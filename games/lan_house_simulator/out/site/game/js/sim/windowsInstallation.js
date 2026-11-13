/** Pending Windows installs run on the actual wall clock, never game minutes.
 * A paid job survives reload/import; completion only changes the selected PC.
 */
import { WINDOWS_ERAS, installedWindows } from "./eraCatalog.js?v=0bd19d58dac2";
export function windowsInstallDurationMs(edition) {
    const index = WINDOWS_ERAS.findIndex(row => row.id === edition);
    return index < 0 ? 0 : (index + 1) * 10 * 60_000;
}
export function windowsInstallFor(s, pc) {
    return s.windowsInstallJobs?.find(job => job.pc === pc) ?? null;
}
export function windowsInstallProgress(s, pc, now = Date.now()) {
    const job = windowsInstallFor(s, pc);
    if (!job)
        return null;
    const duration = windowsInstallDurationMs(job.edition);
    const remaining = Math.max(0, job.finishedAtMs - now);
    return { name: WINDOWS_ERAS.find(row => row.id === job.edition).name,
        percent: Math.max(0, Math.min(100, Math.floor((1 - remaining / duration) * 100))),
        remainingSeconds: Math.ceil(remaining / 1000), totalSeconds: duration / 1000 };
}
function stationCount(s) {
    return Math.max(3, Math.min(3 + (s.expansionLevel ?? 0) * 2, s.installedPcs ?? (3 + (s.expansionLevel ?? 0) * 2))) + (s.annexPcs?.length ?? 0);
}
export function validWindowsInstallJobs(s) {
    const jobs = s.windowsInstallJobs;
    if (jobs === undefined)
        return true;
    if (!Array.isArray(jobs) || jobs.length > 200 || jobs.length > stationCount(s))
        return false;
    const seen = new Set();
    for (const job of jobs) {
        if (!job || typeof job !== "object" || !Number.isInteger(job.pc) || job.pc < 0 ||
            job.pc >= stationCount(s) || seen.has(job.pc) ||
            !WINDOWS_ERAS.some(row => row.id === job.edition) ||
            !Number.isSafeInteger(job.startedAtMs) || job.startedAtMs < 0 || job.startedAtMs > 1e14 ||
            !Number.isSafeInteger(job.finishedAtMs) ||
            job.finishedAtMs !== job.startedAtMs + windowsInstallDurationMs(job.edition) ||
            s.pcPoweredOff?.[job.pc] !== true)
            return false;
        seen.add(job.pc);
    }
    return true;
}
/** Returns newly finished jobs once; OS and license remain old until this point. */
export function finishWindowsInstallations(s, now = Date.now()) {
    const jobs = s.windowsInstallJobs;
    if (!jobs?.length)
        return [];
    const completed = jobs.filter(job => job.finishedAtMs <= now);
    if (!completed.length)
        return [];
    const count = stationCount(s);
    const windows = Array.from({ length: count }, (_, i) => installedWindows(s, i));
    const licenses = Array.from({ length: count }, (_, i) => s.pcWindowsLicenses?.[i] === true);
    for (const job of completed) {
        windows[job.pc] = job.edition;
        licenses[job.pc] = true;
        if (s.pcOperatingSystems?.[job.pc] === "linux")
            s.pcOperatingSystems[job.pc] = "windows";
    }
    s.pcWindows = windows;
    s.pcWindowsLicenses = licenses;
    if (completed.length === jobs.length)
        delete s.windowsInstallJobs;
    else
        s.windowsInstallJobs = jobs.filter(job => job.finishedAtMs > now);
    return completed;
}
