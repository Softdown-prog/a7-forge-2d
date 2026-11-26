import { createPromotionStatusPort } from "../promotionStatusPort.js?v=b0ac0402a753";
import { createPricingInsightsPort } from "../pricingInsightsPort.js?v=b0ac0402a753";
import { createHourlyPriceStatusPort } from "../hourlyPriceStatusPort.js?v=b0ac0402a753";
import { createRetailPriceStatusPort } from "../retailPriceStatusPort.js?v=b0ac0402a753";
import { createDeskPricingPort } from "../deskPricingPort.js?v=b0ac0402a753";
import { createPricingPort } from "../pricingPort.js?v=b0ac0402a753";
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
