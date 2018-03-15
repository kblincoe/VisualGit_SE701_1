import * as nodegit from "git";
import NodeGit, { Status } from "nodegit";

let opn = require('opn');
let $ = require("jquery");
let Git = require("nodegit");
let fs = require("fs");
let async = require("async");
let readFile = require("fs-sync");
let green = "#84db00";
let repo, index, oid, remote, commitMessage, stashMessage;
let filesToAdd = [];
let filesToUnstage = [];
let theirCommit = null;
let modifiedFiles;
let stagedFiles;


function stageFiles() {
  let repository;

  Git.Repository.open(repoFullPath)
  .then(function(repoResult) {
    repository = repoResult;
    return repository.refreshIndex();
  })

  .then(function(indexResult) {
    index = indexResult;
    let filesToStage = [];
    filesToAdd = [];
    //only loop through the files in the unstaged(modified) section of the file panel
    let relevantCheckboxes = $(".checkbox-modified");
    for (let i = 0; i < relevantCheckboxes.length; i++) {
      if (relevantCheckboxes[i].checked === true) {
        filesToStage.push($(".file .modified")[i].innerHTML);
        filesToAdd.push($(".file .modified")[i].innerHTML);
      }
    }
    return index.addAll(filesToStage);
  })

  .then(function() {
    return index.write();
  })

  .then(function() {
    return index.writeTree();
  })

  .then(function(oidResult) {
    oid = oidResult;
  })
  
  .then(function() {
    for (let i = 0; i < filesToAdd.length; i++) {
      addCommand("git add " + filesToAdd[i]);
    }
    hideDiffPanel();
    clearFilesList("modified");
    clearCommitMessage();
    clearSelectAllCheckbox(true);
    determineButtonStates();  //disable the stage button as no files would be selected
    refreshAll(repository);
  });
}

function unstageFiles() {
  let repository;

  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repository = repo;
    return repository.refreshIndex();
  })

  .then(function(indexInfo) {
    index = indexInfo;
    filesToUnstage = [];
    //only loop through the files in the unstaged(modified) section of the file panel
    let relevantCheckboxes = $(".checkbox-staged");
    for (let i = 0; i < relevantCheckboxes.length; i++) {
      if (relevantCheckboxes[i].checked === true) {
        filesToUnstage.push($(".file .staged")[i].innerHTML);
      }
    }
    //remove all files selected from index- makes them untracked, but functions the same as unstaging in the VisualGit UI
    return index.removeAll(filesToUnstage);
  })

  .then(function() {
    return index.write();
  })

  .then(function() {
    return index.writeTree();
  })

  .then(function() {
    for (let i = 0; i < filesToUnstage.length; i++) {
      addCommand("git reset " + filesToUnstage[i]);
    }
    hideDiffPanel();
    clearFilesList("staged");
    clearSelectAllCheckbox(false);
    determineButtonStates();  //disable stage button
    refreshAll(repository);
  })
}

function commitFiles() {
  let repository;

  Git.Repository.open(repoFullPath)
  .then(function(repoResult) {
    repository = repoResult;
    return Git.Reference.nameToId(repository, "HEAD");
  })

  .then(function(head) {
    return repository.getCommit(head);
  })

  .then(function(parent) {
    let sign;
    if (username !== null && email !== null) {
      sign = Git.Signature.now(username, email);
    } else {
      sign = Git.Signature.default(repository);
    }
    commitMessage = document.getElementById('commit-message-input').value;
    if (readFile.exists(repoFullPath + "/.git/MERGE_HEAD")) {
      let tid = readFile.read(repoFullPath + "/.git/MERGE_HEAD", null);
      return repository.createCommit("HEAD", sign, sign, commitMessage, oid, [parent.id().toString(), tid.trim()]);
    } else {
      return repository.createCommit("HEAD", sign, sign, commitMessage, oid, [parent]);
    }
  })

  .then(function(oid) {
    theirCommit = null;

    hideDiffPanel();
    clearFilesList("staged");
    clearCommitMessage();
  
    addCommand('git commit -m "' + commitMessage + '"');
    refreshAll(repository);
  }, function(err) {
    updateModalText("Please sign in before committing!");
  });

}

