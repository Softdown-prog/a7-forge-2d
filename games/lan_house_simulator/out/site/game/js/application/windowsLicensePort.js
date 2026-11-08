import { pcCount } from "../sim/engine.js?v=c132abc69a79";
import { gameYear, WINDOWS_ERAS, installedWindows } from "../sim/era.js?v=c132abc69a79";
import { windowsHardwareIssues } from "../sim/hardware.js?v=c132abc69a79";
import { stationPoweredOn, stationUpgradeIssue } from "../sim/stationPower.js?v=c132abc69a79";
import { windowsInstallProgress } from "../sim/windowsInstallation.js?v=c132abc69a79";
import { isLinuxPc } from "../sim/linuxQuest.js?v=c132abc69a79";
import { linuxMachineFor, linuxMachineSpec } from "../sim/linuxMachines.js?v=c132abc69a79";
import { stationOccupied } from "../sim/computerModels.js?v=c132abc69a79";
export function createWindowsLicensePort(getState) {
    return { rows() {
            const s = getState(), year = gameYear(s);
            return Array.from({ length: pcCount(s) }, (_, index) => {
                const edition = WINDOWS_ERAS.find(w => w.id === installedWindows(s, index));
                const licensed = s.pcWindowsLicenses?.[index] === true;
                const installation = windowsInstallProgress(s, index);
                return {
                    index, installation, title: "PC " + (index + 1) + " · " + (isLinuxPc(s, index) ?
                        licensed ? "Linux ativo (Windows " + edition.name + " preservado)" : "Linux ativo (sem Windows instalado)" : edition.name) +
                        (installation ? " · instalando " + installation.name + " · " + installation.percent + "%" :
                            licensed ? " · Windows licenciado" : " · sem licença Windows") +
                        (linuxMachineFor(s, index) ? " · " + linuxMachineSpec(linuxMachineFor(s, index)).name : ""),
                    linuxAction: linuxMachineFor(s, index) ? {
                        action: isLinuxPc(s, index) ? "windows" : "install",
                        label: isLinuxPc(s, index) ? licensed ? "Iniciar Windows licenciado" : "Windows requer licença" : "Reiniciar em Linux",
                        disabled: !!stationUpgradeIssue(s, index) || !!s.gpuGameInstallJobs?.some(j => j.pc === index) ||
                            (isLinuxPc(s, index) && !licensed),
                        title: installation ? "Aguarde a instalação do Windows terminar." :
                            !licensed && isLinuxPc(s, index) ? "Compre primeiro uma licença Windows para este computador." :
                                stationUpgradeIssue(s, index) ?? "Trocar o sistema exige PC desligado e desocupado."
                    } : null,
                    choices: WINDOWS_ERAS.map(item => {
                        const already = licensed && edition.id === item.id;
                        const reasons = windowsHardwareIssues(s, index, item.id);
                        return {
                            id: item.id,
                            label: item.name + " · " + (year < item.year ? "🔒 " + item.year : already ? "Instalado" : "R$ " + item.cost),
                            disabled: !!installation || year < item.year || already || s.cash < item.cost || reasons.length > 0 ||
                                stationPoweredOn(s, index) || stationOccupied(s, index) ||
                                !!s.repairJobs?.some(job => job.pc === index),
                            title: reasons.join(" ")
                        };
                    })
                };
            });
        } };
}
