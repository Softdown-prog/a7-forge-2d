import { DAY_MINUTES } from "./types.js?v=b612b1779b4d";
import { PRINTER_COST, printWalkInDemand } from "./printService.js?v=b612b1779b4d";
import { DISC_COPIER_COST, discWalkInDemand } from "./discCopy.js?v=b612b1779b4d";
const money = (n) => Math.round(n * 100) / 100;
/** O caixa fecha admissão de novos clientes nos últimos 90 minutos do dia. */
export const SERVICE_ADMISSION_MINUTES = DAY_MINUTES - 90;
function snapshot(revenue, cost, investment, walkIns, demand) {
    const operatingResult = money(revenue - cost);
    const netAfterInvestment = money(operatingResult - investment);
    return {
        revenue, materialCost: cost, operatingResult, investment, netAfterInvestment,
        remainingInvestment: money(Math.max(0, -netAfterInvestment)), fullyRecovered: netAfterInvestment >= 0,
        walkIns,
        expectedWalkInAttemptsPerDay: Math.round(demand * SERVICE_ADMISSION_MINUTES * 10) / 10
    };
}
export function printEconomy(s) {
    const v = s.printer;
    return v ? snapshot(v.revenue, v.expenses, PRINTER_COST, v.walkIns ?? 0, printWalkInDemand(s)) : null;
}
export function discEconomy(s) {
    const v = s.discCopier;
    return v ? snapshot(v.revenue, v.expenses, DISC_COPIER_COST, v.walkIns ?? 0, discWalkInDemand(s)) : null;
}
