import { createStationLedgerPort } from "../stationLedgerPort.js?v=6833c3e7603d";
import { createMonthlyFinancePort } from "../monthlyFinancePort.js?v=6833c3e7603d";
import { createFinancialBalancePort } from "../financialBalancePort.js?v=6833c3e7603d";
import { createFinancialAdminOverviewPort } from "../financialAdminOverviewPort.js?v=6833c3e7603d";
/** Only composes existing ports; all accounting continues to belong to sim/. */
export function createFinanceReportsPorts(getState) {
    return {
        stationLedgerPort: createStationLedgerPort(getState),
        monthlyFinancePort: createMonthlyFinancePort(getState),
        financialBalancePort: createFinancialBalancePort(getState),
        financialAdminOverviewPort: createFinancialAdminOverviewPort(getState)
    };
}
