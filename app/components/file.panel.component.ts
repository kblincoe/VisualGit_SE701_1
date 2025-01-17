import { Component } from "@angular/core";
import { StashPanelComponent } from "./stash.panel.component";

@Component({
  selector: "file-panel",
  template: `
  <div class="file-panel" id="file-panel" style="position:relative;">

    <div [hidden]="showStashPanel" class="modified-file-panel">
      <div style="overflow-y:scroll; height: 60vh;">
        <hr>

        <!-- modified files -->

        <div class="files-header" id="modified-files-header">
          <p class="section-heading">Unstaged changes</p>
        </div>

        <div class="files-changed" id="files-changed" ondrop="drop(event)" ondragover="allowDrop(event)">
          <p class="modified-files-message" id="unstaged-file-drop">Your unstaged files will appear here</p>
        </div>

        <div class="button-panel">
          <button class="file-panel-button" id="stage-button">Stage all</button>
        </div>
        <hr>


        <!-- staged files -->

        <div class="files-header" id="staged-files-header">
          <p class="section-heading">Staged changes</p>
        </div>

        <div class="files-changed" id="staged-files" ondrop="drop(event)" ondragover="allowDrop(event)">
          <p class="modified-files-message" id="staged-file-drop">Your staged files will appear here</p>
          <div class="file" *ngFor="let file of files">
            <p>{{file}}</p>
          </div>
        </div>

        <div class="button-panel">
          <button class="file-panel-button" id="unstage-button">Unstage all</button>
        </div>
        <hr>

        <!-- commit -->

        <div class="button-panel">
          <p class="section-heading">Commit staged files</p>
          <textarea placeholder="Describe your changes here..." class="commit-message-input" id="commit-message-input"></textarea>
          <button class="file-panel-button" id="commit-button">Commit</button>

    <stash-panel [hidden]="!showStashPanel" [setUpStashList]="showStashPanel"></stash-panel>
    <div class="button-panel" id="stash-panel">
      <div>
        <button class="file-panel-button" id="show-stash-button" (click)="togglePanelMode()">{{stashLabel}}</button>
      </div>
      <div class="stash-buttons">
        <button [ngClass]="{'hidden': showStashPanel}" class="file-panel-button" id="stash-button">Stash</button>
        <button [disabled]="disableWhenEmpty()" [ngClass]="{'hidden': !showStashPanel}" class="file-panel-button" id="delete-stash-button" (click)="togglePanelMode()">Delete Stash</button>
        <button [disabled]="disableWhenEmpty()" class="file-panel-button" id="stash-apply-button" (click)="togglePanelMode()">Apply Stash</button>
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
