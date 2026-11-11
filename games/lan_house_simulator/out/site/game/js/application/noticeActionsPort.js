import { chooseDecision } from "../sim/decisions.js?v=1507cb2cfb2d";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=1507cb2cfb2d";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=1507cb2cfb2d";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
