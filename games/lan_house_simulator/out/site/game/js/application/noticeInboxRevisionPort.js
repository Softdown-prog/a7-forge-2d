import { linuxDay } from "../sim/linuxQuest.js?v=345c7fc7b8be";
export function createNoticeInboxRevisionPort(getState) {
    return { snapshot() {
            const s = getState();
            return [s.cash, s.notices, s.contentFilterInstalled, s.pcWindowsLicenses, s.licensedGames,
                s.electricalDeadlineDay, s.electricalInspectionFineApplied, s.linuxResearchStartedDay, s.linuxMailSeenIds,
                s.pcOperatingSystems, s.linuxMagazineSubscriptionDay, s.linuxMagazineIssuesReceived,
                s.linuxMagazineLastDeliveryDay, linuxDay(s)];
        } };
}
