"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TextEditorPanelComponent = (function () {
    function TextEditorPanelComponent() {
    }
    TextEditorPanelComponent = __decorate([
        core_1.Component({
            selector: "text-editor-panel",
            template: "\n  <div class=\"text-editor-panel\" id=\"text-editor-panel\">\n    <div><span title=\"\" id=\"text-editor-panel-title\"></span></div>\n    <button id=\"save-file\" class=\"btn editor-button\">Save</button>\n    <button class=\"btn editor-button\" onclick=displayExitConfirmationDialog()>Exit Edit Mode</button>\n    <textarea class=\"text-editor-panel-body\" id=\"text-editor-panel-body\" ></textarea>\n  </div>\n  "
        })
    ], TextEditorPanelComponent);
    return TextEditorPanelComponent;
}());
exports.TextEditorPanelComponent = TextEditorPanelComponent;
