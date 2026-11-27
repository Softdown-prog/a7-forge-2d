import { createPromotionStatusPort } from "../promotionStatusPort.js?v=6833c3e7603d";
import { createPricingInsightsPort } from "../pricingInsightsPort.js?v=6833c3e7603d";
import { createHourlyPriceStatusPort } from "../hourlyPriceStatusPort.js?v=6833c3e7603d";
import { createRetailPriceStatusPort } from "../retailPriceStatusPort.js?v=6833c3e7603d";
import { createDeskPricingPort } from "../deskPricingPort.js?v=6833c3e7603d";
import { createPricingPort } from "../pricingPort.js?v=6833c3e7603d";
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
