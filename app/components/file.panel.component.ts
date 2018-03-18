import { Component } from "@angular/core";
import { StashPanelComponent } from "./stash.panel.component";

@Component({
  selector: "file-panel",
  template: `
  <div class="file-panel" id="file-panel" style="overflow-y:scroll; position:relative;">

  <div [hidden]="showStashPanel" class="modified-file-panel">
    <div class="modified-files-header" id="modified-files-header">
      <p class="select-all-message" id="select-all-message">Select all</p>
      <input onClick="setAllCheckboxes(this);" type="checkbox" class="select-all-checkbox" id="select-all-checkbox"/>
    </div>

    <div class="files-changed" id="files-changed">
      <p class="modified-files-message" id="modified-files-message">Your modified files will appear here</p>
      <div class="file" *ngFor="let file of files">
        <p>{{file}}</p>
      </div>

      <div class="commit-panel" id="commit-panel">
        <textarea placeholder="Describe your changes here..." class="commit-message-input" id="commit-message-input"></textarea>
        <button class="commit-button" id="commit-button">Commit</button>
      </div>
    </div>
  </div>

  <stash-panel [hidden]="!showStashPanel" [setUpStashList]="showStashPanel"></stash-panel>

    <div class="commit-panel" id="stash-panel">
      <div>
        <button class="commit-button" id="show-stash-button" (click)="togglePanelMode()">{{stashLabel}}</button>
      </div>
      <div class="stash-buttons">
        <button [ngClass]="{'hidden': showStashPanel}" class="commit-button" id="stash-button">Stash</button>
        <button [disabled]="disableWhenEmpty()" [ngClass]="{'hidden': !showStashPanel}" class="commit-button" id="delete-stash-button" (click)="togglePanelMode()">Delete Stash</button>
        <button [disabled]="disableWhenEmpty()" class="commit-button" id="stash-apply-button" (click)="togglePanelMode()">Apply Stash</button>
      </div>
    </div>

  </div>
  `,
  directives: [StashPanelComponent]
})

export class FilePanelComponent {
  showStashPanel: boolean;
  stashLabel: string;

  constructor() {
    this.showStashPanel = false;
    this.stashLabel = "Show Stashes";
  }

  disableWhenEmpty() {
    return (!this.showStashPanel || getStashList().size == 0) ? true : false;
  }

  togglePanelMode() {
    this.showStashPanel = !(this.showStashPanel);
    this.stashLabel = this.showStashPanel ? "Hide Stashes" : "Show Stashes";
  }

}
