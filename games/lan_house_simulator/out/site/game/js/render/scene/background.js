import { SCENE_THEME as theme } from "../theme.js?v=e74c7026ec87";
import { contextScale } from "../sceneSurface.js?v=e74c7026ec87";
import { cosmeticAvailable } from "../../sim/premiumCosmetics.js?v=e74c7026ec87";
import { yearFromMinutes } from "../../sim/historicalEconomy.js?v=e74c7026ec87";
import { drawVignette } from "../lighting.js?v=e74c7026ec87";
import { drawRoomFloor } from "./floor.js?v=e74c7026ec87";
import { drawRoomWalls } from "./walls.js?v=e74c7026ec87";
import { drawRoomDecor } from "./decor.js?v=e74c7026ec87";
import { drawExtraPosters } from "./furnitureArt.js?v=e74c7026ec87";
/** Paint only the static room layer, in the same order as the uncached renderer. */
export function paintRoomBackground(ctx, s, camera, bounds, w, h) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, theme.backgroundTop);
    sky.addColorStop(1, theme.backgroundBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    const sheen = ctx.createLinearGradient(0, 0, w, h);
    sheen.addColorStop(0, "rgba(255,255,255,.035)");
    sheen.addColorStop(.5, "rgba(255,255,255,0)");
    sheen.addColorStop(1, "rgba(0,0,0,.08)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);
    drawVignette(ctx, w, h, .42);
    drawRoomFloor(ctx, camera, bounds, cosmeticAvailable("arcade-checker-floor", yearFromMinutes(s.totalMinutes)));
    drawRoomWalls(ctx, camera, bounds);
    drawRoomDecor(ctx, camera, bounds, s);
    drawExtraPosters(ctx, camera, s);
}
/** Keeps the bitmap on its own context rather than swapping SceneRenderer.ctx. */
export class RoomBackgroundCache {
    background = null;
    backgroundKey = "";
    draw(ctx, s, camera, bounds, w, h) {
        const scale = contextScale(ctx) ?? 1;
        const key = JSON.stringify([w, h, scale, camera, bounds, s.furniture?.poster ?? 0,
            s.furniturePlacements?.filter(p => p.kind === "poster") ?? [],
            s.objectPlacements?.filter(p => p.id.startsWith("built-poster:")) ?? [],
            s.removedBuiltPosters ?? [],
            cosmeticAvailable("arcade-checker-floor", yearFromMinutes(s.totalMinutes)),
            cosmeticAvailable("exclusive-arcade-posters", yearFromMinutes(s.totalMinutes))]);
        if (typeof document !== "undefined") {
            if (!this.background)
                this.background = document.createElement("canvas");
            const buffer = this.background.getContext("2d");
            if (buffer) {
                if (key !== this.backgroundKey) {
                    const width = Math.round(w * scale), height = Math.round(h * scale);
                    if (this.background.width !== width || this.background.height !== height) {
                        this.background.width = width;
                        this.background.height = height;
                    }
                    buffer.setTransform(scale, 0, 0, scale, 0, 0);
                    paintRoomBackground(buffer, s, camera, bounds, w, h);
                    this.backgroundKey = key;
                }
                ctx.drawImage(this.background, 0, 0, this.background.width / scale, this.background.height / scale);
                return;
            }
        }
        paintRoomBackground(ctx, s, camera, bounds, w, h);
    }
}
