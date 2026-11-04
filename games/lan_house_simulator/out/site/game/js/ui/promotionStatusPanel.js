export function renderPromotionStatus(view, setText, dom) {
    setText("promotion-description", view.description);
    setText("promotion-status", view.status);
    const button = dom.querySelector("#launch-promotion");
    if (button) {
        button.disabled = view.buttonDisabled;
        button.textContent = view.buttonLabel;
    }
}
