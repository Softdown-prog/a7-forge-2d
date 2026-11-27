/** Composition root. Domain rules, DOM presentation, Canvas and lifecycle live in their own adapters. */
import { createGameApplication } from "../application/gameApplication.js?v=6833c3e7603d";
import { createLcdPreviewSample } from "../application/lcdPreviewSamplePort.js?v=6833c3e7603d";
import { Soundscape } from "../audio/soundscape.js?v=6833c3e7603d";
import { createGameScene } from "../render/gameScene.js?v=6833c3e7603d";
import { cameraForGame } from "../render/isometric.js?v=6833c3e7603d";
import { drawLcdPreviewArtwork } from "../render/lcdPreviewArtwork.js?v=6833c3e7603d";
import { createScenePicker } from "../render/scenePicking.js?v=6833c3e7603d";
import { mountCloudControls } from "../ui/cloudControls.js?v=6833c3e7603d";
import { locateGameElements } from "../ui/gameElements.js?v=6833c3e7603d";
import { createGamePanels } from "../ui/gamePanels.js?v=6833c3e7603d";
import { installGameViewport } from "../ui/gameViewport.js?v=6833c3e7603d";
import { createLayoutEditor } from "../ui/layoutEditor.js?v=6833c3e7603d";
import { createLcdPreviewCache } from "../ui/lcdPreviewCache.js?v=6833c3e7603d";
import { createPlacementController } from "../ui/placementController.js?v=6833c3e7603d";
import { decorateControls, installWindowNavigation } from "../ui/presentation.js?v=6833c3e7603d";
import { installRuntimeControls } from "../ui/runtimeControls.js?v=6833c3e7603d";
import { createRuntimeLoop } from "../ui/runtimeLoop.js?v=6833c3e7603d";
import { createRuntimeSessionController } from "../ui/runtimeSessionController.js?v=6833c3e7603d";
import { createRuntimeUiState } from "../ui/runtimeUiState.js?v=6833c3e7603d";
import { createServiceAccessInspectionCache } from "../ui/serviceAccessInspectionCache.js?v=6833c3e7603d";
import { installSoundInputBindings } from "../ui/soundInputBindings.js?v=6833c3e7603d";
import { createSoundPreferencePort } from "../ui/soundPreferencePort.js?v=6833c3e7603d";
import { browserMailSeed, browserSaveStore } from "./browserServices.js?v=6833c3e7603d";
export function bootstrapGame(document = globalThis.document, win = window) {
    const elements = locateGameElements(document), store = browserSaveStore(() => win.localStorage);
    const preference = createSoundPreferencePort({ get: store.getItem, set: store.setItem });
    const enabled = preference.read(), soundscape = new Soundscape(enabled);
    elements.soundToggle.checked = enabled;
    installSoundInputBindings(document, soundscape);
    const application = createGameApplication({ store, mailSeed: browserMailSeed, audio: soundscape, cameraForState: cameraForGame });
    const state = createRuntimeUiState(application.session.startup.source !== "none");
    const scene = createGameScene(elements.canvas, elements.menuCanvas, application.renderSource, application.frame.popupQueues);
    const lcdPreview = createLcdPreviewCache(document, createLcdPreviewSample, drawLcdPreviewArtwork);
    const inspection = createServiceAccessInspectionCache(application.ports.accessIssues, () => performance.now());
    // These closures are installed as event handlers; none run until composition is complete.
    const renderUI = (liveOnly = false) => panels.render(liveOnly), save = () => session.save();
    const editor = createLayoutEditor(elements.canvas, application.ports.layoutEditorPort, () => {
        placement.stop();
        Object.assign(state.windows, { shopOpen: false, adminOpen: false, noticesOpen: false });
        soundscape.stopKeyboard();
        renderUI();
    }, () => { save(); renderUI(); });
    installGameViewport(elements.canvas);
    const panels = createGamePanels({ elements, state, ports: application.ports, save, lcdPreview, inspection });
    const session = createRuntimeSessionController({ elements, state, port: application.session, window: win, editor, renderUI, resetScene: () => { scene.resetMotion(); inspection.invalidate(); }, stopKeyboard: () => soundscape.stopKeyboard(), setSound: value => preference.update(value, soundscape) });
    const picker = createScenePicker(elements.canvas, application.ports.placementActions, scene.camera, () => state.placement, () => win.matchMedia("(pointer:coarse)").matches);
    const placement = createPlacementController({ canvas: elements.canvas, state, ports: application.ports, picker, hitOwner: scene.hitOwner, renderUI, save, stopKeyboard: () => soundscape.stopKeyboard(), click: () => soundscape.click() });
    installRuntimeControls({ elements, state, ports: application.ports, panels, placement, session, editor, window: win, inspection });
    mountCloudControls(elements.saveMessage, application.account);
    const loop = createRuntimeLoop({ document, window: win, canvas: elements.canvas, state, framePort: application.frame, scene, editor, inspection, renderUI });
    decorateControls();
    installWindowNavigation();
    session.showMenu();
    loop.start();
    const windowsClock = win.setInterval(() => { if (application.finishRealWindows())
        renderUI(); }, 1000);
    // Angular mounts navigation before bootstrap. All imperative menu handlers,
    // session restoration and the runtime loop have now been installed.
    // Menu readiness must not depend on two animation frames: Chromium can
    // throttle/defer RAF under CI video recording, hiding the Continue button
    // indefinitely even though the app initialized successfully.
    // Actual Canvas rendering remains verified by browser gameplay tests.
    document.documentElement.dataset.gameReady = "true";
    return { stop: () => { win.clearInterval(windowsClock); loop.stop(); } };
}
