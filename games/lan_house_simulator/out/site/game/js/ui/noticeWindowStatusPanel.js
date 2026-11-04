export function renderNoticeWindowStatus(view, doc) {
    const mailbox = doc.getElementById("notices");
    if (mailbox)
        mailbox.hidden = view.windowHidden;
    const badge = doc.getElementById("notices-count");
    if (badge) {
        badge.hidden = view.badgeHidden;
        badge.textContent = view.badgeText;
    }
    doc.getElementById("open-notices")?.setAttribute("aria-expanded", view.expanded);
}
