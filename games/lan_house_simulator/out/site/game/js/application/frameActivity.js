export function frameActivitySnapshot(input) {
    const advanceSimulation = input.playing && !input.accountOpen && !input.editingLayout &&
        !input.placingFurniture && !input.relocatingFurniture && !input.editingWalls && !input.installingAnnexPc;
    return {
        advanceSimulation,
        // Preserve the historical end-of-campaign distinction: finalization may run
        // even after no more movement should be interpolated.
        captureMotion: advanceSimulation && input.beforeCampaignEnd
    };
}
