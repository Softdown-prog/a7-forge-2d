/** An isolated, disposable sample state for LCD catalog illustrations.
 * It must never share the active campaign or advance the simulation.
 */
import { createGame } from "../sim/engine.js?v=a5cbdbc30563";
export function createLcdPreviewSample(id) {
    const sample = createGame();
    sample.pcTiers = [3, 3, 3];
    sample.pcLcdModels = [id, null, null];
    return sample;
}
