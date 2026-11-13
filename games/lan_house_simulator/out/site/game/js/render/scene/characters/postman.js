import { iso } from "../../isometric.js?v=0bd19d58dac2";
import { drawActorSprite as drawActor } from "../../actorSprites.js?v=0bd19d58dac2";
export function drawScenePostman(ctx, camera, job, t) {
    const motion = job.renderMotion;
    const moving = motion?.moving ?? job.moving;
    drawActor(ctx, camera, {
        x: job.x, y: job.y, kind: "postman", id: -31, time: t,
        pose: job.phase === "handing" ? "delivering" : moving ? "walking" : "idle",
        direction: job.phase === "handing" ? "north" : job.facing ?? "north",
        screenView: job.phase === "handing" ? undefined : motion?.view,
        walkDistance: job.phase === "handing" ? undefined : motion?.distance
    });
    const pos = iso(job, camera), z = camera.zoom;
    const caption = job.phase === "handing" ? "ENTREGANDO REVISTA" :
        job.phase === "arriving" ? "CARTEIRO · CHEGANDO" : "CARTEIRO · SAINDO";
    ctx.save();
    ctx.font = "700 " + Math.max(9, 10 * z) + "px system-ui";
    const w = ctx.measureText(caption).width + 10;
    ctx.fillStyle = "rgba(24,42,70,.93)";
    ctx.fillRect(pos.x - w / 2, pos.y - 143 * z, w, 19 * z);
    ctx.fillStyle = "#FFE495";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(caption, pos.x, pos.y - 133.5 * z);
    ctx.restore();
}
