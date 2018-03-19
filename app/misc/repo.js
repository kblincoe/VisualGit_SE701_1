var Git = require("nodegit");
var $ = require('jQuery');
var repoFullPath;
var repoLocalPath;
var bname = {};
var branchCommit = [];
var remoteName = {};
var localBranches = [];
var readFile = require("fs-sync");
var repoCurrentBranch = "master";
var modal;
var span;
var modifiedFiles = 0;
function downloadRepository() {
    var cloneURL = document.getElementById("repoClone").value;
    var localPath = document.getElementById("repoSave").value;
    var fullPath = document.getElementById("repoSaveLocation").files[0].path;
    downloadFunc(cloneURL, localPath, fullPath);
}
function downloadFunc(cloneURL, localPath, fullPath) {
    var fullLocalPath = require("path").join(fullPath, localPath);
    var options = {};
    displayModal("Cloning Repository...");
    options = {
        fetchOpts: {
            callbacks: {
                certificateCheck: function () { return 1; },
                credentials: function () {
                    return cred;
                }
            }
        }
    };
    var repository = Git.Clone.clone(cloneURL, fullLocalPath, options)
        .then(function (repository) {
        updateModalText("Clone Successful, repository saved under: " + fullLocalPath);
        addCommand("git clone " + cloneURL + " " + localPath);
        repoFullPath = fullLocalPath;
        repoLocalPath = localPath;
        refreshAll(repository);
    }, function (err) {
        displayErrorMessage("Clone Failed - " + err);
    });
}
function openRepository() {
    var fullLocalPath = document.getElementById("repoOpen").files[0].path;
    displayModal("Opening Local Repository...");
    Git.Repository.open(fullLocalPath).then(function (repository) {
        repoFullPath = fullLocalPath;
        repoLocalPath = fullLocalPath.replace(/^.*[\\\/]/, '');
        if (readFile.exists(repoFullPath + "/.git/MERGE_HEAD")) {
            var tid = readFile.read(repoFullPath + "/.git/MERGE_HEAD", null);
        }
        refreshAll(repository);
        updateModalText("Repository successfully opened");
    }, function (err) {
        displayErrorMessage("Opening Failed - " + err);
    });
}
function addBranchestoNode(thisB) {
    var elem = document.getElementById("otherBranches");
    elem.innerHTML = '';
    for (var i = 0; i < localBranches.length; i++) {
        if (localBranches[i] !== thisB) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.appendChild(document.createTextNode(localBranches[i]));
            a.setAttribute("tabindex", "0");
            a.setAttribute("href", "#");
            li.appendChild(a);
            elem.appendChild(li);
        }
    }
}
function refreshAll(repository) {
    var branch;
    bname = [];
    repository.getCurrentBranch()
        .then(function (reference) {
        var branchParts = reference.name().split("/");
        branch = branchParts[branchParts.length - 1];
    }, function (err) {
        displayErrorMessage("There was an issue with that operation - " + err);
    })
        .then(function () {
        return repository.getReferences(Git.Reference.TYPE.LISTALL);
    })
        .then(function (branchList) {
        var count = 0;
        clearBranchElement();
        var _loop_1 = function (i) {
            var bp = branchList[i].name().split("/");
            Git.Reference.nameToId(repository, branchList[i].name()).then(function (oid) {
                // Use oid
                if (branchList[i].isRemote()) {
                    remoteName[bp[bp.length - 1]] = oid;
                }
                else {
                    branchCommit.push(branchList[i]);
                    if (oid.tostrS() in bname) {
                        bname[oid.tostrS()].push(branchList[i]);
                    }
                    else {
                        bname[oid.tostrS()] = [branchList[i]];
                    }
                }
            }, function (err) {
                displayErrorMessage("There was an issue with that operation - " + err);
            });
            if (branchList[i].isRemote()) {
                if (localBranches.indexOf(bp[bp.length - 1]) < 0) {
                    displayBranch(bp[bp.length - 1], "branch-dropdown", "canChangeBranch(this,1)");
                }
            }
            else {
                localBranches.push(bp[bp.length - 1]);
                displayBranch(bp[bp.length - 1], "branch-dropdown", "canChangeBranch(this,2)");
            }
        };
        for (var i = 0; i < branchList.length; i++) {
            _loop_1(i);
        }
    })
        .then(function () {
        drawGraph();
        document.getElementById("repo-name").innerHTML = repoLocalPath;
        document.getElementById("branch-name").innerHTML = branch + '<span class="caret"></span>';
    });
}
function getAllBranches() {
    var repos;
    Git.Repository.open(repoFullPath)
        .then(function (repo) {
        repos = repo;
        return repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
    })
        .then(function (branchList) {
        clearBranchElement();
        for (var i = 0; i < branchList.length; i++) {
            var bp = branchList[i].split("/");
            if (bp[1] !== "remotes") {
                displayBranch(bp[bp.length - 1], "branch-dropdown", "checkoutLocalBranch(this)");
            }
            Git.Reference.nameToId(repos, branchList[i]).then(function (oid) {
                // Use oid
            });
        }
    });
}
function getOtherBranches() {
    var list;
    var repos;
    Git.Repository.open(repoFullPath)
        .then(function (repo) {
        repos = repo;
        return repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
    })
        .then(function (branchList) {
        clearMergeElement();
        list = branchList;
    })
        .then(function () {
        return repos.getCurrentBranch();
    })
        .then(function (ref) {
        var name = ref.name().split("/");
        clearBranchElement();
        for (var i = 0; i < list.length; i++) {
            var bp = list[i].split("/");
            if (bp[1] !== "remotes" && bp[bp.length - 1] !== name[name.length - 1]) {
                displayBranch(bp[bp.length - 1], "merge-dropdown", "mergeLocalBranches(this)");
            }
        }
    });
}
function clearMergeElement() {
    var ul = document.getElementById("merge-dropdown");
    ul.innerHTML = '';
}
function clearBranchElement() {
    var ul = document.getElementById("branch-dropdown");
    var li = document.getElementById("create-branch");
    ul.innerHTML = '';
    ul.appendChild(li);
}
function displayBranch(name, id, onclick) {
    var ul = document.getElementById(id);
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("href", "#");
    a.setAttribute("class", "list-group-item");
    a.setAttribute("onclick", onclick);
    li.setAttribute("role", "presentation");
    a.appendChild(document.createTextNode(name));
    li.appendChild(a);
    ul.appendChild(li);
}
function checkoutLocalBranch(bn) {
    toggleCloseButton();
    Git.Repository.open(repoFullPath)
        .then(function (repo) {
        addCommand("git checkout " + bn);
        repo.checkoutBranch("refs/heads/" + bn)
            .then(function () {
            refreshAll(repo);
        }, function (err) {
            displayErrorMessage("Issue with checking out local branch - " + err);
        });
    });
}
function checkoutRemoteBranch(bn) {
    toggleCloseButton();
    console.log("1.0  " + bn);
    var repos;
    Git.Repository.open(repoFullPath)
        .then(function (repo) {
        repos = repo;
        addCommand("git fetch");
        addCommand("git checkout -b " + bn);
        var cid = remoteName[bn];
        return Git.Commit.lookup(repo, cid);
    })
        .then(function (commit) {
        return Git.Branch.create(repos, bn, commit, 0);
    })
        .then(function (code) {
        repos.mergeBranches(bn, "origin/" + bn)
            .then(function () {
            refreshAll(repos);
        });
    }, function (err) {
        displayErrorMessage("Issue with checking out remote branch - " + err);
    });
}
function updateLocalPath() {
    var text = document.getElementById("repoClone").value;
    var splitText = text.split(/\.|:|\//);
    if (splitText.length >= 2) {
        document.getElementById("repoSave").value = splitText[splitText.length - 2];
    }
}
// function initModal() {
//   modal = document.getElementById("modal");
//   btn = document.getElementById("new-repo-button");
//   confirmBtn = document.getElementById("confirm-button");
//   span = document.getElementsByClassName("close")[0];
// }
// function handleModal() {
//   // When the user clicks on <span> (x), close the modal
//   span.onclick = function() {
//     modal.style.display = "none";
//   };
//
//   // When the user clicks anywhere outside of the modal, close it
//   window.onclick = function(event) {
//
//     if (event.target === modal) {
//       modal.style.display = "none";
//     }
//   };
// }
function displayModal(text) {
    //  initModal();
    //  handleModal();
    document.getElementById("modal-text-box").innerHTML = text;
    document.getElementById("modal-text-box").style.wordWrap = 'break-word';
    document.getElementById("modal-title").innerHTML = "Info";
    $('#modal').modal('show');
}
function updateModalText(text) {
    document.getElementById("modal-text-box").innerHTML = text;
    document.getElementById("modal-text-box").style.wordWrap = 'break-word';
    document.getElementById("modal-title").innerHTML = "Info";
    $('#modal').modal('show');
}
//Display error messages on screen
function displayErrorMessage(errorMessage) {
    document.getElementById("modal-title").innerHTML = "Error";
    document.getElementById("modal-text-box").innerHTML = errorMessage;
    document.getElementById("modal-text-box").style.wordWrap = 'break-word';
    $('#modal').modal('show');
}
function displayWarning(warningMessege) {
    $('#OK-button').removeClass('hide');
    $('#cancel-button').removeClass('hide');
    $('#close-button').addClass('hide');
    document.getElementById("modal-title").innerHTML = "Warning";
    document.getElementById("modal-text-box").innerHTML = warningMessege;
    document.getElementById("modal-text-box").style.wordWrap = 'break-word';
    $('#modal').modal('show');
}
function checkForLocalChanges() {
    modifiedFiles = $("#files-changed div").length;
    if (modifiedFiles > 0) {
        return true;
    }
    return false;
}
function toggleCloseButton() {
    $('#OK-button').addClass('hide');
    $('#cancel-button').addClass('hide');
    $('#close-button').removeClass('hide');
}
function canChangeBranch(e, type) {
    var bn;
    if (typeof e === "string") {
        bn = e;
    }
    else {
        bn = e.innerHTML;
    }
    if (type == 1) {
        $('#OK-button').attr("onclick", "checkoutRemoteBranch('" + bn + "')");
    }
    else if (type == 2) {
        $('#OK-button').attr("onclick", "checkoutLocalBranch('" + bn + "')");
    }
    if (checkForLocalChanges()) {
        displayWarning("Please commit or stash your changes before checking out");
        return;
    }
    else {
        if (type == 2) {
            checkoutLocalBranch(e);
        }
        else if (type == 1) {
            checkoutRemoteBranch(e);
        }
    }
}
