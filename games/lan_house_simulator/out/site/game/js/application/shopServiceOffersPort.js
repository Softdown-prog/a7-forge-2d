import { gameYear } from "../sim/era.js?v=c132abc69a79";
import { quotePrinter } from "../sim/printService.js?v=c132abc69a79";
import { quoteDiscCopier, DISC_COPIER_YEAR } from "../sim/discCopy.js?v=c132abc69a79";
import { shopPrice } from "../sim/shop.js?v=c132abc69a79";
export function createShopServiceOffersPort(getState) {
    return { snapshot(id) {
            const s = getState(), price = shopPrice(s, id);
            const quote = id === "printer" ? quotePrinter(s) : quoteDiscCopier(s);
            const text = id === "printer" ?
                s.printer ? "Adquirida · serviço ativo" : s.cash < price ? "Caixa insuficiente · R$ " + price : "Comprar · R$ " + price :
                s.discCopier ? "Adquirida · serviço ativo" : gameYear(s) < DISC_COPIER_YEAR ? "🔒 Disponível em 2001" :
                    s.cash < price ? "Caixa insuficiente · R$ " + price : "Comprar · R$ " + price;
            return { disabled: !quote.ok, title: quote.message, text };
        } };
}
