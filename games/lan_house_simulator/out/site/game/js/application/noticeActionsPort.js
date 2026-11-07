import { chooseDecision } from "../sim/decisions.js?v=bc8308e69cfd";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=bc8308e69cfd";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=bc8308e69cfd";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
