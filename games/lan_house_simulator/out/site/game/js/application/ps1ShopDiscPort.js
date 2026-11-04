import { gameYear } from "../sim/era.js?v=fa1ff35e3337";
import { PS1_CD_CATALOG, PS1_MAX_STATIONS, PS1_UNLOCK_YEAR, ps1DiscCopies, ps1DiscPrice } from "../sim/ps1.js?v=fa1ff35e3337";
export function createPs1ShopDiscPort(getState) {
    return { snapshot() {
            const game = getState();
            if (game.economyVersion !== 2 || gameYear(game) < PS1_UNLOCK_YEAR)
                return null;
            return PS1_CD_CATALOG.map(disc => {
                const copies = ps1DiscCopies(game, disc.id), price = ps1DiscPrice(game, disc.id);
                const noStation = !(game.ps1Stations?.length), full = copies >= PS1_MAX_STATIONS;
                return {
                    id: disc.id, title: disc.title, genre: disc.genre, copies, price, noStation, full,
                    disabled: noStation || full || game.cash < price
                };
            });
        } };
}
