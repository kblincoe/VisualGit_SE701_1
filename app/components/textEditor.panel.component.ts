import { Component } from "@angular/core";

@Component({
  selector: "text-editor-panel",
  template: `
  <div class="text-editor-panel" id="text-editor-panel">
    <button id="save-file" class="btn save-button">Save</button>
    <button class="btn save-button" onclick=hideEditorPanel()>Discard Changes</button>
    <textarea class="text-editor-panel-body" id="text-editor-panel-body" ></textarea>
  </div>
  `
})

export class TextEditorPanelComponent {
    
}