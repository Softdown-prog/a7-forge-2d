import { DAY_MINUTES, OPEN_HOUR } from "./types.js?v=faa670fa6ec3";
import { INITIAL_CASH } from "./gameDefaults.js?v=faa670fa6ec3";
import { futureNightClock } from "./futureNightClock.js?v=faa670fa6ec3";
import { annexComputerPosition } from "./stationLayout.js?v=faa670fa6ec3";
import { pcUnderRepair } from "./stationPower.js?v=faa670fa6ec3";
export const COSTUMES = ["regular", "regular", "female", "female-bob", "female-ponytail", "regular", "clown", "vampire", "stitched-monster", "rabbit", "mouse-mascot"];
/** Encerrar de forma gradual: últimos visitantes até 20h30, início da saída às 21h. */
export { LAST_ADMISSION_MINUTE } from "./types.js?v=faa670fa6ec3";
export const CLOSING_START_MINUTE = DAY_MINUTES - 60;
export const SESSION_FINISH_MINUTE = DAY_MINUTES - 30; // Últimas sessões terminam até 21h30.
export const localMinute = (s) => s.totalMinutes % DAY_MINUTES;
export function createGame(seed = 72421, economyMode = "classic") {
    return {
        version: 1, totalMinutes: 0, leftoverMinutes: 0, rng: seed >>> 0,
        mailScheduleSeed: seed >>> 0, mailStartDay: 1, mailSeenIds: [],
        cash: INITIAL_CASH, revenue: 0, expenses: 0, reputation: 75,
        monthPcUsedMinutes: 0, monthPcCapacityMinutes: 0, monthRevenueBase: 0, monthExpensesBase: 0,
        pricePerHour: economyMode === "historical" ? 2.5 : 12,
        ...(economyMode === "historical" ? { economyVersion: 2 } : { retailPrices: { soda: 8, candy: 5, snacks: 9 } }),
        pcTiers: [1, 1, 1], pcGpus: [null, null, null], internetTier: 1, offlineUntil: 0, licensedGames: false,
        expansionLevel: 0, roomExtensions: { west: 0, east: 0, south: 0, north: 0 }, installedPcs: 3, furniture: { poster: 0, plant: 0, table: 0 }, pcWear: [0, 0, 0], inventory: { soda: 12, candy: 15, snacks: 10 },
        customers: [], nextCustomerId: 1, served: 0, lostCustomers: 0, purchases: 0,
        weather: "sun", eventLog: ["Dia 1: a Lan House Simulator abriu as portas!"]
    };
}
export function dayNumber(s) { return Math.floor(s.totalMinutes / DAY_MINUTES) + 1; }
export function displayTime(s) {
    if (s.nightMeetup)
        return futureNightClock(s.nightMeetup.fridayDay, s.nightMeetup.elapsed).time;
    const value = OPEN_HOUR * 60 + s.totalMinutes % DAY_MINUTES;
    return String(Math.floor(value / 60)).padStart(2, "0") + ":" + String(value % 60).padStart(2, "0");
}
export function online(s) { return s.totalMinutes >= s.offlineUntil; }
export function legacyPcCount(s) {
    return Math.max(3, Math.min(3 + s.expansionLevel * 2, s.installedPcs ?? (3 + s.expansionLevel * 2)));
}
export function pcCount(s) { return legacyPcCount(s) + (s.annexPcs?.length ?? 0); }
export function pcWear(s, index) { return Math.min(100, Math.max(0, s.pcWear?.[index] ?? 0)); }
export function pcBroken(s, index) { return pcWear(s, index) >= 100 || pcUnderRepair(s, index); }
export function roomWidth(s) { return 8 + s.expansionLevel * 2; }
export function entrance(_s) { return { x: 7.5, y: 5.35 }; }
export function pcPosition(i, s) {
    const custom = s?.objectPlacements?.find(p => p.id === "pc:" + i);
    if (custom)
        return { ...custom };
    if (s && i >= legacyPcCount(s)) {
        const installed = s.annexPcs?.[i - legacyPcCount(s)];
        if (installed) {
            const pos = annexComputerPosition(s, installed.slotId);
            if (pos)
                return pos;
        }
    }
    const positions = [
        // Três PCs iniciais alinhados à parede do fundo; prateleira de salgadinhos movida para a lateral.
        { x: 2.20, y: 1.10 }, { x: 3.65, y: 1.10 }, { x: 5.00, y: 1.10 },
        { x: 7.2, y: 1.85 }, { x: 7.85, y: 2.95 },
        { x: 9.5, y: 1.85 }, { x: 9.85, y: 2.95 }
    ];
    return positions[i] ?? positions[0];
}
export function random(s) {
    s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0;
    return s.rng / 0x100000000;
}
export function addLog(s, message) {
    // O contador econômico fica na sexta até 10h, mas após meia-noite
    // o diário já pertence ao sábado civil (igual ao calendário da tela).
    const civilDay = s.nightMeetup
        ? futureNightClock(s.nightMeetup.fridayDay, s.nightMeetup.elapsed).calendarDay
        : dayNumber(s);
    s.eventLog.unshift("D" + civilDay + " " + displayTime(s) + " · " + message);
    s.eventLog = s.eventLog.slice(0, 14);
}
export function applyResult(s, result) {
    addLog(s, result.message);
    return result;
}
/** Verificação contra os outros corpos, independente da escala do Canvas. */
