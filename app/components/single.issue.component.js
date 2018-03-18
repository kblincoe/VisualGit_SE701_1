"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SingleIssueComponent = (function () {
    function SingleIssueComponent() {
    }
    SingleIssueComponent.prototype.closeCurrentIssue = function () {
        closeIssue();
    };
    SingleIssueComponent.prototype.createComment = function () {
        createIssueComment();
    };
    SingleIssueComponent.prototype.createNewIssue = function () {
        var title = $('#issue-title').val();
        var body = $('#create-issue-textarea').val();
        createIssue(title, body);
        $('#issue-title').val("");
        $('#create-issue-textarea').val("");
    };
    SingleIssueComponent = __decorate([
        core_1.Component({
            selector: "single-issue",
            template: "\n  <div class=\"single-issue\" id=\"single-issue\"> \n    <div id=\"create-issue\">\n        <form id=\"create-issue-form\">\n            <div class=\"form-group\">\n                <label>Issue Title</label>\n                <input class=\"form-control\" id=\"issue-title\" placeholder=\"Enter issue name\">\n            </div>\n            <div class=\"form-group\">\n                <label>Enter issue body</label>\n                <textarea class=\"form-control\" id=\"create-issue-textarea\" rows=\"3\"></textarea>\n                <button type=\"button\" class=\"btn\"  (click)=\"createNewIssue()\">Submit</button>\n            </div>\n        </form>\n    </div>\n    <div id=\"issue-content\">\n        <h1 class=\"display-4\" id=\"issueTitle\">No issue has been picked</h1>\n        <p class=\"lead\" id=\"issueBody\">  </p>\n        <hr class=\"my-4\">\n        <div id = \"comments-section\">\n        </div>\n        <div class=\"panel panel-default\" id=\"enter-comment\">\n            <div class=\"panel-heading\">\n                <h3 class=\"panel-title\">Add Comment</h3>\n            </div>\n            <div class=\"panel-body\">\n                <textarea class=\"form-control\" id=\"comment-text-area\" rows=\"3\"></textarea>\n            </div>\n            <div class=\"btn-group\" role=\"group\">\n                <button type=\"button\" class=\"btn\" (click)=\"createComment()\" >Submit</button>\n                <button type=\"button\" class=\"btn\"  (click)=\"closeCurrentIssue()\">Close Issue</button>\n            </div>\n        </div>\n    </div>\n  </div>\n  "
        })
    ], SingleIssueComponent);
    return SingleIssueComponent;
}());
exports.SingleIssueComponent = SingleIssueComponent;
