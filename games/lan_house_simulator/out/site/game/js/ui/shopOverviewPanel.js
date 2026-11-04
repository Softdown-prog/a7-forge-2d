const published = new WeakMap();
export function renderShopOverview(view, doc) {
    // An explicit Angular host is the sole owner of its child buttons and text.
    // Never mutate Angular-managed nodes from the legacy DOM writer.
    if (doc.getElementById("angular-shop-overview")) {
        if ("dispatchEvent" in doc && typeof doc.dispatchEvent === "function" &&
            typeof CustomEvent === "function") {
            const fingerprint = JSON.stringify(view);
            if (published.get(doc) !== fingerprint) {
                published.set(doc, fingerprint);
                doc.dispatchEvent(new CustomEvent("lhs:shop-overview-updated", { detail: view }));
            }
        }
        return;
    }
    const organize = doc.querySelector("#organize-furniture");
    if (organize) {
        organize.disabled = false;
        organize.textContent = view.organizeText;
    }
    const demolish = doc.querySelector("#demolish-walls");
    if (demolish) {
        demolish.disabled = view.demolishDisabled;
        demolish.textContent = view.demolishText;
    }
    const cash = doc.getElementById("shop-cash");
    if (cash)
        cash.textContent = view.cashText;
}
