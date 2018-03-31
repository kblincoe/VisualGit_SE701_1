import * as nodegit from "git";
import NodeGit, { Status } from "nodegit";

let Git = require("nodegit");

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (ev.currentTarget.id === 'staged-files') {
      stageFiles([document.getElementById(data)]);
    } else if (ev.currentTarget.id === 'files-changed') {
      unStageFiles([document.getElementById(data)]);
    }
}
