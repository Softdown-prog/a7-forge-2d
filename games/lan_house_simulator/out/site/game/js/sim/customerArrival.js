import { counterQueueCustomers, counterQueueSlot, MAX_COUNTER_QUEUE } from "./checkoutQueue.js?v=faa670fa6ec3";
import { initialNeeds } from "./needs.js?v=faa670fa6ec3";
import { visitorPreference } from "./customerChoices.js?v=faa670fa6ec3";
import { discWalkInKind, discReferencePrice } from "./discCopy.js?v=faa670fa6ec3";
import { printReferencePrice } from "./printService.js?v=faa670fa6ec3";
import { vipArrivalEligible } from "./vip.js?v=faa670fa6ec3";
import { operationalLinuxPcs } from "./linuxQuest.js?v=faa670fa6ec3";
import { priceIndex, yearFromMinutes } from "./historicalEconomy.js?v=faa670fa6ec3";
import { wantsGpuGame, preferredGpuGame } from "./gpuGames.js?v=faa670fa6ec3";
import { recordGpuGameRequest } from "./gpuDemand.js?v=faa670fa6ec3";
import { entrance, random, COSTUMES } from "./simulationState.js?v=faa670fa6ec3";
import { setTravel } from "./customerMotion.js?v=faa670fa6ec3";
import { entranceAvailable } from "./customerFlow.js?v=faa670fa6ec3";
export function spawn(s) {
    const queueIndex = counterQueueCustomers(s).length;
    if (queueIndex >= MAX_COUNTER_QUEUE)
        return;
    const e = entrance(s);
    // Entrada e saída compartilham a soleira: não materializar um novo corpo
    // em cima de quem está atravessando a porta.
    if (!entranceAvailable(s, e))
        return;
    const costume = COSTUMES[Math.floor(random(s) * COSTUMES.length)] ?? "regular";
    const c = {
        id: s.nextCustomerId++, x: e.x, y: e.y, facing: "north",
        stage: "arriving", target: counterQueueSlot(queueIndex, s), queueIndex,
        costume, vip: vipArrivalEligible(s, s.nextCustomerId - 1),
        gpuGamer: wantsGpuGame(s, s.nextCustomerId - 1),
        preferredGpuGame: preferredGpuGame(s, s.nextCustomerId - 1),
        pcIndex: null, usedMinutes: 0, waitingMinutes: 0,
        offlineWait: 0, happy: true, budgetAware: true,
        preference: visitorPreference(s.nextCustomerId - 1, s.mailScheduleSeed ?? 0),
        needs: initialNeeds(s.nextCustomerId - 1), wallet: Math.round(((s.economyVersion === 2 ? 5 : 12) + Math.floor(random(s) * (s.economyVersion === 2 ? 14 : 18))) *
            (s.economyVersion === 2 ? priceIndex(yearFromMinutes(s.totalMinutes)) : 1) * 100) / 100
    };
    // Students are drawn from real regular visitors by ID, without extra RNG.
    if (!c.gpuGamer && operationalLinuxPcs(s).length > 0 && c.id % 8 === 3)
        c.linuxEnthusiast = true;
    if (!setTravel(s, c, c.target))
        return;
    if (c.preferredGpuGame)
        recordGpuGameRequest(s, c.preferredGpuGame);
    s.customers.push(c);
}
/** Um amigo entra pela mesma soleira e fila, com carteira própria e sem
 * incrementar o RNG de clientes comuns. Nunca produz receita ao chegar. */
export function spawnMultiplayerFriend(s, visitId) {
    const queueIndex = counterQueueCustomers(s).length, entry = entrance(s);
    if (queueIndex >= MAX_COUNTER_QUEUE || !entranceAvailable(s, entry))
        return null;
    const id = s.nextCustomerId;
    const rate = s.economyVersion === 2 ? priceIndex(yearFromMinutes(s.totalMinutes)) : 1;
    const c = {
        id, x: entry.x, y: entry.y, facing: "north", stage: "arriving",
        target: counterQueueSlot(queueIndex, s), queueIndex,
        costume: COSTUMES[id % COSTUMES.length] ?? "regular",
        preference: "gaming", multiplayerVisitId: visitId,
        pcIndex: null, usedMinutes: 0, sessionMinutes: 45, waitingMinutes: 0,
        offlineWait: 0, happy: true, budgetAware: true,
        wallet: Math.round((s.economyVersion === 2 ? 9 : 18) * rate * 100) / 100,
        needs: initialNeeds(id)
    };
    if (!setTravel(s, c, c.target))
        return null;
    s.nextCustomerId++;
    s.customers.push(c);
    return c;
}
/** Clientes avulsos de impressão usam a mesma fila e saída física dos demais,
 * mas não reservam PCs nem recebem cobrança por sessão. */
export function spawnPrintWalkIn(s) {
    const queueIndex = counterQueueCustomers(s).length;
    if (queueIndex >= MAX_COUNTER_QUEUE)
        return;
    const entry = entrance(s);
    if (!entranceAvailable(s, entry))
        return;
    const id = s.nextCustomerId;
    const seed = (Math.imul(id, 2654435761) ^ (s.totalMinutes >>> 0)) >>> 0;
    const reference = printReferencePrice(s);
    const wallet = s.economyVersion === 2 ? Math.round(Math.max(5, reference * (2 + seed % 5)) * 100) / 100 : 12 + seed % 17;
    // Quem nem sequer pode pagar uma página não ocupa espaço de quem veio jogar.
    if (wallet < (s.printer?.price ?? Infinity))
        return;
    const c = { id, x: entry.x, y: entry.y, facing: "north", stage: "arriving",
        target: counterQueueSlot(queueIndex, s), queueIndex, costume: "regular",
        serviceRequest: "printing", wallet, pcIndex: null, usedMinutes: 0, waitingMinutes: 0,
        offlineWait: 0, happy: true };
    if (!setTravel(s, c, c.target))
        return;
    s.nextCustomerId++;
    s.customers.push(c);
}
/** Outro tipo de visitante avulso; usa exatamente a mesma navegação e fila da impressão. */
export function spawnDiscWalkIn(s) {
    const queueIndex = counterQueueCustomers(s).length;
    if (queueIndex >= MAX_COUNTER_QUEUE)
        return;
    const entry = entrance(s);
    if (!entranceAvailable(s, entry))
        return;
    const id = s.nextCustomerId, kind = discWalkInKind(id), copier = s.discCopier;
    if (!copier)
        return;
    const seed = (Math.imul(id, 2246822519) ^ s.totalMinutes) >>> 0;
    const wallet = Math.max(6, Math.round(discReferencePrice(s, kind) * (3 + seed % 4)));
    if (wallet < copier.prices[kind])
        return;
    const c = { id, x: entry.x, y: entry.y, facing: "north", stage: "arriving",
        target: counterQueueSlot(queueIndex, s), queueIndex, costume: "regular",
        serviceRequest: "disc-copy", wallet, pcIndex: null, usedMinutes: 0, waitingMinutes: 0,
        offlineWait: 0, happy: true };
    if (!setTravel(s, c, c.target))
        return;
    s.nextCustomerId++;
    s.customers.push(c);
}
