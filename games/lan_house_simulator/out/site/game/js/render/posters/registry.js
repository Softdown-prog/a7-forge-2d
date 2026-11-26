import { coasterPoster } from "./coaster.js?v=b0980822919c";
import { tacticalPoster } from "./tactical.js?v=b0980822919c";
import { golfPoster } from "./golf.js?v=b0980822919c";
import { artilleryPoster } from "./artillery.js?v=b0980822919c";
import { cityPoster } from "./city.js?v=b0980822919c";
import { terminalPoster } from "./terminal.js?v=b0980822919c";
import { arcadePoster } from "./arcade.js?v=b0980822919c";
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
