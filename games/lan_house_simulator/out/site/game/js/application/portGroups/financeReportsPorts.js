import { createStationLedgerPort } from "../stationLedgerPort.js?v=b715623ba9fb";
import { createMonthlyFinancePort } from "../monthlyFinancePort.js?v=b715623ba9fb";
import { createFinancialBalancePort } from "../financialBalancePort.js?v=b715623ba9fb";
import { createFinancialAdminOverviewPort } from "../financialAdminOverviewPort.js?v=b715623ba9fb";
/** Only composes existing ports; all accounting continues to belong to sim/. */
export function createFinanceReportsPorts(getState) {
    return {
        stationLedgerPort: createStationLedgerPort(getState),
        monthlyFinancePort: createMonthlyFinancePort(getState),
        financialBalancePort: createFinancialBalancePort(getState),
        financialAdminOverviewPort: createFinancialAdminOverviewPort(getState)
    };
}
