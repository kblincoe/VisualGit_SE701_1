let Git = require("nodegit");
let $ = require('jQuery');
let repoFullPath;
let repoLocalPath;
let bname = {};
let branchCommit = [];
let remoteName = {};
let localBranches = [];
let readFile = require("fs-sync");
let repoCurrentBranch = "master";
let modal;
let span;

function downloadRepository() {
  let cloneURL = document.getElementById("repoClone").value;
  let localPath = document.getElementById("repoSave").value;
  let fullPath = document.getElementById("repoSaveLocation").files[0].path
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
    repoFullPath = fullLocalPath;
    repoLocalPath = localPath;
    refreshAll(repository);
  },
  function(err) {
    updateModalText("Clone Failed - " + err);
    console.error(err); // TODO show error on screen
  });
}

function openRepository() {

  let fullLocalPath = document.getElementById("repoOpen").files[0].path;

  displayModal("Opening Local Repository...");

  Git.Repository.open(fullLocalPath).then(function(repository) {
    repoFullPath = fullLocalPath;
    if (readFile.exists(repoFullPath + "/.git/MERGE_HEAD")) {
      let tid = readFile.read(repoFullPath + "/.git/MERGE_HEAD", null);
    }
    repoLocalPath = fullLocalPath.replace(/^.*[\\\/]/, '');
    refreshAll(repository);
    updateModalText("Repository successfully opened");
  },
  function(err) {
    updateModalText("Opening Failed - " + err);
    console.error(err); // TODO show error on screen
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
    console.error(err); // TODO show error on screen
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
        console.error(err);
      });
      if (branchList[i].isRemote()) {
        if (localBranches.indexOf(bp[bp.length - 1]) < 0) {
          displayBranch(bp[bp.length - 1], "branch-dropdown", "checkoutRemoteBranch(this)");
        }
      } else {
        localBranches.push(bp[bp.length - 1]);
        displayBranch(bp[bp.length - 1], "branch-dropdown", "checkoutLocalBranch(this)");
      }

    }
  })
  .then(function() {
    drawGraph();
    document.getElementById("repo-name").innerHTML = repoLocalPath;
    document.getElementById("branch-name").innerHTML = branch + '<span class="caret"></span>';
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
  a.appendChild(document.createTextNode(name));
  li.appendChild(a);
  ul.appendChild(li);
}

function checkoutLocalBranch(element) {
  let bn;
  if (typeof element === "string") {
    bn = element;
  } else {
    bn = element.innerHTML;
  }
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    addCommand("git checkout " + bn);
    repo.checkoutBranch("refs/heads/" + bn)
    .then(function() {
      refreshAll(repo);
    }, function(err) {
      console.error(err);
    });
  })
}

function checkoutRemoteBranch(element) {
  let bn;
  if (typeof element === "string") {
    bn = element;
  } else {
    bn = element.innerHTML;
  }
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
    console.error(err);
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
  $('#modal').modal('show');
}

function updateModalText(text) {
  document.getElementById("modal-text-box").innerHTML = text;
  document.getElementById("modal-text-box").style.wordWrap = 'break-word';
  $('#modal').modal('show');
}
