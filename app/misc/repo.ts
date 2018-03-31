let Git = require("nodegit");
let $ = require('jQuery');
let chokidar = require("chokidar")
let path = require("path")
let repoFullPath;
let repoLocalPath;
let bname = {};
let branchCommit = [];
let remoteName = {};
let localBranches = [];
let repoCurrentBranch = "master";
let modal;
let span;
let modifiedFiles = 0;

function downloadRepository() {
  let cloneURL = document.getElementById("repoClone").value;
  let localPath = document.getElementById("repoSave").value;
  let fullPath = document.getElementById("repoSaveLocation").files[0].path
  let splitText = cloneURL.split(/\.|:|\//); 
  let local;
  local = splitText[splitText.length-2] + "/" + splitText[splitText.length - 1];
  var ghrepo = getRepo(local);
  getIssues(ghrepo);
  downloadFunc(cloneURL, localPath, fullPath);
}

function downloadFunc(cloneURL, localPath, fullPath) {
  let fullLocalPath = require("path").join(fullPath, localPath);
  let options = {};

  displayModal("Cloning Repository...");

  options = {
    fetchOpts: {
      callbacks: {
        certificateCheck: function() { return 1; },
        credentials: function() {
          return cred;
        }
      }
    }
  };

  let repository = Git.Clone.clone(cloneURL, fullLocalPath, options)
  .then(function(repository) {
    updateModalText("Clone Successful, repository saved under: " + fullLocalPath);
    addCommand("git clone " + cloneURL + " " + localPath);
    isRepositoryLoaded = true;
    repoFullPath = fullLocalPath;
    repoLocalPath = localPath;
    refreshAll(repository);
    setupWatcher(repoFullPath); // This sets up the local repo to be tracked for file deletion
  },
  function(err) {
    displayErrorMessage("Clone Failed - " + err);
  });
}

function openRepository() {
  let fullLocalPath = document.getElementById("repoOpen").files[0].path;

  let readFile = require("fs-sync");

  displayModal("Opening Local Repository...");
  Git.Repository.open(fullLocalPath).then(function(repository) {
    repository.getRemotes().then(function(remoteArray) {
        repository.getRemote(remoteArray[0]).then(function(remote) {
            let remoteUrl = remote.url();
            let local;
            let splitText = remoteUrl.split(/\.|:|\//); //split up the url by any '.', ':', '/' to get the words in the url
            local = splitText[splitText.length-2] + "/" + splitText[splitText.length - 1];
            var ghrepo = getRepo(local);
            getIssues(ghrepo);
        });
    });

    repoFullPath = fullLocalPath;
    repoLocalPath = fullLocalPath.replace(/^.*[\\\/]/, '');
    if (readFile.exists(repoFullPath + "/.git/MERGE_HEAD")) {
      let tid = readFile.read(repoFullPath + "/.git/MERGE_HEAD", null);
    }
    refreshAll(repository);
    // Need to initialise the existing stashes
    persistStashList(repository);
    updateModalText("Repository successfully opened");
    isRepositoryLoaded = true;
    setupWatcher(repoFullPath); // This sets up the local repo to be tracked for file deletion
  },
  function(err) {
    displayErrorMessage("Opening Failed - " + err);
  })
}

function persistStashList(repository) {
  let stashList = new Map();
  Git.Stash.foreach(repository, ((value,key) => {
    stashList.set(key, value);
  }), {}).then(function(result) {
    // saves stash list in local storage
    setStashList(stashList);
  },
  function(err) {
    displayErrorMessage("Failed retrieving stashes");
  });
}

// Sets up a watcher for the local git repo directory
// that notifies when a file gets deleted.
// When it detects that an untracked file gets deleted,
// it also removes it from within the VisualGit file view.
function setupWatcher(repoFullPath) {
  let watcher = chokidar.watch(repoFullPath, {ignored: [repoFullPath + "\\.git"], persistent: true});
  watcher
  .on('unlink', function(deletedPath) {
    let neutralDeletedPath = deletedPath.replace(/[\/\\]/g, " "); // Remove "\" or "/" from pathname to be os independent
    console.log("DELETED PATH IS " + neutralDeletedPath);
    let filePanel = document.getElementById("files-changed");
    let childNodes = filePanel.childNodes;
    let filePaths = document.getElementsByClassName("file-path");
    for (let i = 0; i < filePaths.length; i++) { // Matches the deleted file name to the file component and remove it

      let subPath = filePaths[i].innerHTML;
      subPath = subPath.replace(/[\/\\]/g, " "); // Remove "\" or "/" from pathname to be os independent
      console.log("SUBPATH IS " + subPath);
      if (neutralDeletedPath.indexOf(subPath) !== -1) {
        let fileElement = filePaths[i].parentNode;
        filePanel.removeChild(fileElement.parentNode);
        return;
      }
    }
  });
}

function addBranchestoNode(thisB: string) {
  let elem = document.getElementById("otherBranches");
  elem.innerHTML = '';
  for (let i = 0; i < localBranches.length; i++) {
    if (localBranches[i] !== thisB) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.appendChild(document.createTextNode(localBranches[i]));
      a.setAttribute("tabindex", "0");
      a.setAttribute("href", "#");
      li.appendChild(a);
      elem.appendChild(li);
    }
  }
}

function refreshAll(repository) {
  let branch;
  bname = [];
  repository.getCurrentBranch()
  .then(function(reference) {
    let branchParts = reference.name().split("/");
    branch = branchParts[branchParts.length - 1];
  },function(err) {
      displayErrorMessage("There was an issue with that operation - " + err);
  })
  .then(function() {
    return repository.getReferences(Git.Reference.TYPE.LISTALL);
  })
  .then(function(branchList) {
    let count = 0;
    clearBranchElement();
    for (let i = 0; i < branchList.length; i++) {
      let bp = branchList[i].name().split("/");
      Git.Reference.nameToId(repository, branchList[i].name()).then(function(oid) {
        // Use oid
        if (branchList[i].isRemote()) {
          remoteName[bp[bp.length-1]] = oid;
        } else {
          branchCommit.push(branchList[i]);
          if (oid.tostrS() in bname) {
            bname[oid.tostrS()].push(branchList[i]);
          } else {
            bname[oid.tostrS()] = [branchList[i]];
          }
        }
      }, function(err) {
          displayErrorMessage("There was an issue with that operation - " + err);
      });
      if (branchList[i].isRemote()) {
        if (localBranches.indexOf(bp[bp.length - 1]) < 0) {
          displayBranch(bp[bp.length - 1], "branch-dropdown", "canChangeBranch(this,1)");
        }
      } else {
        localBranches.push(bp[bp.length - 1]);
          displayBranch(bp[bp.length - 1], "branch-dropdown", "canChangeBranch(this,2)");
      }

    }
  })
  .then(function() {
    drawGraph();
    document.getElementById("repo-name").innerHTML = repoLocalPath;
    document.getElementById("branch-name").innerHTML = branch + '<span class="caret"></span>';
    clearFilesList("modified");
    clearFilesList("staged");
  });
}

function getAllBranches() {
  let repos;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    return repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
  })
  .then(function(branchList) {
    clearBranchElement();
    for (let i = 0; i < branchList.length; i++) {
      let bp = branchList[i].split("/");
      if (bp[1] !== "remotes") {
        displayBranch(bp[bp.length - 1], "branch-dropdown", "checkoutLocalBranch(this)");
      }
      Git.Reference.nameToId(repos, branchList[i]).then(function(oid) {
        // Use oid
      });
    }
  });
}

