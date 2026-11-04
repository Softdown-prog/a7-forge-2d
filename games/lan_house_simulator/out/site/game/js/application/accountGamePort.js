/** The account UI transports opaque saves and cosmetic commands, never a GameState. */
import { yearFromMinutes } from "../sim/historicalEconomy.js?v=fa1ff35e3337";
import { COOKIE_COSMETICS, setVerifiedCosmetics, toggleVerifiedCosmetic } from "../sim/premiumCosmetics.js?v=fa1ff35e3337";
import { parseImportedSave, serializeSave } from "../sim/saveTransfer.js?v=fa1ff35e3337";
export function createAccountGamePort(getState, restore) {
    return { catalog: COOKIE_COSMETICS, year: () => yearFromMinutes(getState().totalMinutes),
        verifyCosmetics: ids => setVerifiedCosmetics([...ids]), toggleCosmetic: toggleVerifiedCosmetic,
        prepareRestore(json) { const state = parseImportedSave(json); return () => restore(state); },
        exportSaveText: () => serializeSave(getState()) };
}
