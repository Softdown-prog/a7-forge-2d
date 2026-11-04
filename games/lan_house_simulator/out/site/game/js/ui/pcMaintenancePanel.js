export function renderPcMaintenancePanel(host, actions, doc = document) {
    // Build offscreen to keep the old scroll geometry, focus and preserved details.
    const next = doc.createElement("div");
    const focused = doc.activeElement;
    const focusSelector = focused instanceof HTMLButtonElement && host.contains(focused)
        ? focused.id ? "#" + focused.id : focused.dataset.lcdBuy !== undefined ?
            '[data-lcd-buy="' + focused.dataset.lcdBuy + '"]' :
            focused.dataset.lcdSelect !== undefined ?
                '[data-lcd-select="' + focused.dataset.lcdSelect + '"]' : null : null;
    actions.build(next);
    actions.decorate(next);
    actions.reconcile(host, next);
    if (focusSelector && (!(focused instanceof HTMLButtonElement) || !focused.isConnected || focused.disabled)) {
        const restored = host.querySelector(focusSelector);
        const fallback = focusSelector.startsWith("#hardware-") ?
            host.querySelector("#hardware-select-" + actions.selectedStation()) :
            host.querySelector('.lcd-upgrades [aria-pressed="true"]');
        (restored && !restored.disabled ? restored : fallback)?.focus({ preventScroll: true });
    }
}
