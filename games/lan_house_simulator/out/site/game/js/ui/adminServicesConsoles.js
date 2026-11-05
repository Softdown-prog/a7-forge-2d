import { renderPs1AdminPanel } from "./ps1AdminPanel.js?v=a7a149bb38f1";
import { renderStaffStatusPanel } from "./staffStatusPanel.js?v=a7a149bb38f1";
import { renderServiceAccessStatus } from "./serviceAccessStatusPanel.js?v=a7a149bb38f1";
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