/*
clear files in the files panel on the left

type: String indicating whether to clear files in modified (unstaged) section or staged section
*/
function clearFilesList(type) {
  let filePanel;
  if (type == "modified") {
    filePanel = document.getElementById("files-changed");
  } else if (type == "staged") {
    filePanel = document.getElementById("staged-files");
  }

  while (filePanel.firstChild) {
    filePanel.removeChild(filePanel.firstChild);
  }
  
  //add message when there are no files back to UI
  let filesChangedMessage = document.createElement("p");
  filesChangedMessage.className = "modified-files-message";
  filesChangedMessage.id = "modified-files-message";
  filesChangedMessage.innerHTML = "Your " + type + " files will appear here";
  filePanel.appendChild(filesChangedMessage);
}



function clearCommitMessage() {
  document.getElementById('commit-message-input').value = "";
}

function clearSelectAllCheckbox(stage) {
  if (stage) {
    document.getElementById('select-all-modified').checked = false;
  } else {
    document.getElementById('select-all-staged').checked = false;
  }
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
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repos = repo;
    return repo.getReferences(Git.Reference.TYPE.LISTALL);
  })
  .then(function(refs) {
    let count = 0;
    async.whilst(
      function() {
        return count < refs.length;
      },

      function(cb) {
        if (!refs[count].isRemote()) {
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
              cb();
            });

            history.start();
          });
        } else {
          count++;
          cb();
        }
      },

      function(err) {
        console.error(err);
        callback(allCommits);
      });
    });
}

function pullFromRemote(e) {
  let repository;
  toggleCloseButton();
  if(checkForLocalChanges() && e==null) {
    $('#OK-button').attr("onclick", "pullFromRemote(this)");
    displayWarning("Please stash or commit your changes before pulling");
    return;
  }
  let branch = document.getElementById("branch-name").innerText;
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repository = repo;
    addCommand("git pull");
    displayModal("Pulling new changes from the remote repository...");

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
    return Git.AnnotatedCommit.lookup(repository, oid);
  }, function(err) {
    console.error(err);
  })
  .then(function(annotated) {
    Git.Merge.merge(repository, annotated, null, {
      checkoutStrategy: Git.Checkout.STRATEGY.FORCE,
    });
    theirCommit = annotated;
  })
  .then(function() {
    if (fs.existsSync(repoFullPath + "/.git/MERGE_MSG")) {
      updateModalText("There are merge conflicts! Please check the list of files on the right and resolve conflicts, then commit again.");
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
        updateModalText("Push successful");
        refreshAll(repo);
      });
    });
  });
}

