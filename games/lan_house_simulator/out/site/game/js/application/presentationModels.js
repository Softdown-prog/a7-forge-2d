import { online, pcCount, pcWear, pcBroken } from "../sim/engine.js?v=c132abc69a79";
import { computerOccupancyPercent } from "../sim/financialReview.js?v=c132abc69a79";
import { isPromotionActive } from "../sim/promotion.js?v=c132abc69a79";
import { stationModelName } from "../sim/computerModels.js?v=c132abc69a79";
import { installedWindows, WINDOWS_ERAS } from "../sim/era.js?v=c132abc69a79";
import { isLinuxPc } from "../sim/linuxQuest.js?v=c132abc69a79";
import { hardwareFor, buildParts, formatMemory, describePart } from "../sim/hardware.js?v=c132abc69a79";
import { PRODUCTS, merchandiseStock } from "../sim/merchandise.js?v=c132abc69a79";
export function liveStatusSnapshot(s, internetName) {
    const stock = { soda: 0, candy: 0, snacks: 0 };
    for (const p of PRODUCTS)
        stock[p.category] += merchandiseStock(s, p.id);
    return {
        cash: s.cash, reputation: s.reputation, internetName, connected: online(s),
        occupied: s.customers.filter(c => c.stage === "using" && c.ps1StationIndex === undefined && c.ps2StationIndex === undefined).length,
        computerCount: pcCount(s), customerCount: s.customers.length, stock,
        promotionActive: isPromotionActive(s),
        occupancyPercent: computerOccupancyPercent(s.monthPcUsedMinutes ?? 0, s.monthPcCapacityMinutes ?? 0)
    };
}
export function computerOperationsSnapshot(s) {
    return Array.from({ length: pcCount(s) }, (_, i) => {
        const parts = buildParts(hardwareFor(s, i));
        return {
            index: i, wear: pcWear(s, i), broken: pcBroken(s, i),
            windows: isLinuxPc(s, i) ? "Linux" : WINDOWS_ERAS.find(w => w.id === installedWindows(s, i)).name,
            model: stationModelName(s, i), cpu: parts.cpu.name,
            ram: formatMemory(parts.ram.ramMb), storage: describePart(parts.storage)
        };
    });
}
