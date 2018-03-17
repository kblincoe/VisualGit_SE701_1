import * as nodegit from "git";
import NodeGit, { Status } from "nodegit";

let opn = require('opn');
let $ = require("jquery");
let Git = require("nodegit");
let fs = require("fs");
let async = require("async");
let readFile = require("fs-sync");
let green = "#84db00";
let repo, index, oid, remote, commitMessage;
let filesToAdd = [];
let theirCommit = null;
let modifiedFiles;

function addAndCommit() {
  let repository;

  Git.Repository.open(repoFullPath)
  .then(function(repoResult) {
    repository = repoResult;
    console.log("1.0");
    return repository.refreshIndex();
  })

  .then(function(indexResult) {
    console.log("2.0");
    index = indexResult;
    let filesToStage = [];
    filesToAdd = [];
    let fileElements = document.getElementsByClassName('file');
    for (let i = 0; i < fileElements.length; i++) {
      let fileElementChildren = fileElements[i].childNodes;
      if (fileElementChildren[1].checked === true) {
        filesToStage.push(fileElementChildren[0].innerHTML);
        filesToAdd.push(fileElementChildren[0].innerHTML);
      }
    }
    console.log("2.1");
    return index.addAll(filesToStage);
  })

  .then(function() {
    console.log("3.0");
    return index.write();
  })

  .then(function() {
    console.log("4.0");
    return index.writeTree();
  })

  .then(function(oidResult) {
    console.log("5.0");
    oid = oidResult;
    return Git.Reference.nameToId(repository, "HEAD");
  })

  .then(function(head) {
    console.log("6.0");
    return repository.getCommit(head);
  })

  .then(function(parent) {
    console.log("7.0");
    let sign;
    if (username !== null && password !== null) {
      sign = Git.Signature.now(username, password);
    } else {
      sign = Git.Signature.default(repository);
    }
    commitMessage = document.getElementById('commit-message-input').value;
    //console.log(sign.toString());
    if (readFile.exists(repoFullPath + "/.git/MERGE_HEAD")) {
      let tid = readFile.read(repoFullPath + "/.git/MERGE_HEAD", null);
      console.log("theirComit: " + tid);
      console.log("ourCommit: " + parent.id.toString());
      return repository.createCommit("HEAD", sign, sign, commitMessage, oid, [parent.id().toString(), tid.trim()]);
    } else {
      console.log('no other commit');
      return repository.createCommit("HEAD", sign, sign, commitMessage, oid, [parent]);
    }
  })
  .then(function(oid) {
    theirCommit = null;
    //console.log("8.0");
    console.log("Commit successful: " + oid.tostrS());

    hideDiffPanel();
    hideTextEditorPanel();
    clearModifiedFilesList();
    clearCommitMessage();
    clearSelectAllCheckbox();
    for (let i = 0; i < filesToAdd.length; i++) {
      addCommand("git add " + filesToAdd[i]);
    }
    addCommand('git commit -m "' + commitMessage + '"');
    refreshAll(repository);
  }, function(err) {
    console.log(err);
    updateModalText("Oops, error occours! If u haven't login, please login and try again.");
  });
}

// Clear all modified files from the left file panel
function clearModifiedFilesList() {
  let filePanel = document.getElementById("files-changed");
  while (filePanel.firstChild) {
    filePanel.removeChild(filePanel.firstChild);
  }
  let filesChangedMessage = document.createElement("p");
  filesChangedMessage.className = "modified-files-message";
  filesChangedMessage.id = "modified-files-message";
  filesChangedMessage.innerHTML = "Your modified files will appear here";
  filePanel.appendChild(filesChangedMessage);
}

function clearCommitMessage() {
  document.getElementById('commit-message-input').value = "";
}

function clearSelectAllCheckbox() {
  document.getElementById('select-all-checkbox').checked = false;
}

function getAllCommits(callback) {
  // Git.Repository.open(repoFullPath)
  // .then(function(repo) {
  //   return repo.getHeadCommit();
  // })
  // .then(function(firstCommitOnMaster){
  //   let history = firstCommitOnMaster.history(Git.Revwalk.SORT.Time);
  //
  //   history.on("end", function(commits) {
  //     callback(commits);
  //   });
  //
  //   history.start();
  // });
  let repos;
  let allCommits = [];
  let aclist = [];
  console.log("1.0");
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    console.log("2.0");
    return repo.getReferences(Git.Reference.TYPE.LISTALL);
  })
  .then(function(refs) {
    let count = 0;
    console.log("3.0    " + refs.length);
    async.whilst(
      function() {
        return count < refs.length;
      },

      function(cb) {
        if (!refs[count].isRemote()) {
          console.log("4.0");
          repos.getReferenceCommit(refs[count])
          .then(function(commit) {
            let history = commit.history(Git.Revwalk.SORT.Time);
            history.on("end", function(commits) {
              for (let i = 0; i < commits.length; i++) {
                if (aclist.indexOf(commits[i].toString()) < 0) {
                  allCommits.push(commits[i]);
                  aclist.push(commits[i].toString());
                }
              }
              count++;
              console.log(count + "-------" + allCommits.length);
              cb();
            });

            history.start();
          });
        } else {
          console.log('lalalalalalala');
          count++;
          cb();
        }
      },

      function(err) {
        console.log(err);
        callback(allCommits);
      });
    });
}

