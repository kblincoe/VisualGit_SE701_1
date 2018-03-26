var Git = require("nodegit");
var $ = require('jQuery');
var repo;
var client;
var issue;
var commentSection;
var issueNumber;
function getIssues(ghrepo) {
    repo = ghrepo;
    $('#issues-panel-dropdown').empty();
    resetSingleIssue();
    ghrepo.issues(1, 200, function (request, issuesArray) {
        for (var i = 0; i < issuesArray.length; i++) {
            var issueName = issuesArray[i].number + ": " + issuesArray[i].title;
            displayBranch(issueName, "issues-panel-dropdown", "selectIssue(this)");
        }
    });
}
function setClient(currentClient) {
    client = currentClient;
}
function selectIssue(ele) {
    var temp = ele.innerHTML.split(":");
    var issueNumber = temp[0];
    issue = client.issue(repo.name, issueNumber);
    displayIssue(issue);
}
function closeIssue() {
    issue.update({
        "state": "closed",
    }, function (request, response) {
        var issueName = response.number + ': ' + response.title;
        document.getElementById(issueName).remove();
        resetSingleIssue();
    });
}
function displayIssue(issue) {
    switchFromCreateIssue();
    document.getElementById("enter-comment").style.display = "inline";
    $('#comments-section').empty();
    issue.info(function (request, response) {
        $('#issueTitle').text(response.title);
        $('#issueBody').text(response.body);
    });
    issue.comments(function displayComments(request, comments) {
        commentSection = document.getElementById("comments-section");
        for (var i = 0; i < comments.length; i++) {
            addComment(comments[i]);
        }
    });
}
function createIssueComment() {
    var comment = $('#comment-text-area').val();
    $('#comment-text-area').val("");
    commentSection = document.getElementById("comments-section");
    issue.createComment({
        "body": comment,
    }, function (request, createdComment) {
        addComment(createdComment);
        return comment.id;
    });
}
function addComment(comment) {
    var mainPanel = document.createElement("div");
    mainPanel.setAttribute("class", "panel panel-default");
    mainPanel.setAttribute("id", comment.id);
    var headerPanel = document.createElement("div");
    headerPanel.setAttribute("class", "panel-heading");
    var date = comment.created_at.split("T");
    var heading = document.createElement("h3");
    heading.setAttribute("class", "panel-title");
    heading.innerHTML = comment.user.login + " commented on " + date[0];
    headerPanel.appendChild(heading);
    var bodyPanel = document.createElement("div");
    bodyPanel.setAttribute("class", "panel-body");
    bodyPanel.innerHTML = comment.body;
    commentSection.appendChild(mainPanel);
    mainPanel.appendChild(headerPanel);
    mainPanel.appendChild(bodyPanel);
}
function createIssue(title, body) {
    repo.issue({
        "title": title,
        "body": body,
    }, function (request, issueInfo) {
        resetSingleIssue();
        var issueName = issueInfo.number + ": " + issueInfo.title;
        issueNumber = issueInfo.number;
        switchFromCreateIssue();
        displayBranch(issueName, "issues-panel-dropdown", "selectIssue(this)");
        document.getElementById("enter-comment").style.display = "inline";
        $('#issueTitle').text(issueInfo.title);
        $('#issueBody').text(issueInfo.body);
        issue = client.issue(repo.name, issueNumber);
    });
}
function resetSingleIssue() {
    $('#issueTitle').text("No issue chosen");
    $('#issueBody').text("");
    $('#comments-section').empty();
    document.getElementById("enter-comment").style.display = "none";
}
