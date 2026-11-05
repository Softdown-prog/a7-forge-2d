import { renderFinancialBalance, renderFinancialBillWatch } from "./financialBalancePanel.js?v=a7a149bb38f1";
import { renderFinancialAdminTotals, renderFinancialAdminActivity } from "./financialAdminOverviewPanel.js?v=a7a149bb38f1";
import { renderMonthlyFinancePanel } from "./monthlyFinancePanel.js?v=a7a149bb38f1";
import { renderPromotionStatus } from "./promotionStatusPanel.js?v=a7a149bb38f1";
import { renderCustomerFeedback } from "./customerFeedbackPanel.js?v=a7a149bb38f1";
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
