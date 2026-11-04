export function installSoundInputBindings(doc, audio) {
    audio.preload();
    // Capture phase allows unlock before buttons/gestures use audio.
    doc.addEventListener("pointerdown", () => audio.unlock(), { capture: true });
    doc.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ")
            audio.unlock();
    }, { capture: true });
    doc.addEventListener("click", event => {
        const target = event.target;
        if (!(target instanceof Element))
            return;
        const control = target.closest("button");
        if (control instanceof HTMLButtonElement && !control.disabled)
            audio.click();
    }, { capture: true });
    doc.addEventListener("visibilitychange", () => {
        if (doc.hidden)
            audio.stopKeyboard();
    });
}
