"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var IssuesPanelComponent = (function () {
    function IssuesPanelComponent() {
    }
    IssuesPanelComponent.prototype.addAnIssue = function () {
        switchToCreateIssue();
    };
    IssuesPanelComponent = __decorate([
        core_1.Component({
            selector: "issues-panel",
            template: "\n  <div class=\"issues-panel\" id=\"issues-panel\">\n    <button type=\"button\" class=\"btn\" (click)=\"addAnIssue()\">Add Issue</button>\n    <div class=\"issues-panel-body\" id=\"issues-panel-body\"></div>\n        <ul class=\"list-group\" id=\"issues-panel-dropdown\">\n        </ul>\n    </div>\n  "
        })
    ], IssuesPanelComponent);
    return IssuesPanelComponent;
}());
exports.IssuesPanelComponent = IssuesPanelComponent;
