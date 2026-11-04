import { createMenuScenePreview } from "../application/menuScenePreviewPort.js?v=fa1ff35e3337";
import { paintFeedbackPopups } from "./feedbackPopupPainter.js?v=fa1ff35e3337";
import { drawLayoutEditorOverlay, drawPlacementInteractionOverlays } from "./interactionOverlays.js?v=fa1ff35e3337";
import { cameraForGame } from "./isometric.js?v=fa1ff35e3337";
import { createMenuPreviewPainter } from "./menuPreviewPainter.js?v=fa1ff35e3337";
import { SceneMotion } from "./motion.js?v=fa1ff35e3337";
import { SceneRenderer } from "./scene.js?v=fa1ff35e3337";
export function createGameScene(canvas, menuCanvas, source, popupQueues) {
    const view = canvas.getContext("2d");
    if (!view)
        throw new Error("Canvas 2D indisponível");
    const renderer = new SceneRenderer(view), sceneMotion = new SceneMotion(), menuView = menuCanvas?.getContext("2d");
    const menuRenderer = menuView ? new SceneRenderer(menuView) : null, menuPreview = createMenuScenePreview();
    const menuPreviewPainter = createMenuPreviewPainter(elapsed => menuRenderer?.draw(menuPreview, elapsed));
    menuPreviewPainter.paintInitial();
    return {
        resetMotion: () => sceneMotion.reset(), captureMotion: () => sceneMotion.capture(source()), camera: () => cameraForGame(source()),
        hasMenuRenderer: () => !!menuRenderer, menuAvailable: () => menuPreviewPainter.available(),
        drawScene: (elapsed) => renderer.draw(sceneMotion.sample(source()), elapsed),
        drawAccessOverlay: (issues, elapsed) => renderer.drawServiceAccessOverlay(source(), issues, elapsed),
        drawEditorOverlay: (elapsed, input) => drawLayoutEditorOverlay(renderer, source(), elapsed, input),
        drawPlacementOverlay: (input) => drawPlacementInteractionOverlays(renderer, source(), input),
        drawEffects: (dt, visible) => paintFeedbackPopups(view, () => cameraForGame(source()), popupQueues, dt, visible),
        paintMenu: (elapsed, painted) => { if (menuRenderer)
            menuPreviewPainter.paintFrame(elapsed, painted); },
        hitOwner: (x, y) => renderer.hitOwner(x, y)
    };
}
