/** Read-only PS1/PS2 projections; all purchase rules remain in the game ports. */
import { nextPs1DiscReleaseYear } from "../application/ps1ShopDiscPort.js?v=80953abaf40f";
import { ps1ProceduralCover } from "./ps1CoverArt.js?v=80953abaf40f";
import { ps2ProceduralCover } from "./ps2CoverArt.js?v=80953abaf40f";
const money = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function projectPs1Disc(row) {
    const price = money(row.price);
    return { id: row.id, title: row.title, genre: row.genre, copies: row.copies, releaseYear: row.releaseYear,
        buttonText: row.noStation ? "Instale uma bancada primeiro" : row.full ? "Acervo completo" :
            row.disabled ? "Caixa insuficiente · " + price : "Comprar CD · " + price,
        disabled: row.disabled, cover: ps1ProceduralCover(row) };
}
export function projectPs2Game(row) {
    return { id: row.id, title: row.title, genre: row.genre, copies: row.copies, releaseYear: row.releaseYear,
        buttonText: row.buyText + " · " + money(row.price), disabled: row.disabled, cover: ps2ProceduralCover(row) };
}
export function projectConsoleShop(ps1, slots, selected, discs, ps2, artworkPs1, artworkPs2) {
    return {
        ps1: { offerText: ps1.text, offerDisabled: ps1.disabled, slots,
            selected: slots.some(s => s.id === selected) ? selected : slots[0]?.id ?? null,
            artwork: artworkPs1, nextReleaseYear: nextPs1DiscReleaseYear(discs),
            discs: discs?.map(projectPs1Disc) ?? null },
        ps2: { benchText: ps2 ? ps2.benchText + " · " + money(ps2.benchPrice) : "PS2 indisponível",
            benchDisabled: ps2?.benchDisabled ?? true, slots: ps2?.slots ?? [],
            games: ps2?.games.map(projectPs2Game) ?? [], artwork: artworkPs2,
            nextReleaseYear: ps2?.nextReleaseYear ?? null }
    };
}
export function publishAngularConsoleShop(doc, view) {
    if (typeof doc.getElementById !== "function" || !doc.getElementById("angular-shop-catalog") ||
        typeof doc.dispatchEvent !== "function" || typeof CustomEvent !== "function")
        return;
    doc.dispatchEvent(new CustomEvent("lhs:shop-consoles-updated", { detail: view }));
}
