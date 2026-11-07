export { gameYear, installedWindows, INTERNET_ERAS, internetUnlockYear, WINDOWS_ERAS, windowsLicenseCost } from "./eraCatalog.js?v=7be61a7f1436";
import { gameYear, installedWindows, WINDOWS_ERAS } from "./eraCatalog.js?v=7be61a7f1436";
import { windowsHardwareIssues } from "./hardware.js?v=7be61a7f1436";
import { stationUpgradeIssue } from "./stationPower.js?v=7be61a7f1436";
import { windowsInstallDurationMs, windowsInstallFor } from "./windowsInstallation.js?v=7be61a7f1436";
export function licenseWindows(s, index, edition) {
    const count = Math.max(3, Math.min(3 + s.expansionLevel * 2, s.installedPcs ?? (3 + s.expansionLevel * 2))) + (s.annexPcs?.length ?? 0);
    if (!Number.isInteger(index) || index < 0 || index >= count)
        return { ok: false, message: "PC inexistente." };
    if (windowsInstallFor(s, index))
        return { ok: false, message: "Aguarde a instalação do Windows neste PC." };
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
    if (s.gpuGameInstallJobs?.some(j => j.pc === index))
        return { ok: false, message: "Aguarde o download no PC terminar." };
    if (s.customers.some(c => c.pcIndex === index && ["to_pc", "sitting", "using", "standing"].includes(c.stage)) || s.repairJobs?.some(j => j.pc === index))
        return { ok: false, message: "Libere a estação antes de instalar o Windows." };
    // Mesmo o Windows 98 inicial exige sua própria licença, separada do hardware.
    const cost = release.cost;
    if (s.cash < cost)
        return { ok: false, message: "Caixa insuficiente: licença de " + release.name + " custa R$ " + cost + "." };
    s.cash -= cost;
    s.expenses += cost;
    const startedAtMs = Date.now(), finishedAtMs = startedAtMs + windowsInstallDurationMs(edition);
    (s.windowsInstallJobs ??= []).push({ pc: index, edition, startedAtMs, finishedAtMs });
    return { ok: true, message: "Instalação de " + release.name + " iniciada no PC " + (index + 1) +
            ": -R$ " + cost + "; duração " + (windowsInstallDurationMs(edition) / 60000) + " minutos reais." };
}
