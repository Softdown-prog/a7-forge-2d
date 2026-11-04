export function renderFinancialBalance(view, setText, doc) {
    setText("admin-cash", view.cash);
    setText("management-summary-value", view.summary);
    setText("admin-profit", view.profit);
    const resultFigure = doc.getElementById("admin-profit");
    if (resultFigure)
        resultFigure.classList.toggle("balance-negative", view.negative);
    setText("balance-opening", view.opening);
    setText("balance-income", view.income);
    setText("balance-outgoing", view.outgoing);
    setText("balance-available", view.available);
    const reconciliation = doc.getElementById("balance-reconciliation");
    if (reconciliation) {
        reconciliation.hidden = view.reconciliation === null;
        if (view.reconciliation !== null)
            reconciliation.textContent = view.reconciliation;
    }
}
export function renderFinancialBillWatch(view, doc) {
    const label = doc.getElementById("bill-watch-title");
    const status = doc.getElementById("bill-watch-status");
    const container = doc.getElementById("bill-watch");
    if (label)
        label.textContent = view.title;
    if (status)
        status.textContent = view.status;
    if (container)
        container.classList.toggle("bill-watch-warning", view.warning);
}
