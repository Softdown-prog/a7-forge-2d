import { createPs1ActionsPort } from "../ps1ActionsPort.js?v=b0ac0402a753";
import { createPs2Port } from "../ps2Port.js?v=b0ac0402a753";
import { createPs1AdminPort } from "../ps1AdminPort.js?v=b0ac0402a753";
import { createPs1ShopDiscPort } from "../ps1ShopDiscPort.js?v=b0ac0402a753";
import { createPs1ShopPlacementPort } from "../ps1ShopPlacementPort.js?v=b0ac0402a753";
import { createPs1ShopOfferPort } from "../ps1ShopOfferPort.js?v=b0ac0402a753";
/** Every adapter receives the same live getter: save replacements are immediately visible. */
export function createConsolePorts(getState) {
    return {
        ps1Actions: createPs1ActionsPort(getState),
        ps2Port: createPs2Port(getState),
        ps1AdminPort: createPs1AdminPort(getState),
        ps1ShopDiscPort: createPs1ShopDiscPort(getState),
        ps1ShopPlacementPort: createPs1ShopPlacementPort(getState),
        ps1ShopOfferPort: createPs1ShopOfferPort(getState)
    };
}
