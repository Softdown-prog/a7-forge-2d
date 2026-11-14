import { ps1PlacementSlots, ps1PlacementLabel } from "../sim/ps1.js?v=e74c7026ec87";
export function createPs1ShopPlacementPort(getState) {
    return { snapshot: () => ps1PlacementSlots(getState()).map(slot => ({ id: slot.id, label: ps1PlacementLabel(slot) })) };
}
