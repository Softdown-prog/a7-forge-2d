import { chooseDecision } from "../sim/decisions.js?v=c416c21ccd84";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=c416c21ccd84";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=c416c21ccd84";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
