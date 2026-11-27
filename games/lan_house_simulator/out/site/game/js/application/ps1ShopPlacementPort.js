import { ps1PlacementSlots, ps1PlacementLabel } from "../sim/ps1.js?v=6833c3e7603d";
export function createPs1ShopPlacementPort(getState) {
    return { snapshot: () => ps1PlacementSlots(getState()).map(slot => ({ id: slot.id, label: ps1PlacementLabel(slot) })) };
}
