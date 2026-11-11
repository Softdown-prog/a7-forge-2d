import { DAY_MINUTES } from "./types.js?v=1507cb2cfb2d";
import { pcCount } from "./simulationState.js?v=1507cb2cfb2d";
/** Contabiliza um minuto real da simulação — minutos-PC usados/capacidade instalada.
 * A capacidade é acumulada a cada minuto, sem supor que a quantidade de PCs
 * permaneceu constante durante ampliações no meio do mês. */
export function recordComputerUtilization(s) {
    const count = pcCount(s);
    const occupied = s.customers.filter(c => c.stage === "using" && c.ps1StationIndex === undefined && c.ps2StationIndex === undefined).length;
    s.monthPcUsedMinutes = (s.monthPcUsedMinutes ?? 0) + Math.min(count, occupied);
    s.monthPcCapacityMinutes = (s.monthPcCapacityMinutes ?? 0) + count;
}
/** Fechamento depois da cobrança do mês e antes de eventos do mês seguinte. */
export function closeFinancialMonth(s) {
    s.lastMonthPcUsedMinutes = s.monthPcUsedMinutes ?? 0;
    s.lastMonthPcCapacityMinutes = s.monthPcCapacityMinutes ?? 0;
    s.monthPcUsedMinutes = 0;
    s.monthPcCapacityMinutes = 0;
    if (s.monthRevenueBase !== undefined && s.monthExpensesBase !== undefined) {
        s.lastMonthRevenue = s.revenue - s.monthRevenueBase;
        s.lastMonthExpenses = s.expenses - s.monthExpensesBase;
    }
    s.monthRevenueBase = s.revenue;
    s.monthExpensesBase = s.expenses;
}
export function computerOccupancyPercent(used, capacity) {
    if (!Number.isFinite(used) || !Number.isFinite(capacity) || capacity <= 0)
        return 0;
    return Math.round(1000 * Math.min(capacity, Math.max(0, used)) / capacity) / 10;
}
export function expansionAdvice(s) {
    const last = s.lastMonthPcCapacityMinutes ?? 0, now = s.monthPcCapacityMinutes ?? 0;
    // Uma amostra muito curta não serve para sugerir investimentos ao jogador.
    if (last <= 0 && now < DAY_MINUTES * 3 * pcCount(s))
        return "Reúna pelo menos três dias de funcionamento para avaliar a expansão.";
    const usage = last > 0 ? computerOccupancyPercent(s.lastMonthPcUsedMinutes ?? 0, last) :
        computerOccupancyPercent(s.monthPcUsedMinutes ?? 0, now);
    if (usage < 12)
        return "Capacidade ociosa: antes de ampliar, verifique preços, fila e procura.";
    if (usage > 65)
        return "Computadores bastante utilizados: uma ampliação pode reduzir filas.";
    return "Ocupação intermediária: avalie demanda e contas antes de ampliar.";
}
