export function renderServiceAccessStatus(status, setText, doc) {
    setText("service-access-summary", status.summary);
    setText("service-access-list", status.destinations);
    const button = doc.querySelector("#show-service-access");
    if (button) {
        button.disabled = status.showDisabled;
        button.textContent = status.showLabel;
    }
}
export function renderServiceAccessOverlayStatus(status, visible, setText, doc) {
    const toolbar = doc.getElementById("service-access-toolbar");
    if (toolbar)
        toolbar.hidden = !visible;
    if (visible)
        setText("service-access-map-hint", status.mapHint);
}
