import { renderHourlyPriceStatus, renderSessionPackages } from "./hourlyPriceStatusPanel.js?v=1426089a9f9b";
import { renderHourlyPricingInsights, renderEnergyYearOutlook } from "./pricingInsightsPanel.js?v=1426089a9f9b";
import { renderRetailPriceControls } from "./retailPriceControlsPanel.js?v=1426089a9f9b";
export function renderAdminPricingSections(options) {
    renderHourlyPriceStatus(options.hourly, options.setText, options.doc);
    const durations = options.doc.getElementById("session-package-prices");
    if (durations && options.pricingTab && options.active("hourly") && options.packagesChanged())
        renderSessionPackages(options.hourly.packages, durations, options.doc);
    if (options.pricingTab && options.active("insights"))
        renderHourlyPricingInsights(options.insights.hourly(), options.setText);
    renderEnergyYearOutlook(options.insights.energy(), options.setText);
    if (options.retailControls && options.pricingTab && options.active("retail") && options.retailChanged())
        renderRetailPriceControls(options.retailControls, options.retail.snapshot(), options.iconMarkup, options.doc, options.sync);
}
