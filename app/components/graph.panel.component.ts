import {Component, Directive, ElementRef, ViewChild} from "@angular/core";
import {mergeCommits, rebaseCommits} from "../misc/git";

@Component({
  selector: "graph-panel",
  template: `
  <div class="graph-panel" id="graph-panel">
    <div class="network" id="my-network">
    </div>
    <ul class="dropdown-menu" role="menu" id="branchOptions">
      <li><a tabindex="0" href="#">Checkout this branch</a></li>
      <li class="dropdown-submenu">
        <a tabindex="0" href="#">Merge from</a>
        <ul class="dropdown-menu" role="menu" id="otherBranches"></ul>
      </li>
    </ul>
    <div class="modal fade" id="mergeModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Merge branches</h4>
          </div>
          <div class="modal-body">
            <p id="mergeModalBody"></p>
          </div>
          <p class="invisible" id="fromMerge" #fromMerge></p>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="mergeBranches(fromMerge.innerHTML)" data-dismiss="modal">Yes</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>
    <div class="modal fade" id="rebaseModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Rebase branches</h4>
          </div>
          <div class="modal-body">
            <p id="rebaseModalBody"></p>
          </div>
          <p class="invisible" id="fromRebase" #fromRebase></p>
          <p class="invisible" id="toRebase" #toRebase></p>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="mergeBranches(fromMerge.innerHTML)" data-dismiss="modal">Yes</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>
  </div>
  `
})

export class GraphPanelComponent {
  mergeBranches(fromMerge : string): void {
    let p1 = fromMerge;
    mergeCommits(p1);
  }

  rebaseBranches(fromRebase : string, toRebase : string): void {
    let p1 = fromRebase;
    let p2 = toRebase;
    rebaseCommits(p1, p2);
  }
}
