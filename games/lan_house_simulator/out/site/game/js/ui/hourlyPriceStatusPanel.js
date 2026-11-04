export function renderHourlyPriceStatus(view, setText, doc) {
    setText("price", view.priceLabel);
    const migration = doc.getElementById("migrate-historical-pricing");
    if (migration instanceof HTMLButtonElement)
        migration.hidden = view.historical;
    setText("year-price-ceiling", view.yearCeiling);
    setText("equipment-price-ceiling", view.equipmentCeiling);
    setText("annual-ipca", view.inflation);
    const decrease = doc.getElementById("price-down");
    const increase = doc.getElementById("price-up");
    if (decrease instanceof HTMLButtonElement)
        decrease.disabled = view.decreaseDisabled;
    if (increase instanceof HTMLButtonElement)
        increase.disabled = view.increaseDisabled;
}
/** Only invoked when the existing panel-revision guard allows refreshing packages. */
export function renderSessionPackages(rows, host, doc) {
    host.replaceChildren();
    for (const label of rows) {
        const li = doc.createElement("li");
        li.textContent = label;
        host.append(li);
    }
}
