let fsSync = require("fs-sync");

function readFileToTextEditor(filepath) {
    if(doesFileExist(filepath)){
        let data = fsSync.read(filepath, null);
        document.getElementById("text-editor-panel-body").value = data;
    }
}

function saveFromTextEditorToFile(filepath){
    console.log(filepath);
    if(doesFileExist(filepath)){
        let content = document.getElementById("text-editor-panel-body").value;
        fsSync.write(filepath,content);
        displayModal("Saved!");
        hideEditorPanel();
    }
}

function doesFileExist(filepath) : boolean {
    return fsSync.exists(filepath);
}