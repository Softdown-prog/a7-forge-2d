const HIDDEN_SECTION = ".admin-section[hidden],.management-page[hidden]";
export function createVisibleAdminTextWriter(doc) {
    return (id, value) => {
        const node = doc.getElementById(id);
        if (node && !node.closest(HIDDEN_SECTION) && node.textContent !== value)
            node.textContent = value;
    };
}
export function formatAdminMoney(amount) {
    return "R$ " + amount.toLocaleString("pt-BR");
}
export function renderAdminWindowVisibility(admin, open) {
    admin.hidden = !open;
}
export function renderShopWindowVisibility(shop, open, doc) {
    if (shop)
        shop.hidden = !open;
    const button = doc.querySelector("#open-shop");
    if (button)
        button.setAttribute("aria-expanded", String(open));
}
export function renderAdminDisclosure(controls, open) {
    controls.setAttribute("aria-expanded", String(open));
}
