import { online } from "../sim/engine.js?v=345c7fc7b8be";
export function createAdminPanelRevisionsPort(getState) {
    return {
        feedback() {
            const s = getState();
            return [Math.floor(s.totalMinutes / 720), s.customerFeedback];
        },
        packages() {
            const s = getState();
            return [s.pricePerHour, s.economyVersion === 2];
        },
        retail() { return [getState().retailPrices]; },
        computerWear(operationsActive) {
            return operationsActive ? getState().pcWear?.map(Math.round) : null;
        },
        computerMaintenance(page, stationIndex, hardwareTab, stationRevision, operationsActive) {
            return [page, stationIndex, hardwareTab, stationRevision, this.computerWear(operationsActive)];
        },
        gpuChoice(stationRevision, selectedGpuPc) { return [stationRevision, selectedGpuPc]; },
        windows(stationRevision) { return [stationRevision]; },
        classicGames(year, stationRevision) {
            const s = getState();
            return [year, stationRevision, s.licensedGames, s.licensedEraGames, s.ericSecondMailDelivered];
        },
        gpuGames(year, stationRevision) {
            const s = getState();
            return [
                year, stationRevision, s.licensedGames, s.licensedGpuGames, s.pcPoweredOff,
                s.gpuGameInstalls, s.gpuGameInstallJobs?.map(j => [j.pc, j.id, j.durationMinutes]),
                s.gpuGameDemand, online(s)
            ];
        }
    };
}
