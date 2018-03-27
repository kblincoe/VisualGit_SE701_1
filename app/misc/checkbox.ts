function setAllCheckboxes(sourceCheckbox) {

    let checkboxes;
    if (sourceCheckbox.id === "select-all-modified") {
        checkboxes = document.getElementsByClassName('checkbox-modified');
    } else if (sourceCheckbox.id === "select-all-staged") {
        checkboxes = document.getElementsByClassName('checkbox-staged');
    }

    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = sourceCheckbox.checked;
    }

}

function determineButtonStates() {
    let disableStageButton = true;
    let disableUnstageButton = true;
    let checkBoxes = document.getElementsByClassName('checkbox');
    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].classList.contains('checkbox-modified')) {
            if (checkBoxes[i].checked === true) {
                disableStageButton = false;
            }
        } else if (checkBoxes[i].classList.contains('checkbox-staged')) {
            if (checkBoxes[i].checked === true) {
                disableUnstageButton = false;
            }
        }
    }

    document.getElementById("stage-button").disabled = disableStageButton;
    document.getElementById("unstage-button").disabled = disableUnstageButton;
}
