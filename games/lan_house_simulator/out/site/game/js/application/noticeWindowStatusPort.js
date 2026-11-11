import { unreadNotices } from "../sim/notices.js?v=1507cb2cfb2d";
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
