import { chooseDecision } from "../sim/decisions.js?v=7be61a7f1436";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=7be61a7f1436";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=7be61a7f1436";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
