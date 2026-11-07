import { gameYear } from "../sim/era.js?v=7be61a7f1436";
export function createShopCatalogRevisionPort(getState) {
    return { snapshot(category) {
            const s = getState();
            return [
                category, s.cash, s.discCopier, s.printer, s.ps1Stations, s.ps1Discs,
                gameYear(s), s.expansionLevel, s.installedPcs, s.annexPcs,
                s.roomExtensions, s.furniture, s.furniturePlacements, s.objectPlacements,
                s.removedBuiltPosters, s.interiorWalls, s.interiorDoors,
                s.linuxResearchStartedDay, s.linuxMailSeenIds, s.pcLinuxModels, s.pcOperatingSystems,
                s.topGamesUnlockMode, s.topGamesSubscriptionDay, s.topGamesSubscriptionActive,
                s.topGamesReceivedIssues, s.topGamesLastDeliveryDay,
                ...(s.ps2Stations !== undefined ? [s.ps2Stations, s.ps2Games] : [])
            ];
        } };
}
