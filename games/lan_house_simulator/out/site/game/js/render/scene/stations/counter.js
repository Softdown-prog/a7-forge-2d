import { objectCamera } from "../../isometric.js?v=5a84ef5bc1ea";
import { drawCounter } from "../../counterArt.js?v=5a84ef5bc1ea";
import { drawCounterPrinter } from "../../printerArt.js?v=5a84ef5bc1ea";
import { printingAnimationActive } from "../../../sim/printService.js?v=5a84ef5bc1ea";
import { copyingAnimationActive } from "../../../sim/discCopy.js?v=5a84ef5bc1ea";
import { drawCounterDiscCopier } from "../../discCopierArt.js?v=5a84ef5bc1ea";
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
