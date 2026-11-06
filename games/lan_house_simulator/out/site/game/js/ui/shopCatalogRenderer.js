/** DOM-only shop catalog composition.
 * Inventory, prices, licensing and placement availability are supplied
 * through live read models, never taken from the game simulation here.
 */
import { createShopCatalogCard, appendStandardShopCatalogCard, appendShopCatalogOwned } from "./shopCatalogCard.js?v=80953abaf40f";
import { renderShopCatalogOfferButton } from "./shopCatalogOfferButton.js?v=80953abaf40f";
import { renderShopServiceOffer } from "./shopServiceOfferButton.js?v=80953abaf40f";
import { renderPs1ShopOfferButton } from "./ps1ShopOfferButton.js?v=80953abaf40f";
import { renderPs1ShopPlacement } from "./ps1ShopPlacementPicker.js?v=80953abaf40f";
import { renderPs1ShopDiscCatalog } from "./ps1ShopDiscCatalog.js?v=80953abaf40f";
import { renderPs2ShopCatalog } from "./ps2Panels.js?v=80953abaf40f";
import { regularShopCardView, publishAngularShopCatalog } from "./shopCatalogAngularProjection.js?v=80953abaf40f";
import { projectConsoleShop, publishAngularConsoleShop } from "./shopConsoleAngularProjection.js?v=80953abaf40f";
import { shopCategory } from "./shopPanels.js?v=80953abaf40f";
export function renderShopCatalog(options) {
    options.renderOverview();
    options.host.replaceChildren();
    const angularCards = [];
    const currentCategory = options.currentCategory();
    for (const item of options.items) {
        if (shopCategory(item.id) !== currentCategory)
            continue;
        const fields = createShopCatalogCard(item, options.doc);
        const { card, art, category, title, description, button } = fields;
        const offer = options.offer(item.id);
        const placementHint = offer.placementHint;
        renderShopCatalogOfferButton(button, offer);
        const serviceOffer = item.id === "printer" || item.id === "disc-copier"
            ? options.service(item.id) : null;
        if (serviceOffer)
            renderShopServiceOffer(button, serviceOffer);
        if (item.id === "ps1") {
            renderPs1ShopOfferButton(button, options.ps1Offer());
            renderPs1ShopPlacement(card, { art, category, title, description, button }, options.ps1Slots(), options.selectedPs1Slot(), options.selectPs1Slot, options.doc);
        }
        else {
            appendStandardShopCatalogCard(fields, placementHint, options.doc);
        }
        if (offer.ownedText !== null)
            appendShopCatalogOwned(card, offer.ownedText, options.doc);
        options.host.append(card);
        // Only regular cards are ported in this step. PS1/PS2 remain on their
        // procedural Canvas renderers and existing purchase handlers.
        if (item.id !== "ps1") {
            const artworkSrc = typeof art.querySelector === "function"
                ? art.querySelector("img")?.getAttribute("src") ?? null : null;
            angularCards.push(regularShopCardView(item, offer, serviceOffer, artworkSrc));
        }
    }
    publishAngularShopCatalog(options.doc, {
        category: currentCategory ?? "equipment", cards: angularCards,
        consolesPending: currentCategory === "consoles"
    });
    renderPs1ShopDiscCatalog(options.host, options.discs, options.currentCategory() === "consoles", options.doc);
    if (options.ps2 && options.currentCategory() === "consoles")
        renderPs2ShopCatalog(options.host, options.ps2, options.doc);
    if (currentCategory === "consoles" && typeof options.doc.getElementById === "function" &&
        options.doc.getElementById("angular-shop-catalog")) {
        const ps1Card = options.host.querySelector('button[data-buy="ps1"]')?.closest(".shop-card");
        const ps1Artwork = ps1Card?.querySelector(".shop-art img")?.getAttribute("src") ?? null;
        const ps2Canvas = options.host.querySelector(".ps2-bench-card canvas");
        const ps2Artwork = ps2Canvas?.toDataURL() ?? null;
        publishAngularConsoleShop(options.doc, projectConsoleShop(options.ps1Offer(), options.ps1Slots(), options.selectedPs1Slot(), options.discs.snapshot(), options.ps2?.snapshot() ?? null, ps1Artwork, ps2Artwork));
    }
    // Only alert presentation controls after the original DOM catalogue is complete.
    if (typeof options.host.dispatchEvent === "function" && typeof Event === "function")
        options.host.dispatchEvent(new Event("lhs:shop-catalog-updated"));
}
