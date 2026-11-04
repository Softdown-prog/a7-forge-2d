export function renderPlacementStatus(state, elements, doc) {
    if (elements.toolbar)
        elements.toolbar.hidden = !state.toolbarVisible;
    const rotate = doc.querySelector("#rotate-furniture");
    if (rotate) {
        rotate.hidden = state.rotateHidden;
        rotate.disabled = state.rotateDisabled;
    }
    const confirm = doc.querySelector("#confirm-wall");
    const turn = doc.querySelector("#turn-wall");
    if (confirm) {
        confirm.hidden = state.confirmWallHidden;
        confirm.disabled = state.confirmWallDisabled;
    }
    if (turn) {
        turn.hidden = state.turnWallHidden;
        turn.disabled = state.turnWallDisabled;
    }
    if (elements.stage)
        elements.stage.classList.toggle("placing", state.stagePlacing);
    if (elements.help)
        elements.help.textContent = state.hint;
}
