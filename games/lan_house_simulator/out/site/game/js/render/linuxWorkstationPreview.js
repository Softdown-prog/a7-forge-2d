import { drawRetroComputer } from "./retroComputer.js?v=c416c21ccd84";
export function drawLinuxWorkstationPreview(ctx, id) {
    const { width, height } = ctx.canvas;
    ctx.save();
    ctx.fillStyle = "#e1e7dd";
    ctx.fillRect(0, 0, width, height);
    // The draw call uses the same geometry, chassis and screen activity as the salon.
    // A minimal state is sufficient because the renderer only reads these fields.
    const state = {
        totalMinutes: (360 + 210) * 720,
        customers: [], pcTiers: [1], pcWear: [0], pcGpus: [null], pcLinuxModels: [id],
        pcOperatingSystems: ["linux"], pcLinuxInstalled: [true], pcPoweredOff: [false]
    };
    const camera = { originX: width * .42, originY: height * .37, zoom: 1.65 };
    drawRetroComputer(ctx, camera, { x: 0, y: 0 }, 0, 0, true, state, false);
    ctx.restore();
}