function pullFromRemote() {
  let repository;
  let branch = document.getElementById("branch-name").innerText;
  if (modifiedFiles.length > 0) {
    updateModalText("Please commit before pulling from remote!");
  }
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repository = repo;
    console.log("Pulling changes from remote...");
    addCommand("git pull");
    displayModal("Pulling new changes from the remote repository");

    return repository.fetchAll({
      callbacks: {
        credentials: function() {
          return cred;
        },
        certificateCheck: function() {
          return 1;
        }
      }
    });
  })
  // Now that we're finished fetching, go ahead and merge our local branch
  // with the new one
  .then(function() {
    return Git.Reference.nameToId(repository, "refs/remotes/origin/" + branch);
  })
  .then(function(oid) {
    console.log("3.0  " + oid);
    return Git.AnnotatedCommit.lookup(repository, oid);
  }, function(err) {
    console.log(err);
  })
  .then(function(annotated) {
    console.log("4.0  " + annotated);
    Git.Merge.merge(repository, annotated, null, {
      checkoutStrategy: Git.Checkout.STRATEGY.FORCE,
    });
    theirCommit = annotated;
  })
  .then(function() {
    if (fs.existsSync(repoFullPath + "/.git/MERGE_MSG")) {
      updateModalText("Conflicts exists! Please check files list on right side and solve conflicts before you commit again!");
      refreshAll(repository);
    } else {
      updateModalText("Successfully pulled from remote branch " + branch + "!");
      refreshAll(repository);
    }
  });
//   .then(function(updatedRepository) {
//     refreshAll(updatedRepository);

// });
}

function pushToRemote() {
  let branch = document.getElementById("branch-name").innerText;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    console.log("Pushing changes to remote")
    displayModal("Pushing changes to remote...");
    addCommand("git push -u origin " + branch);
    repo.getRemotes()
    .then(function(remotes) {
      repo.getRemote(remotes[0])
      .then(function(remote) {
        return remote.push(
          ["refs/heads/" + branch + ":refs/heads/" + branch],
          {
            callbacks: {
              credentials: function() {
                return cred;
              }
            }
          }
        );
      })
      .then(function() {
        console.log("Push successful");
        updateModalText("Push successful");
        refreshAll(repo);
      });
    });
  });
}

function createBranch() {
  let branchName = document.getElementById("branchName").value;
  let repos;
  console.log(branchName + "!!!!!!");
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    // Create a new branch on head
    repos = repo;
    addCommand("git branch " + branchName);
    return repo.getHeadCommit()
    .then(function(commit) {
      return repo.createBranch(
        branchName,
        commit,
        0,
        repo.defaultSignature(),
        "Created new-branch on HEAD");
    }, function(err) {
      console.log(err + "LLLLLL");
    });
  }).done(function() {
    refreshAll(repos);
    console.log("All done!");
  });
}

function mergeLocalBranches(element) {
  let bn = element.innerHTML;
  let fromBranch;
  let repos;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
  })
  .then(function() {
    addCommand("git merge " + bn);
    return repos.getBranch("refs/heads/" + bn);
  })
  .then(function(branch) {
    console.log(branch.name());
    fromBranch = branch;
    return repos.getCurrentBranch();
  })
  .then(function(toBranch) {
    console.log(toBranch.name());
    return repos.mergeBranches(toBranch,
       fromBranch,
       repos.defaultSignature(),
       Git.Merge.PREFERENCE.NONE,
       null);
  })
  .then(function(index) {
    let text;
    console.log(index);
    if (index instanceof Git.Index) {
      text = "Conflicts Exist";
    } else {
      text = "Merge Successfully";
    }
    console.log(text);
    updateModalText(text);
    refreshAll(repos);
  });
}

