import { renderPs1AdminPanel } from "./ps1AdminPanel.js?v=1426089a9f9b";
import { renderStaffStatusPanel } from "./staffStatusPanel.js?v=1426089a9f9b";
import { renderServiceAccessStatus } from "./serviceAccessStatusPanel.js?v=1426089a9f9b";
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
