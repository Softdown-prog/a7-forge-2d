/** Composition root. Domain rules, DOM presentation, Canvas and lifecycle live in their own adapters. */
import { createGameApplication } from "../application/gameApplication.js?v=b612b1779b4d";
import { createLcdPreviewSample } from "../application/lcdPreviewSamplePort.js?v=b612b1779b4d";
import { Soundscape } from "../audio/soundscape.js?v=b612b1779b4d";
import { createGameScene } from "../render/gameScene.js?v=b612b1779b4d";
import { cameraForGame } from "../render/isometric.js?v=b612b1779b4d";
import { drawLcdPreviewArtwork } from "../render/lcdPreviewArtwork.js?v=b612b1779b4d";
import { createScenePicker } from "../render/scenePicking.js?v=b612b1779b4d";
import { mountCloudControls } from "../ui/cloudControls.js?v=b612b1779b4d";
import { locateGameElements } from "../ui/gameElements.js?v=b612b1779b4d";
import { createGamePanels } from "../ui/gamePanels.js?v=b612b1779b4d";
import { installGameViewport } from "../ui/gameViewport.js?v=b612b1779b4d";
import { createLayoutEditor } from "../ui/layoutEditor.js?v=b612b1779b4d";
import { createLcdPreviewCache } from "../ui/lcdPreviewCache.js?v=b612b1779b4d";
import { createPlacementController } from "../ui/placementController.js?v=b612b1779b4d";
import { decorateControls, installWindowNavigation } from "../ui/presentation.js?v=b612b1779b4d";
import { installRuntimeControls } from "../ui/runtimeControls.js?v=b612b1779b4d";
import { createRuntimeLoop } from "../ui/runtimeLoop.js?v=b612b1779b4d";
import { createRuntimeSessionController } from "../ui/runtimeSessionController.js?v=b612b1779b4d";
import { createRuntimeUiState } from "../ui/runtimeUiState.js?v=b612b1779b4d";
import { createServiceAccessInspectionCache } from "../ui/serviceAccessInspectionCache.js?v=b612b1779b4d";
import { installSoundInputBindings } from "../ui/soundInputBindings.js?v=b612b1779b4d";
import { createSoundPreferencePort } from "../ui/soundPreferencePort.js?v=b612b1779b4d";
import { browserMailSeed, browserSaveStore } from "./browserServices.js?v=b612b1779b4d";
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
    // React mounts navigation before bootstrap. Reveal those controls only after
    // two real frames: the first draws the CRT menu preview and attaches listeners.
    // Avoid races in mobile touch and account/continue flows.
    win.requestAnimationFrame(() => win.requestAnimationFrame(() => {
        document.documentElement.dataset.gameReady = "true";
    }));
    return { stop: () => { win.clearInterval(windowsClock); loop.stop(); } };
}
