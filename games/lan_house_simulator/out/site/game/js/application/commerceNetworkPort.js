import { supplierLevel, wholesaleCost } from "../sim/economy.js?v=0bd19d58dac2";
import { online } from "../sim/engine.js?v=0bd19d58dac2";
import { gameYear, INTERNET_ERAS } from "../sim/era.js?v=0bd19d58dac2";
export function createCommerceNetworkPort(getState) {
    return { snapshot() {
            const game = getState();
            const supplierPartner = supplierLevel(game) === 2;
            const connected = online(game);
            const year = gameYear(game);
            const currentName = INTERNET_ERAS[game.internetTier - 1]?.name ?? "Desconhecida";
            const next = INTERNET_ERAS[game.internetTier];
            const upgradeCost = 250 * game.internetTier;
            return {
                supplierStatus: supplierPartner ?
                    "Fornecedor parceiro · 20% de desconto nos novos lotes" :
                    "Fornecedor básico · preços de atacado normais",
                supplierUpgradeDisabled: supplierPartner,
                stockSoda: " + Bebidas R$ " + wholesaleCost(game, "soda"),
                stockCandy: "+ Doces R$ " + wholesaleCost(game, "candy"),
                stockSnacks: "+ Salgados R$ " + wholesaleCost(game, "snacks"),
                internetStatus: currentName + " · Nível " + game.internetTier +
                    (connected ? " · Online" : " · Sem conexão até " + (game.offlineUntil - game.totalMinutes) + " min de jogo"),
                internetUpgradeDisabled: !next || year < next.year || game.cash < upgradeCost,
                internetUpgradeLabel: !next ? "Internet no nível máximo" :
                    next.name + " · " + (year < next.year ? "🔒 Disponível em " + next.year : "R$ " + upgradeCost),
                internetRepairDisabled: connected,
                internetRepairLabel: "Chamar técnico · R$ " + (75 + 25 * (game.internetTier - 1))
            };
        } };
}
