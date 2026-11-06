import { renderFrameVisualLayers } from "./frameVisualLayers.js?v=b612b1779b4d";
export function createFramePresentationCoordinator(schedule) {
    return {
        render(input) {
            const paintScene = schedule.scene(input.timestamp, input.sceneFlags);
            renderFrameVisualLayers({
                sceneVisible: paintScene, accessVisible: input.accessVisible,
                drawScene: input.drawScene,
                drawAccessOverlay: input.drawAccessOverlay,
                drawEditorOverlay: () => input.drawEditorOverlay(paintScene),
                drawMenuPreview: () => {
                    if (schedule.menu(input.timestamp, input.menuFlags))
                        input.paintMenu(() => schedule.menuPainted(input.timestamp));
                },
                drawEffects: () => input.drawEffects(paintScene),
                drawPlacementOverlay: () => input.drawPlacementOverlay(paintScene)
            });
            if (schedule.hud(input.timestamp, input.hudFlags))
                input.refreshHud();
        }
    };
}
