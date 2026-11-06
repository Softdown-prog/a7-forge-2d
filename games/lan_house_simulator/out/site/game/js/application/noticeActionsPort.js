import { chooseDecision } from "../sim/decisions.js?v=80953abaf40f";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=80953abaf40f";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=80953abaf40f";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
