import { Component } from "@angular/core";

@Component({
  selector: "add-repository-panel",
  template: `
    <div class="add-repository-panel" id="add-repository-panel">
      <img src="./assets/Back.svg" (click)="returnToMainPanel()" class="back-button">

      <div class="add-repository-body">
        <div class="title">
          <h2 class="clone-title">Clone from Internet</h2>
        </div>

        <div class="block">
          <div class="left">
            <p>URL to clone from</p>
          </div>
          <div class="right">
          <input type="text" oninput="updateLocalPath()" name="repositoryRemote" size="50" id="repoClone" placeholder="https://github.com/user/repository.git"/>
          </div>
        </div>

        <div class="block">
          <div class="left">
            <p>File location to save to</p>
          </div>
          <div class="right">
            <input type="text" name="repositoryLocal" size="50" id="repoSave"/>
            <button class="button-clone" (click)="addRepository()">Clone</button>
          </div>
        </div>


        <div class="title">
          <h2 class="open-local-repo">Open Local Repository</h2>
        </div>

        <div class="block">
          <div class="left">
            <p>Location of existing repository</p>
          </div>
          <div class="right">
            <input type="text" name="repositoryLocal" size="50" id="repoOpen"/>
            <button class="button-open" (click)="openRepository()">Open</button>
          </div>
        </div>
      </div>
    </div>
  `
})

export class AddRepositoryComponent {

  addRepository(): void {
    if (document.getElementById("repoSave").value === "") {
      displayModal("Please enter a repo name!");
    } else if (document.getElementById("repoClone").value === "") {
      displayModal("Please enter a remote URL!");
    } else if (document.getElementById("repoSaveLocation").value === "") {
       displayModal("Please enter a save location!");
    } else {
      downloadRepository();
      switchToMainPanel();
    }
  }

  openRepository(): void {
    if (document.getElementById("repoOpen").value === "") {
      displayModal("Please enter a local path!");
    } else {
      openRepository();
      switchToMainPanel();
    }
  }

  returnToMainPanel(): void {
    switchToMainPanel();
  }
}
