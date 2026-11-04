/** The editor and placement indicators must still paint when the world is paused. */
export function renderFrameVisualLayers(layers) {
    if (layers.sceneVisible)
        layers.drawScene();
    if (layers.sceneVisible && layers.accessVisible)
        layers.drawAccessOverlay();
    layers.drawEditorOverlay();
    layers.drawMenuPreview();
    layers.drawEffects();
    layers.drawPlacementOverlay();
}
