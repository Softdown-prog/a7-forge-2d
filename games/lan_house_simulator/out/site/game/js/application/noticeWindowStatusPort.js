import { unreadNotices } from "../sim/notices.js?v=7d5a5079cdfa";
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
