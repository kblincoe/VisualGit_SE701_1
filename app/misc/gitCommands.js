function addCommand(command) {
    var gitCommand = document.createElement("p");
    gitCommand.className = "git-command";
    gitCommand.id = "git-command";
    gitCommand.innerHTML = command;
    var footer = document.getElementById("footer");
    footer.appendChild(gitCommand);
    footer.scrollTop = footer.scrollHeight; // This ensures the git command console scrolls to the bottom for every new command insert
}
