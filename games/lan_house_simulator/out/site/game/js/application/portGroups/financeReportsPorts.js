import { createStationLedgerPort } from "../stationLedgerPort.js?v=88374e228e86";
import { createMonthlyFinancePort } from "../monthlyFinancePort.js?v=88374e228e86";
import { createFinancialBalancePort } from "../financialBalancePort.js?v=88374e228e86";
import { createFinancialAdminOverviewPort } from "../financialAdminOverviewPort.js?v=88374e228e86";
/** Only composes existing ports; all accounting continues to belong to sim/. */
export function createFinanceReportsPorts(getState) {
    return {
        stationLedgerPort: createStationLedgerPort(getState),
        monthlyFinancePort: createMonthlyFinancePort(getState),
        financialBalancePort: createFinancialBalancePort(getState),
        financialAdminOverviewPort: createFinancialAdminOverviewPort(getState)
    };
}
