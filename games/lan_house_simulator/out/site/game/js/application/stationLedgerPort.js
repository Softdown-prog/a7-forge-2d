import { pcCount } from "../sim/engine.js?v=bc8308e69cfd";
import { stationAccountingSummary } from "../sim/stationAccounting.js?v=bc8308e69cfd";
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
