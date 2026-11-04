export function createRuntimeUiState(hasSavedGame = false) {
    return { isPlaying: false, hasSavedGame, windows: { adminOpen: false, shopOpen: false, noticesOpen: false, activeAdminTab: "prices" },
        selection: { selectedGpuPc: 0, selectedLcdPc: 0, selectedHardwareTab: "platform", selectedPs1PlacementId: null },
        placement: { placingKind: null, wallMode: null, installingAnnexPc: false, hoveredAnnexPc: null, hoveredWall: null, relocating: false, relocationFrom: null, hoveredPlacement: null, placementNotice: "", purchaseRotation: 0, pendingWall: null }, serviceAccessVisible: false };
}
export function resetPlacementUi(state) {
    Object.assign(state.placement, { placingKind: null, wallMode: null, installingAnnexPc: false, hoveredAnnexPc: null, hoveredWall: null, relocating: false, relocationFrom: null, hoveredPlacement: null, placementNotice: "", pendingWall: null });
}
