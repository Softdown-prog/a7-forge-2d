import { chooseDecision } from "../sim/decisions.js?v=88374e228e86";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=88374e228e86";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=88374e228e86";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
