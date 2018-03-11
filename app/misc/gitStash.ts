import * as nodegit from "git";
import NodeGit, { Status } from "nodegit";

let clearModifiedFilesList = require('./git');
let clearCommitMessage = require('./git');
let clearSelectAllCheckbox = require('./git');
let Git = require("nodegit");

function stashChanges() {
  let repository;
  let NOSTASHES = "Cannot stash changes - There is nothing to stash."

  Git.Repository.open(repoFullPath)
  .then(function(repoResult) {
    repository = repoResult;
    return;
  })

  .then(function() {
    let sign;
    if (username !== null && password !== null) {
      sign = Git.Signature.now(username, password);
    } else {
      sign = Git.Signature.default(repository);
    }
    var datetime = new Date();
    // As we can not yet visualise stashes, showing the time of the stash is the next best option
    var stashTime = " (Stash from: " + datetime.getDate() + "-" + datetime.getMonth() + "-" + datetime.getFullYear() + " Time: " + datetime.getHours() + ":" + datetime.getMinutes() + ")";
    var stashMessage = document.getElementById('commit-message-input').value;
    if (!stashMessage) {
      updateModalText("Oops, your message is empty. Please write a message for the stash in the textbox before stashing.");
      return;
    } else {
      stashMessage += stashTime;
      return Git.Stash.save(repository, sign, stashMessage, Git.Stash.FLAGS.DEFAULT);
    }
  })
  .then(function(stashMessage) {
    if (stashMessage) {
      hideDiffPanel();
      clearModifiedFilesList();
      clearCommitMessage();
      clearSelectAllCheckbox();
      addCommand("git stash save '" + stashMessage + "'");
      updateStashes(repository);
      refreshAll(repository);
    }
  }, function(err) {
    if (err.message.endsWith(NOSTASHES)){
      updateModalText("Oops, there's nothing to stash!");
    } else {
      updateModalText("Oops, error occours! If u haven't login, please login and try again.");
    }
  });
}

function updateStashes(repository) {
  // We want to update the new stash in our local storage
  let stashList = new Map();
  Git.Stash.foreach(repository, ((value,key) => {
    stashList.set(key, value);
  }), {}).then(function(result) {
    setStashList(stashList);
  }, function (err) {
    updateModalText("Oops, could not stash, please try again.");
  });
}

function deleteStash(){
  let repository;

  Git.Repository.open(repoFullPath)
  .then(function(repoResult) {
    repository = repoResult;
    return;
  })

  .then(function(indexResult) {
    var stashIndex = Number(document.getElementsByClassName('selected')[0].id);
    return Git.Stash.drop(repository, stashIndex);
  })
  .then(function() {
    updateStashes(repository);
    updateModalText("Stash dropped!");
    addCommand("git stash drop");
    refreshAll(repository);
  }, function(err) {
    updateModalText("Oops, error occours! If u haven't login, please login and try again.");
  });
}

function applyStashedChanges() {
  let repository;
  let STASHCONFLICTONE = "conflict prevents checkout";
  let STASHCONFLICTMULTIPLE = "conflicts prevents checkout"

  Git.Repository.open(repoFullPath)
  .then(function(repoResult) {
    repository = repoResult;
    return;
  })

  .then(function(indexResult) {
    var stashIndex = Number(document.getElementsByClassName('selected')[0].id);
    return Git.Stash.apply(repository, stashIndex, new Git.StashApplyOptions());
  })
  .then(function() {
    updateModalText("Stash applied successfully!");
    addCommand("git stash apply");
    refreshAll(repository);
  }, function(err) {
    if (err.message.endsWith(STASHCONFLICTONE) || err.message.endsWith(STASHCONFLICTMULTIPLE)){
      updateModalText("Oops, there are conflicts while trying to apply your stash. Please resolve these (discard your changes).");
    } else {
      updateModalText("Oops, error occours! If u haven't login, please login and try again.");
    }
  });
}