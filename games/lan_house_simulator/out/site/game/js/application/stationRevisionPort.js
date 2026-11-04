import { pcCount } from "../sim/engine.js?v=fa1ff35e3337";
import { stationOccupied } from "../sim/computerModels.js?v=fa1ff35e3337";
export function createStationRevisionPort(getState) {
    return { snapshot(year) {
            const s = getState();
            return [
                year, s.cash, s.economyVersion, s.pcTiers, s.pcWindows, s.pcWindowsLicenses,
                s.pcPoweredOff, s.pcGpus, s.pcLcdModels, s.pcComponents,
                s.pcLinuxInstalled, s.pcOperatingSystems, s.linuxResearchStartedDay, Math.floor(s.totalMinutes / 720),
                Array.from({ length: pcCount(s) }, (_, i) => stationOccupied(s, i)),
                s.repairJobs?.map(j => [j.pc, j.phase, Math.floor(j.progress / j.duration * 4)])
            ];
        } };
}
