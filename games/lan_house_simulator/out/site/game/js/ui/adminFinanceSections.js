import { renderFinancialBalance, renderFinancialBillWatch } from "./financialBalancePanel.js?v=e74c7026ec87";
import { renderFinancialAdminTotals, renderFinancialAdminActivity } from "./financialAdminOverviewPanel.js?v=e74c7026ec87";
import { renderMonthlyFinancePanel } from "./monthlyFinancePanel.js?v=e74c7026ec87";
import { renderPromotionStatus } from "./promotionStatusPanel.js?v=e74c7026ec87";
import { renderCustomerFeedback } from "./customerFeedbackPanel.js?v=e74c7026ec87";
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
