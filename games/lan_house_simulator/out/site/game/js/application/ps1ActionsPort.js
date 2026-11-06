import { PS1_CD_CATALOG, buyPs1Disc, buyPs1Station, setPs1StationDisc, buyPs1SecondSeat, repairPs1Controls } from "../sim/ps1.js?v=80953abaf40f";
const invalid = { ok: false, message: "CD ou bancada de PlayStation inválido." };
const knownDisc = (id) => PS1_CD_CATALOG.some(x => x.id === id);
const valid = (s, i) => Number.isInteger(i) && i >= 0 && i < (s.ps1Stations?.length ?? 0);
/** Read/write adapter always targeting the current save instance. */
export function createPs1ActionsPort(getState) {
    return {
        stationCount: () => getState().ps1Stations?.length ?? 0,
        buyDisc(id) { return knownDisc(id) ? buyPs1Disc(getState(), id) : invalid; },
        buyStation(slotId) { return buyPs1Station(getState(), slotId); },
        discAt(i) { const s = getState(); return valid(s, i) ? (s.ps1Stations[i]?.discId ?? "") : ""; },
        insertDisc(i, id) {
            const s = getState();
            if (!valid(s, i) || (id !== "" && !knownDisc(id)))
                return invalid;
            return setPs1StationDisc(s, i, id === "" ? null : id);
        },
        secondSeat(i) { const s = getState(); return valid(s, i) ? buyPs1SecondSeat(s, i) : invalid; },
        repairControls(i) { const s = getState(); return valid(s, i) ? repairPs1Controls(s, i) : invalid; }
    };
}
