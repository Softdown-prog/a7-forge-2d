export function renderBasicGamesLicenseStatus(status, setText, doc) {
    setText("license-status", status.statusLabel);
    const button = doc.querySelector("#license");
    if (button) {
        button.hidden = status.buttonHidden;
        button.disabled = status.buttonDisabled;
        button.textContent = status.buttonLabel;
    }
}
