import { createPromotionStatusPort } from "../promotionStatusPort.js?v=e74c7026ec87";
import { createPricingInsightsPort } from "../pricingInsightsPort.js?v=e74c7026ec87";
import { createHourlyPriceStatusPort } from "../hourlyPriceStatusPort.js?v=e74c7026ec87";
import { createRetailPriceStatusPort } from "../retailPriceStatusPort.js?v=e74c7026ec87";
import { createDeskPricingPort } from "../deskPricingPort.js?v=e74c7026ec87";
import { createPricingPort } from "../pricingPort.js?v=e74c7026ec87";
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
