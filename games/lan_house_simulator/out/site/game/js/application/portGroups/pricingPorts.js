import { createPromotionStatusPort } from "../promotionStatusPort.js?v=88374e228e86";
import { createPricingInsightsPort } from "../pricingInsightsPort.js?v=88374e228e86";
import { createHourlyPriceStatusPort } from "../hourlyPriceStatusPort.js?v=88374e228e86";
import { createRetailPriceStatusPort } from "../retailPriceStatusPort.js?v=88374e228e86";
import { createDeskPricingPort } from "../deskPricingPort.js?v=88374e228e86";
import { createPricingPort } from "../pricingPort.js?v=88374e228e86";
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
