import { createStationLedgerPort } from "../stationLedgerPort.js?v=f36771daf749";
import { createMonthlyFinancePort } from "../monthlyFinancePort.js?v=f36771daf749";
import { createFinancialBalancePort } from "../financialBalancePort.js?v=f36771daf749";
import { createFinancialAdminOverviewPort } from "../financialAdminOverviewPort.js?v=f36771daf749";
/** Only composes existing ports; all accounting continues to belong to sim/. */
export function createFinanceReportsPorts(getState) {
    return {
        stationLedgerPort: createStationLedgerPort(getState),
        monthlyFinancePort: createMonthlyFinancePort(getState),
        financialBalancePort: createFinancialBalancePort(getState),
        financialAdminOverviewPort: createFinancialAdminOverviewPort(getState)
    };
}
