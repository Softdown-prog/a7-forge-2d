import { gameYear } from "../sim/era.js?v=c12101473308";
import { annualHourlyCeiling, allowableHourlyPrice, priceIndex, ipcaLastYear, SESSION_PACKAGES, sessionPrice, MIN_HOURLY_PRICE } from "../sim/historicalEconomy.js?v=c12101473308";
export function createHourlyPriceStatusPort(getState) {
    const currency = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return { snapshot() {
            const game = getState();
            const historical = game.economyVersion === 2;
            const year = gameYear(game);
            const marketMax = annualHourlyCeiling(year);
            const max = allowableHourlyPrice(game);
            const price = game.pricePerHour;
            const lastYear = ipcaLastYear(year);
            const packages = (historical ? SESSION_PACKAGES : [30, 45, 60, 90]).map(min => (min < 60 ? min + " minutos" : Number(min / 60).toLocaleString("pt-BR") + " h") +
                " — " + currency(sessionPrice(price, min)));
            return {
                priceLabel: currency(price) + "/h",
                historical,
                yearCeiling: historical ?
                    year + " · teto nominal da época " + currency(marketMax) + "/h" :
                    "Modo clássico: tarifa histórica disponível apenas em novas partidas.",
                equipmentCeiling: historical ?
                    "Máquinas e Windows instalados: até " + currency(max) + "/h. Modernizar pode liberar uma tarifa maior." :
                    "Esta partida conserva a economia anterior e seus preços.",
                inflation: historical ?
                    "IPCA anual aplicado aos custos fixos, energia e atacado. Índice acumulado desde 1998: " +
                        ((priceIndex(year) - 1) * 100).toFixed(1) + "%" + (lastYear !== null ?
                        " · variação do ano anterior " + lastYear.toFixed(2) + "%." : " · último ano sem dado oficial: congelado.") :
                    "Partida clássica: inflação antiga de energia (+3% ao ano); sem indexação do IPCA.",
                decreaseDisabled: price - (historical ? .5 : 2) < (historical ? MIN_HOURLY_PRICE : 4),
                increaseDisabled: price + (historical ? .5 : 2) > max,
                packages
            };
        } };
}
