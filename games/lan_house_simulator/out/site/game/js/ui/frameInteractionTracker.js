export function installFrameInteractionTracker(doc, win, now) {
    let lastScroll = -1000, lastInput = -1000, pointerHeld = false;
    doc.addEventListener("scroll", () => { lastScroll = now(); }, { capture: true, passive: true });
    doc.addEventListener("pointerdown", () => { pointerHeld = true; lastInput = now(); }, { capture: true, passive: true });
    for (const type of ["pointerup", "pointercancel"])
        doc.addEventListener(type, () => { pointerHeld = false; lastInput = now(); }, { capture: true, passive: true });
    win.addEventListener("blur", () => { pointerHeld = false; });
    return { snapshot: () => ({ lastScroll, lastInput, pointerHeld }) };
}
