export function renderCommerceNetworkPanel(view, setText, doc) {
    setText("supplier-status", view.supplierStatus);
    const supplier = doc.querySelector("#supplier-up");
    if (supplier)
        supplier.disabled = view.supplierUpgradeDisabled;
    setText("stock-soda", view.stockSoda);
    setText("stock-candy", view.stockCandy);
    setText("stock-snacks", view.stockSnacks);
    setText("internet", view.internetStatus);
    const internetUp = doc.querySelector("#internet-up");
    if (internetUp) {
        internetUp.disabled = view.internetUpgradeDisabled;
        internetUp.textContent = view.internetUpgradeLabel;
    }
    const repair = doc.querySelector("#internet-repair");
    if (repair) {
        repair.disabled = view.internetRepairDisabled;
        repair.textContent = view.internetRepairLabel;
    }
}
