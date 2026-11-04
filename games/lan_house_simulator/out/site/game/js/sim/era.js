export { gameYear, installedWindows, INTERNET_ERAS, internetUnlockYear, WINDOWS_ERAS, windowsLicenseCost } from "./eraCatalog.js?v=fa1ff35e3337";
import { gameYear, installedWindows, WINDOWS_ERAS } from "./eraCatalog.js?v=fa1ff35e3337";
import { windowsHardwareIssues } from "./hardware.js?v=fa1ff35e3337";
import { isLinuxPc } from "./linuxQuest.js?v=fa1ff35e3337";
import { stationUpgradeIssue } from "./stationPower.js?v=fa1ff35e3337";
export function licenseWindows(s, index, edition) {
    const count = Math.max(3, Math.min(3 + s.expansionLevel * 2, s.installedPcs ?? (3 + s.expansionLevel * 2))) + (s.annexPcs?.length ?? 0);
    if (!Number.isInteger(index) || index < 0 || index >= count)
        return { ok: false, message: "PC inexistente." };
    const issue = stationUpgradeIssue(s, index);
    if (issue)
        return { ok: false, message: issue };
    const release = WINDOWS_ERAS.find(x => x.id === edition);
    if (!release)
        return { ok: false, message: "Versão de Windows inválida." };
    if (gameYear(s) < release.year)
        return { ok: false, message: release.name + " estará disponível em " + release.year + "." };
    if (installedWindows(s, index) === edition && (s.pcWindowsLicenses?.[index] ?? false))
        return { ok: false, message: "Este PC já possui essa licença." };
    const hardwareIssue = windowsHardwareIssues(s, index, edition)[0];
    if (hardwareIssue)
        return { ok: false, message: release.name + ": " + hardwareIssue };
    if (s.customers.some(c => c.pcIndex === index && ["to_pc", "sitting", "using", "standing"].includes(c.stage)) || s.repairJobs?.some(j => j.pc === index))
        return { ok: false, message: "Libere a estação antes de instalar o Windows." };
    // Mesmo o Windows 98 inicial exige sua própria licença, separada do hardware.
    const cost = release.cost;
    if (s.cash < cost)
        return { ok: false, message: "Caixa insuficiente: licença de " + release.name + " custa R$ " + cost + "." };
    s.cash -= cost;
    s.expenses += cost;
    s.pcWindows = Array.from({ length: count }, (_, i) => installedWindows(s, i));
    s.pcWindows[index] = edition;
    s.pcWindowsLicenses = Array.from({ length: count }, (_, i) => s.pcWindowsLicenses?.[i] === true);
    s.pcWindowsLicenses[index] = true;
    if (isLinuxPc(s, index))
        s.pcOperatingSystems[index] = "windows";
    return { ok: true, message: "PC " + (index + 1) + " licenciado com " + release.name + ": -R$ " + cost + "." };
}
