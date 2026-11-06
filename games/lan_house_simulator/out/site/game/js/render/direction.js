export { directionFromDelta, movementDirection } from "../sim/direction.js?v=80953abaf40f";
const AT_REST = {
    north: "back-right", south: "front-left", east: "front-right", west: "back-left"
};
/** x_screen=(x-y)*64, y_screen=(x+y)*32. Diagonal world detours
 * may face the viewer or move screen-horizontally, unlike cardinal steps. */
export function screenViewForMotion(dx, dy, previous = "south") {
    if (!Number.isFinite(dx) || !Number.isFinite(dy) || Math.abs(dx) + Math.abs(dy) < .0001)
        return AT_REST[previous];
    const sx = dx - dy, sy = (dx + dy) * .5;
    if (Math.abs(sx) > Math.abs(sy) * 2.7)
        return sx < 0 ? "profile-left" : "profile-right";
    if (Math.abs(sy) > Math.abs(sx) * 2.7)
        return sy < 0 ? "back" : "front";
    return sy < 0 ? (sx < 0 ? "back-left" : "back-right") : (sx < 0 ? "front-left" : "front-right");
}
/** PC faces +Y into the aisle; its user must face -Y toward the monitor. */
export const COMPUTER_DIRECTION = "north";
