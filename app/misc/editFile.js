var fsSync = require("fs-sync");
function readFileToTextEditor(filepath) {
    if (doesFileExist(filepath)) {
        var data = fsSync.read(filepath, null);
        document.getElementById("text-editor-panel-body").value = data;
        document.getElementById("text-editor-panel-body").scrollTop = 0;
    }
}
function saveFromTextEditorToFile(filepath) {
    console.log(filepath);
    if (doesFileExist(filepath)) {
        var content = document.getElementById("text-editor-panel-body").value;
        fsSync.write(filepath, content);
        displayModal("Saved!");
        hideTextEditorPanel();
    }
}
function doesFileExist(filepath) {
    return fsSync.exists(filepath);
}
function displayExitConfirmationDialog() {
    $('#text-editor-modal').modal('show');
}
function setTextEditorPanelTitle(title) {
    document.getElementById("text-editor-panel-title").innerHTML = title;
    document.getElementById("text-editor-panel-title").title = title;
}
