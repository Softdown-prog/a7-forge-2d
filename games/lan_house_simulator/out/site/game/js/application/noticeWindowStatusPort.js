import { unreadNotices } from "../sim/notices.js?v=a7a149bb38f1";
export function createNoticeWindowStatusPort(getState) {
    return { snapshot(open) {
            const unread = unreadNotices(getState());
            return {
                unread,
                badgeHidden: unread === 0,
                badgeText: String(unread),
                windowHidden: !open,
                expanded: String(open)
            };
        } };
}
