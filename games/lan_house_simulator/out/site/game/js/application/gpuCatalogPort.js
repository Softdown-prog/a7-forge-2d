import { pcCount } from "../sim/engine.js?v=7be61a7f1436";
import { gameYear } from "../sim/era.js?v=7be61a7f1436";
import { GPU_CATALOG, installedGpu, gpuSpec } from "../sim/gpu.js?v=7be61a7f1436";
import { hardwareFor, buildParts, requiredPsuWatts } from "../sim/hardware.js?v=7be61a7f1436";
import { stationOccupied } from "../sim/computerModels.js?v=7be61a7f1436";
import { stationPoweredOn } from "../sim/stationPower.js?v=7be61a7f1436";
export function createGpuCatalogPort(getState) {
    return { snapshot(selectedPc) {
            const s = getState(), count = pcCount(s), index = Math.max(0, Math.min(count - 1, selectedPc));
            const year = gameYear(s), current = gpuSpec(installedGpu(s, index));
            const build = hardwareFor(s, index), psuWatts = buildParts(build).psu.watts;
            const isOn = stationPoweredOn(s, index), busy = stationOccupied(s, index);
            const underRepair = !!s.repairJobs?.some(j => j.pc === index);
            const num = (value) => value.toFixed(3).replace(".", ",");
            return {
                stations: Array.from({ length: count }, (_, i) => ({
                    index: i, selected: i === index,
                    label: "PC " + (i + 1) + (stationPoweredOn(s, i) ? " · ligado" : " · desligado") +
                        (installedGpu(s, i) ? " · GPU" : " · sem GPU")
                })),
                replacementNote: current ?
                    "PC " + (index + 1) + ": " + current.name + " instalada. Trocar custa o valor integral da nova placa e substitui a antiga sem desconto. Compare o ganho adicional indicado em cada cartão." :
                    "PC " + (index + 1) + " sem GPU dedicada. Cada compra acrescenta satisfação e consumo ao computador selecionado.",
                models: GPU_CATALOG.map(model => {
                    const locked = year < model.year, owned = current?.id === model.id;
                    const obsolete = !!current && current.year >= model.year && !owned;
                    const required = requiredPsuWatts(build, model.id), powerOk = psuWatts >= required;
                    return {
                        id: model.id, locked,
                        artSrc: "./assets/gpu/" + model.id + ".svg",
                        artAlt: "Placa de vídeo " + model.name + " com circuito, dissipador e ventilador",
                        title: model.name + " · " + model.year,
                        details: "R$ " + model.cost + " · bônus de satisfação " + num(model.bonus) +
                            " · ganho adicional " + num(Math.max(0, model.bonus - (current?.bonus ?? 0))) +
                            " · consumo relativo " + num(model.power) + " · fonte necessária " + required + " W",
                        buttonLabel: locked ? "🔒 Disponível em " + model.year : owned ? "Instalada" : obsolete ? "Modelo anterior" :
                            !powerOk ? "Requer fonte de " + required + " W" : "Comprar · R$ " + model.cost,
                        disabled: locked || owned || obsolete || !powerOk || isOn || busy || underRepair || s.cash < model.cost
                    };
                })
            };
        } };
}
