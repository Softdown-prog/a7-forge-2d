import { createPromotionStatusPort } from "../promotionStatusPort.js?v=f36771daf749";
import { createPricingInsightsPort } from "../pricingInsightsPort.js?v=f36771daf749";
import { createHourlyPriceStatusPort } from "../hourlyPriceStatusPort.js?v=f36771daf749";
import { createRetailPriceStatusPort } from "../retailPriceStatusPort.js?v=f36771daf749";
import { createDeskPricingPort } from "../deskPricingPort.js?v=f36771daf749";
import { createPricingPort } from "../pricingPort.js?v=f36771daf749";
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
