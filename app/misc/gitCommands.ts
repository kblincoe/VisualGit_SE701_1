function addCommand(command) {
  let gitCommand = document.createElement("p");
  gitCommand.className = "git-command";
  gitCommand.id = "git-command";
  gitCommand.innerHTML = command;
  let footer = document.getElementById("footer");
  footer.appendChild(gitCommand);
  footer.scrollTop = footer.scrollHeight; // This ensures the git command console scrolls to the bottom for every new command insert
  // console.log(command);
}
