import { Component, Input } from "@angular/core";

@Component({
  selector: "stash-panel",
  template: `
  <div class="stashed-files">
    <h2 class="heading">Stashed Changes</h2>
    <p class="modified-files-message"> Choose a stash to apply </p>

    <div id="scroll-panel">
      <div class="files-changed" id="stash-list">
        <div class="file stashed-file" *ngFor="let stash of stashList">
          <div id="{{stash.value}}" class="stashed-file" [ngClass]="{'selected': selectedStash == stash.value}">
            <p (click)="selectStash(stash.value)" style="white-space: normal;">{{stash.key}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})

export class StashPanelComponent {
  @Input() setUpStashList: boolean;
  stashList: any;
  selectedStash: number;

  constructor() {
    this.stashList = [];
  }

  // listens to parent button click to showing stash to set up the panel
  ngOnChanges(changes: {setUpStashList: boolean}) {
    if (this.setUpStashList) {
      this.showStashList();
      this.stashList.length > 0 ? this.selectedStash = 0 : null;
    }
  }

  showStashList() {
    let stashMap = getStashList();
    this.stashList = [];
    stashMap.forEach((value,key) => {
      this.stashList.push({
        key: key,
        value: Number(value)
      })
    })
  }

  selectStash(key) {
    this.selectedStash = Number(key);
  }
}
