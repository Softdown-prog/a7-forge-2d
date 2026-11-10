import { pcCount } from "../sim/engine.js?v=345c7fc7b8be";
import { stationOccupied } from "../sim/computerModels.js?v=345c7fc7b8be";
export function createStationRevisionPort(getState) {
    return { snapshot(year) {
            const s = getState();
            return [
                year, s.cash, s.economyVersion, s.pcTiers, s.pcWindows, s.pcWindowsLicenses,
                s.pcPoweredOff, s.pcGpus, s.pcLcdModels, s.pcComponents,
                s.pcLinuxInstalled, s.pcOperatingSystems, s.linuxResearchStartedDay, Math.floor(s.totalMinutes / 720),
                Array.from({ length: pcCount(s) }, (_, i) => stationOccupied(s, i)),
                s.repairJobs?.map(j => [j.pc, j.phase, Math.floor(j.progress / j.duration * 4)]),
                ...(s.windowsInstallJobs?.length
                    ? [s.windowsInstallJobs.map(j => [j.pc, j.edition, j.startedAtMs, j.finishedAtMs]), Math.floor(Date.now() / 1000)]
                    : [])
            ];
        } };
}
