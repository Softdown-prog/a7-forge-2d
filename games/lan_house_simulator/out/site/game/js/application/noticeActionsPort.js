import { chooseDecision } from "../sim/decisions.js?v=b0ac0402a753";
import { readNotice, hireContentProgrammer, reviewNotices } from "../sim/notices.js?v=b0ac0402a753";
import { startLinuxResearch } from "../sim/linuxQuest.js?v=b0ac0402a753";
export function createNoticeActionsPort(getState) {
    return {
        review() { reviewNotices(getState()); },
        choose(id, choice) { return chooseDecision(getState(), id, choice); },
        markRead(id) { return readNotice(getState(), id); },
        hireProgrammer() { return hireContentProgrammer(getState()); },
        startLinux() { return startLinuxResearch(getState()); }
    };
}
