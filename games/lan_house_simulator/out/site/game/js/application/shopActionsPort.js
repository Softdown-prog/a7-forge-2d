import { buyComputer, availablePlacementSlots } from "../sim/shop.js?v=7be61a7f1436";
import { linuxMachineSpec } from "../sim/linuxMachines.js?v=7be61a7f1436";
import { buyPrinter } from "../sim/printService.js?v=7be61a7f1436";
import { buyDiscCopier } from "../sim/discCopy.js?v=7be61a7f1436";
import { expandShop } from "../sim/economy.js?v=7be61a7f1436";
import { expandDirection } from "../sim/room.js?v=7be61a7f1436";
import { buyPs2Station } from "../sim/ps2.js?v=7be61a7f1436";
import { buyPs1Station } from "../sim/ps1.js?v=7be61a7f1436";
import { subscribeTopGames, cancelTopGames } from "../sim/topGamesMagazines.js?v=7be61a7f1436";
const furniture = (s) => s === "poster" || s === "plant" || s === "table";
const extension = (s) => s === "west" || s === "east" || s === "north";
export function createShopActionsPort(getState) {
    return {
        canPlace(kind) { return furniture(kind) && availablePlacementSlots(getState(), kind).length > 0; },
        purchase(id, ps1SlotId = "") {
            const s = getState();
            switch (id) {
                case "expand": return expandShop(s);
                case "computer": return buyComputer(s);
                case "linux-lab-99":
                case "linux-dev-99": return buyComputer(s, linuxMachineSpec(id).id);
                case "ps1": return buyPs1Station(s, ps1SlotId);
                case "ps2": return buyPs2Station(s, ps1SlotId);
                case "top-games-subscribe": return subscribeTopGames(s);
                case "top-games-cancel": return cancelTopGames(s);
                case "disc-copier": return buyDiscCopier(s);
                case "printer": return buyPrinter(s);
                default: {
                    if (id.startsWith("extend-")) {
                        const direction = id.slice(7);
                        if (extension(direction))
                            return expandDirection(s, direction);
                    }
                    return { ok: false, message: "Compra desconhecida." };
                }
            }
        }
    };
}
