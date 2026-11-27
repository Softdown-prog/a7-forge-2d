/** Composition of application contracts. Every port reads the same live campaign getter. */
import { gameYear, INTERNET_ERAS } from "../sim/eraCatalog.js?v=f36771daf749";
import { clampPriceToEra } from "../sim/historicalEconomy.js?v=f36771daf749";
import { serviceAccessIssues } from "../sim/serviceAccess.js?v=f36771daf749";
import { SHOP_CATALOG } from "../sim/shop.js?v=f36771daf749";
import { applyResult, pcCount } from "../sim/simulationState.js?v=f36771daf749";
import { ANNEX_PC_COST } from "../sim/stationLayout.js?v=f36771daf749";
import { WALL_COST } from "../sim/walls.js?v=f36771daf749";
import { createAdminPanelRevisionsPort } from "./adminPanelRevisionsPort.js?v=f36771daf749";
import { createBasicGamesLicenseStatusPort } from "./basicGamesLicenseStatusPort.js?v=f36771daf749";
import { createClassicGamesCatalogPort } from "./classicGamesCatalogPort.js?v=f36771daf749";
import { createCommerceNetworkPort } from "./commerceNetworkPort.js?v=f36771daf749";
import { createConsolePorts } from "./portGroups/consolePorts.js?v=f36771daf749";
import { createFinanceReportsPorts } from "./portGroups/financeReportsPorts.js?v=f36771daf749";
import { createPricingPorts } from "./portGroups/pricingPorts.js?v=f36771daf749";
import { customerFeedbackSnapshot } from "./customerFeedbackSnapshot.js?v=f36771daf749";
import { createEventLogPort } from "./eventLogPort.js?v=f36771daf749";
import { createFridayMeetupPort } from "./fridayMeetupPort.js?v=f36771daf749";
import { createGameLicensingPort } from "./gameLicensingPort.js?v=f36771daf749";
import { createGpuCatalogPort } from "./gpuCatalogPort.js?v=f36771daf749";
import { createGpuDownloadMetersPort } from "./gpuDownloadMetersPort.js?v=f36771daf749";
import { createGpuGamesCatalogPort } from "./gpuGamesCatalogPort.js?v=f36771daf749";
import { createHardwarePanelPort } from "./hardwarePanelPort.js?v=f36771daf749";
import { createLayoutEditorPort } from "./layoutEditorPort.js?v=f36771daf749";
import { createLcdMonitorsPort } from "./lcdMonitorsPort.js?v=f36771daf749";
import { createMerchandisePort } from "./merchandisePort.js?v=f36771daf749";
import { createNightTournamentHudPort } from "./nightTournamentHudPort.js?v=f36771daf749";
import { createNoticeActionsPort } from "./noticeActionsPort.js?v=f36771daf749";
import { createNoticeInboxPort } from "./noticeInboxPort.js?v=f36771daf749";
import { createNoticeInboxRevisionPort } from "./noticeInboxRevisionPort.js?v=f36771daf749";
import { createNoticeWindowStatusPort } from "./noticeWindowStatusPort.js?v=f36771daf749";
import { createPcOperationsPort } from "./pcOperationsPort.js?v=f36771daf749";
import { createPlacementActionsPort } from "./placementActionsPort.js?v=f36771daf749";
import { computerOperationsSnapshot, liveStatusSnapshot } from "./presentationModels.js?v=f36771daf749";
import { createServiceActionsPort } from "./serviceActionsPort.js?v=f36771daf749";
import { createShopActionsPort } from "./shopActionsPort.js?v=f36771daf749";
import { createShopCatalogOffersPort } from "./shopCatalogOffersPort.js?v=f36771daf749";
import { createShopCatalogRevisionPort } from "./shopCatalogRevisionPort.js?v=f36771daf749";
import { createShopOverviewPort } from "./shopOverviewPort.js?v=f36771daf749";
import { createShopServiceOffersPort } from "./shopServiceOffersPort.js?v=f36771daf749";
import { createTopGamesShopPort } from "./topGamesShopPort.js?v=f36771daf749";
import { createStaffStatusPort } from "./staffStatusPort.js?v=f36771daf749";
import { createStationActionsPort } from "./stationActionsPort.js?v=f36771daf749";
import { createStationRevisionPort } from "./stationRevisionPort.js?v=f36771daf749";
import { timeWeatherSnapshot } from "./timeWeatherSnapshot.js?v=f36771daf749";
import { createWindowsLicensePort } from "./windowsLicensePort.js?v=f36771daf749";
export function createGamePorts(getState, cameraForState) {
    const layoutEditorPort = createLayoutEditorPort(getState, cameraForState);
    const placementActions = createPlacementActionsPort(getState);
    const { ps1Actions, ps2Port, ps1AdminPort, ps1ShopDiscPort, ps1ShopPlacementPort, ps1ShopOfferPort } = createConsolePorts(getState);
    const shopServiceOffersPort = createShopServiceOffersPort(getState);
    const topGamesShopPort = createTopGamesShopPort(getState);
    const shopCatalogOffersPort = createShopCatalogOffersPort(getState, () => placementActions.availableAnnex().length);
    const shopOverviewPort = createShopOverviewPort(getState, () => layoutEditorPort.objects().length, () => placementActions.annexSlots().length);
    const gpuDownloadMetersPort = createGpuDownloadMetersPort(getState);
    const windowsLicensePort = createWindowsLicensePort(getState);
    const { stationLedgerPort, monthlyFinancePort, financialBalancePort, financialAdminOverviewPort } = createFinanceReportsPorts(getState);
    const stationRevisionPort = createStationRevisionPort(getState);
    const adminPanelRevisionsPort = createAdminPanelRevisionsPort(getState);
    const { promotionStatusPort, pricingInsightsPort, hourlyPriceStatusPort, retailPriceStatusPort, deskPricingPort, pricingPort } = createPricingPorts(getState);
    const staffStatusPort = createStaffStatusPort(getState);
    const commerceNetworkPort = createCommerceNetworkPort(getState);
    const pcOperationsPort = createPcOperationsPort(getState);
    const lcdMonitorsPort = createLcdMonitorsPort(getState);
    const hardwarePanelPort = createHardwarePanelPort(getState);
    const gpuCatalogPort = createGpuCatalogPort(getState);
    const classicGamesCatalogPort = createClassicGamesCatalogPort(getState);
    const gpuGamesCatalogPort = createGpuGamesCatalogPort(getState);
    const basicGamesLicenseStatusPort = createBasicGamesLicenseStatusPort(getState);
    const noticeInboxPort = createNoticeInboxPort(getState);
    const noticeWindowStatusPort = createNoticeWindowStatusPort(getState);
    const noticeInboxRevisionPort = createNoticeInboxRevisionPort(getState);
    const eventLogPort = createEventLogPort(getState);
    const noticeActions = createNoticeActionsPort(getState);
    const merchandisePort = createMerchandisePort(getState);
    const serviceActions = createServiceActionsPort(getState);
    const gameLicensing = createGameLicensingPort(getState);
    const stationActions = createStationActionsPort(getState);
    const shopActions = createShopActionsPort(getState);
    const shopCatalogRevisionPort = createShopCatalogRevisionPort(getState);
    const fridayMeetupPort = createFridayMeetupPort(getState);
    const nightTournamentHudPort = createNightTournamentHudPort(getState);
    return {
        layoutEditorPort, placementActions, ps2Port, ps1Actions, ps1AdminPort, ps1ShopDiscPort, ps1ShopPlacementPort, ps1ShopOfferPort, shopServiceOffersPort, topGamesShopPort, shopCatalogOffersPort, shopOverviewPort, gpuDownloadMetersPort, windowsLicensePort, stationLedgerPort, stationRevisionPort, adminPanelRevisionsPort, monthlyFinancePort, promotionStatusPort, financialBalancePort, financialAdminOverviewPort, staffStatusPort, pricingInsightsPort, hourlyPriceStatusPort, retailPriceStatusPort, deskPricingPort, commerceNetworkPort, pcOperationsPort, lcdMonitorsPort, hardwarePanelPort, gpuCatalogPort, classicGamesCatalogPort, gpuGamesCatalogPort, basicGamesLicenseStatusPort, noticeInboxPort, noticeWindowStatusPort, noticeInboxRevisionPort, eventLogPort, noticeActions, merchandisePort, pricingPort, serviceActions, gameLicensing, stationActions, shopActions, shopCatalogRevisionPort, fridayMeetupPort, nightTournamentHudPort,
        catalog: SHOP_CATALOG, rules: { wallCost: WALL_COST, annexPcCost: ANNEX_PC_COST },
        status() { const s = getState(); return { year: gameYear(s), pcCount: pcCount(s), ps1Count: s.ps1Stations?.length ?? 0, partitionsCount: (s.interiorWalls?.length ?? 0) + (s.interiorDoors?.length ?? 0) }; },
        recordResult: (result) => applyResult(getState(), result),
        normalizeLegacyPricing: () => clampPriceToEra(getState()),
        timeWeather: () => timeWeatherSnapshot(getState()),
        liveStatus() { const s = getState(); return liveStatusSnapshot(s, INTERNET_ERAS[s.internetTier - 1]?.name ?? "Desconhecida"); },
        computerOperations: () => computerOperationsSnapshot(getState()),
        feedback: () => customerFeedbackSnapshot(getState()),
        accessIssues: () => serviceAccessIssues(getState())
    };
}
