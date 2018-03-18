import { Component } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { FilePanelComponent } from "./file.panel.component";
import { BodyPanelComponent } from "./body.panel.component";
import { FooterComponent } from "./footer.component";
import { AddRepositoryComponent } from "./add.repository.component";
import { AuthenticateComponent } from "./authenticate.component";
import { IssuesPanelComponent } from "./issues.panel.component";

@Component({
  selector: "my-app",
  template: `
    <user-auth></user-auth>
    <app-header></app-header>
    <file-panel></file-panel>
    <issues-panel></issues-panel>
    <body-panel></body-panel>
    <add-repository-panel></add-repository-panel>
    <app-footer></app-footer>
  `,
  directives: [HeaderComponent, FilePanelComponent, BodyPanelComponent, FooterComponent, AddRepositoryComponent, AuthenticateComponent, IssuesPanelComponent]
})

export class AppComponent { }
