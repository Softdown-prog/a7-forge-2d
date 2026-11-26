import { chooseDecision } from "../sim/decisions.js?v=b0980822919c";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=b0980822919c";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=b0980822919c";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
