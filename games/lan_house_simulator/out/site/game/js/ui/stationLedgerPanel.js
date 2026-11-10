import { syncPanelChildren } from "./panelChildren.js?v=229a76357973";
export function renderStationLedgerRows(host, port) {
    const currency = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const next = document.createElement("tbody");
    for (const item of port.rows()) {
        const row = document.createElement("tr");
        const cells = [
            item.label, String(item.sessions), String(item.vipSessions),
            Math.floor(item.occupiedMinutes).toLocaleString("pt-BR"),
            currency(item.sessionRevenue), currency(item.energyShare),
            currency(item.netRevenue)
        ];
        for (let index = 0; index < cells.length; index++) {
            const cell = index === 0 ? document.createElement("th") : document.createElement("td");
            if (index === 0)
                cell.scope = "row";
            cell.textContent = cells[index];
            row.append(cell);
        }
        next.append(row);
    }
    syncPanelChildren(host, next);
}
