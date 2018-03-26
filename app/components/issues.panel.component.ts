import { Component } from "@angular/core";

@Component({
  selector: "issues-panel",
  template: `
  <div class="issues-panel" id="issues-panel">
    <button type="button" class="btn" (click)="addAnIssue()">Add Issue</button>
    <div class="issues-panel-body" id="issues-panel-body"></div>
        <ul class="list-group" id="issues-panel-dropdown">
        </ul>
    </div>
  `
})

export class IssuesPanelComponent {
    addAnIssue() : void {
      switchToCreateIssue() ;
    }
}