function getOtherBranches() {
  let list;
  let repos;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    return repo.getReferenceNames(Git.Reference.TYPE.LISTALL);
  })
  .then(function(branchList) {
    clearMergeElement();
    list = branchList;
  })
  .then(function() {
    return repos.getCurrentBranch()
  })
  .then(function(ref) {
    let name = ref.name().split("/");
    clearBranchElement();
    for (let i = 0; i < list.length; i++) {
      let bp = list[i].split("/");
      if (bp[1] !== "remotes" && bp[bp.length - 1] !== name[name.length - 1]) {
        displayBranch(bp[bp.length - 1], "merge-dropdown", "mergeLocalBranches(this)");
      }
    }
  })

}

function clearMergeElement() {
  let ul = document.getElementById("merge-dropdown");
  ul.innerHTML = '';
}

function clearBranchElement() {
  let ul = document.getElementById("branch-dropdown");
  let li = document.getElementById("create-branch");
  ul.innerHTML = '';
  ul.appendChild(li);
}

function displayBranch(name, id, onclick) {
  let ul = document.getElementById(id);
  let li = document.createElement("li");
  let a = document.createElement("a");
  a.setAttribute("href", "#");
  a.setAttribute("class", "list-group-item");
  a.setAttribute("onclick", onclick);
  li.setAttribute("role", "presentation")
  li.setAttribute("id", name);
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
        })
}

