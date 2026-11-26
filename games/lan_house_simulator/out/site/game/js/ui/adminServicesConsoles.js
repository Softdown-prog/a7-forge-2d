import { renderPs1AdminPanel } from "./ps1AdminPanel.js?v=b0ac0402a753";
import { renderStaffStatusPanel } from "./staffStatusPanel.js?v=b0ac0402a753";
import { renderServiceAccessStatus } from "./serviceAccessStatusPanel.js?v=b0ac0402a753";
export function renderAdminServicesConsoles(options) {
    if (options.consolesTab)
        renderPs1AdminPanel(options.ps1, {
            showStations: options.showPs1Stations(),
            setText: options.setText,
            money: options.money
        });
    if (options.servicesTab) {
        renderStaffStatusPanel(options.staff.snapshot(), options.setText, options.doc);
        if (options.showServiceAccess())
            renderServiceAccessStatus(options.accessSnapshot(), options.setText, options.doc);
    }
}
