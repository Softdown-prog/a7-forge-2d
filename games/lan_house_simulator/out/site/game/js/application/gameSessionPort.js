import { createGame, dayNumber } from "../sim/engine.js?v=bc8308e69cfd";
import { GAME_LAST_MINUTE } from "../sim/mailCalendar.js?v=bc8308e69cfd";
import { clampPriceToEra } from "../sim/historicalEconomy.js?v=bc8308e69cfd";
import { loadLocalSave, replaceLocalSave, writeLocalSave } from "../sim/localSave.js?v=bc8308e69cfd";
import { serializeSave, parseImportedSave } from "../sim/saveTransfer.js?v=bc8308e69cfd";
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