function mergeCommits(from) {
  let repos;
  let index;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    //return repos.getCommit(fromSha);
    addCommand("git merge " + from);
    return Git.Reference.nameToId(repos, 'refs/heads/' + from);
  })
  .then(function(oid) {
    console.log("3.0  " + oid);
    return Git.AnnotatedCommit.lookup(repos, oid);
  })
  .then(function(annotated) {
    console.log("4.0  " + annotated);
    Git.Merge.merge(repos, annotated, null, {
      checkoutStrategy: Git.Checkout.STRATEGY.FORCE,
    });
    theirCommit = annotated;
  })
  .then(function() {
    if (fs.existsSync(repoFullPath + "/.git/MERGE_MSG")) {
      updateModalText("Conflicts exists! Please check files list on right side and solve conflicts before you commit again!");
      refreshAll(repos);
    } else {
      updateModalText("Successfully Merged!");
      refreshAll(repos);
    }
  });
}

function rebaseCommits(from: string, to: string) {
  let repos;
  let index;
  let branch;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    //return repos.getCommit(fromSha);
    addCommand("git rebase " + to);
    return Git.Reference.nameToId(repos, 'refs/heads/' + from);
  })
  .then(function(oid) {
    console.log("3.0  " + oid);
    return Git.AnnotatedCommit.lookup(repos, oid);
  })
  .then(function(annotated) {
    console.log("4.0  " + annotated);
    branch = annotated;
    return Git.Reference.nameToId(repos, 'refs/heads/' + to);
  })
  .then(function(oid) {
    console.log("5.0  " + oid);
    return Git.AnnotatedCommit.lookup(repos, oid);
  })
  .then(function(annotated) {
    console.log("6.0");
    return Git.Rebase.init(repos, branch, annotated, null, null);
  })
  .then(function(rebase) {
    console.log("7.0");
    return rebase.next();
  })
  .then(function(operation) {
    refreshAll(repos);
  });
}

function rebaseInMenu(from: string, to: string) {
  let p1 = document.getElementById("fromRebase");
  let p2 = document.getElementById("toRebase");
  let p3 = document.getElementById("rebaseModalBody");
  p1.innerHTML = from;
  p2.innerHTML = to;
  p3.innerHTML = "Do you want to rebase branch " + from + " to " + to + " ?";
  $("#rebaseModal").modal('show');
}

function mergeInMenu(from: string) {
  let p1 = document.getElementById("fromMerge");
  let p3 = document.getElementById("mergeModalBody");
  p1.innerHTML = from;
  p3.innerHTML = "Do you want to merge branch " + from + " to HEAD ?";
  $("#mergeModal").modal('show');
}

function resetCommit(name: string) {
  let repos;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    addCommand("git reset --hard");
    return Git.Reference.nameToId(repo, name);
  })
  .then(function(id) {
    console.log('2.0' + id);
    return Git.AnnotatedCommit.lookup(repos, id);
  })
  .then(function(commit) {
    let checkoutOptions = new Git.CheckoutOptions();
    return Git.Reset.fromAnnotated(repos, commit, Git.Reset.TYPE.HARD, checkoutOptions);
  })
  .then(function(number) {
    console.log(number);
    if (number !== 0) {
      updateModalText("Reset failed, please check if you have pushed the commit.");
    } else {
      updateModalText("Reset successfully.");
    }
    refreshAll(repos);
  }, function(err) {
    updateModalText(err);
  });
}

function revertCommit(name: string) {
  let repos;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    console.log(1.0);
    addCommand("git revert " + name + "~1");
    return Git.Reference.nameToId(repo, name);
  })
  .then(function(id) {
    console.log('2.0' + id);
    return Git.Commit.lookup(repos, id);
  })
  .then(function(commit) {
    let revertOptions = new Git.RevertOptions();
    if (commit.parents().length > 1) {
      revertOptions.mainline = 1;
    }
    return Git.Revert.revert(repos, commit, revertOptions);
  })
  .then(function(number) {
    console.log(number);
    if (number === -1) {
      updateModalText("Revert failed, please check if you have pushed the commit.");
    } else {
      updateModalText("Revert successfully.");
    }
    refreshAll(repos);
  }, function(err) {
    updateModalText(err);
  });
}

