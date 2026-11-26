/** Composition of application contracts. Every port reads the same live campaign getter. */
import { gameYear, INTERNET_ERAS } from "../sim/eraCatalog.js?v=b715623ba9fb";
import { clampPriceToEra } from "../sim/historicalEconomy.js?v=b715623ba9fb";
import { serviceAccessIssues } from "../sim/serviceAccess.js?v=b715623ba9fb";
import { SHOP_CATALOG } from "../sim/shop.js?v=b715623ba9fb";
import { applyResult, pcCount } from "../sim/simulationState.js?v=b715623ba9fb";
import { ANNEX_PC_COST } from "../sim/stationLayout.js?v=b715623ba9fb";
import { WALL_COST } from "../sim/walls.js?v=b715623ba9fb";
import { createAdminPanelRevisionsPort } from "./adminPanelRevisionsPort.js?v=b715623ba9fb";
import { createBasicGamesLicenseStatusPort } from "./basicGamesLicenseStatusPort.js?v=b715623ba9fb";
import { createClassicGamesCatalogPort } from "./classicGamesCatalogPort.js?v=b715623ba9fb";
import { createCommerceNetworkPort } from "./commerceNetworkPort.js?v=b715623ba9fb";
import { createConsolePorts } from "./portGroups/consolePorts.js?v=b715623ba9fb";
import { createFinanceReportsPorts } from "./portGroups/financeReportsPorts.js?v=b715623ba9fb";
import { createPricingPorts } from "./portGroups/pricingPorts.js?v=b715623ba9fb";
import { customerFeedbackSnapshot } from "./customerFeedbackSnapshot.js?v=b715623ba9fb";
import { createEventLogPort } from "./eventLogPort.js?v=b715623ba9fb";
import { createFridayMeetupPort } from "./fridayMeetupPort.js?v=b715623ba9fb";
import { createGameLicensingPort } from "./gameLicensingPort.js?v=b715623ba9fb";
import { createGpuCatalogPort } from "./gpuCatalogPort.js?v=b715623ba9fb";
import { createGpuDownloadMetersPort } from "./gpuDownloadMetersPort.js?v=b715623ba9fb";
import { createGpuGamesCatalogPort } from "./gpuGamesCatalogPort.js?v=b715623ba9fb";
import { createHardwarePanelPort } from "./hardwarePanelPort.js?v=b715623ba9fb";
import { createLayoutEditorPort } from "./layoutEditorPort.js?v=b715623ba9fb";
import { createLcdMonitorsPort } from "./lcdMonitorsPort.js?v=b715623ba9fb";
import { createMerchandisePort } from "./merchandisePort.js?v=b715623ba9fb";
import { createNightTournamentHudPort } from "./nightTournamentHudPort.js?v=b715623ba9fb";
import { createNoticeActionsPort } from "./noticeActionsPort.js?v=b715623ba9fb";
import { createNoticeInboxPort } from "./noticeInboxPort.js?v=b715623ba9fb";
import { createNoticeInboxRevisionPort } from "./noticeInboxRevisionPort.js?v=b715623ba9fb";
import { createNoticeWindowStatusPort } from "./noticeWindowStatusPort.js?v=b715623ba9fb";
import { createPcOperationsPort } from "./pcOperationsPort.js?v=b715623ba9fb";
import { createPlacementActionsPort } from "./placementActionsPort.js?v=b715623ba9fb";
import { computerOperationsSnapshot, liveStatusSnapshot } from "./presentationModels.js?v=b715623ba9fb";
import { createServiceActionsPort } from "./serviceActionsPort.js?v=b715623ba9fb";
import { createShopActionsPort } from "./shopActionsPort.js?v=b715623ba9fb";
import { createShopCatalogOffersPort } from "./shopCatalogOffersPort.js?v=b715623ba9fb";
import { createShopCatalogRevisionPort } from "./shopCatalogRevisionPort.js?v=b715623ba9fb";
import { createShopOverviewPort } from "./shopOverviewPort.js?v=b715623ba9fb";
import { createShopServiceOffersPort } from "./shopServiceOffersPort.js?v=b715623ba9fb";
import { createTopGamesShopPort } from "./topGamesShopPort.js?v=b715623ba9fb";
import { createStaffStatusPort } from "./staffStatusPort.js?v=b715623ba9fb";
import { createStationActionsPort } from "./stationActionsPort.js?v=b715623ba9fb";
import { createStationRevisionPort } from "./stationRevisionPort.js?v=b715623ba9fb";
import { timeWeatherSnapshot } from "./timeWeatherSnapshot.js?v=b715623ba9fb";
import { createWindowsLicensePort } from "./windowsLicensePort.js?v=b715623ba9fb";
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