function createBranch() {
  let branchName = document.getElementById("branchName").value;
  let repos;

  Git.Repository.open(repoFullPath)
    .then(function (repo) {
      // Create a new branch on head
      repos = repo;
      var flag = false;

      repo.getReferenceNames(Git.Reference.TYPE.LISTALL)
        .then(function (arrayReference) {
          for (var i = 0; i < arrayReference.length; i++) {
            var shortName = arrayReference[i].replace(/^.*[\\\/]/, '');
            if (shortName === branchName) {
              flag = true;
            }            
          }
          

          if (!flag) {
            if (confirm("Would you like to make a branch called " + branchName + "?")) {
              return true;
            }
          } else {
            alert("There is an existing local/remote branch with the name " + branchName + ".");
            return false;
          }

        })
        .then(function (verdict) {
          if (verdict) {
            addCommand("git branch " + branchName);
            return repo.getHeadCommit()
              .then(function (commit) {
                return repo.createBranch(
                  branchName,
                  commit,
                  0,
                  repo.defaultSignature(),
                  "Created new-branch on HEAD");
              }, function (err) {
                console.error(err);
              })
              .then(function () {
                refreshAll(repos);
              });
          }
        });
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
    fromBranch = branch;
    return repos.getCurrentBranch();
  })
  .then(function(toBranch) {
    return repos.mergeBranches(toBranch,
       fromBranch,
       repos.defaultSignature(),
       Git.Merge.PREFERENCE.NONE,
       null);
  })
  .then(function(index) {
    let text;
    if (index instanceof Git.Index) {
      text = "Conflicts Exist";
    } else {
      text = "Merged Successfully";
    }
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
    return Git.AnnotatedCommit.lookup(repos, oid);
  })
  .then(function(annotated) {
    Git.Merge.merge(repos, annotated, null, {
      checkoutStrategy: Git.Checkout.STRATEGY.FORCE,
    });
    theirCommit = annotated;
  })
  .then(function() {
    if (fs.existsSync(repoFullPath + "/.git/MERGE_MSG")) {
      updateModalText("There are merge conflicts! Please check the list of files on the right and resolve conflicts, then commit again.");
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
    return Git.AnnotatedCommit.lookup(repos, oid);
  })
  .then(function(annotated) {
    branch = annotated;
    return Git.Reference.nameToId(repos, 'refs/heads/' + to);
  })
  .then(function(oid) {
    return Git.AnnotatedCommit.lookup(repos, oid);
  })
  .then(function(annotated) {
    return Git.Rebase.init(repos, branch, annotated, null, null);
  })
  .then(function(rebase) {
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
    return Git.AnnotatedCommit.lookup(repos, id);
  })
  .then(function(commit) {
    let checkoutOptions = new Git.CheckoutOptions();
    return Git.Reset.fromAnnotated(repos, commit, Git.Reset.TYPE.HARD, checkoutOptions);
  })
  .then(function(number) {
    if (number !== 0) {
      updateModalText("Reset failed, please check if you have already pushed the commit.");
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
    addCommand("git revert " + name + "~1");
    return Git.Reference.nameToId(repo, name);
  })
  .then(function(id) {
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
    if (number === -1) {
      updateModalText("Revert failed, please check if you have already pushed the commit.");
    } else {
      updateModalText("Reverted successfully.");
    }
    refreshAll(repos);
  }, function(err) {
    updateModalText(err);
  });
}

function displayFiles() {
  modifiedFiles = [];
  stagedFiles = [];
  
  Git.Repository.open(repoFullPath)
  .then(function(repo) {
    repo.getStatus().then(function(statuses) {
      statuses.forEach(addModifiedOrStagedFile);  //add files to modifedFiles or stagedFiles array above if necessary
      
      //if there are files in the unstaged section, then remove the default message if its present
      if (modifiedFiles.length !== 0 && document.getElementById("modified-files-message") !== null) {
        let filePanelMessage = document.getElementById("modified-files-message");
        filePanelMessage.parentNode.removeChild(filePanelMessage);
      } 
        //if there are files in the staged section, then remove the default message if its present
      if (stagedFiles.length !== 0 && document.getElementById("staged-files-message") !== null) {
        let filePanelMessage = document.getElementById("staged-files-message");
        filePanelMessage.parentNode.removeChild(filePanelMessage);
      }
  
      for (let file of modifiedFiles) {
        displayFile(file, "modified");
      }

      for (let file of stagedFiles) {
        displayFile(file, "staged");
      }

      // Add file to array of modified files 'modifiedFiles' or array of staged files 'stagedFiles'
      function addModifiedOrStagedFile(file) {

        let modifiedFilePaths = document.getElementsByClassName('file-path modified');
        let stagedFilePaths = document.getElementsByClassName('file-path staged');
        
        //there are complex situations in which files should or should not appear 
        //these are necessary to determine if files should be displayed in the staged or modified (unstaged) sections
        //e.g. files are in section but need to be updated
        let newChangesExist = file.status().includes("WT_MODIFIED") || file.status().includes("WT_NEW");
        let fileUnstaged = (file.status().includes("WT_NEW") && file.status().includes("INDEX_DELETED"));

        let displayedInModified = false;
        let displayedInStaged = false;

        for (let i = 0; i < modifiedFilePaths.length; i++) {
          if (modifiedFilePaths[i].innerHTML === file.path()) {
            displayedInModified = true;
            break;
          }
        }

        for (let i = 0; i < stagedFilePaths.length; i++) {
          if (stagedFilePaths[i].innerHTML === file.path()) {
            displayedInStaged = true;
            break;
          }
        }

        let path = file.path();
        let modification = calculateModification(file);
        
        //if file is not staged and not displayed in the modified section
        if (!file.inIndex() && !displayedInModified) {
          modifiedFiles.push({
            filePath: path,
            fileModification: modification
          });
        } else if (file.inIndex()) {
          if (!displayedInStaged) { //if file is staged but not displayed in staged section
            if (!fileUnstaged) {  //without this line, unstaged files will show be added to stagedFiles array as they still pass the inIndex() test
              stagedFiles.push({
                filePath: path,
                fileModification: modification
              });
            }
          }
          //there could be staged and unstaged changes in one file, checks if staged files has been modified
          if (newChangesExist && !displayedInModified) {
            modifiedFiles.push({
              filePath: path,
              fileModification: modification
            });
          }
        }
      }

      // Find HOW the file has been modified
      function calculateModification(status) {
        if (status.isModified()) {
          return "MODIFIED";
        } else if (status.isNew()) {
          return "NEW";
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
      function displayFile(file, type) {
        
        let fileContainer = document.createElement("div");
        let filePath = document.createElement("p");
        filePath.className = ("file-path " + type);
        filePath.innerHTML = file.filePath;
        filePath.title = file.filePath;
        let fileElement = document.createElement("div");
        let checkboxElement = document.createElement("div");
        fileContainer.appendChild(checkboxElement);
        fileContainer.appendChild(fileElement);
        fileContainer.style.display='flex';

        // Set how the file has been modified (type required to differentiate between staged and unstaged files)
        if (file.fileModification === "NEW") {
          fileElement.className = "file " + type + " file-created";
        } else if (file.fileModification === "MODIFIED") {
          fileElement.className = "file " + type + " file-modified";
        } else if (file.fileModification === "DELETED") {
          fileElement.className = "file " + type + " file-deleted";
        } else {
          fileElement.className = "file" + type + " ";
        }

        fileElement.appendChild(filePath);
        
        let checkbox = document.createElement("input");
        checkboxElement.style.margin='5px';
        checkbox.type = "checkbox";
        checkbox.className = "checkbox checkbox-" + type; //type is required to separate out checkboxes for staged and unstaged files
        checkboxElement.appendChild(checkbox);

        if (type == "modified") {
          document.getElementById("files-changed").appendChild(fileContainer);
        } else if (type == "staged") {
          document.getElementById("staged-files").appendChild(fileContainer);
        }

        checkbox.onclick = function() {
          determineButtonStates();  //checks if any buttons should be disabled as no relevant checkboxes are selected 
        }

        fileElement.onclick = function () {
          var doc = document.getElementById("diff-panel");
          if (doc.style.width === '0px' || doc.style.width === '') {
            displayDiffPanel();
            document.getElementById("diff-panel-body").innerHTML = "";

            if (fileElement.className.indexOf("file-created") >= 0) {
              printNewFile(file.filePath);
            } else {
              if (fileElement.className.indexOf("staged") >= 0) {
                printFileDiff(file.filePath, true);
              } else if (fileElement.className.indexOf("modified") >= 0) {
                printFileDiff(file.filePath, false);
              }
            }
          } else {
            hideDiffPanel();
          }
        }
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

      // prints staged changes or unstaged changes depending on where file is
      function printFileDiff(filePath, staged) {
        getCurrentDiff(filePath, staged, function(line) {
          formatLine(line);
        })
      }

      function getCurrentDiff(filePath, staged, callback) {
        //depending on whether file is in staged or unstaged section in file panel, staged
        // or unstaged changes will be obtained in the code following this section of code.
        var diff;
        if (staged) {
          diff= repo.getHeadCommit().then(function(commit) {
            return commit.getTree().then(function(tree) {
              return Git.Diff.treeToIndex(repo, tree, null);
            });
          });
        } else {
          diff = Git.Diff.indexToWorkdir(repo, null, {
            flags: Git.Diff.OPTION.INCLUDE_UNTRACKED | Git.Diff.OPTION.RECURSE_UNTRACKED_DIRS
          });
        }

        //gets each line of code that has been modified and passes the lines onto formatLine() to be processed
        diff.then(function(diff) {
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
      
      // If files on the left panel exist, enable commit button
      disableOrEnableCommitButton();
      
      function disableOrEnableCommitButton(){
        let filesOnPanel = document.getElementsByClassName("file");
        let commitButton = (document.getElementById("commit-button") as HTMLButtonElement);
        console.log("Files to enable commit button: " + filesOnPanel.length);
        if(filesOnPanel.length == 0){
          commitButton.disabled = true;
        } else{
          commitButton.disabled = false;
        }
      }

    });
    
  },
  function(err) {
    console.error(err);
  });
}

function clearFilesListExport() {
  return new clearFilesList();
}

function clearCommitMessageExport() {
  return new clearCommitMessage();
}

function clearSelectAllCheckboxExport() {
  return new clearSelectAllCheckbox();
}


module.exports = { clearFilesListExport, clearCommitMessageExport, clearSelectAllCheckboxExport };