import { createStationLedgerPort } from "../stationLedgerPort.js?v=e74c7026ec87";
import { createMonthlyFinancePort } from "../monthlyFinancePort.js?v=e74c7026ec87";
import { createFinancialBalancePort } from "../financialBalancePort.js?v=e74c7026ec87";
import { createFinancialAdminOverviewPort } from "../financialAdminOverviewPort.js?v=e74c7026ec87";
/** Only composes existing ports; all accounting continues to belong to sim/. */
export function createFinanceReportsPorts(getState) {
    return {
        stationLedgerPort: createStationLedgerPort(getState),
        monthlyFinancePort: createMonthlyFinancePort(getState),
        financialBalancePort: createFinancialBalancePort(getState),
        financialAdminOverviewPort: createFinancialAdminOverviewPort(getState)
    };
}
