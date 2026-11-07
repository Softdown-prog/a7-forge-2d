import { stationUpgradeIssue } from "./stationPower.js?v=7be61a7f1436";
import { gameYear } from "./eraCatalog.js?v=7be61a7f1436";
import { hardwareFor, buildParts, requiredPsuWatts } from "./hardware.js?v=7be61a7f1436";
import { GPU_CATALOG } from "./gpuCatalog.js?v=7be61a7f1436";
export { GPU_CATALOG } from "./gpuCatalog.js?v=7be61a7f1436";
export function installedGpu(s, index) {
    const id = s.pcGpus?.[index];
    return GPU_CATALOG.some(x => x.id === id) ? id : null;
}
export function gpuSpec(id) {
    return GPU_CATALOG.find(x => x.id === id) ?? null;
}
export function gpuBonus(s, index) {
    return gpuSpec(installedGpu(s, index))?.bonus ?? 0;
}
export function buyGpu(s, index, id) {
    const count = Math.max(3, Math.min(3 + s.expansionLevel * 2, s.installedPcs ?? (3 + s.expansionLevel * 2))) + (s.annexPcs?.length ?? 0);
    if (!Number.isInteger(index) || index < 0 || index >= count)
        return { ok: false, message: "PC inexistente." };
    const issue = stationUpgradeIssue(s, index);
    if (issue)
        return { ok: false, message: issue };
    const spec = GPU_CATALOG.find(x => x.id === id);
    if (!spec)
        return { ok: false, message: "Placa de vídeo desconhecida." };
    if (gameYear(s) < spec.year)
        return { ok: false, message: spec.name + " desbloqueia em " + spec.year + "." };
    const old = gpuSpec(installedGpu(s, index));
    if (old && old.year >= spec.year)
        return { ok: false, message: "Esta máquina já possui placa igual ou superior." };
    const build = hardwareFor(s, index), needed = requiredPsuWatts(build, id);
    if (buildParts(build).psu.watts < needed)
        return { ok: false, message: "Esta GPU exige fonte de pelo menos " + needed + " W nesta estação." };
    if (s.cash < spec.cost)
        return { ok: false, message: "Caixa insuficiente: R$ " + spec.cost + "." };
    s.cash -= spec.cost;
    s.expenses += spec.cost;
    (s.pcGpus ??= [])[index] = id;
    return { ok: true, message: "PC " + (index + 1) + " equipado com " + spec.name + ": -R$ " + spec.cost + "." };
}
