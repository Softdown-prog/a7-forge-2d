import { createPromotionStatusPort } from "../promotionStatusPort.js?v=b715623ba9fb";
import { createPricingInsightsPort } from "../pricingInsightsPort.js?v=b715623ba9fb";
import { createHourlyPriceStatusPort } from "../hourlyPriceStatusPort.js?v=b715623ba9fb";
import { createRetailPriceStatusPort } from "../retailPriceStatusPort.js?v=b715623ba9fb";
import { createDeskPricingPort } from "../deskPricingPort.js?v=b715623ba9fb";
import { createPricingPort } from "../pricingPort.js?v=b715623ba9fb";
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
