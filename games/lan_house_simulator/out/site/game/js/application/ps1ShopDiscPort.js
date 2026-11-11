import { gameYear } from "../sim/era.js?v=1507cb2cfb2d";
import { topGamesCanBuy } from "../sim/topGamesUnlockGate.js?v=1507cb2cfb2d";
import { PS1_MAX_STATIONS, PS1_UNLOCK_YEAR, PS1_CD_CATALOG, ps1ReleasedDiscs, ps1DiscCopies, ps1DiscPrice } from "../sim/ps1.js?v=1507cb2cfb2d";
/** Shows the next yearly milestone without exposing unreleased titles or changing saves. */
export function nextPs1DiscReleaseYear(rows) {
    if (!rows?.length)
        return null;
    const last = rows[rows.length - 1].releaseYear;
    return PS1_CD_CATALOG.find(d => d.releaseYear > last)?.releaseYear ?? null;
}
export function createPs1ShopDiscPort(getState) {
    return { snapshot() {
            const game = getState();
            if (game.economyVersion !== 2 || gameYear(game) < PS1_UNLOCK_YEAR)
                return null;
            return ps1ReleasedDiscs(gameYear(game)).map(disc => {
                const copies = ps1DiscCopies(game, disc.id), price = ps1DiscPrice(game, disc.id);
                const noStation = !(game.ps1Stations?.length), full = copies >= PS1_MAX_STATIONS;
                const magazineLocked = !topGamesCanBuy(game, "ps1", disc.id, copies);
                return {
                    id: disc.id, title: disc.title, releaseYear: disc.releaseYear, genre: disc.genre, copies, price, noStation, full, magazineLocked,
                    disabled: noStation || full || magazineLocked || game.cash < price
                };
            });
        } };
}
