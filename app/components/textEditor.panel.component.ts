import { Component } from "@angular/core";

@Component({
  selector: "text-editor-panel",
  template: `
  <div class="text-editor-panel" id="text-editor-panel">
    <button type="button" id="save-file">Save</button>
    <textarea class="text-editor-panel-body" id="text-editor-panel-body" ></textarea>
  </div>
  `
})

export class TextEditorPanelComponent {
    
}