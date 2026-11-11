import { createGame, dayNumber } from "../sim/engine.js?v=5a84ef5bc1ea";
import { GAME_LAST_MINUTE } from "../sim/mailCalendar.js?v=5a84ef5bc1ea";
import { clampPriceToEra } from "../sim/historicalEconomy.js?v=5a84ef5bc1ea";
import { loadLocalSave, replaceLocalSave, writeLocalSave } from "../sim/localSave.js?v=5a84ef5bc1ea";
import { serializeSave, parseImportedSave } from "../sim/saveTransfer.js?v=5a84ef5bc1ea";
export function createGameSessionPort(store, getState) {
    return {
        startup() {
            const loaded = loadLocalSave(store);
            if (loaded.state) {
                if (loaded.state.totalMinutes > GAME_LAST_MINUTE) {
                    loaded.state.totalMinutes = GAME_LAST_MINUTE;
                    loaded.state.leftoverMinutes = 0;
                }
                clampPriceToEra(loaded.state);
            }
            return loaded;
        },
        newGame(seed, mode, mailSeed) {
            const fresh = createGame(seed, mode);
            fresh.mailScheduleSeed = mailSeed >>> 0;
            return fresh;
        },
        persist() { writeLocalSave(store, getState()); },
        replace(state) { replaceLocalSave(store, state); },
        parseImport(json) { return parseImportedSave(json); },
        exportSnapshot() {
            const state = getState();
            return { filename: "lan-house-simulator-dia-" + dayNumber(state) + ".json",
                contents: serializeSave(state) };
        }
    };
}
