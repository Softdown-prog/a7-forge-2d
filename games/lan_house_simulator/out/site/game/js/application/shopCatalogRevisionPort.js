import { gameYear } from "../sim/era.js?v=80953abaf40f";
export function createShopCatalogRevisionPort(getState) {
    return { snapshot(category) {
            const s = getState();
            return [
                category, s.cash, s.discCopier, s.printer, s.ps1Stations, s.ps1Discs,
                gameYear(s), s.expansionLevel, s.installedPcs, s.annexPcs,
                s.roomExtensions, s.furniture, s.furniturePlacements, s.objectPlacements,
                s.removedBuiltPosters, s.interiorWalls, s.interiorDoors,
                s.linuxResearchStartedDay, s.linuxMailSeenIds, s.pcLinuxModels, s.pcOperatingSystems,
                ...(s.ps2Stations !== undefined ? [s.ps2Stations, s.ps2Games] : [])
            ];
        } };
}
