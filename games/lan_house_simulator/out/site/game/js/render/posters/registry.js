import { coasterPoster } from "./coaster.js?v=88374e228e86";
import { tacticalPoster } from "./tactical.js?v=88374e228e86";
import { golfPoster } from "./golf.js?v=88374e228e86";
import { artilleryPoster } from "./artillery.js?v=88374e228e86";
import { cityPoster } from "./city.js?v=88374e228e86";
import { terminalPoster } from "./terminal.js?v=88374e228e86";
import { arcadePoster } from "./arcade.js?v=88374e228e86";
/** Reject duplicate IDs rather than silently replacing another module's artwork. */
export function createPosterRegistry(entries) {
    const registered = new Map();
    for (const [kind, design] of entries) {
        if (registered.has(kind))
            throw new Error("Duplicate poster artwork: " + kind);
        registered.set(kind, design);
    }
    return registered;
}
/** One line per independent design, retaining the existing public ordering and identifiers. */
const POSTER_ENTRIES = [
    ["coaster", coasterPoster],
    ["tactical", tacticalPoster],
    ["golf", golfPoster],
    ["artillery", artilleryPoster],
    ["city", cityPoster],
    ["terminal", terminalPoster],
    ["arcade", arcadePoster]
];
export const POSTER_KINDS = POSTER_ENTRIES.map(([kind]) => kind);
const POSTERS = createPosterRegistry(POSTER_ENTRIES);
export function posterFor(kind) {
    const poster = POSTERS.get(kind);
    if (!poster)
        throw new Error("Unknown poster artwork: " + kind);
    return poster;
}
