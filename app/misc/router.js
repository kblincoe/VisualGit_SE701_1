var cred;
function collpaseSignPanel() {
    $('#nav-collapse1').collapse('hide');
    clearTextBoxes();
}
function switchToMainPanel() {
    hideAuthenticatePanel();
    hideAddRepositoryPanel();
    displayFilePanel();
    displayGraphPanel();
}
function switchToAddRepositoryPanel() {
    hideAuthenticatePanel();
    hideFilePanel();
    hideGraphPanel();
    displayAddRepositoryPanel();
}
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
function displayFilePanel() {
    document.getElementById("file-panel").style.zIndex = "10";
}
function displayGraphPanel() {
    document.getElementById("graph-panel").style.zIndex = "10";
}
function displayAddRepositoryPanel() {
    document.getElementById("add-repository-panel").style.zIndex = "10";
}
function hideFilePanel() {
    document.getElementById("file-panel").style.zIndex = "-10";
}
function hideGraphPanel() {
    document.getElementById("graph-panel").style.zIndex = "-10";
}
function hideAddRepositoryPanel() {
    document.getElementById("add-repository-panel").style.zIndex = "-10";
}
function displayDiffPanel() {
    document.getElementById("graph-panel").style.width = "60%";
    document.getElementById("diff-panel").style.width = "40%";
}
function displayTextEditorPanel() {
    document.getElementById("graph-panel").style.width = "60%";
    document.getElementById("text-editor-panel").style.width = "40%";
    document.getElementById("text-editor-panel-body").style.visibility = "visible";
}
function hideTextEditorPanel() {
    document.getElementById("text-editor-panel").style.width = "0";
    document.getElementById("graph-panel").style.width = "100%";
    document.getElementById("text-editor-panel-body").style.visibility = "hidden";
}
function hideDiffPanel() {
    document.getElementById("diff-panel").style.width = "0";
    document.getElementById("graph-panel").style.width = "100%";
}
function hideAuthenticatePanel() {
    document.getElementById("authenticate").style.zIndex = "-20";
}
function displayAuthenticatePanel() {
    document.getElementById("authenticate").style.zIndex = "20";
}
function clearTextBoxes() {
    document.getElementById("Email1").value = "";
    document.getElementById("Password1").value = "";
}
