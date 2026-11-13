/** Save validation is kept outside the runtime minute loop to isolate persistence contracts. */
import { validLcdModels } from "./computerModels.js?v=0bd19d58dac2";
import { validCustomerFeedback } from "./customerFeedback.js?v=0bd19d58dac2";
import { validDiscCopier } from "./discCopy.js?v=0bd19d58dac2";
import { validateObjectPlacements } from "./editableObjects.js?v=0bd19d58dac2";
import { WINDOWS_ERAS } from "./eraCatalog.js?v=0bd19d58dac2";
import { validEraGameLicenses } from "./eraGames.js?v=0bd19d58dac2";
import { validPaidMonthlyBill } from "./financialClarity.js?v=0bd19d58dac2";
import { validFridayMeetupDraft } from "./fridayMeetup.js?v=0bd19d58dac2";
import { validGpuGameDemand } from "./gpuDemand.js?v=0bd19d58dac2";
import { gpuGameSpec, validGpuGameInstallJobs, validGpuGameInstalls, validGpuGameLicenses } from "./gpuGames.js?v=0bd19d58dac2";
import { validHardwareState } from "./hardware.js?v=0bd19d58dac2";
import { validWindowsInstallJobs } from "./windowsInstallation.js?v=0bd19d58dac2";
import { validGpuIds } from "./gpuCatalog.js?v=0bd19d58dac2";
import { GAME_END_DAY, isSporadicMailId } from "./mailCalendar.js?v=0bd19d58dac2";
import { productSpec, validMerchandise } from "./merchandise.js?v=0bd19d58dac2";
import { validMultiplayerVisit } from "./multiplayerVisitors.js?v=0bd19d58dac2";
import { validNightMeetup } from "./nightMeetup.js?v=0bd19d58dac2";
import { validLinuxState } from "./linuxQuest.js?v=0bd19d58dac2";
import { validTopGamesState } from "./topGamesMagazines.js?v=0bd19d58dac2";
import { validTopGamesUnlockMode } from "./topGamesUnlockGate.js?v=0bd19d58dac2";
import { validPostmanDelivery } from "./postmanDelivery.js?v=0bd19d58dac2";
import { validPrinterService } from "./printService.js?v=0bd19d58dac2";
import { validPs2State } from "./ps2.js?v=0bd19d58dac2";
import { validPs2ReleaseMailHistory } from "./ps2ReleaseMail.js?v=0bd19d58dac2";
import { validPs1State } from "./ps1.js?v=0bd19d58dac2";
import { pcCount } from "./simulationState.js?v=0bd19d58dac2";
import { validEmployeeState } from "./staff.js?v=0bd19d58dac2";
import { validStationLedger } from "./stationAccounting.js?v=0bd19d58dac2";
import { validStationPower } from "./stationPower.js?v=0bd19d58dac2";
import { CHAIN_IDS, STORY_IDS } from "./storyEvents.js?v=0bd19d58dac2";
import { DAY_MINUTES } from "./types.js?v=0bd19d58dac2";
export function isValidSave(value) {
    if (!value || typeof value !== "object")
        return false;
    const v = value;
    const metrics = [v.monthPcUsedMinutes, v.monthPcCapacityMinutes, v.lastMonthPcUsedMinutes,
        v.lastMonthPcCapacityMinutes, v.monthRevenueBase, v.monthExpensesBase, v.lastMonthRevenue, v.lastMonthExpenses];
    return validPostmanDelivery(v) && validLinuxState(v) && validTopGamesState(v) && validTopGamesUnlockMode(v) && validMultiplayerVisit(v) && validFridayMeetupDraft(v) && validNightMeetup(v) && validMerchandise(v) && validCustomerFeedback(v.customerFeedback, v.totalMinutes ?? 0) && validEmployeeState(v) && validStationPower(v) && validWindowsInstallJobs(v) && validPs1State(v) && validPs2State(v) && validPs2ReleaseMailHistory(v) && validPaidMonthlyBill(v.lastPaidMonthlyBill, v) && (v.economyVersion === undefined || v.economyVersion === 2) && validDiscCopier(v) && validPrinterService(v) && validHardwareState(v) && validGpuIds(v.pcGpus) && validGpuGameLicenses(v.licensedGpuGames, v) && validGpuGameInstalls(v.gpuGameInstalls, v) && validGpuGameInstallJobs(v.gpuGameInstallJobs, v) && validGpuGameDemand(v.gpuGameDemand) && validEraGameLicenses(v.licensedEraGames, v) && validLcdModels(v.pcLcdModels) && validStationLedger(v.stationLedger) &&
        (v.stationLedger === undefined || v.stationLedger.length <= pcCount(v)) &&
        (v.pcWindows === undefined || (Array.isArray(v.pcWindows) && v.pcWindows.length <= 200 && v.pcWindows.every(id => id === null || WINDOWS_ERAS.some(w => w.id === id)))) &&
        metrics.every(n => n === undefined || (Number.isFinite(n) && n >= 0 && n <= 1e9)) &&
        v.version === 1 && Number.isFinite(v.totalMinutes) && Number.isFinite(v.cash) &&
        Number.isFinite(v.rng) && Number.isFinite(v.pricePerHour) &&
        v.inventory !== undefined && ["soda", "candy", "snacks"].every(k => Number.isFinite(v.inventory?.[k])) &&
        Array.isArray(v.customers) && v.customers.every(c => !!c &&
        (c.retailConsumption === undefined || (!!c.retailConsumption && !!productSpec(c.retailConsumption.product) && Number.isInteger(c.retailConsumption.untilMinute) && c.retailConsumption.untilMinute >= 0 && c.retailConsumption.untilMinute <= 1e9)) &&
        (c.desiredProduct === undefined || (!!productSpec(c.desiredProduct) && productSpec(c.desiredProduct).category === c.desiredItem)) &&
        [c.purchasedDrink, c.purchasedFood, c.gpuGamer, c.linuxEnthusiast, c.gpuGameCharged, c.discCopyChecked, c.printChecked, c.doorwayYielding, c.budgetAware].every(flag => flag === undefined || typeof flag === "boolean") &&
        (c.preference === undefined || ["economy", "comfort", "gaming", "quick"].includes(c.preference)) &&
        (c.preferredGpuGame === undefined || (c.gpuGamer === true && gpuGameSpec(c.preferredGpuGame) !== undefined)) &&
        (c.serviceRequest === undefined || c.serviceRequest === "printing" || c.serviceRequest === "disc-copy") &&
        (c.multiplayerVisitId === undefined || (Number.isInteger(c.multiplayerVisitId) && c.multiplayerVisitId > 0 && c.multiplayerVisitId <= v.nextCustomerId)) &&
        (c.nightMeetupDay === undefined || (v.nightMeetup !== undefined && c.nightMeetupDay === v.nightMeetup.fridayDay)) &&
        (c.multiplayerAssignedPc === undefined || (Number.isInteger(c.multiplayerAssignedPc) && c.multiplayerAssignedPc >= 0 && c.multiplayerAssignedPc < pcCount(v))) &&
        (c.ps1StationIndex === undefined || (Number.isInteger(c.ps1StationIndex) && c.ps1StationIndex >= 0 &&
            c.ps1StationIndex < (v.ps1Stations?.length ?? 0) && c.pcIndex === null)) &&
        (c.ps1SeatIndex === undefined || (c.ps1StationIndex !== undefined &&
            (c.ps1SeatIndex === 0 || (c.ps1SeatIndex === 1 && v.ps1Stations?.[c.ps1StationIndex]?.secondSeat === true)))) &&
        (c.nextCrowdRetryMinute === undefined || (Number.isInteger(c.nextCrowdRetryMinute) && c.nextCrowdRetryMinute >= 0 && c.nextCrowdRetryMinute <= 1e9)) &&
        (c.stalledMinutes === undefined || (Number.isInteger(c.stalledMinutes) && c.stalledMinutes >= 0 && c.stalledMinutes <= 120)) &&
        (c.retailQueueItem === undefined || ["soda", "candy", "snacks"].includes(c.retailQueueItem)) &&
        (c.retailQueueIndex === undefined || (Number.isInteger(c.retailQueueIndex) && c.retailQueueIndex >= 0 && c.retailQueueIndex < 14))) && Array.isArray(v.eventLog) &&
        Number.isInteger(v.internetTier) && Number.isInteger(v.expansionLevel) &&
        (v.energyAccrued === undefined || (Number.isFinite(v.energyAccrued) && v.energyAccrued >= 0)) &&
        (v.binFill === undefined || (Array.isArray(v.binFill) && v.binFill.length === 2 && v.binFill.every(n => Number.isFinite(n) && n >= 0 && n <= 100))) &&
        (v.overflowWaste === undefined || (Number.isFinite(v.overflowWaste) && v.overflowWaste >= 0 && v.overflowWaste <= 1000)) &&
        (v.mailScheduleSeed === undefined || (Number.isInteger(v.mailScheduleSeed) && v.mailScheduleSeed >= 0 && v.mailScheduleSeed <= 0xffffffff)) &&
        (v.mailStartDay === undefined || (Number.isInteger(v.mailStartDay) && v.mailStartDay >= 1 && v.mailStartDay <= GAME_END_DAY)) &&
        (v.y2kNoticeDelivered === undefined || typeof v.y2kNoticeDelivered === "boolean") &&
        (v.ericFirstMailDelivered === undefined || typeof v.ericFirstMailDelivered === "boolean") &&
        (v.ericSecondMailDelivered === undefined || typeof v.ericSecondMailDelivered === "boolean") &&
        (v.mailSeenIds === undefined || (Array.isArray(v.mailSeenIds) && v.mailSeenIds.length <= 8 &&
            new Set(v.mailSeenIds).size === v.mailSeenIds.length && v.mailSeenIds.every(id => isSporadicMailId(id)))) &&
        (v.storySeenIds === undefined || (Array.isArray(v.storySeenIds) && v.storySeenIds.length <= STORY_IDS.length &&
            new Set(v.storySeenIds).size === v.storySeenIds.length &&
            v.storySeenIds.every(id => STORY_IDS.some(key => key === id)))) &&
        (v.storyRecords === undefined || (Array.isArray(v.storyRecords) && v.storyRecords.length <= STORY_IDS.length + 4 &&
            new Set(v.storyRecords.map(r => r.id)).size === v.storyRecords.length &&
            v.storyRecords.every(r => !!r && CHAIN_IDS.some(id => id === r.id) &&
                typeof r.choice === "string" && r.choice.length <= 80 &&
                (r.choiceLabel === undefined || (typeof r.choiceLabel === "string" && r.choiceLabel.length <= 200)) &&
                ["good", "mixed", "bad"].includes(r.outcome) && ["pending", "awaiting", "ending", "done"].includes(r.stage) &&
                Number.isInteger(r.dueDay) && r.dueDay >= 1 && r.dueDay <= 1e7 &&
                (r.followupChoice === undefined || (typeof r.followupChoice === "string" && r.followupChoice.length <= 80)) &&
                (r.followupLabel === undefined || (typeof r.followupLabel === "string" && r.followupLabel.length <= 200)) &&
                (r.finalOutcome === undefined || ["good", "mixed", "bad"].includes(r.finalOutcome))))) &&
        (v.storyVisitorEffects === undefined || (Array.isArray(v.storyVisitorEffects) && v.storyVisitorEffects.length <= 32 &&
            v.storyVisitorEffects.every(e => !!e && typeof e.id === "string" && e.id.length <= 100 &&
                Number.isFinite(e.factor) && e.factor >= 0.5 && e.factor <= 1.5 &&
                Number.isInteger(e.untilDay) && e.untilDay >= 1 && e.untilDay <= 1e7))) &&
        (v.notices === undefined || (Array.isArray(v.notices) && v.notices.every(n => typeof n.id === "string" && typeof n.title === "string" && typeof n.body === "string" && typeof n.read === "boolean"))) &&
        [v.electricalInspectionSeen, v.electricalWiringRegularized, v.electricalExtensionUsed, v.electricalInspectionFineApplied]
            .every(flag => flag === undefined || typeof flag === "boolean") &&
        (v.electricalDeadlineDay === undefined || (Number.isInteger(v.electricalDeadlineDay) && v.electricalDeadlineDay >= 1 && v.electricalDeadlineDay <= 1e7)) &&
        (v.promotionDay === undefined || (Number.isInteger(v.promotionDay) && v.promotionDay >= 1 && v.promotionDay <= Math.floor(v.totalMinutes / DAY_MINUTES) + 1)) && validateObjectPlacements(v);
}
