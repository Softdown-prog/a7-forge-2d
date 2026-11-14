import { merchandiseDisplay } from "../merchandiseDisplay.js?v=e74c7026ec87";
import { editableObjects, objectCorners, layoutPlacementIssue } from "../../sim/editableObjects.js?v=e74c7026ec87";
import { online } from "../../sim/simulationState.js?v=e74c7026ec87";
import { cameraForGame, iso, polygon, objectCamera } from "../isometric.js?v=e74c7026ec87";
import { drawComputerDesk } from "./stations/computer.js?v=e74c7026ec87";
import { drawCounterSurface } from "./stations/counter.js?v=e74c7026ec87";
import { drawSnackShelf, drawVendingMachine } from "../retailArt.js?v=e74c7026ec87";
import { drawTrashBin } from "./trashBin.js?v=e74c7026ec87";
import { drawWallPoster } from "../posterArt.js?v=e74c7026ec87";
import { drawPurchasedFurniture } from "./furnitureArt.js?v=e74c7026ec87";
/** Edit-mode interaction overlay. Drawing and placement validation remain separate. */
export function drawLayoutOverlay(ctx, s, selected, draft, time) {
    const cam = cameraForGame(s);
    ctx.save();
    for (const o of editableObjects(s)) {
        const corners = o.surface === "wall" ? [iso({ x: o.x, y: o.y }, cam, 115), iso({ x: o.x + (o.axis === "y" ? 0 : o.w), y: o.y + (o.axis === "y" ? o.w : 0) }, cam, 115)] : objectCorners(o).map(p => iso(p, cam, 2));
        ctx.beginPath();
        corners.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        if (corners.length > 2)
            ctx.closePath();
        ctx.strokeStyle = o.id === selected ? "#92d8ed" : "rgba(239,190,91,.7)";
        ctx.lineWidth = o.id === selected ? 3 : 1.2;
        ctx.stroke();
    }
    if (draft) {
        const original = editableObjects(s).find(o => o.id === draft.id), changed = !original || original.x !== draft.x || original.y !== draft.y || original.rotation !== draft.rotation;
        ctx.globalAlpha = .65;
        if (changed) {
            if (draft.kind === "pc")
                drawComputerDesk(ctx, cam, draft, draft.index, time, online(s), s);
            else if (draft.kind === "counter")
                drawCounterSurface(ctx, cam, draft);
            else if (draft.kind === "shelf")
                drawSnackShelf(ctx, objectCamera(cam, draft, .46, 1.22, draft.rotation), 0, s.inventory.snacks, true, draft, merchandiseDisplay(s, "snacks"));
            else if (draft.kind === "soda" || draft.kind === "candy")
                drawVendingMachine(ctx, objectCamera(cam, { x: draft.x, y: draft.y }, .66, .59, draft.rotation), { x: draft.x, y: draft.y }, draft.kind, time, s.inventory[draft.kind], true, merchandiseDisplay(s, draft.kind));
            else if (draft.kind === "bin")
                drawTrashBin(ctx, cam, draft, 0);
            else if (draft.id.startsWith("built-poster:"))
                drawWallPoster(ctx, cam, { x: draft.x, y: draft.y, axis: draft.rotation === 3 ? "y" : "x", span: draft.span, top: 133, height: 59 }, draft.posterKind);
            else
                drawPurchasedFurniture(ctx, cam, draft.kind, draft.x, draft.y, draft.rotation, "city", draft.axis);
        }
        ctx.globalAlpha = 1;
        const corners = objectCorners(draft).map(p => iso(p, cam, 3));
        polygon(ctx, corners, layoutPlacementIssue(s, draft) ? "rgba(215,92,69,.15)" : "rgba(121,223,152,.15)", layoutPlacementIssue(s, draft) ? "#efad87" : "#b9efa1");
    }
    ctx.restore();
}
