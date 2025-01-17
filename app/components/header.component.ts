import { Component } from "@angular/core";
import { RepositoryService } from "../services/repository.service";
import { GraphService } from "../services/graph.service";

@Component({
  selector: "app-header",
  template: `
    <nav class="navbar navbar-inverse" role="navigation">
      <div class="container-fluid row navbar-container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <img src="./assets/AddRepositoryFolder.svg" onclick="switchToAddRepositoryPanel()" class="add-repository-button" title="Add Repository" style="cursor:pointer">
        </div>
        <div class="collapse navbar-collapse" id="navbar">
          <ul class="nav navbar-nav col-md-5 hidden-xs">
            <li><img src="./assets/RightArrow.svg" class="right-arrow"></li>
            <li class="repo-name dropdown-toggle">
                <a href="#" id="repo-name" data-toggle="modal" data-target="#repo-modal">repository</a>
            </li>
            <li><img src="./assets/RightArrow.svg" class="right-arrow"></li>
            <li class="branch-name dropdown">
              <a class="dropdown-toggle" id="branch-name" data-toggle="dropdown" style="cursor: pointer">
                branch<span class="caret"></span>
              </a>
              <ul class="dropdown-menu" id="branch-dropdown" role="menu" aria-labelledby="branch-name">
                <li role="presentation" id="create-branch">
                  <div class="input-group menuitem">
                    <input type="text" id="branchName" class="form-control" placeholder="Search or create branch">
                    <span class="input-group-btn">
                      <button class="btn btn-default" type="button" onclick="createBranch()">OK</button>
                    </span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="color-name dropdown">       
               <button class="btn btn-inverse dropdown-toggle btn-sm navbar-btn" id="color-name" data-toggle="dropdown">
             color
             <span class="caret"></span>
           </button>
             <ul class="dropdown-menu" id="color-dropdown" role="menu" aria-labelledby="color-name">
               <li class="white" onclick="changeColor('white')">white</li>
               <li class="vintage" onclick="changeColor('vintage')">vintage</li>
               <li class="blue" onclick="changeColor('blue')">blue</li>
               <li class="burgundy" onclick="changeColor('burgundy')">burgundy</li>
               <li class="default" onclick="changeColor('default')">default</li>
             </ul>
          </ul>

          <ul class="nav navbar-nav col-md-4 hidden-xs">
          <li><img src="./assets/Octopush.svg" class="push" style="cursor:pointer" onclick="pushToRemote()" title="Push"></li>
          <li><img src="./assets/Octopull.svg" class="pull" style="cursor:pointer" onclick="pullFromRemote()" title="Pull"></li>
         </ul>

          <ul class="nav navbar-nav navbar-right hidden-xs">
            <li>
              <a id="usernameTitle"></a>
            </li>
            <li>
              <a class="btn btn-default btn-outline btn-circle"  id="quickstartButton" data-toggle="collapse" (click)="showQuickstartModal()" aria-expanded="false" aria-controls="nav-collapse1">Quick Start</a>
            </li>
            <li>
              <a class="btn btn-default btn-outline btn-circle"  id="issuesButton" data-toggle="collapse" (click)="toggleIssuesPanel()" aria-expanded="false" aria-controls="nav-collapse1">Issues</a>
            </li>
            <li>
              <a class="btn btn-default btn-outline btn-circle"  id="avatar" data-toggle="collapse" href="." onclick="signOut()" aria-expanded="false" aria-controls="nav-collapse1">Sign in</a>
            </li>
          </ul>
          <div class="collapse nav navbar-nav nav-collapse" id="nav-collapse1">
            <form class="navbar-form navbar-right form-inline" role="form">
              <div class="form-group">
                <label class="sr-only" for="Email">User name</label>
                <input type="text" class="form-control" id="Email1" placeholder="Username/Email" autofocus required />
              </div>
              <div class="form-group">
                <label class="sr-only" for="Password">Password</label>
                <input type="password" class="form-control" id="Password1" placeholder="Password" required />
              </div>
              <div class="form-group">
                  <label class="sr-only" for="tfa-code">2FA code</label>
                  <input type="text" name="tfa-code" class="form-control" id="tfa-code" placeholder="2FA code (optional)" />
              </div>
              <button type="submit" class="btn btn-success" (click)="switchToMainPanel()">Sign in</button>
            </form>
          </div>

          <ul class="nav navbar-nav visible-xs">
            <li (click)="promptUserToAddRepository()"><a>&nbsp;&nbsp;add repository</a></li>
            <li class="dropdown">
              <a id="repo-name" data-toggle="modal" data-target="#repo-modal" href="#">
                &nbsp;&nbsp;repository
                <span class="caret"></span>
              </a>
            </li>
            <li class="dropdown">
              <a id="branch-name" data-toggle="dropdown" href="#">
                &nbsp;&nbsp;branch
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" id="branch-dropdown" role="menu" aria-labelledby="branch-name">
                <li role="presentation" id="create-branch">
                  <div class="input-group menuitem">
                    <input type="text" id="branchName" class="form-control" placeholder="Search or create branch">
                    <span class="input-group-btn">
                      <button class="btn btn-default" type="button" onclick="createBranch()">OK</button>
                    </span>
                  </div>
                </li>
              </ul>
            </li>
            <li class="dropdown">
              <a id="merge-name" onclick="getOtherBranches()" data-toggle="dropdown" href="#">
                &nbsp;&nbsp;update from
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" id="merge-dropdown" role="menu" >
              </ul>
            </li>
            <li class="upload" onclick="pullFromRemote()"><a href="#">&nbsp;&nbsp;pull</a></li>
            <li class="download"onclick="pushToRemote()"><a href="#">&nbsp;&nbsp;push</a></li>
          </ul>
        </div>
      </div>
    </nav>
    <div id="modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="modal-title">Info</h4>
          </div>
          <div class="modal-body" id="modal-text-box">
            unset
          </div>
          <div class="modal-footer">
            <button type="button" id="close-button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" id="cancel-button" class="btn btn-secondary hide" data-dismiss="modal" onclick="toggleCloseButton()">Cancel</button>
            <button type="button" id="OK-button" class="btn btn-primary hide" data-dismiss="modal">Continue anyway</button>
          </div>
        </div>
      </div>
    </div>

    <div id="text-editor-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">Warning</h4>
          </div>
          <div class="modal-body" id="modal-text-box">
            Are you sure that you want to stop editing the file? All unsaved changes will be lost!
          </div>
          <div class="modal-footer">
            <button type="button" id="exit-edit-mode-button" class="btn btn-primary" onclick=hideTextEditorPanel() data-dismiss="modal">Yes</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>

          </div>
        </div>
      </div>
    </div>
    <div id="repo-modal" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <ul class="list-group"id="repo-dropdown" role="menu" aria-labelledby="repo-name">
          </ul>
          <div class="modal-footer">
            <label for="repoCloneLocation" style="float: left;padding-right: 5px;">Clone Location:</label>
            <input type="file" webkitdirectory directory name="repoFullPath" id="repoCloneLocation" style="float: left;"/>
            <button type="button" class="btn btn-primary disabled" style="float: right" id="cloneButton" onclick="cloneRepo()">Clone</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>
  `,
  providers: [RepositoryService, GraphService]
})

export class HeaderComponent   {
  repoName: string = "Repo name";
  repoBranch: string = "Repo branch";
  repository: any;
  issueOpen: boolean = false;

  promptUserToAddRepository(): void {
    switchToAddRepositoryPanel();
  }

  switchToMainPanel(): void {
    signInHead(collpaseSignPanel);
  }

  showQuickstartModal(): void {
    displayQuickstartModal();
  }

  toggleIssuesPanel(): void {
    if (!this.issueOpen) {
      switchToIssuesPanel();
      this.issueOpen = true;
    } else {
      switchFromIssuesPanel();
      this.issueOpen = false;
    }
  }
}
