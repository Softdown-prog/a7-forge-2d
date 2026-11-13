import { objectCamera } from "../../isometric.js?v=c12101473308";
import { drawCounter } from "../../counterArt.js?v=c12101473308";
import { drawCounterPrinter } from "../../printerArt.js?v=c12101473308";
import { printingAnimationActive } from "../../../sim/printService.js?v=c12101473308";
import { copyingAnimationActive } from "../../../sim/discCopy.js?v=c12101473308";
import { drawCounterDiscCopier } from "../../discCopierArt.js?v=c12101473308";
/** The counter alone is reused for edit-mode previews without paid peripherals. */
export function drawCounterSurface(ctx, camera, p = { x: .9, y: 1.42 }) {
    drawCounter(ctx, objectCamera(camera, p, 1.75, .72, p.rotation), p);
}
/** Draws the counter, then printer and disc copier in their original visual order. */
export function drawSceneCounter(ctx, camera, counter, s, elapsedSeconds) {
    drawCounterSurface(ctx, camera, counter);
    if (s.printer)
        drawCounterPrinter(ctx, objectCamera(camera, counter, 1.75, .72, counter.rotation), counter, printingAnimationActive(s), elapsedSeconds);
    if (s.discCopier)
        drawCounterDiscCopier(ctx, objectCamera(camera, counter, 1.75, .72, counter.rotation), counter, copyingAnimationActive(s), elapsedSeconds);
}
