import { renderFinancialBalance, renderFinancialBillWatch } from "./financialBalancePanel.js?v=80953abaf40f";
import { renderFinancialAdminTotals, renderFinancialAdminActivity } from "./financialAdminOverviewPanel.js?v=80953abaf40f";
import { renderMonthlyFinancePanel } from "./monthlyFinancePanel.js?v=80953abaf40f";
import { renderPromotionStatus } from "./promotionStatusPanel.js?v=80953abaf40f";
import { renderCustomerFeedback } from "./customerFeedbackPanel.js?v=80953abaf40f";
export function renderAdminFinanceSummary(options) {
    renderFinancialBalance(options.balance.balance(), options.setText, options.doc);
    if (options.financeTab && options.pageActive("feedback")) {
        const host = options.doc.getElementById("customer-feedback-panel");
        if (host && options.feedbackChanged())
            renderCustomerFeedback(host, options.feedback());
    }
    if (options.financeTab && options.pageActive("balance"))
        renderFinancialBillWatch(options.balance.billWatch(), options.doc);
    renderFinancialAdminTotals(options.overview, options.setText);
}
export function renderAdminFinanceActivity(options) {
    renderFinancialAdminActivity(options.overview, options.setText, options.financeTab);
    if (options.financeTab) {
        renderMonthlyFinancePanel(options.monthly.snapshot(), options.setText, options.doc);
        renderPromotionStatus(options.promotion.snapshot(), options.setText, options.doc);
    }
}
