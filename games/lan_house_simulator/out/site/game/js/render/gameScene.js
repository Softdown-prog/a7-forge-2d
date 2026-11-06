import { createMenuScenePreview } from "../application/menuScenePreviewPort.js?v=80953abaf40f";
import { paintFeedbackPopups } from "./feedbackPopupPainter.js?v=80953abaf40f";
import { drawLayoutEditorOverlay, drawPlacementInteractionOverlays } from "./interactionOverlays.js?v=80953abaf40f";
import { cameraForGame } from "./isometric.js?v=80953abaf40f";
import { createMenuPreviewPainter } from "./menuPreviewPainter.js?v=80953abaf40f";
import { SceneMotion } from "./motion.js?v=80953abaf40f";
import { SceneRenderer } from "./scene.js?v=80953abaf40f";
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
