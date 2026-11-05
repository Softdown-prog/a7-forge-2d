import { linuxDay } from "../sim/linuxQuest.js?v=a7a149bb38f1";
export function createNoticeInboxRevisionPort(getState) {
    return { snapshot() {
            const s = getState();
            return [s.cash, s.notices, s.contentFilterInstalled, s.pcWindowsLicenses, s.licensedGames,
                s.electricalDeadlineDay, s.electricalInspectionFineApplied, s.linuxResearchStartedDay, s.linuxMailSeenIds,
                s.pcOperatingSystems, s.linuxMagazineSubscriptionDay, s.linuxMagazineIssuesReceived,
                s.linuxMagazineLastDeliveryDay, linuxDay(s)];
        } };
}
