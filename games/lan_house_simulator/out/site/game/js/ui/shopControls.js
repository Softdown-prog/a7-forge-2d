/** DOM-only controller. The main app still owns temporary placement modes
 * and the existing touch/Canvas editor. PS1 CD purchase remains a separate listener.
 */
export function installShopControls(catalog, port, events) {
    catalog?.addEventListener("click", event => {
        const button = event.target instanceof Element ? event.target.closest("button") : null;
        if (!(button instanceof HTMLButtonElement) || button.disabled)
            return;
        const id = button.dataset.buy;
        if (!id)
            return;
        if (id === "computer-annex" || id === "wall" || id === "door") {
            events.onPlacement(id);
            return;
        }
        if (id === "poster" || id === "plant" || id === "table") {
            if (port.canPlace(id))
                events.onPlacement(id);
            return;
        }
        const ps1Slot = id === "ps2" ? catalog.querySelector("#ps2-placement")?.value ?? "" :
            catalog.querySelector("#ps1-placement")?.value ?? "";
        events.onPurchase(port.purchase(id, ps1Slot), id);
    });
}
