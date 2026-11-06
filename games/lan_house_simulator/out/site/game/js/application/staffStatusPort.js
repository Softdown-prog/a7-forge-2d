import { employeeHired, employeeDailyWage } from "../sim/staff.js?v=b612b1779b4d";
import { staffActivity, workPhaseLabel } from "../sim/staffPresentation.js?v=b612b1779b4d";
import { binStatus } from "../sim/services.js?v=b612b1779b4d";
import { serviceVisitCost } from "../sim/historicalEconomy.js?v=b612b1779b4d";
export function createStaffStatusPort(getState) {
    const money = (n) => "R$ " + n.toLocaleString("pt-BR");
    return { snapshot() {
            const game = getState();
            const cleanerHired = employeeHired(game, "cleaner");
            const technicianHired = employeeHired(game, "technician");
            const cleanerDay = employeeDailyWage(game, "cleaner");
            const technicianDay = employeeDailyWage(game, "technician");
            const cleaning = staffActivity(game, "cleaner");
            const technician = staffActivity(game, "technician");
            const cost = serviceVisitCost(game, "cleaning");
            const binFill = game.binFill ?? [0, 0];
            return {
                cleanerControl: cleanerHired ? "Dispensar faxineiro" : "Contratar faxineiro · " + money(cleanerDay) + "/dia trabalhado",
                technicianControl: technicianHired ? "Dispensar técnico" : "Contratar técnico · " + money(technicianDay) + "/dia trabalhado",
                summary: "Equipe: faxineiro " + (cleanerHired ? "contratado" : "não contratado") +
                    " · técnico " + (technicianHired ? "contratado" : "não contratado") +
                    " · folha acumulada " + money(game.employeePayrollAccrued ?? 0) +
                    ". Diárias: faxineiro " + money(cleanerDay) + ", técnico " + money(technicianDay) +
                    " · dias trabalhados neste mês: faxineiro " + (game.employeeWorkedDays?.cleaner ?? 0) +
                    ", técnico " + (game.employeeWorkedDays?.technician ?? 0) +
                    ". Contratos mensais sem diária ociosa; folha cobrada no fechamento.",
                cleanerActivity: "Faxineiro · " + cleaning.label,
                technicianActivity: "Técnico · " + technician.label,
                cleanerProgress: cleaning.percent,
                technicianProgress: technician.percent,
                binSummary: "Lixeiras: " + binFill.map((n, i) => {
                    const status = binStatus(n);
                    return (i + 1) + ": " + (status === "empty" ? "Vazia" : status === "full" ? "Cheia" : "Enchendo · " + Math.round(n) + "%");
                }).join(" · ") + (game.overflowWaste ? " · ⚠ Lixo no chão: " + Math.round(game.overflowWaste) : "") +
                    " · faxineiro " + (game.cleaningJob ? workPhaseLabel("cleaner", game.cleaningJob).toLowerCase() : cleanerHired ? "contratado" : "sem contrato"),
                cleaningLabel: game.cleaningJob ? "Faxineiro · " + workPhaseLabel("cleaner", game.cleaningJob) :
                    cleanerHired ? "Solicitar limpeza · coberta pelo contrato" :
                        "Chamar faxineiro avulso · " + money(cost),
                cleaningDisabled: !!game.cleaningJob ||
                    (!binFill.some(x => x >= 10) && (game.overflowWaste ?? 0) < 1) ||
                    (!cleanerHired && game.cash < cost)
            };
        } };
}
