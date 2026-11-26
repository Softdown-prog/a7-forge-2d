import { chooseDecision } from "../sim/decisions.js?v=b715623ba9fb";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=b715623ba9fb";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=b715623ba9fb";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
