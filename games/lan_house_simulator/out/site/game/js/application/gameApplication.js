import { createAccountGamePort } from "./accountGamePort.js?v=1426089a9f9b";
import { createGameFramePort } from "./gameFramePort.js?v=1426089a9f9b";
import { createGamePorts } from "./gamePorts.js?v=1426089a9f9b";
import { createGameSessionPort } from "./gameSessionPort.js?v=1426089a9f9b";
export function createGameApplication(options) {
    let game;
    const sessionPort = createGameSessionPort(options.store, () => game);
    const startup = sessionPort.startup();
    const newGame = (mode) => sessionPort.newGame(72421, mode, options.mailSeed(72421));
    game = startup.state ?? newGame("historical");
    const getState = () => game;
    const frame = createGameFramePort(getState, options.audio);
    const listeners = new Set();
    function replace(state, reason) {
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
    return { ports: createGamePorts(getState, options.cameraForState), frame, session,
        account: createAccountGamePort(getState, state => replace(state, "cloud")),
        /** Only the Canvas adapter receives this source; it is not part of GamePorts. */
        renderSource: getState };
}
