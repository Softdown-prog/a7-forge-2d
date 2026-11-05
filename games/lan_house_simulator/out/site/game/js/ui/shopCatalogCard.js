/** DOM and cached Canvas previews for the shop catalog, without simulation dependencies. */
import { drawDiscCopier } from "../render/discCopierArt.js?v=a7a149bb38f1";
import { drawPrinterShop } from "../render/printerArt.js?v=a7a149bb38f1";
import { drawPs1Station } from "../render/ps1Art.js?v=a7a149bb38f1";
import { drawLinuxWorkstationPreview } from "../render/linuxWorkstationPreview.js?v=a7a149bb38f1";
import { iconMarkup, catalogueIcon } from "./presentation.js?v=a7a149bb38f1";
const shopArtwork = new Map();
export function createShopCatalogCard(item, doc) {
    const card = doc.createElement("article");
    card.className = "shop-card";
    const art = doc.createElement("div");
    art.className = "shop-art";
    art.dataset.item = item.id;
    art.setAttribute("aria-hidden", "true");
    art.innerHTML = iconMarkup(catalogueIcon(item.id));
    if (item.id === "disc-copier" || item.id === "printer" || item.id === "ps1" ||
        item.id === "linux-lab-99" || item.id === "linux-dev-99") {
        art.replaceChildren();
        if (shopArtwork.has(item.id)) {
            const image = doc.createElement("img");
            image.src = shopArtwork.get(item.id);
            image.alt = "";
            art.append(image);
        }
        else {
            const preview = doc.createElement("canvas");
            preview.width = 640;
            preview.height = 360;
            const ctx = preview.getContext("2d");
            if (ctx) {
                if (item.id === "printer")
                    drawPrinterShop(ctx, 640, 360);
                else if (item.id === "disc-copier")
                    drawDiscCopier(ctx, 640, 360);
                else if (item.id === "linux-lab-99" || item.id === "linux-dev-99")
                    drawLinuxWorkstationPreview(ctx, item.id);
                else {
                    ctx.fillStyle = "#edf1e7";
                    ctx.fillRect(0, 0, 640, 360);
                    const preview = { originX: 250, originY: 125, zoom: 1.75 };
                    drawPs1Station(ctx, preview, { x: 0, y: 0 }, 0, true, 0);
                }
            }
            shopArtwork.set(item.id, preview.toDataURL());
            const image = doc.createElement("img");
            image.src = shopArtwork.get(item.id);
            image.alt = "";
            art.append(image);
        }
    }
    const title = doc.createElement("h3");
    title.textContent = item.label;
    const category = doc.createElement("small");
    category.textContent = item.category;
    const description = doc.createElement("p");
    description.textContent = item.description;
    const button = doc.createElement("button");
    button.type = "button";
    button.dataset.buy = item.id;
    return { card, art, category, title, description, button };
}
export function appendStandardShopCatalogCard(fields, placementHint, doc) {
    const { card, art, category, title, description, button } = fields;
    card.append(art, category, title, description);
    if (placementHint) {
        const hint = doc.createElement("small");
        hint.className = "shop-purchase-status";
        hint.textContent = placementHint;
        card.append(hint);
    }
    card.append(button);
}
export function appendShopCatalogOwned(card, text, doc) {
    const owned = doc.createElement("span");
    owned.textContent = text;
    card.append(owned);
}
