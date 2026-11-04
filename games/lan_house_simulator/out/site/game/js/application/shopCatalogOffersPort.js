import { shopPrice, furnitureLimit, availablePlacementSlots, nextComputerPlacementIssue } from "../sim/shop.js?v=fa1ff35e3337";
import { linuxMachineSpec } from "../sim/linuxMachines.js?v=fa1ff35e3337";
import { linuxUnlocked } from "../sim/linuxQuest.js?v=fa1ff35e3337";
import { MAX_EXTENSION_LEVEL } from "../sim/room.js?v=fa1ff35e3337";
import { shopPlacementStatus, shopPurchaseButtonText } from "./shopCatalogGuidance.js?v=fa1ff35e3337";
export function createShopCatalogOffersPort(getState, getAvailableAnnexCount) {
    return { snapshot(id) {
            const s = getState();
            const isFurniture = id === "poster" || id === "plant" || id === "table";
            const kind = id;
            const max = isFurniture ? furnitureLimit(s, kind) : 0;
            const count = s.furniture?.[kind] ?? 0;
            const ext = id.startsWith("extend-") ? id.slice(7) : null;
            const linux = linuxMachineSpec(id);
            const slots = max > 0 ? availablePlacementSlots(s, kind).length : 0;
            const full = id === "door" ? !(s.interiorWalls?.length) :
                id === "computer-annex" ? !getAvailableAnnexCount() :
                    ext ? (s.roomExtensions?.[ext] ?? 0) >= MAX_EXTENSION_LEVEL :
                        id === "expand" ? s.expansionLevel >= 2 :
                            (id === "computer" || linux) ? (s.installedPcs ?? (3 + s.expansionLevel * 2)) >= 3 + s.expansionLevel * 2 :
                                max > 0 && (count >= max || !slots);
            const price = shopPrice(s, id), poor = s.cash < price;
            // A vaga numérica pode estar livre mesmo que móveis ou circulação impeçam a instalação.
            const placementIssue = (id === "computer" || linux) && !full ? nextComputerPlacementIssue(s) : null;
            const hint = shopPlacementStatus(s, id);
            return {
                disabled: full || poor || placementIssue !== null || (!!linux && !linuxUnlocked(s)),
                text: linux && !linuxUnlocked(s) ? "🔒 Coleção Linux · outubro de 1999" :
                    full || poor || placementIssue === null ? shopPurchaseButtonText(id, full, poor, price, max > 0) : "Posição do próximo PC bloqueada",
                placementHint: placementIssue ? (hint ? hint + " " : "") + placementIssue : hint,
                ownedText: max > 0 ? "Instalados: " + count + " · posições livres: " + slots : null
            };
        } };
}
