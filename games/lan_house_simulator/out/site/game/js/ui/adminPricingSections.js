import { renderHourlyPriceStatus, renderSessionPackages } from "./hourlyPriceStatusPanel.js?v=5a84ef5bc1ea";
import { renderHourlyPricingInsights, renderEnergyYearOutlook } from "./pricingInsightsPanel.js?v=5a84ef5bc1ea";
import { renderRetailPriceControls } from "./retailPriceControlsPanel.js?v=5a84ef5bc1ea";
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
