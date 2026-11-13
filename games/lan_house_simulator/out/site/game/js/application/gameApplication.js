import { finishWindowsInstallations } from "../sim/windowsInstallation.js?v=0bd19d58dac2";
import { addLog } from "../sim/simulationState.js?v=0bd19d58dac2";
import { WINDOWS_ERAS } from "../sim/eraCatalog.js?v=0bd19d58dac2";
import { createAccountGamePort } from "./accountGamePort.js?v=0bd19d58dac2";
import { createGameFramePort } from "./gameFramePort.js?v=0bd19d58dac2";
import { createGamePorts } from "./gamePorts.js?v=0bd19d58dac2";
import { createGameSessionPort } from "./gameSessionPort.js?v=0bd19d58dac2";
export function createGameApplication(options) {
    let game;
    const sessionPort = createGameSessionPort(options.store, () => game);
    const startup = sessionPort.startup();
    const newGame = (mode) => sessionPort.newGame(72421, mode, options.mailSeed(72421));
    game = startup.state ?? newGame("historical");
    const offlineCompleted = finishWindowsInstallations(game);
    if (offlineCompleted.length && startup.state) {
        for (const job of offlineCompleted)
            addLog(game, "Instalação concluída: " + WINDOWS_ERAS.find(w => w.id === job.edition).name + " no PC " + (job.pc + 1) + ".");
        try {
            sessionPort.persist();
        }
        catch { /* Normal autosave retries. */ }
    }
    const getState = () => game;
    const frame = createGameFramePort(getState, options.audio);
    const listeners = new Set();
    function replace(state, reason) {
        finishWindowsInstallations(state);
        sessionPort.replace(state); // A storage failure must keep every old getter and UI untouched.
        game = state;
        frame.reset();
        for (const listener of listeners)
            listener(reason);
    }
    const session = {
        startup: { source: startup.source, invalidPrimary: startup.invalidPrimary },
        persist: () => sessionPort.persist(), exportSnapshot: () => sessionPort.exportSnapshot(),
        prepareImport(json) { const state = sessionPort.parseImport(json); return () => replace(state, "import"); },
        newCampaign: (mode) => replace(newGame(mode), mode),
        onReplaced(listener) { listeners.add(listener); return () => listeners.delete(listener); },
        beginPlay: () => frame.beginPlay()
    };
    function finishRealWindows() {
        const completed = finishWindowsInstallations(game);
        if (!completed.length)
            return false;
        for (const job of completed)
            addLog(game, "Instalação concluída: " + WINDOWS_ERAS.find(w => w.id === job.edition).name + " no PC " + (job.pc + 1) + ". Ligue a estação.");
        try {
            sessionPort.persist();
        }
        catch { /* Normal autosave retries. */ }
        return true;
    }
    return { ports: createGamePorts(getState, options.cameraForState), frame, session, finishRealWindows,
        account: createAccountGamePort(getState, state => replace(state, "cloud")),
        /** Only the Canvas adapter receives this source; it is not part of GamePorts. */
        renderSource: getState };
}
