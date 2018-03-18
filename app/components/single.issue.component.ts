import { Component } from "@angular/core";

@Component({
  selector: "single-issue",
  template: `
  <div class="single-issue" id="single-issue"> 
    <div id="create-issue">
        <form id="create-issue-form">
            <div class="form-group">
                <label>Issue Title</label>
                <input class="form-control" id="issue-title" placeholder="Enter issue name">
            </div>
            <div class="form-group">
                <label>Enter issue body</label>
                <textarea class="form-control" id="create-issue-textarea" rows="3"></textarea>
                <button type="button" class="btn"  (click)="createNewIssue()">Submit</button>
            </div>
        </form>
    </div>
    <div id="issue-content">
        <h1 class="display-4" id="issueTitle">No issue has been picked</h1>
        <p class="lead" id="issueBody">  </p>
        <hr class="my-4">
        <div id = "comments-section">
        </div>
        <div class="panel panel-default" id="enter-comment">
            <div class="panel-heading">
                <h3 class="panel-title">Add Comment</h3>
            </div>
            <div class="panel-body">
                <textarea class="form-control" id="comment-text-area" rows="3"></textarea>
            </div>
            <div class="btn-group" role="group">
                <button type="button" class="btn" (click)="createComment()" >Submit</button>
                <button type="button" class="btn"  (click)="closeCurrentIssue()">Close Issue</button>
            </div>
        </div>
    </div>
  </div>
  `
})

export class SingleIssueComponent {
    closeCurrentIssue() : void  {
        closeIssue();
    }

    createComment() : void {
        createIssueComment();
    }

    createNewIssue() : void {
        let title = $('#issue-title').val();
        let body = $('#create-issue-textarea').val();
        createIssue(title, body);
        $('#issue-title').val("");
        $('#create-issue-textarea').val("");
    }
}
