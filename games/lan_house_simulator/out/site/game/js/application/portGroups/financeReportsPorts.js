import { createStationLedgerPort } from "../stationLedgerPort.js?v=b0ac0402a753";
import { createMonthlyFinancePort } from "../monthlyFinancePort.js?v=b0ac0402a753";
import { createFinancialBalancePort } from "../financialBalancePort.js?v=b0ac0402a753";
import { createFinancialAdminOverviewPort } from "../financialAdminOverviewPort.js?v=b0ac0402a753";
/** Only composes existing ports; all accounting continues to belong to sim/. */
export function createFinanceReportsPorts(getState) {
    return {
        stationLedgerPort: createStationLedgerPort(getState),
        monthlyFinancePort: createMonthlyFinancePort(getState),
        financialBalancePort: createFinancialBalancePort(getState),
        financialAdminOverviewPort: createFinancialAdminOverviewPort(getState)
    };
}
