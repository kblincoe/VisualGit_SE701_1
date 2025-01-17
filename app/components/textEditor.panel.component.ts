import { Component } from "@angular/core";

@Component({
  selector: "text-editor-panel",
  template: `
  <div class="text-editor-panel" id="text-editor-panel">
    <div><span title="" id="text-editor-panel-title"></span></div>
    <button id="save-file" class="btn editor-button">Save</button>
    <button class="btn editor-button" onclick=displayExitConfirmationDialog()>Exit Edit Mode</button>
    <textarea class="text-editor-panel-body" id="text-editor-panel-body" ></textarea>
  </div>
  `
})

export class TextEditorPanelComponent {
    
}