import { cameraForGame, iso } from "../isometric.js?v=1507cb2cfb2d";
import { wallEndpoints, canBuildWall } from "../../sim/walls.js?v=1507cb2cfb2d";
import { drawInteriorWall, drawInteriorDoor } from "./partitions.js?v=1507cb2cfb2d";
/** Building overlays stay separate from wall collision and navigation policy. */
export function drawDoorCandidates(ctx, s, hovered) {
    const cam = cameraForGame(s);
    ctx.save();
    for (const wall of s.interiorWalls ?? []) {
        const [a, b] = wallEndpoints(wall), point = iso({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, cam, 40);
        ctx.fillStyle = "#d2bc76";
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(2, 6 * cam.zoom), 0, Math.PI * 2);
        ctx.fill();
    }
    if (hovered)
        drawInteriorDoor(ctx, cam, hovered, true);
    ctx.restore();
}
export function drawWallPreview(ctx, s, wall, demolish) {
    if (!wall)
        return;
    const exists = (s.interiorWalls ?? []).some(w => w.axis === wall.axis && w.x === wall.x && w.y === wall.y);
    const isDoor = (s.interiorDoors ?? []).some(w => w.axis === wall.axis && w.x === wall.x && w.y === wall.y);
    if (demolish && isDoor) {
        drawInteriorDoor(ctx, cameraForGame(s), wall, true);
        return;
    }
    if (demolish && !exists)
        return;
    drawInteriorWall(ctx, cameraForGame(s), wall, true, demolish ? exists : canBuildWall(s, wall));
}
