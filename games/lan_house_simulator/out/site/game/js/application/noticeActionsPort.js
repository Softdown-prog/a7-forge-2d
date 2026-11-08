import { chooseDecision } from "../sim/decisions.js?v=02e5c3e2bfd0";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=02e5c3e2bfd0";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=02e5c3e2bfd0";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
