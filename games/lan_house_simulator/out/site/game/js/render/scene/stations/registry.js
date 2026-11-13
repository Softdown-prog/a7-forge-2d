import { collectPs1Entries } from "./ps1.js?v=c12101473308";
import { collectPs2Entries } from "./ps2.js?v=c12101473308";
export function createConsoleRegistry(entries) {
    const handlers = new Map();
    for (const [generation, collect] of entries) {
        if (handlers.has(generation))
            throw new Error("Duplicate console painter: " + generation);
        handlers.set(generation, collect);
    }
    return handlers;
}
/** One registration per console generation, in original draw-order. */
export const CONSOLE_PAINTERS = createConsoleRegistry([
    ["ps1", collectPs1Entries],
    ["ps2", collectPs2Entries]
]);
export function collectConsoleEntries(ctx, camera, s, t) {
    const entries = [];
    for (const collect of CONSOLE_PAINTERS.values())
        entries.push(...collect(ctx, camera, s, t));
    return entries;
}
