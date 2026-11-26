import { createStationLedgerPort } from "../stationLedgerPort.js?v=b0980822919c";
import { createMonthlyFinancePort } from "../monthlyFinancePort.js?v=b0980822919c";
import { createFinancialBalancePort } from "../financialBalancePort.js?v=b0980822919c";
import { createFinancialAdminOverviewPort } from "../financialAdminOverviewPort.js?v=b0980822919c";
/** Only composes existing ports; all accounting continues to belong to sim/. */
export function createFinanceReportsPorts(getState) {
    return {
        stationLedgerPort: createStationLedgerPort(getState),
        monthlyFinancePort: createMonthlyFinancePort(getState),
        financialBalancePort: createFinancialBalancePort(getState),
        financialAdminOverviewPort: createFinancialAdminOverviewPort(getState)
    };
}
