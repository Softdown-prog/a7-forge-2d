/** Coordinates one simulation frame without retaining the active game or save.
 * Keeps animation capture before clock advancement and resets interpolation
 * whenever eligibility for movement changes.
 */
import { frameActivitySnapshot } from "./frameActivity.js?v=105c98f50b12";
export function createFrameSimulationCoordinator(actions) {
    let wasSimulating = false;
    return {
        run(activity, dt, leftoverMinutes) {
            const { captureMotion: simulating, advanceSimulation } = frameActivitySnapshot(activity);
            if (wasSimulating !== simulating) {
                actions.resetMotion();
                wasSimulating = simulating;
            }
            const minutes = dt * 4.0;
            if (simulating && leftoverMinutes + minutes >= 1)
                actions.captureMotion();
            if (advanceSimulation)
                actions.advance(minutes);
        }
    };
}
