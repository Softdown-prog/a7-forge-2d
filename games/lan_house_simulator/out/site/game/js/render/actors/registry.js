import { appearance as a0 } from "./regular.js?v=b0980822919c";
import { appearance as a1 } from "./female.js?v=b0980822919c";
import { appearance as a2 } from "./female-bob.js?v=b0980822919c";
import { appearance as a3 } from "./female-ponytail.js?v=b0980822919c";
import { appearance as a4 } from "./clown.js?v=b0980822919c";
import { appearance as a5 } from "./vampire.js?v=b0980822919c";
import { appearance as a6 } from "./stitched-monster.js?v=b0980822919c";
import { appearance as a7 } from "./rabbit.js?v=b0980822919c";
import { appearance as a8 } from "./mouse-mascot.js?v=b0980822919c";
import { appearance as a9 } from "./owner.js?v=b0980822919c";
import { appearance as a10 } from "./cleaner.js?v=b0980822919c";
import { appearance as a11 } from "./technician.js?v=b0980822919c";
import { appearance as a12 } from "./postman.js?v=b0980822919c";
const APPEARANCES = {
    "regular": a0,
    "female": a1,
    "female-bob": a2,
    "female-ponytail": a3,
    "clown": a4,
    "vampire": a5,
    "stitched-monster": a6,
    "rabbit": a7,
    "mouse-mascot": a8,
    "owner": a9,
    "cleaner": a10,
    "technician": a11,
    "postman": a12
};
export function actorAppearanceFor(kind) {
    return APPEARANCES[kind] ?? APPEARANCES.regular;
}
export function resolvedActorStyle(appearance, id) {
    return typeof appearance.style === "function" ? appearance.style(id) : appearance.style;
}
