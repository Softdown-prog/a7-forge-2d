import { PRODUCTS, SUPPLIERS, availableProducts, merchandiseStock, merchandisePrice, averageProductCost, orderMerchandise, setMerchandisePrice, quoteOrder, productSpec, productQuality } from "../sim/merchandise.js?v=fa1ff35e3337";
import { yearFromMinutes } from "../sim/historicalEconomy.js?v=fa1ff35e3337";
const suppliers = SUPPLIERS.map(({ id, name, description, minPacks }) => ({ id, name, description, minPacks }));
export function createMerchandisePort(getState) {
    return {
        suppliers,
        overview(category) {
            const s = getState(), year = yearFromMinutes(s.totalMinutes);
            const products = availableProducts(s).filter(p => p.category === category).map(p => ({ id: p.id, name: p.name }));
            const next = PRODUCTS.find(p => p.category === category && p.year > year);
            return { year, products, next: next ? { id: next.id, name: next.name, year: next.year } : null };
        },
        details(id, supplierId, packs) {
            const s = getState(), p = productSpec(id), supplier = SUPPLIERS.find(sp => sp.id === supplierId);
            if (!p || p.year > yearFromMinutes(s.totalMinutes) || !supplier)
                return null;
            const productId = p.id, account = s.merchandise?.products[productId];
            const price = merchandisePrice(s, productId), averageCost = averageProductCost(s, productId);
            const validPacks = Number.isInteger(packs) && packs >= supplier.minPacks && packs <= 50;
            const orderCost = validPacks ? quoteOrder(s, productId, supplier.id, packs) : quoteOrder(s, productId, supplier.id, 0);
            return {
                pack: p.pack, stock: merchandiseStock(s, productId),
                qualityPercent: Math.round(productQuality(s, productId) * 100),
                price, averageCost, sold: account?.sold ?? 0, revenue: account?.revenue ?? 0,
                costOfSales: account?.costOfSales ?? 0, cash: s.cash,
                priceMin: s.economyVersion === 2 ? "0.25" : "1", priceMax: s.economyVersion === 2 ? "100" : "40",
                priceStep: s.economyVersion === 2 ? "0.01" : "1", priceDecimals: s.economyVersion === 2 ? 2 : 0,
                quotes: SUPPLIERS.map(sp => ({ name: sp.name, costPerUnit: quoteOrder(s, productId, sp.id) / p.pack })),
                orderQuantity: validPacks ? packs * p.pack : 0, orderCost,
                canOrder: validPacks && s.cash >= orderCost && (supplier.id !== "partner" || s.supplierTier === 2),
                orders: (s.merchandise?.orders ?? []).map(o => ({
                    id: o.id, productName: productSpec(o.product)?.name ?? o.product, quantity: o.quantity, cost: o.cost,
                    minutesRemaining: Math.max(0, o.dueMinute - s.totalMinutes), dueDay: Math.floor(o.dueMinute / 720) + 1
                }))
            };
        },
        setPrice(id, price) {
            const p = productSpec(id);
            if (!p)
                return { ok: false, message: "Mercadoria inexistente." };
            return setMerchandisePrice(getState(), p.id, price);
        },
        order(id, supplierId, packs) {
            const p = productSpec(id), supplier = SUPPLIERS.find(sp => sp.id === supplierId);
            if (!p || !supplier)
                return { ok: false, message: "Mercadoria ou fornecedor inválido." };
            return orderMerchandise(getState(), p.id, supplier.id, packs);
        }
    };
}
