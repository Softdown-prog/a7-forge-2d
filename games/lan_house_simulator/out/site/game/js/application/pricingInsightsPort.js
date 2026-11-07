import { hourlyPriceInsight, hourlyPriceScenarios, energyYearOutlook } from "../sim/pricingInsights.js?v=7be61a7f1436";
import { allowableHourlyPrice } from "../sim/historicalEconomy.js?v=7be61a7f1436";
export function createPricingInsightsPort(getState) {
    return {
        hourly() {
            const game = getState();
            const historical = game.economyVersion === 2;
            const max = allowableHourlyPrice(game);
            const inReais = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            const insight = hourlyPriceInsight(game);
            const scenarios = hourlyPriceScenarios(game);
            const scenarioLine = (delta, title) => {
                const candidate = scenarios.find(p => p.delta === delta);
                return candidate ? title + " · R$ " + (historical ? candidate.price.toFixed(2) : String(candidate.price)) +
                    "/h · procura " + candidate.demandIndex + "% · receita bruta potencial " + candidate.grossIntakeIndex + "%" :
                    title + " · fora do teto de " + inReais(max) + "/h.";
            };
            return {
                demand: "Procura relativa pelo modelo: " +
                    (insight.relativeDemandPercent === 0 ? "menos de 1%" : insight.relativeDemandPercent + "%") +
                    " (R$ 12/h = 100%).",
                satisfaction: "Avaliação estimada em PC básico, sem espera ou queda: " + insight.assessment + ".",
                caution: insight.caution,
                lower: historical ? scenarioLine(-.5, "Reduzir R$ 0,50") : scenarioLine(-2, "Reduzir R$ 2"),
                current: scenarioLine(0, "Manter"),
                higher: historical ? scenarioLine(.5, "Aumentar R$ 0,50") : scenarioLine(2, "Aumentar R$ 2")
            };
        },
        energy() {
            const game = getState();
            const historical = game.economyVersion === 2;
            const outlook = energyYearOutlook(game);
            const change = (outlook.changePercent > 0 ? "+" : "") + outlook.changePercent.toLocaleString("pt-BR");
            return {
                label: historical ?
                    "IPCA na virada " + outlook.currentYear + " → " + outlook.nextYear +
                        ": " + change +
                        "% aplicado ao custo energético e às demais contas indexadas, mantendo as máquinas iguais." :
                    "Energia na virada " + outlook.currentYear + " → " + outlook.nextYear +
                        ": " + change +
                        "% de tarifa, mantendo os mesmos PCs e a carga ociosa. Demais contas fixas não recebem inflação automática."
            };
        }
    };
}