function displayModifiedFiles() {
  modifiedFiles = [];

  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    console.log(repo.isMerging() + "ojoijnkbunmm");
    repo.getStatus().then(function(statuses) {

      statuses.forEach(addModifiedFile);
      if (modifiedFiles.length !== 0) {
        if (document.getElementById("modified-files-message") !== null) {
          let filePanelMessage = document.getElementById("modified-files-message");
          filePanelMessage.parentNode.removeChild(filePanelMessage);
        }
      }
      modifiedFiles.forEach(displayModifiedFile);

      // Add modified file to array of modified files 'modifiedFiles'
      function addModifiedFile(file) {
        // Check if modified file is already being displayed
        let filePaths = document.getElementsByClassName('file-path');
        for (let i = 0; i < filePaths.length; i++) {
          if (filePaths[i].innerHTML === file.path()) {
            return;
          }
        }

        let path = file.path();
        let modification = calculateModification(file);
        modifiedFiles.push({
            filePath: path,
            fileModification: modification
          });
      }

      // Find HOW the file has been modified
      function calculateModification(status) {
        if (status.isNew()) {
          return "NEW";
        } else if (status.isModified()) {
          return "MODIFIED";
        } else if (status.isDeleted()) {
          return "DELETED";
        } else if (status.isTypechange()) {
          return "TYPECHANGE";
        } else if (status.isRenamed()) {
          return "RENAMED";
        } else if (status.isIgnored()) {
          return "IGNORED";
        }
      }

      // Add the modified file to the left file panel
      function displayModifiedFile(file){
        let fileContainer = document.createElement("div");
        let filePath = document.createElement("p");
        filePath.className = "file-path";
        filePath.innerHTML = file.filePath;
        let fileElement = document.createElement("div");
        let checkboxElement = document.createElement("div");
        fileContainer.appendChild(checkboxElement);
        fileContainer.appendChild(fileElement);
        fileContainer.style.display='flex';
        // Set how the file has been modified
        if (file.fileModification === "NEW") {
          fileElement.className = "file file-created";
        } else if (file.fileModification === "MODIFIED") {
          fileElement.className = "file file-modified";
        } else if (file.fileModification === "DELETED") {
          fileElement.className = "file file-deleted";
        } else {
          fileElement.className = "file";
        }

        fileElement.appendChild(filePath);
        
        let checkbox = document.createElement("input");
        checkboxElement.style.margin='5px';
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkboxElement.appendChild(checkbox);

        document.getElementById("files-changed").appendChild(fileContainer);
        fileElement.onclick = function() {

          let textEditorPanel = document.getElementById("text-editor-panel");
          let diffPanel = document.getElementById("diff-panel");

          console.log('diffPanel width = ' + diffPanel.style.width);
          console.log('textEditorPanel width = ' + textEditorPanel.style.width);
          
          // if EDITOR NOT OPEN
          if(textEditorPanel.style.width === '0px' || textEditorPanel.style.width === ''){
            // if DIFF NOT OPEN
            if (diffPanel.style.width === '0px' || diffPanel.style.width === '') {
              // OPEN DIFF
              displayDiffPanel();
              document.getElementById("diff-panel-body").innerHTML = "";
  
              if (fileElement.className === "file file-created") {
                printNewFile(file.filePath);
              } else {
                printFileDiff(file.filePath);
              }
            } else {
              hideDiffPanel();

            }
          } else{
            displayExitConfirmationDialog();
          }
        };
      }
      function printNewFile(filePath) {
        let fileLocation = require("path").join(repoFullPath, filePath);
        let lineReader = require("readline").createInterface({
          input: fs.createReadStream(fileLocation)
        });

        lineReader.on("line", function (line) {
          formatNewFileLine(line);
        });
      }

      function printFileDiff(filePath) {
        repo.getHeadCommit().then(function(commit) {
          getCurrentDiff(commit, filePath, function(line) {
            formatLine(line);
          });
        });
      }

      function getCurrentDiff(commit, filePath, callback) {
        commit.getTree().then(function(tree) {
          Git.Diff.treeToWorkdir(repo, tree, null).then(function(diff) {
            diff.patches().then(function(patches) {
              patches.forEach(function(patch) {
                patch.hunks().then(function(hunks) {
                  hunks.forEach(function(hunk) {
                    hunk.lines().then(function(lines) {
                      let oldFilePath = patch.oldFile().path();
                      let newFilePath = patch.newFile().path();
                      if (newFilePath === filePath) {
                        lines.forEach(function(line) {
                          callback(String.fromCharCode(line.origin()) + line.content());
                        });
                      }
                    });
                  });
                });
              });
            });
          });
        });
      }

      function formatLine(line) {
        let element = document.createElement("div");

        if (line.charAt(0) === "+") {
          element.style.backgroundColor = "#84db00";
          line = line.slice(1, line.length);
        } else if (line.charAt(0) === "-") {
          element.style.backgroundColor = "#ff2448";
          line = line.slice(1, line.length);
        }

        element.innerText = line;
        document.getElementById("diff-panel-body").appendChild(element);
      }

      function formatNewFileLine(text) {
        let element = document.createElement("div");
        element.style.backgroundColor = green;
        element.innerHTML = text;
        document.getElementById("diff-panel-body").appendChild(element);
      }
    });
  },
  function(err) {
    console.log("waiting for repo to be initialised");
  });
}
