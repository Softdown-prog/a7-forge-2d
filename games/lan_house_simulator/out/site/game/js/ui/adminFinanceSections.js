import { renderFinancialBalance, renderFinancialBillWatch } from "./financialBalancePanel.js?v=b0ac0402a753";
import { renderFinancialAdminTotals, renderFinancialAdminActivity } from "./financialAdminOverviewPanel.js?v=b0ac0402a753";
import { renderMonthlyFinancePanel } from "./monthlyFinancePanel.js?v=b0ac0402a753";
import { renderPromotionStatus } from "./promotionStatusPanel.js?v=b0ac0402a753";
import { renderCustomerFeedback } from "./customerFeedbackPanel.js?v=b0ac0402a753";
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
