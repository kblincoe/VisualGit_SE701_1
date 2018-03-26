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
function switchToIssuesPanel() {
    hideGraphPanel();
    hideDiffPanel();
    hideTextEditorPanel();
    displayIssuesPanel();
    displaySingleIssue();
    hideFilePanel();
    hideCreateIssue();
}
function switchFromIssuesPanel() {
    hideIssuesPanel();
    hideSingleIssue();
    displayGraphPanel();
    displayDiffPanel();
    displayFilePanel();
}
function switchToCreateIssue() {
    displayCreateIssue();
    hideIssueContent();
}
function switchFromCreateIssue() {
    hideCreateIssue();
    displayIssueContent();
    resetSingleIssue();
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
function hideIssuesPanel() {
    document.getElementById("issues-panel").style.zIndex = "-100";
}
function hideSingleIssue() {
    document.getElementById("single-issue").style.display = "none";
}
function hideCreateIssue() {
    document.getElementById("create-issue").style.display = "none";
}
function hideIssueContent() {
    document.getElementById("issue-content").style.display = "none";
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
function displayIssuesPanel() {
    document.getElementById("issues-panel").style.zIndex = "100";
}
function displayCreateIssue() {
    document.getElementById("create-issue").style.display = "block";
}
function displayIssueContent() {
    document.getElementById("issue-content").style.display = "block";
}
function displaySingleIssue() {
    document.getElementById("single-issue").style.display = "block";
}
function clearTextBoxes() {
    document.getElementById("Email1").value = "";
    document.getElementById("Password1").value = "";
}
