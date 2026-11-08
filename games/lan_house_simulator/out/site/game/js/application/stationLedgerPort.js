import { pcCount } from "../sim/engine.js?v=c416c21ccd84";
import { stationAccountingSummary } from "../sim/stationAccounting.js?v=c416c21ccd84";
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
