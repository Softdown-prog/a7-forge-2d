export function renderFinancialAdminTotals(v, setText) {
    setText("admin-bills", v.bills);
    setText("admin-served", v.served);
    setText("monthly-breakdown", v.breakdown);
}
export function renderFinancialAdminActivity(v, setText, finance) {
    setText("finance", v.activity);
    if (finance)
        setText("expansion", v.expansion);
}
