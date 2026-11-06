import { productPrice } from "../sim/economy.js?v=b612b1779b4d";
const PRODUCTS = [
    { id: "soda", label: "Refrigerante" },
    { id: "candy", label: "Doce" },
    { id: "snacks", label: "Salgadinho" }
];
export function createRetailPriceStatusPort(getState) {
    const money = (n) => "R$ " + n.toLocaleString("pt-BR");
    return { snapshot() {
            const game = getState();
            return PRODUCTS.map(({ id, label }) => {
                const price = productPrice(game, id);
                return {
                    id, label, priceText: money(price),
                    decreaseDisabled: price <= 1,
                    increaseDisabled: price >= 40
                };
            });
        } };
}
