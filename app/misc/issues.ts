let Git = require("nodegit");
let $ = require('jQuery');
let repo;
let client;
let issue;
let commentSection;
let issueNumber;

function getIssues(ghrepo) {
    repo = ghrepo;
    $('#issues-panel-dropdown').empty();

    //reset the single issue panel in case there is already another issue shown
    resetSingleIssue();

    //1 is number of pages of issues requested, 200 is number of issues on the page 
    ghrepo.issues(1,200,function (request, issuesArray) {
        for (let i = 0; i < issuesArray.length; i++) {
            let issueName = issuesArray[i].number + ": " + issuesArray[i].title;
            displayBranch(issueName, "issues-panel-dropdown", "selectIssue(this)");
        }
    });
}

//client is required to get and store the issue to for functions later
function setClient(currentClient) {
    client = currentClient;
}

function selectIssue(ele) {
    let temp = ele.innerHTML.split(":");
    let issueNumber = temp[0];
    issue = client.issue(repo.name, issueNumber);
    displayIssue(issue);
}

function closeIssue() {
    issue.update({
        "state": "closed",
    }, function(request, response) {
        let issueName = response.number + ': ' + response.title;
        document.getElementById(issueName).remove();   
        resetSingleIssue();
    }); 
}

function displayIssue(issue) {
    //make sure the single issue panel is displaying the correct items and the user can comment
    switchFromCreateIssue();
    document.getElementById("enter-comment").style.display = "inline";
    $('#comments-section').empty();

    issue.info(function(request, response) {
        $('#issueTitle').text(response.title);
        $('#issueBody').text(response.body);
    });

    issue.comments(function displayComments(request, comments) { 
        commentSection = document.getElementById("comments-section");
        for (let i = 0; i < comments.length; i++) {    
            addComment(comments[i]);
        }
    });
}

function createIssueComment() {
    let comment = $('#comment-text-area').val();
    $('#comment-text-area').val(""); //reset so comment text area is blank again
    commentSection = document.getElementById("comments-section");

    issue.createComment({
        "body": comment,
    }, function(request, createdComment) { 
        addComment(createdComment);
        return comment.id;
    });
}

function addComment(comment) {
    let mainPanel = document.createElement("div");
    mainPanel.setAttribute("class", "panel panel-default");
    mainPanel.setAttribute("id", comment.id);

    let headerPanel = document.createElement("div");
    headerPanel.setAttribute("class", "panel-heading");
    
    var date = comment.created_at.split("T"); 
    let heading = document.createElement("h3");
    heading.setAttribute("class", "panel-title");
    heading.innerHTML = comment.user.login + " commented on " + date[0];
    headerPanel.appendChild(heading);

    let bodyPanel = document.createElement("div");
    bodyPanel.setAttribute("class", "panel-body");
    bodyPanel.innerHTML = comment.body;

    commentSection.appendChild(mainPanel);
    mainPanel.appendChild(headerPanel);
    mainPanel.appendChild(bodyPanel);
}

//TODO: can possibly add in future to the repo.issue to allow for assignees, milestones, labels
function createIssue(title, body) {
    repo.issue({
        "title": title,
        "body": body,
    }, function(request, issueInfo) { //difference between the parameters issue and issueInfo is that issue is an object for getting info about an issue
        resetSingleIssue();
        let issueName = issueInfo.number + ": " + issueInfo.title;
        issueNumber = issueInfo.number;
        switchFromCreateIssue();
        displayBranch(issueName, "issues-panel-dropdown", "selectIssue(this)");
        document.getElementById("enter-comment").style.display = "inline";
        $('#issueTitle').text(issueInfo.title);
        $('#issueBody').text(issueInfo.body);

        //for the sake of consistency, the ISSUE rather than the ISSUEINFO needs to be saved in case the user chooses to close the issue
        issue = client.issue(repo.name, issueNumber);
    }); 
}

//when switching between repositories or after closing the issue, the body must be updated, it is reset to show no issue
function resetSingleIssue() {
    $('#issueTitle').text("No issue chosen");
    $('#issueBody').text("");
    $('#comments-section').empty();
    document.getElementById("enter-comment").style.display = "none";
}
