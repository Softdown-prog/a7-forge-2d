/** Read-only bin geometry/status, shared by navigation and service commands. */
import { placedObject } from "./layout.js?v=1507cb2cfb2d";
export const BIN_SPOTS = [{ x: 1.1, y: 3.1 }, { x: 5.65, y: 4.65 }];
export function binSpots(s) { return BIN_SPOTS.map((p, i) => placedObject(s, "bin:" + i, p)); }
export function binStatus(fill) {
    return fill >= 100 ? "full" : fill > 0 ? "filling" : "empty";
}
export function binStates(s) {
    return BIN_SPOTS.map((_, i) => binStatus(s.binFill?.[i] ?? 0));
}
