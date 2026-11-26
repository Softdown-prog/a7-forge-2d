import { createPromotionStatusPort } from "../promotionStatusPort.js?v=b0980822919c";
import { createPricingInsightsPort } from "../pricingInsightsPort.js?v=b0980822919c";
import { createHourlyPriceStatusPort } from "../hourlyPriceStatusPort.js?v=b0980822919c";
import { createRetailPriceStatusPort } from "../retailPriceStatusPort.js?v=b0980822919c";
import { createDeskPricingPort } from "../deskPricingPort.js?v=b0980822919c";
import { createPricingPort } from "../pricingPort.js?v=b0980822919c";
/** Compose both commands and projections without capturing a particular save. */
export function createPricingPorts(getState) {
    return {
        promotionStatusPort: createPromotionStatusPort(getState),
        pricingInsightsPort: createPricingInsightsPort(getState),
        hourlyPriceStatusPort: createHourlyPriceStatusPort(getState),
        retailPriceStatusPort: createRetailPriceStatusPort(getState),
        deskPricingPort: createDeskPricingPort(getState),
        pricingPort: createPricingPort(getState)
    };
}
