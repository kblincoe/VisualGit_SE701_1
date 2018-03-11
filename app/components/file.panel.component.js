"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var stash_panel_component_1 = require("./stash.panel.component");
var FilePanelComponent = (function () {
    function FilePanelComponent() {
        this.showStashPanel = false;
        this.stashLabel = "Show Stashes";
    }
    FilePanelComponent.prototype.disableWhenEmpty = function () {
        return (!this.showStashPanel || getStashList().size == 0) ? true : false;
    };
    FilePanelComponent.prototype.togglePanelMode = function () {
        this.showStashPanel = !(this.showStashPanel);
        this.stashLabel = this.showStashPanel ? "Hide Stashes" : "Show Stashes";
    };
    FilePanelComponent = __decorate([
        core_1.Component({
            selector: "file-panel",
            template: "\n  <div class=\"file-panel\" id=\"file-panel\" style=\"overflow-y:scroll; position:relative;\">\n\n  <div [hidden]=\"showStashPanel\" class=\"modified-file-panel\">\n    <div class=\"modified-files-header\" id=\"modified-files-header\">\n      <p class=\"select-all-message\" id=\"select-all-message\">Select all</p>\n      <input onClick=\"setAllCheckboxes(this);\" type=\"checkbox\" class=\"select-all-checkbox\" id=\"select-all-checkbox\"/>\n    </div>\n\n    <div class=\"files-changed\" id=\"files-changed\">\n      <p class=\"modified-files-message\" id=\"modified-files-message\">Your modified files will appear here</p>\n      <div class=\"file\" *ngFor=\"let file of files\">\n        <p>{{file}}</p>\n      </div>\n    </div>\n\n    <div class=\"commit-panel\" id=\"commit-panel\">\n      <textarea placeholder=\"Describe your changes here...\" class=\"commit-message-input\" id=\"commit-message-input\"></textarea>\n      <button class=\"commit-button\" id=\"commit-button\" disabled>Commit</button>\n    </div>\n  </div>\n\n  <stash-panel [hidden]=\"!showStashPanel\" [setUpStashList]=\"showStashPanel\"></stash-panel>\n\n    <div class=\"commit-panel\" id=\"stash-panel\">\n      <div>\n        <button class=\"commit-button\" id=\"show-stash-button\" (click)=\"togglePanelMode()\">{{stashLabel}}</button>\n      </div>\n      <div class=\"stash-buttons\">\n        <button [ngClass]=\"{'hidden': showStashPanel}\" class=\"commit-button\" id=\"stash-button\">Stash</button>\n        <button [disabled]=\"disableWhenEmpty()\" [ngClass]=\"{'hidden': !showStashPanel}\" class=\"commit-button\" id=\"delete-stash-button\" (click)=\"togglePanelMode()\">Delete Stash</button>\n        <button [disabled]=\"disableWhenEmpty()\" class=\"commit-button\" id=\"stash-apply-button\" (click)=\"togglePanelMode()\">Apply Stash</button>\n      </div>\n    </div>\n\n  </div>\n  ",
            directives: [stash_panel_component_1.StashPanelComponent]
        }),
        __metadata("design:paramtypes", [])
    ], FilePanelComponent);
    return FilePanelComponent;
}());
exports.FilePanelComponent = FilePanelComponent;
