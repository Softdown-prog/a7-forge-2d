import { pcCount } from "../sim/engine.js?v=fa1ff35e3337";
import { stationAccountingSummary } from "../sim/stationAccounting.js?v=fa1ff35e3337";
export function createStationLedgerPort(getState) {
    return { rows() {
            const state = getState();
            return Array.from({ length: pcCount(state) }, (_, index) => {
                const account = stationAccountingSummary(state, index);
                return {
                    label: "PC " + (index + 1),
                    sessions: account.sessions,
                    vipSessions: account.vipSessions,
                    occupiedMinutes: account.occupiedMinutes,
                    sessionRevenue: account.sessionRevenue,
                    energyShare: account.energyShare,
                    netRevenue: account.sessionRevenue - account.energyShare
                };
            });
        } };
}
