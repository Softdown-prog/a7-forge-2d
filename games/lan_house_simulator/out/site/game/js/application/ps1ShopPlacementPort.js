import { ps1PlacementSlots, ps1PlacementLabel } from "../sim/ps1.js?v=f36771daf749";
export function createPs1ShopPlacementPort(getState) {
    return { snapshot: () => ps1PlacementSlots(getState()).map(slot => ({ id: slot.id, label: ps1PlacementLabel(slot) })) };
}
