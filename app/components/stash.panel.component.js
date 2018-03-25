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
var StashPanelComponent = (function () {
    function StashPanelComponent() {
        this.stashList = [];
    }
    StashPanelComponent.prototype.ngOnChanges = function (changes) {
        if (this.setUpStashList) {
            this.showStashList();
            this.stashList.length > 0 ? this.selectedStash = 0 : null;
        }
    };
    StashPanelComponent.prototype.showStashList = function () {
        var _this = this;
        var stashMap = getStashList();
        this.stashList = [];
        stashMap.forEach(function (value, key) {
            _this.stashList.push({
                key: key,
                value: Number(value)
            });
        });
    };
    StashPanelComponent.prototype.selectStash = function (key) {
        this.selectedStash = Number(key);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], StashPanelComponent.prototype, "setUpStashList", void 0);
    StashPanelComponent = __decorate([
        core_1.Component({
            selector: "stash-panel",
            template: "\n  <div class=\"stashed-files\">\n    <h2 class=\"heading\">Stashed Changes</h2>\n    <p class=\"modified-files-message\"> Choose a stash to apply </p>\n\n    <div id=\"scroll-panel\">\n      <div class=\"files-changed\" id=\"stash-list\">\n        <div class=\"file stashed-file\" *ngFor=\"let stash of stashList\">\n          <div id=\"{{stash.value}}\" class=\"stashed-file\" [ngClass]=\"{'selected': selectedStash == stash.value}\">\n            <p (click)=\"selectStash(stash.value)\" style=\"white-space: normal;\">{{stash.key}}</p>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  "
        }),
        __metadata("design:paramtypes", [])
    ], StashPanelComponent);
    return StashPanelComponent;
}());
exports.StashPanelComponent = StashPanelComponent;
