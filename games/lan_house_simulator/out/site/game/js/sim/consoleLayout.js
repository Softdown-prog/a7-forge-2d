import { furnitureSlots } from "./furnitureLayout.js?v=c12101473308";
import { roomBounds } from "./room.js?v=c12101473308";
export const CONSOLE_ACTIVE_STAGES = ["to_pc", "sitting", "using", "standing"];
export function consoleStations(s, g) {
    return g === "ps1" ? s.ps1Stations ?? [] : s.ps2Stations ?? [];
}
const slotCache = new WeakMap();
function stationSlots(s) {
    const e = s.roomExtensions, key = [s.expansionLevel, e?.west, e?.east, e?.north, e?.south].join(":");
    let cached = slotCache.get(s);
    if (!cached || cached.key !== key) {
        cached = { key, points: new Map(furnitureSlots(s).filter(p => p.surface === "floor").map(p => [p.id, { x: p.x, y: p.y }])) };
        slotCache.set(s, cached);
    }
    return cached.points;
}
export function consolePoint(s, g, index) {
    const id = consoleStations(s, g)[index]?.slotId;
    const slot = id && stationSlots(s).get(id);
    // The PS2's rear chair stays entirely inside the original south wall.
    return slot ? { x: slot.x, y: slot.y - (g === "ps2" && slot.y === 5.17 ? .20 : 0) } : null;
}
export function consoleSeat(s, g, index, number = 0) {
    const p = consolePoint(s, g, index), duo = consoleStations(s, g)[index]?.secondSeat === true;
    if (!p || (number === 1 && !duo))
        return null;
    return { x: p.x + (duo ? (number === 0 ? .27 : .85) : .43), y: p.y + .77 };
}
export function consoleApproach(s, g, index, number = 0) {
    const p = consolePoint(s, g, index), seat = consoleSeat(s, g, index, number);
    if (!p || !seat)
        return null;
    const b = roomBounds(s);
    if (consoleStations(s, g)[index]?.secondSeat) {
        const x = number === 0 ? p.x - .35 : p.x + 1.36;
        return x > b.minX + .22 && x < b.maxX - .22 ? { x, y: seat.y } : null;
    }
    const right = p.x + 1.36;
    return { x: right < b.maxX - .22 ? right : p.x - .35, y: seat.y };
}
export function consoleBusy(s, g, index, seat) {
    return s.customers.some(c => (g === "ps1" ? c.ps1StationIndex : c.ps2StationIndex) === index &&
        CONSOLE_ACTIVE_STAGES.includes(c.stage) && (seat === undefined || (g === "ps1" ? c.ps1SeatIndex : c.ps2SeatIndex) === seat ||
        (seat === 0 && (g === "ps1" ? c.ps1SeatIndex : c.ps2SeatIndex) === undefined)));
}
export function customerConsole(c) {
    return c.ps2StationIndex !== undefined ? "ps2" : c.ps1StationIndex !== undefined ? "ps1" : null;
}
export function customerConsoleSeat(s, c, approach = false) {
    const g = customerConsole(c);
    if (!g)
        return null;
    const index = g === "ps1" ? c.ps1StationIndex : c.ps2StationIndex, number = (g === "ps1" ? c.ps1SeatIndex : c.ps2SeatIndex) ?? 0;
    return approach ? consoleApproach(s, g, index, number) : consoleSeat(s, g, index, number);
}
/** Table/TV footprint. Seats remain accessible interaction points. */
export function consoleFootprints(s, includeChairs = false) {
    return ["ps1", "ps2"].flatMap(g => consoleStations(s, g).flatMap((st, i) => {
        const p = consolePoint(s, g, i);
        return p ? [{ id: "console:" + g + ":" + st.slotId, label: g.toUpperCase() + " · bancada " + (i + 1), kind: "table",
                ...p, rotation: 0, w: 1.16, d: includeChairs ? .995 : .60, surface: "floor" }] : [];
    }));
}
export function consoleApproaches(s) {
    return ["ps1", "ps2"].flatMap(g => consoleStations(s, g).flatMap((st, i) => (st.secondSeat ? [0, 1] : [0]).flatMap(n => {
        const p = consoleApproach(s, g, i, n);
        return p ? [p] : [];
    })));
}