function checkoutRemoteBranch(bn) {
  toggleCloseButton();
  console.log("1.0  " + bn);
  let repos;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    addCommand("git fetch");
    addCommand("git checkout -b " + bn);
    let cid = remoteName[bn];
    return Git.Commit.lookup(repo, cid);
  })
  .then(function(commit) {
    return Git.Branch.create(repos, bn, commit, 0);
  })
  .then(function(code) {
    repos.mergeBranches(bn, "origin/" + bn)
    .then(function() {
        refreshAll(repos);
    });
  }, function(err) {
      displayErrorMessage("Issue with checking out remote branch - " + err);
  })
}

function updateLocalPath() {
  let text = document.getElementById("repoClone").value;
  let splitText = text.split(/\.|:|\//);
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
  document.getElementById("modal-title").innerHTML  = "Info";
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

function displayQuickstartModal() {

  let header1 = "<h4 style='color: black'>File Changes</h4>"
  let descriptionFiles = "File changes since the last commit are shown on the left column with a color code: <span class='file-created'>Added</span>, <span class='file-modified'>Modified</span>, and <span class='file-deleted'>Deleted</span>."

  let header2 = "<h4 style='color: black'>Text Changes</h4>"
  let descriptionTextDiff = "The Text Changes panel in the centre shows a 'diff' of the selected file -- what has been added and deleted."
  
  let header3 = "<h4 style='color: black'>Revision History</h4>"
  let descriptionRevision = "The graph shows the revision history in a graph layout. Nodes will be added as more commits are added."

  let descriptionNote = "<p style='font-style: italic'>This QuickStart guide will still be available in the top menu bar.</p>"

  document.getElementById("modal-text-box").innerHTML = header1 + descriptionFiles + header2 + descriptionTextDiff + header3 + descriptionRevision + descriptionNote;
  document.getElementById("modal-text-box").style.wordWrap = 'break-word';
  document.getElementById("modal-title").innerHTML = "VisualGit Quick Start";
  $('#modal').modal('show');
}

function displayWarning(warningMessege){
  $('#OK-button').removeClass('hide');
  $('#cancel-button').removeClass('hide');
  $('#close-button').addClass('hide');
  document.getElementById("modal-title").innerHTML  = "Warning";
  document.getElementById("modal-text-box").innerHTML = warningMessege;
  document.getElementById("modal-text-box").style.wordWrap = 'break-word';
  $('#modal').modal('show');
}

function checkForLocalChanges() {
  modifiedFiles = $("#files-changed div").length;
  if (modifiedFiles > 0){
    return true;
  }
  return false;
}

function toggleCloseButton(){
  $('#OK-button').addClass('hide');
  $('#cancel-button').addClass('hide');
  $('#close-button').removeClass('hide');
}

function canChangeBranch(e,type) {
    let bn;
    if (typeof e === "string") {
        bn = e;
    } else {
        bn = e.innerHTML;
    }
    if (type == 1) {
        $('#OK-button').attr("onclick", "checkoutRemoteBranch('" + bn + "')");
    } else if (type == 2) {
        $('#OK-button').attr("onclick", "checkoutLocalBranch('" + bn + "')");
    }
    if (checkForLocalChanges()) {
        displayWarning("Please commit or stash your changes before checking out");
        return;
    } else {
        if (type == 2) {
            checkoutLocalBranch(e);
        } else if (type == 1) {
            checkoutRemoteBranch(e);
        }
    }
}
