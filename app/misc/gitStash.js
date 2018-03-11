"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clearModifiedFilesList = require('./git');
var clearCommitMessage = require('./git');
var clearSelectAllCheckbox = require('./git');
var Git = require("nodegit");
function stashChanges() {
    var repository;
    var NOSTASHES = "Cannot stash changes - There is nothing to stash.";
    Git.Repository.open(repoFullPath)
        .then(function (repoResult) {
        repository = repoResult;
        return;
    })
        .then(function () {
        var sign;
        if (username !== null && password !== null) {
            sign = Git.Signature.now(username, password);
        }
        else {
            sign = Git.Signature.default(repository);
        }
        var datetime = new Date();
        var stashTime = " (Stash from: " + datetime.getDate() + "-" + datetime.getMonth() + "-" + datetime.getFullYear() + " Time: " + datetime.getHours() + ":" + datetime.getMinutes() + ")";
        var stashMessage = document.getElementById('commit-message-input').value;
        if (!stashMessage) {
            updateModalText("Oops, your message is empty. Please write a message for the stash in the textbox before stashing.");
            return;
        }
        else {
            stashMessage += stashTime;
            return Git.Stash.save(repository, sign, stashMessage, Git.Stash.FLAGS.DEFAULT);
        }
    })
        .then(function (stashMessage) {
        if (stashMessage) {
            hideDiffPanel();
            clearModifiedFilesList();
            clearCommitMessage();
            clearSelectAllCheckbox();
            addCommand("git stash save '" + stashMessage + "'");
            updateStashes(repository);
            refreshAll(repository);
        }
    }, function (err) {
        if (err.message.endsWith(NOSTASHES)) {
            updateModalText("Oops, there's nothing to stash!");
        }
        else {
            updateModalText("Oops, error occours! If u haven't login, please login and try again.");
        }
    });
}
function updateStashes(repository) {
    var stashList = new Map();
    Git.Stash.foreach(repository, (function (value, key) {
        stashList.set(key, value);
    }), {}).then(function (result) {
        setStashList(stashList);
    }, function (err) {
        updateModalText("Oops, could not stash, please try again.");
    });
}
function deleteStash() {
    var repository;
    Git.Repository.open(repoFullPath)
        .then(function (repoResult) {
        repository = repoResult;
        return;
    })
        .then(function (indexResult) {
        var stashIndex = Number(document.getElementsByClassName('selected')[0].id);
        return Git.Stash.drop(repository, stashIndex);
    })
        .then(function () {
        updateStashes(repository);
        updateModalText("Stash dropped!");
        addCommand("git stash drop");
        refreshAll(repository);
    }, function (err) {
        updateModalText("Oops, error occours! If u haven't login, please login and try again.");
    });
}
function applyStashedChanges() {
    var repository;
    var STASHCONFLICTONE = "conflict prevents checkout";
    var STASHCONFLICTMULTIPLE = "conflicts prevents checkout";
    Git.Repository.open(repoFullPath)
        .then(function (repoResult) {
        repository = repoResult;
        return;
    })
        .then(function (indexResult) {
        var stashIndex = Number(document.getElementsByClassName('selected')[0].id);
        return Git.Stash.apply(repository, stashIndex, new Git.StashApplyOptions());
    })
        .then(function () {
        updateModalText("Stash applied successfully!");
        addCommand("git stash apply");
        refreshAll(repository);
    }, function (err) {
        if (err.message.endsWith(STASHCONFLICTONE) || err.message.endsWith(STASHCONFLICTMULTIPLE)) {
            updateModalText("Oops, there are conflicts while trying to apply your stash. Please resolve these (discard your changes).");
        }
        else {
            updateModalText("Oops, error occours! If u haven't login, please login and try again.");
        }
    });
}
