import { pcCount } from "../sim/engine.js?v=c416c21ccd84";
import { ERA_GAME_CATALOG, licenseEraGame } from "../sim/eraGames.js?v=c416c21ccd84";
import { GPU_GAME_CATALOG, licenseGpuGame, toggleGpuGameInstallation, installGpuGameOnAvailablePcs, cancelGpuGameInstallation } from "../sim/gpuGames.js?v=c416c21ccd84";
const invalid = { ok: false, message: "Jogo ou computador inválido." };
const knownGpu = (id) => GPU_GAME_CATALOG.some(g => g.id === id);
const validIndex = (s, i) => Number.isInteger(i) && i >= 0 && i < pcCount(s);
/** The current state is resolved per command so importing a save is safe. */
export function createGameLicensingPort(getState) {
    return {
        licenseEra(id) { return ERA_GAME_CATALOG.some(g => g.id === id) ? licenseEraGame(getState(), id) : invalid; },
        licenseGpu(id) { return knownGpu(id) ? licenseGpuGame(getState(), id) : invalid; },
        toggleInstallation(i, id) { const s = getState(); return knownGpu(id) && validIndex(s, i) ? toggleGpuGameInstallation(s, i, id) : invalid; },
        installAvailable(id) { return knownGpu(id) ? installGpuGameOnAvailablePcs(getState(), id) : invalid; },
        cancelDownload(i, id) { const s = getState(); return knownGpu(id) && validIndex(s, i) ? cancelGpuGameInstallation(s, i, id) : invalid; }
    };
}
