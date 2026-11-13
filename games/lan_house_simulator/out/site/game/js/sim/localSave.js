import { isValidSave } from "./engine.js?v=c12101473308";
import { snapshotGameState } from "./saveTransfer.js?v=c12101473308";
import { DAY_MINUTES, GAME_SAVE_KEY } from "./types.js?v=c12101473308";
export const GAME_SAVE_BACKUP_KEY = GAME_SAVE_KEY + "-backup";
function decode(raw) {
    if (!raw || raw.length > 2_000_000)
        return null;
    try {
        const data = JSON.parse(raw);
        if (!isValidSave(data) || !Number.isInteger(data.totalMinutes) || data.totalMinutes < 0 ||
            !Number.isInteger(data.rng) || data.rng < 0)
            return null;
        return data;
    }
    catch {
        return null;
    }
}
export function loadLocalSave(store) {
    let primary = null;
    // Mesmo que a leitura da chave principal falhe, o backup pode estar acessível.
    try {
        primary = store.getItem(GAME_SAVE_KEY);
    }
    catch { }
    const state = decode(primary);
    if (state)
        return { state, source: "primary", invalidPrimary: false };
    let backup = null;
    try {
        backup = store.getItem(GAME_SAVE_BACKUP_KEY);
    }
    catch { }
    const recovered = decode(backup);
    if (recovered)
        return { state: recovered, source: "backup", invalidPrimary: primary !== null };
    return { state: null, source: "none", invalidPrimary: primary !== null };
}
function encode(state) {
    if (!isValidSave(state) || !Number.isInteger(state.totalMinutes) || state.totalMinutes < 0 ||
        !Number.isInteger(state.rng) || state.rng < 0)
        throw Error("Estado do jogo inválido.");
    const json = JSON.stringify(snapshotGameState(state));
    if (json.length > 2_000_000)
        throw Error("Limite local de 2 MB excedido.");
    return json;
}
/** Guarda uma versão válida anterior; renova a cópia por dia do jogo, não por frame. */
export function writeLocalSave(store, state) {
    const payload = encode(state), old = store.getItem(GAME_SAVE_KEY), existing = decode(old);
    if (existing) {
        // Falha de leitura do checkpoint não deve bloquear uma gravação principal válida.
        let last = null;
        try {
            last = decode(store.getItem(GAME_SAVE_BACKUP_KEY));
        }
        catch { }
        const oldDay = Math.floor(existing.totalMinutes / DAY_MINUTES);
        const backDay = last ? Math.floor(last.totalMinutes / DAY_MINUTES) : -1;
        if (!last || oldDay > backDay) {
            try {
                store.setItem(GAME_SAVE_BACKUP_KEY, old);
            }
            catch { /* Backup opcional: a cópia principal tem prioridade. */ }
        }
    }
    store.setItem(GAME_SAVE_KEY, payload);
}
/** Substituições explícitas nunca recuperam um backup de campanha anterior. */
export function replaceLocalSave(store, state) {
    store.setItem(GAME_SAVE_KEY, encode(state));
    try {
        store.removeItem(GAME_SAVE_BACKUP_KEY);
    }
    catch { }
}
