export function createMenuPreviewPainter(draw) {
    let working = true;
    function paint(elapsed, painted) {
        if (!working)
            return;
        try {
            draw(elapsed);
            painted?.();
        }
        catch {
            // Missing or failing menu art is not allowed to block the game.
            working = false;
        }
    }
    return {
        available: () => working,
        paintInitial: () => paint(0),
        paintFrame: (elapsed, painted) => paint(elapsed, painted)
    };
}
