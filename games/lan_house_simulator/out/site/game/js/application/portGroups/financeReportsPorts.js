import { createStationLedgerPort } from "../stationLedgerPort.js?v=c12101473308";
import { createMonthlyFinancePort } from "../monthlyFinancePort.js?v=c12101473308";
import { createFinancialBalancePort } from "../financialBalancePort.js?v=c12101473308";
import { createFinancialAdminOverviewPort } from "../financialAdminOverviewPort.js?v=c12101473308";
/** Only composes existing ports; all accounting continues to belong to sim/. */
export function createFinanceReportsPorts(getState) {
    return {
        stationLedgerPort: createStationLedgerPort(getState),
        monthlyFinancePort: createMonthlyFinancePort(getState),
        financialBalancePort: createFinancialBalancePort(getState),
        financialAdminOverviewPort: createFinancialAdminOverviewPort(getState)
    };
}
