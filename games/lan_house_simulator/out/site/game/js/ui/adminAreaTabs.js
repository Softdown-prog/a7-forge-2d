export function createAdminAreaTabs(admin, selectArea, onChange) {
    // Preserve the stable nodes and event listeners mounted in the original bootstrap.
    const tabs = Array.from(admin.querySelectorAll("[data-admin-tab]"));
    const sections = Array.from(admin.querySelectorAll("[data-section]"));
    let selectedArea = null;
    function activate(area) {
        selectArea(area);
        for (const button of tabs) {
            const active = button.dataset.adminTab === area;
            button.classList.toggle("active", active);
            button.setAttribute("aria-selected", String(active));
            button.tabIndex = active ? 0 : -1;
        }
        for (const section of sections)
            section.hidden = section.dataset.section !== area;
        if (selectedArea !== area) {
            selectedArea = area;
            // Browsers have an ownerDocument; minimal DOM test doubles need not.
            const doc = admin.ownerDocument;
            if (doc && typeof doc.dispatchEvent === "function" && typeof CustomEvent === "function")
                doc.dispatchEvent(new CustomEvent('lhs:admin-area-selected', { detail: { area } }));
        }
    }
    for (const button of tabs)
        button.addEventListener("click", () => {
            activate(button.dataset.adminTab ?? "prices");
            admin.scrollTop = 0;
            onChange();
        });
    return { activate };
}
