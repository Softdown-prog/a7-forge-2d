export function createFrameViewportState(canvas, makeObserver, matchMedia) {
    // Start visible until an observation is delivered, just like the old frame loop.
    let sceneVisible = true;
    makeObserver(entries => { sceneVisible = entries[0]?.isIntersecting ?? false; }).observe(canvas);
    const coarse = matchMedia("(pointer:coarse)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    return {
        visible: () => sceneVisible,
        coarsePointer: () => coarse.matches,
        reducedMotion: () => reduced.matches
    };
}
