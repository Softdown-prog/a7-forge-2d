import { chooseDecision } from "../sim/decisions.js?v=fa1ff35e3337";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=fa1ff35e3337";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=fa1ff35e3337";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
