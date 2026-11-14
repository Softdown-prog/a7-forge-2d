/** PS2 scene station: rules, render and registry are independent responsibilities. */
import { ps2StationPoint, ps2PlayableGame } from "../../../sim/ps2.js?v=e74c7026ec87";
import { drawPs2Station } from "../../ps2Art.js?v=e74c7026ec87";
export function collectPs2Entries(ctx, camera, s, elapsedSeconds) {
    const entries = [];
    for (let i = 0; i < (s.ps2Stations?.length ?? 0); i++) {
        const point = ps2StationPoint(s, i);
        if (!point)
            continue;
        const st = s.ps2Stations[i], active = s.customers.some(c => c.ps2StationIndex === i && c.stage === "using");
        entries.push({ depth: point.x + point.y + .3, paint: () => drawPs2Station(ctx, camera, point, st.wear, active, elapsedSeconds, ps2PlayableGame(s, i), !!st.secondSeat, !!st.poweredOff) });
    }
    return entries;
}
