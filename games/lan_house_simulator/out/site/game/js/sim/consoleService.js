import { ps1OpenSeat, ps1SessionPrice, ps1HourPrice } from "./ps1.js?v=229a76357973";
import { ps2OpenSeat, ps2SessionPrice, ps2HourPrice } from "./ps2.js?v=229a76357973";
import { consoleSeat, consoleApproach, consoleStations } from "./consoleLayout.js?v=229a76357973";
import { sessionPlan, shouldConsiderConsole } from "./customerChoices.js?v=229a76357973";
import { navigableRoute, canTraverseLocalStep } from "./navigation.js?v=229a76357973";
export function chooseConsoleSession(s, c, wanted, remaining, pc) {
    if (c.multiplayerVisitId !== undefined || !shouldConsiderConsole(c, pc))
        return null;
    // Stable taste: some gamers still prefer the PS1. Economy visitors compare rates.
    const generations = c.preference === "economy"
        ? (ps1HourPrice(s) <= ps2HourPrice(s) ? ["ps1", "ps2"] : ["ps2", "ps1"])
        : c.id % 3 === 0 ? ["ps1", "ps2"] : ["ps2", "ps1"];
    for (const g of generations)
        for (let index = 0; index < consoleStations(s, g).length; index++) {
            const number = g === "ps1" ? ps1OpenSeat(s, index) : ps2OpenSeat(s, index);
            if (number === null)
                continue;
            const side = consoleApproach(s, g, index, number), seat = consoleSeat(s, g, index, number);
            if (!side || !seat || !navigableRoute(s, c, side) ||
                !(canTraverseLocalStep(s, side, seat) || navigableRoute(s, side, seat)))
                continue;
            const quote = (m) => g === "ps1" ? ps1SessionPrice(s, m) : ps2SessionPrice(s, m);
            const minutes = sessionPlan(c, wanted, remaining, quote);
            if (minutes === null)
                continue;
            return { generation: g, index, number, side, seat, minutes, paid: quote(minutes), hourly: g === "ps1" ? ps1HourPrice(s) : ps2HourPrice(s) };
        }
    return null;
}
