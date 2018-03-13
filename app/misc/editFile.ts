let Git = require("nodegit");
let fsSync = require("fs-sync");


function readFile(filepath) {
    if(doesFileExist(filepath)){
        let data = fsSync.read(filepath, null);
        console.log(data);
        document.getElementById("text-editor-panel-body").value = data;
    }
}
function saveFile(filepath){
    console.log(filepath);
    if(doesFileExist(filepath)){
        let content = document.getElementById("text-editor-panel-body").value;
        console.log(content);
        fsSync.write(filepath,content);
        alert("Saved!");
    }
}

function doesFileExist(filepath) : boolean {
    return fsSync.exists(filepath);
}