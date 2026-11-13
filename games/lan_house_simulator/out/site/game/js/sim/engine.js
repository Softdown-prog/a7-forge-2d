/** engine.ts: módulo do runtime LHS; lógica executada por minuto do jogo. */
export { chooseAvailablePc } from "./customerFlow.js?v=c12101473308";
export { canCustomerOccupy, EXIT_REACH_DISTANCE } from "./customerMotion.js?v=c12101473308";
export { addLog, applyResult, CLOSING_START_MINUTE, createGame, dayNumber, displayTime, entrance, LAST_ADMISSION_MINUTE, legacyPcCount, online, pcBroken, pcCount, pcPosition, pcWear, roomWidth } from "./simulationState.js?v=c12101473308";
import { spawn, spawnDiscWalkIn, spawnPrintWalkIn } from "./customerArrival.js?v=c12101473308";
import { refreshCounterQueue, sendHome, startStanding } from "./customerFlow.js?v=c12101473308";
import { advanceCustomer } from "./customerLifecycle.js?v=c12101473308";
import { EXIT_REACH_DISTANCE } from "./customerMotion.js?v=c12101473308";
import { scheduleDecisions } from "./decisions.js?v=c12101473308";
import { DISC_COPIES_PER_DAY, discCopiesToday, discWalkInDue } from "./discCopy.js?v=c12101473308";
import { demandFactor, energyCostPerMinute, monthlyBills } from "./economy.js?v=c12101473308";
import { eraGameVisitorMultiplier } from "./eraGames.js?v=c12101473308";
import { paidMonthlyBillReceipt } from "./financialClarity.js?v=c12101473308";
import { closeFinancialMonth, recordComputerUtilization } from "./financialReview.js?v=c12101473308";
import { gpuGameSpec, gpuGameVisitorMultiplier, tickGpuGameInstallations } from "./gpuGames.js?v=c12101473308";
import { clampPriceToEra, normalizedHourlyPrice } from "./historicalEconomy.js?v=c12101473308";
import { GAME_LAST_MINUTE } from "./mailCalendar.js?v=c12101473308";
import { receiveDueOrders } from "./merchandise.js?v=c12101473308";
import { tickMultiplayerVisitors } from "./multiplayerVisitors.js?v=c12101473308";
import { tickNeeds } from "./needs.js?v=c12101473308";
import { advanceNightMeetup, beginNightMeetup, nightScheduledForClosing } from "./nightMeetup.js?v=c12101473308";
import { reviewNotices } from "./notices.js?v=c12101473308";
import { tickPostman } from "./postmanDelivery.js?v=c12101473308";
import { pagesPrintedToday, PRINT_PAGES_PER_DAY, printWalkInDue } from "./printService.js?v=c12101473308";
import { promotionVisitorMultiplier } from "./promotion.js?v=c12101473308";
import { ps2EnergyCostPerMinute, ps2HourPrice, ps2StationAvailable } from "./ps2.js?v=c12101473308";
import { ps1EnergyCostPerMinute, ps1HourPrice, ps1StationAvailable } from "./ps1.js?v=c12101473308";
import { refreshRetailQueues } from "./retailQueue.js?v=c12101473308";
import { addWaste, dispatchHiredStaff, tickServices } from "./services.js?v=c12101473308";
import { addLog, CLOSING_START_MINUTE, dayNumber, entrance, LAST_ADMISSION_MINUTE, localMinute, online, pcCount, random, SESSION_FINISH_MINUTE } from "./simulationState.js?v=c12101473308";
import { accrueEmployeeDay } from "./staff.js?v=c12101473308";
import { recordStationMinute } from "./stationAccounting.js?v=c12101473308";
import { stationReadyForSessions } from "./stationPower.js?v=c12101473308";
import { storyVisitorMultiplier } from "./storyEvents.js?v=c12101473308";
import { DAY_MINUTES, SESSION_MINUTES } from "./types.js?v=c12101473308";
function nextDay(s) {
    for (const c of s.customers)
        if (c.stage !== "leaving")
            sendHome(s, c);
    // Na virada, máquina que envelheceu pode perder competitividade.
    if (clampPriceToEra(s))
        addLog(s, "Tarifa ajustada ao teto da época e aos computadores disponíveis.");
    s.weather = random(s) < 0.27 ? "rain" : "sun";
    s.offlineUntil = Math.min(s.offlineUntil, s.totalMinutes);
    addLog(s, s.weather === "rain" ? "Dia chuvoso: demanda menor e rede instável." : "Novo dia: portas abertas.");
    if (dayNumber(s) > 1 && (dayNumber(s) - 1) % 30 === 0) {
        // A conta encerra o mês que acabou, não antecipa o índice do mês seguinte.
        const closingState = { ...s, totalMinutes: Math.max(0, s.totalMinutes - 1) };
        const bill = monthlyBills(closingState);
        const energy = Math.round(s.energyAccrued ?? 0);
        const wages = s.employeePayrollAccrued ?? 0;
        const cashAfterPayment = s.cash - bill;
        // Registrar as parcelas antes de limpar os acumuladores de energia/salários.
        const paidReceipt = paidMonthlyBillReceipt(closingState, dayNumber(s) - 1, bill, cashAfterPayment);
        s.cash -= bill;
        s.expenses += bill;
        s.lastPaidMonthlyBill = paidReceipt;
        s.energyAccrued = 0;
        s.employeePayrollAccrued = 0;
        s.employeeWorkedDays = { cleaner: 0, technician: 0 };
        closeFinancialMonth(s);
        addLog(s, "Contas do mês pagas: -R$ " + bill + " (energia R$ " + energy + "; salários R$ " + wages + "; aluguel, internet e manutenção).");
    }
    // A diária do novo dia só entra depois do fechamento mensal anterior.
    accrueEmployeeDay(s);
    reviewNotices(s);
    scheduleDecisions(s);
    // Infrações dependem de cartas e prazos relativos, nunca de multas aleatórias diárias.
    if (s.cash < 0)
        addLog(s, "Atenção: caixa negativo. Reorganize a operação!");
}
export function visitorArrivalChance(s, occupied) {
    // Não bloquear o público de console quando todos os PCs estão apagados.
    // O serviço PS1 não depende da internet e só admite clientes se há cadeira livre.
    const poweredPcs = Array.from({ length: pcCount(s) }, (_, i) => i).filter(i => stationReadyForSessions(s, i)).length;
    const ps1Capacity = (s.ps1Stations ?? []).filter((_, i) => ps1StationAvailable(s, i)).length;
    const ps2Capacity = (s.ps2Stations ?? []).filter((_, i) => ps2StationAvailable(s, i)).length;
    const consoleCapacity = ps1Capacity + ps2Capacity;
    if (!poweredPcs && !consoleCapacity)
        return 0;
    if (localMinute(s) >= LAST_ADMISSION_MINUTE ||
        (localMinute(s) < 10 && s.customers.some(c => c.stage === "leaving")))
        return 0;
    const consoleOnly = poweredPcs === 0;
    const rate = normalizedHourlyPrice(s, consoleOnly ? (ps1Capacity && ps2Capacity ? Math.min(ps1HourPrice(s), ps2HourPrice(s)) : ps2Capacity ? ps2HourPrice(s) : ps1HourPrice(s)) : s.pricePerHour);
    const factor = demandFactor(rate, s.reputation, consoleOnly || online(s), s.weather === "rain");
    const congestion = occupied >= poweredPcs + (s.ps1Stations?.length ?? 0) + (s.ps2Stations?.length ?? 0) ? 0.38 : 1;
    return 0.052 * factor * promotionVisitorMultiplier(s) * storyVisitorMultiplier(s) * eraGameVisitorMultiplier(s) * gpuGameVisitorMultiplier(s) * congestion;
}
/** Dispensa em pequenos grupos: fila e compras primeiro, sessões até 21h30. */
function prepareClosing(s) {
    const minute = localMinute(s);
    if (minute < CLOSING_START_MINUTE)
        return;
    const exit = entrance(s);
    const active = (c) => c.stage === "using" || c.stage === "sitting" || c.stage === "to_pc";
    const candidates = s.customers.filter(c => c.stage !== "leaving").sort((a, b) => {
        if (active(a) !== active(b))
            return active(a) ? 1 : -1;
        return Math.hypot(a.x - exit.x, a.y - exit.y) - Math.hypot(b.x - exit.x, b.y - exit.y) || a.id - b.id;
    });
    // Poucos clientes por vez: um a cada dois minutos no começo, um por
    // minuto depois das 21h20. Evita uma debandada quando muitos PCs desocupam.
    if (minute < CLOSING_START_MINUTE + 20 && (minute - CLOSING_START_MINUTE) % 2 !== 0)
        return;
    // Ao concluir as últimas sessões às 21h30, liberar dois clientes por
    // minuto pela rota real da porta. Um único por minuto pode manter alguém
    // usando o PC depois do limite quando a fila de compras está cheia.
    const eligible = candidates.filter(c => !active(c) || minute >= SESSION_FINISH_MINUTE || c.usedMinutes >= (c.sessionMinutes ?? SESSION_MINUTES));
    for (const c of eligible.slice(0, minute >= SESSION_FINISH_MINUTE ? 2 : 1)) {
        if (c.ps2StationIndex !== undefined) {
            if (c.stage === "using" || c.stage === "sitting") {
                startStanding(c, false);
                continue;
            }
            if (c.stage === "standing" && (c.poseMinutes ?? 0) < 3)
                continue;
        }
        sendHome(s, c);
    }
}
function advanceMinute(s) {
    if (s.nightMeetup) {
        if (advanceNightMeetup(s)) {
            s.totalMinutes++; // Uma única virada para sábado 10h.
            nextDay(s);
        }
        return;
    }
    if (s.totalMinutes >= GAME_LAST_MINUTE)
        return;
    if (nightScheduledForClosing(s)) {
        beginNightMeetup(s);
        if (s.nightMeetup) {
            advanceNightMeetup(s);
            return;
        }
    }
    // Cobrar o consumo real por minuto: cada PC ligado usa standby; ocupados consomem mais.
    // Acumular inclusive o último minuto antes da virada mensal.
    const energyExpense = energyCostPerMinute(s) + ps1EnergyCostPerMinute(s) + ps2EnergyCostPerMinute(s);
    s.energyAccrued = (s.energyAccrued ?? 0) + energyExpense;
    recordComputerUtilization(s);
    recordStationMinute(s, pcCount(s), energyExpense - ps2EnergyCostPerMinute(s));
    s.totalMinutes++;
    for (const message of receiveDueOrders(s))
        addLog(s, message);
    if (s.economyVersion === 2 && s.totalMinutes === 4 * 360 * DAY_MINUTES)
        addLog(s, "2002: chegaram os videogames! A loja agora oferece bancada com PlayStation 1, TV de tubo e cadeira.");
    for (const installed of tickGpuGameInstallations(s))
        addLog(s, "Download concluído: " + gpuGameSpec(installed.id)?.name + " no PC " + (installed.pc + 1) + ".");
    if (s.totalMinutes === GAME_LAST_MINUTE)
        addLog(s, "Fim de 2030: calendário da campanha concluído.");
    if (s.totalMinutes === 1)
        reviewNotices(s);
    if (s.totalMinutes % DAY_MINUTES === 0) {
        s.multiplayerVisit = undefined;
        nextDay(s);
        return;
    }
    if (s.offlineUntil === s.totalMinutes)
        addLog(s, "A internet voltou!");
    if (online(s)) {
        const chance = (s.weather === "rain" ? 0.00065 : 0.00015) / Math.sqrt(s.internetTier);
        if (random(s) < chance) {
            const duration = Math.max(7, 36 - s.internetTier * 8);
            s.offlineUntil = s.totalMinutes + duration;
            addLog(s, "Internet caiu! Previsão de reparo: " + duration + " minutos do jogo.");
        }
    }
    dispatchHiredStaff(s);
    // Uma visita contratual ainda ativa após a virada do dia ganha uma só diária
    // no novo dia, também quando o jogo retoma um save intermediário.
    accrueEmployeeDay(s);
    tickServices(s);
    tickPostman(s);
    prepareClosing(s);
    const occupied = s.customers.filter(c => c.stage === "using" || c.stage === "to_pc").length;
    const admission = visitorArrivalChance(s, occupied);
    if (s.customers.length < 14 && admission > 0 && random(s) < admission)
        spawn(s);
    // Grupos pequenos entram aos poucos pela mesma porta dos demais clientes.
    tickMultiplayerVisitors(s);
    // Outra fonte de movimento comercial: sem PC, sem receita passiva e sem RNG adicional.
    if (s.customers.length < 14 && printWalkInDue(s) && pagesPrintedToday(s) < PRINT_PAGES_PER_DAY)
        spawnPrintWalkIn(s);
    if (s.customers.length < 14 && discWalkInDue(s) && discCopiesToday(s) < DISC_COPIES_PER_DAY)
        spawnDiscWalkIn(s);
    if (localMinute(s) < CLOSING_START_MINUTE) {
        refreshCounterQueue(s);
        refreshRetailQueues(s);
    }
    // Remover cada cliente assim que atravessa a soleira, liberando a porta
    // antes do próximo. Dar prioridade a quem já está saindo e está mais perto.
    const exit = entrance(s);
    const order = [...s.customers].sort((a, b) => a.stage === "leaving" && b.stage !== "leaving" ? -1 :
        a.stage !== "leaving" && b.stage === "leaving" ? 1 :
            a.stage === "leaving" && b.stage === "leaving" ?
                Math.hypot(a.x - exit.x, a.y - exit.y) - Math.hypot(b.x - exit.x, b.y - exit.y) : a.id - b.id);
    for (const c of order) {
        tickNeeds(c);
        advanceCustomer(s, c);
        if (c.stage === "leaving" && Math.hypot(c.x - exit.x, c.y - exit.y) <= EXIT_REACH_DISTANCE) {
            const index = s.customers.indexOf(c);
            if (index >= 0)
                s.customers.splice(index, 1);
        }
    }
    if (s.totalMinutes % 70 === 0)
        addWaste(s, 2);
}
export function stepGame(s, deltaMinutes) {
    if (!Number.isFinite(deltaMinutes) || deltaMinutes <= 0)
        return;
    if (s.totalMinutes >= GAME_LAST_MINUTE) {
        s.totalMinutes = GAME_LAST_MINUTE;
        s.leftoverMinutes = 0;
        return;
    }
    s.leftoverMinutes += Math.min(deltaMinutes, 120);
    while (s.leftoverMinutes >= 1 && s.totalMinutes < GAME_LAST_MINUTE) {
        s.leftoverMinutes--;
        advanceMinute(s);
    }
    if (s.totalMinutes >= GAME_LAST_MINUTE)
        s.leftoverMinutes = 0;
}
export { isValidSave } from "./saveValidation.js?v=c12101473308";
