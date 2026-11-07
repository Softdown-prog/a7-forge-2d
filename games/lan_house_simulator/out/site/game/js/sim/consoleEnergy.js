import { priceIndex, yearFromMinutes } from "./historicalEconomy.js?v=bc8308e69cfd";
export function ps2EnergyCostPerMinute(s) {
    const factor = priceIndex(yearFromMinutes(s.totalMinutes ?? 0)) / priceIndex(2006);
    return (s.ps2Stations ?? []).reduce((sum, st, i) => sum + (st.poweredOff ? 0 :
        (s.customers ?? []).some(c => c.ps2StationIndex === i && c.stage === "using") ? .0012 : .00015), 0) * factor;
}
