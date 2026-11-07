import { linuxDay } from "../sim/linuxQuest.js?v=7be61a7f1436";
export function createNoticeInboxRevisionPort(getState) {
    return { snapshot() {
            const s = getState();
            return [s.cash, s.notices, s.contentFilterInstalled, s.pcWindowsLicenses, s.licensedGames,
                s.electricalDeadlineDay, s.electricalInspectionFineApplied, s.linuxResearchStartedDay, s.linuxMailSeenIds,
                s.pcOperatingSystems, s.linuxMagazineSubscriptionDay, s.linuxMagazineIssuesReceived,
                s.linuxMagazineLastDeliveryDay, linuxDay(s)];
        } };
}
