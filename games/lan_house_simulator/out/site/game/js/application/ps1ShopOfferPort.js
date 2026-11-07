import { gameYear } from "../sim/era.js?v=7be61a7f1436";
import { PS1_UNLOCK_YEAR, PS1_MAX_STATIONS, ps1PlacementSlots } from "../sim/ps1.js?v=7be61a7f1436";
import { shopPrice } from "../sim/shop.js?v=7be61a7f1436";
export function createPs1ShopOfferPort(getState) {
    return { snapshot() {
            const s = getState();
            const price = shopPrice(s, "ps1");
            const locked = s.economyVersion !== 2 || gameYear(s) < PS1_UNLOCK_YEAR;
            const full = (s.ps1Stations?.length ?? 0) >= PS1_MAX_STATIONS || !ps1PlacementSlots(s).length;
            const poor = s.cash < price;
            return {
                disabled: locked || full || poor,
                text: locked ? "🔒 Disponível em 2002" : full ? "Sem espaço livre" :
                    poor ? "Caixa insuficiente · R$ " + price : "Comprar conjunto · R$ " + price
            };
        } };
}
