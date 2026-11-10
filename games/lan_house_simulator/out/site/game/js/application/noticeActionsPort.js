import { chooseDecision } from "../sim/decisions.js?v=345c7fc7b8be";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=345c7fc7b8be";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=345c7fc7b8be";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
