import { coasterPoster } from "./coaster.js?v=e74c7026ec87";
import { tacticalPoster } from "./tactical.js?v=e74c7026ec87";
import { golfPoster } from "./golf.js?v=e74c7026ec87";
import { artilleryPoster } from "./artillery.js?v=e74c7026ec87";
import { cityPoster } from "./city.js?v=e74c7026ec87";
import { terminalPoster } from "./terminal.js?v=e74c7026ec87";
import { arcadePoster } from "./arcade.js?v=e74c7026ec87";
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
