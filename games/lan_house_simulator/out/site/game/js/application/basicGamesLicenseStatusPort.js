import { basicGamesLicenseCost } from "../sim/economy.js?v=a7a149bb38f1";
export function createBasicGamesLicenseStatusPort(getState) {
    return { snapshot() {
            const game = getState(), fee = basicGamesLicenseCost(game);
            const price = fee.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            return {
                fee,
                statusLabel: game.licensedGames ?
                    "Jogos regularizados · licença permanente, sem renovação anual." :
                    "Catálogo sem regularização — risco de multa. Taxa única: " + price + ".",
                buttonHidden: game.licensedGames,
                buttonDisabled: game.cash < fee,
                buttonLabel: "Regularizar jogos · " + price
            };
        } };
}
