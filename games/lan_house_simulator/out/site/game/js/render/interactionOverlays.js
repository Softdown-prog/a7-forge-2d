export function drawLayoutEditorOverlay(renderer, state, elapsed, view) {
    if (view.visible && view.active)
        renderer.drawLayoutOverlay(state, view.selected, view.draft, elapsed);
}
export function drawPlacementInteractionOverlays(renderer, state, view) {
    if (!view.visible)
        return;
    if (view.editWall)
        renderer.drawWallPreview(state, view.editWall, true);
    if (view.placingKind)
        renderer.drawPlacementCandidates(state, view.placingKind, view.hoveredPlacement, view.purchaseRotation);
    if (view.relocating)
        renderer.drawRelocationCandidates(state, view.relocationFrom, view.hoveredPlacement);
    if (view.wallMode) {
        const wall = view.pendingWall ?? view.hoveredWall;
        if (view.wallMode === "door")
            renderer.drawDoorCandidates(state, wall);
        else
            renderer.drawWallPreview(state, wall, view.wallMode === "remove");
    }
    if (view.installingAnnexPc)
        renderer.drawAnnexPcCandidates(state, view.hoveredAnnexPc);
}
