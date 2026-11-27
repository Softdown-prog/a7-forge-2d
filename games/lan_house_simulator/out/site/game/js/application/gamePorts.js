/** Composition of application contracts. Every port reads the same live campaign getter. */
import { gameYear, INTERNET_ERAS } from "../sim/eraCatalog.js?v=6833c3e7603d";
import { clampPriceToEra } from "../sim/historicalEconomy.js?v=6833c3e7603d";
import { serviceAccessIssues } from "../sim/serviceAccess.js?v=6833c3e7603d";
import { SHOP_CATALOG } from "../sim/shop.js?v=6833c3e7603d";
import { applyResult, pcCount } from "../sim/simulationState.js?v=6833c3e7603d";
import { ANNEX_PC_COST } from "../sim/stationLayout.js?v=6833c3e7603d";
import { WALL_COST } from "../sim/walls.js?v=6833c3e7603d";
import { createAdminPanelRevisionsPort } from "./adminPanelRevisionsPort.js?v=6833c3e7603d";
import { createBasicGamesLicenseStatusPort } from "./basicGamesLicenseStatusPort.js?v=6833c3e7603d";
import { createClassicGamesCatalogPort } from "./classicGamesCatalogPort.js?v=6833c3e7603d";
import { createCommerceNetworkPort } from "./commerceNetworkPort.js?v=6833c3e7603d";
import { createConsolePorts } from "./portGroups/consolePorts.js?v=6833c3e7603d";
import { createFinanceReportsPorts } from "./portGroups/financeReportsPorts.js?v=6833c3e7603d";
import { createPricingPorts } from "./portGroups/pricingPorts.js?v=6833c3e7603d";
import { customerFeedbackSnapshot } from "./customerFeedbackSnapshot.js?v=6833c3e7603d";
import { createEventLogPort } from "./eventLogPort.js?v=6833c3e7603d";
import { createFridayMeetupPort } from "./fridayMeetupPort.js?v=6833c3e7603d";
import { createGameLicensingPort } from "./gameLicensingPort.js?v=6833c3e7603d";
import { createGpuCatalogPort } from "./gpuCatalogPort.js?v=6833c3e7603d";
import { createGpuDownloadMetersPort } from "./gpuDownloadMetersPort.js?v=6833c3e7603d";
import { createGpuGamesCatalogPort } from "./gpuGamesCatalogPort.js?v=6833c3e7603d";
import { createHardwarePanelPort } from "./hardwarePanelPort.js?v=6833c3e7603d";
import { createLayoutEditorPort } from "./layoutEditorPort.js?v=6833c3e7603d";
import { createLcdMonitorsPort } from "./lcdMonitorsPort.js?v=6833c3e7603d";
import { createMerchandisePort } from "./merchandisePort.js?v=6833c3e7603d";
import { createNightTournamentHudPort } from "./nightTournamentHudPort.js?v=6833c3e7603d";
import { createNoticeActionsPort } from "./noticeActionsPort.js?v=6833c3e7603d";
import { createNoticeInboxPort } from "./noticeInboxPort.js?v=6833c3e7603d";
import { createNoticeInboxRevisionPort } from "./noticeInboxRevisionPort.js?v=6833c3e7603d";
import { createNoticeWindowStatusPort } from "./noticeWindowStatusPort.js?v=6833c3e7603d";
import { createPcOperationsPort } from "./pcOperationsPort.js?v=6833c3e7603d";
import { createPlacementActionsPort } from "./placementActionsPort.js?v=6833c3e7603d";
import { computerOperationsSnapshot, liveStatusSnapshot } from "./presentationModels.js?v=6833c3e7603d";
import { createServiceActionsPort } from "./serviceActionsPort.js?v=6833c3e7603d";
import { createShopActionsPort } from "./shopActionsPort.js?v=6833c3e7603d";
import { createShopCatalogOffersPort } from "./shopCatalogOffersPort.js?v=6833c3e7603d";
import { createShopCatalogRevisionPort } from "./shopCatalogRevisionPort.js?v=6833c3e7603d";
import { createShopOverviewPort } from "./shopOverviewPort.js?v=6833c3e7603d";
import { createShopServiceOffersPort } from "./shopServiceOffersPort.js?v=6833c3e7603d";
import { createTopGamesShopPort } from "./topGamesShopPort.js?v=6833c3e7603d";
import { createStaffStatusPort } from "./staffStatusPort.js?v=6833c3e7603d";
import { createStationActionsPort } from "./stationActionsPort.js?v=6833c3e7603d";
import { createStationRevisionPort } from "./stationRevisionPort.js?v=6833c3e7603d";
import { timeWeatherSnapshot } from "./timeWeatherSnapshot.js?v=6833c3e7603d";
import { createWindowsLicensePort } from "./windowsLicensePort.js?v=6833c3e7603d";
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
