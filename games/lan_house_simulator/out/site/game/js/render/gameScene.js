import { createMenuScenePreview } from "../application/menuScenePreviewPort.js?v=1507cb2cfb2d";
import { paintFeedbackPopups } from "./feedbackPopupPainter.js?v=1507cb2cfb2d";
import { drawLayoutEditorOverlay, drawPlacementInteractionOverlays } from "./interactionOverlays.js?v=1507cb2cfb2d";
import { cameraForGame } from "./isometric.js?v=1507cb2cfb2d";
import { createMenuPreviewPainter } from "./menuPreviewPainter.js?v=1507cb2cfb2d";
import { SceneMotion } from "./motion.js?v=1507cb2cfb2d";
import { SceneRenderer } from "./scene.js?v=1507cb2cfb2d";
import { fitSceneBackingStore, sceneBackingScale, SCENE_WIDTH } from "./sceneSurface.js?v=1507cb2cfb2d";
/** Keep the bitmap at the display's resolution: CSS size × device pixel ratio,
 * quantized and capped by sceneBackingScale. Painters never see this scale. */
function createSurfaceFitter(canvas, ctx) {
    const win = typeof window !== "undefined" ? window : undefined;
    const coarse = typeof matchMedia === "function" ? matchMedia("(pointer:coarse)") : null;
    let last = 0;
    return () => {
        const css = canvas.clientWidth || 0;
        const scale = sceneBackingScale(css || SCENE_WIDTH, win?.devicePixelRatio ?? 1, !!coarse?.matches);
        if (scale !== last || canvas.width !== Math.round(SCENE_WIDTH * scale)) {
            last = scale;
            fitSceneBackingStore(canvas, ctx, scale);
        }
    };
}
export function createGameScene(canvas, menuCanvas, source, popupQueues) {
    const view = canvas.getContext("2d");
    if (!view)
        throw new Error("Canvas 2D indisponível");
    const renderer = new SceneRenderer(view), sceneMotion = new SceneMotion(), menuView = menuCanvas?.getContext("2d");
    const fitScene = createSurfaceFitter(canvas, view), fitMenu = menuCanvas && menuView ? createSurfaceFitter(menuCanvas, menuView) : () => { };
    const menuRenderer = menuView ? new SceneRenderer(menuView) : null, menuPreview = createMenuScenePreview();
    const menuPreviewPainter = createMenuPreviewPainter(elapsed => menuRenderer?.draw(menuPreview, elapsed));
    fitMenu();
    menuPreviewPainter.paintInitial();
    return {
        resetMotion: () => sceneMotion.reset(), captureMotion: () => sceneMotion.capture(source()), camera: () => cameraForGame(source()),
        hasMenuRenderer: () => !!menuRenderer, menuAvailable: () => menuPreviewPainter.available(),
        drawScene: (elapsed) => { fitScene(); renderer.draw(sceneMotion.sample(source()), elapsed); },
        drawAccessOverlay: (issues, elapsed) => renderer.drawServiceAccessOverlay(source(), issues, elapsed),
        drawEditorOverlay: (elapsed, input) => drawLayoutEditorOverlay(renderer, source(), elapsed, input),
        drawPlacementOverlay: (input) => drawPlacementInteractionOverlays(renderer, source(), input),
        drawEffects: (dt, visible) => paintFeedbackPopups(view, () => cameraForGame(source()), popupQueues, dt, visible),
        paintMenu: (elapsed, painted) => { if (menuRenderer) {
            fitMenu();
            menuPreviewPainter.paintFrame(elapsed, painted);
        } },
        hitOwner: (x, y) => renderer.hitOwner(x, y)
    };
}
