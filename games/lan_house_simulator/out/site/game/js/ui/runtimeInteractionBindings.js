export function installRuntimeInteractionBindings(doc, actions) {
    // Refresh on opening, not on closing; preserve the second live DOM lookup.
    doc.getElementById("time-weather-panel")?.addEventListener("toggle", () => {
        const panel = doc.getElementById("time-weather-panel");
        if (panel?.hasAttribute("open"))
            actions.refreshTimeWeather();
    });
    // Capture Escape before dialog, button or framework handlers can stop bubbling.
    // The original editor/placement precedence stays unchanged.
    doc.addEventListener("keydown", e => {
        if (e.key !== "Escape" || !actions.playing())
            return;
        // WindowNavigation also handles Escape in capture phase. It is installed
        // after this listener, so don't call showMenu before the dialog can close.
        // Preserve editor/placement precedence when no modal window is visible.
        if (["admin", "shop", "notices"].some(id => {
            const panel = doc.getElementById(id);
            return panel !== null && !panel.hidden;
        }))
            return;
        if (actions.editorOpen())
            actions.closeEditor();
        else if (actions.editingPlacement())
            actions.stopPlacement();
        else
            actions.showMenu();
    }, { capture: true });
}
