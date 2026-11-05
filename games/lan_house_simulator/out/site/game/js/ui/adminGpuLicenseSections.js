import { renderGpuCatalogPanel } from "./gpuCatalogPanel.js?v=a7a149bb38f1";
import { renderBasicGamesLicenseStatus } from "./basicGamesLicenseStatusPanel.js?v=a7a149bb38f1";
import { renderWindowsLicensePanel } from "./windowsLicensePanel.js?v=a7a149bb38f1";
import { renderClassicGamesCatalog } from "./classicGamesCatalogPanel.js?v=a7a149bb38f1";
import { renderGpuGamesCatalog } from "./gpuGamesCatalogPanel.js?v=a7a149bb38f1";
import { refreshGpuDownloadMeters } from "./gpuDownloadMeters.js?v=a7a149bb38f1";
export function renderAdminGpuLicenseSections(options) {
    if (options.gpuPcChoice && options.gpuList && options.adminOpen && options.gpuTab && options.gpuChanged())
        renderGpuCatalogPanel(options.gpuPcChoice, options.gpuList, options.gpuCatalog.snapshot(options.selectedGpuIndex()), options.setText, options.doc, options.sync);
    renderBasicGamesLicenseStatus(options.basicGames.snapshot(), options.setText, options.doc);
    if (options.licensePanel && options.adminOpen && options.licensesTab && options.licensePageActive("windows") && options.windowsChanged())
        renderWindowsLicensePanel(options.licensePanel, options.windows);
    if (options.eraGamePanel && options.adminOpen && options.licensesTab && options.licensePageActive("classic") && options.classicChanged())
        renderClassicGamesCatalog(options.eraGamePanel, options.classic.snapshot(), options.doc, options.sync);
    if (options.gpuGamePanel && options.adminOpen && options.licensesTab && options.licensePageActive("gpu") && options.gpuGamesChanged())
        renderGpuGamesCatalog(options.gpuGamePanel, options.gpuGames.snapshot(), options.doc, options.sync);
    refreshGpuDownloadMeters(options.gpuGamePanel, options.adminOpen && options.licensesTab && options.licensePageActive("gpu"), options.downloads);
}
