import { cameraForGame, iso } from "../isometric.js?v=1507cb2cfb2d";
import { annexComputerSlots, availableAnnexComputers } from "../../sim/stations.js?v=1507cb2cfb2d";
import { pcCount } from "../../sim/simulationState.js?v=1507cb2cfb2d";
import { drawRetroComputer } from "../retroComputer.js?v=1507cb2cfb2d";
/** Annex purchase ghost and vacancy markers, with no edits to GameState. */
export function drawAnnexPcCandidates(ctx, s, hovered) {
    const cam = cameraForGame(s), available = new Set(availableAnnexComputers(s).map(x => x.id));
    ctx.save();
    for (const slot of annexComputerSlots(s)) {
        const p = iso({ x: slot.position.x + 0.35, y: slot.position.y + 0.55 }, cam, 4);
        const free = available.has(slot.id), selected = hovered === slot.id;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, 19 * cam.zoom, 11 * cam.zoom, 0, 0, Math.PI * 2);
        ctx.fillStyle = !free ? "rgba(183,75,70,.78)" : selected ? "rgba(114,233,162,.98)" : "rgba(73,160,130,.80)";
        ctx.fill();
        ctx.strokeStyle = "#f6efdc";
        ctx.lineWidth = selected ? 3 : 1.3;
        ctx.stroke();
        if (selected && free) {
            ctx.globalAlpha = .66;
            drawRetroComputer(ctx, cam, slot.position, pcCount(s), 1, true, s);
            ctx.globalAlpha = 1;
        }
    }
    ctx.restore();
}
