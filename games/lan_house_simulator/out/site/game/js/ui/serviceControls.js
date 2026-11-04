/** Somente eventos do DOM. Não lê GameState nem aciona regras do motor. */
export function installServiceControls(port, callbacks, doc = document) {
    const bind = (id, action, policy = "always") => {
        const element = doc.getElementById(id);
        element?.addEventListener("click", () => {
            if (element instanceof HTMLButtonElement && element.disabled)
                return;
            callbacks.onResult(action(), policy);
        });
    };
    bind("stock-soda", () => port.restock("soda"));
    bind("stock-candy", () => port.restock("candy"));
    bind("stock-snacks", () => port.restock("snacks"));
    bind("supplier-up", () => port.contractSupplier());
    bind("launch-promotion", () => port.promote());
    bind("internet-up", () => port.upgradeInternet());
    bind("internet-repair", () => port.repairInternet());
    bind("license", () => port.licenseGames());
    bind("clean-bins", () => port.toggleEmployee("cleaner"), "success");
    bind("hire-technician", () => port.toggleEmployee("technician"), "success");
    bind("clean-bins-now", () => port.cleanNow());
}
