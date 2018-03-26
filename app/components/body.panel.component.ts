import { Component } from "@angular/core";
import { DiffPanelComponent } from "./diff.panel.component";
import { TextEditorPanelComponent } from "./textEditor.panel.component";
import { GraphPanelComponent } from "./graph.panel.component";
import { SingleIssueComponent } from "./single.issue.component";


@Component({
  selector: "body-panel",
  template: `
  <div class="body-panel" id="body-panel">
    <single-issue></single-issue>
    <text-editor-panel></text-editor-panel>
    <diff-panel></diff-panel>
    <graph-panel></graph-panel>
  </div>
  `,
  directives: [TextEditorPanelComponent, DiffPanelComponent, GraphPanelComponent, SingleIssueComponent]
})

export class BodyPanelComponent {

}
