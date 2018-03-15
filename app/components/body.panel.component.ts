import { Component } from "@angular/core";
import { DiffPanelComponent } from "./diff.panel.component";
import { TextEditorPanelComponent } from "./textEditor.panel.component";
import { GraphPanelComponent } from "./graph.panel.component";

@Component({
  selector: "body-panel",
  template: `
  <div class="body-panel" id="body-panel">
    <text-editor-panel></text-editor-panel>
    <diff-panel></diff-panel>
    <graph-panel></graph-panel>
  </div>
  `,
  directives: [TextEditorPanelComponent, DiffPanelComponent, GraphPanelComponent]
})

export class BodyPanelComponent {

}
