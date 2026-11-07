import { renderFinancialBalance, renderFinancialBillWatch } from "./financialBalancePanel.js?v=7be61a7f1436";
import { renderFinancialAdminTotals, renderFinancialAdminActivity } from "./financialAdminOverviewPanel.js?v=7be61a7f1436";
import { renderMonthlyFinancePanel } from "./monthlyFinancePanel.js?v=7be61a7f1436";
import { renderPromotionStatus } from "./promotionStatusPanel.js?v=7be61a7f1436";
import { renderCustomerFeedback } from "./customerFeedbackPanel.js?v=7be61a7f1436";
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
