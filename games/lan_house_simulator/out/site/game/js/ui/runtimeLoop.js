/** Browser frame adapter: simulation, events, presentation, HUD, then the next RAF. */
import { createFrameSchedule } from "../application/frameSchedule.js?v=c12101473308";
import { createFrameSimulationCoordinator } from "../application/frameSimulationCoordinator.js?v=c12101473308";
import { installFrameInteractionTracker } from "./frameInteractionTracker.js?v=c12101473308";
import { createFramePresentationCoordinator } from "./framePresentationCoordinator.js?v=c12101473308";
import { createFrameViewportState } from "./frameViewportState.js?v=c12101473308";
export function createRuntimeLoop(options) {
    const { document, window: win, canvas, state, framePort, scene, editor: layoutEditor } = options;
    const frameSchedule = createFrameSchedule(), framePresentation = createFramePresentationCoordinator(frameSchedule);
    const frameViewport = createFrameViewportState(canvas, callback => new IntersectionObserver(callback), query => win.matchMedia(query));
    const frameInteraction = installFrameInteractionTracker(document, win, () => performance.now());
    const frameSimulation = createFrameSimulationCoordinator({ resetMotion: scene.resetMotion, captureMotion: scene.captureMotion, advance: framePort.advance });
    let running = false, request = null;
    function frame(timestamp) {
        if (!running)
            return;
        const { dt, elapsed } = frameSchedule.begin(timestamp), accountOpen = document.getElementById("player-account")?.hasAttribute("open") === true;
        const simulation = framePort.snapshot();
        frameSimulation.run({ playing: state.isPlaying, accountOpen, beforeCampaignEnd: simulation.beforeCampaignEnd,
            editingLayout: layoutEditor.active, placingFurniture: !!state.placement.placingKind, relocatingFurniture: state.placement.relocating, editingWalls: !!state.placement.wallMode, installingAnnexPc: state.placement.installingAnnexPc }, dt, simulation.leftoverMinutes);
        framePort.dispatch(state.isPlaying, document.hidden);
        framePresentation.render({ timestamp,
            sceneFlags: { playing: state.isPlaying, accountOpen, visible: frameViewport.visible(), hidden: document.hidden, ...state.windows, coarse: frameViewport.coarsePointer() },
            menuFlags: { playing: state.isPlaying, accountOpen, hasRenderer: scene.hasMenuRenderer(), previewAvailable: scene.menuAvailable(), hidden: document.hidden, reduceMotion: frameViewport.reducedMotion() },
            hudFlags: { playing: state.isPlaying, accountOpen, ...frameInteraction.snapshot() }, accessVisible: state.serviceAccessVisible,
            drawScene: () => scene.drawScene(elapsed), drawAccessOverlay: () => scene.drawAccessOverlay(options.inspection.inspect(), elapsed),
            drawEditorOverlay: visible => scene.drawEditorOverlay(elapsed, { visible, active: layoutEditor.active, selected: layoutEditor.selected, draft: layoutEditor.draft }),
            paintMenu: painted => scene.paintMenu(elapsed, painted),
            drawEffects: visible => { if (state.isPlaying)
                scene.drawEffects(dt, visible); },
            drawPlacementOverlay: visible => scene.drawPlacementOverlay({ visible, editWall: layoutEditor.active ? layoutEditor.wall : null, ...state.placement }),
            refreshHud: () => options.renderUI(true)
        });
        request = win.requestAnimationFrame(frame);
    }
    return { start() { if (running)
            return; running = true; request = win.requestAnimationFrame(frame); }, stop() { running = false; if (request !== null)
            win.cancelAnimationFrame(request); request = null; } };
}
