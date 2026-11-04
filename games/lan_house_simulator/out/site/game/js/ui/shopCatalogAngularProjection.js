const allowedIcons = new Set([
    "computer", "cart", "settings", "mail", "play", "pause", "continue", "save", "upload", "close",
    "coins", "chart", "disc", "calendar", "sun", "rain", "network", "users", "tag", "stock", "tools",
    "chip", "shield", "wall", "door", "expand", "move", "rotate", "plant", "poster", "table",
    "megaphone", "trash", "check", "cursor", "idea", "lock", "warning", "arrow", "soda", "candy", "snacks"
]);
export function shopCardIcon(id) {
    const name = id.includes("computer") ? "computer" :
        id.startsWith("extend-") || id === "expand" ? "expand" : id;
    return allowedIcons.has(name) ? name : "computer";
}
export function regularShopCardView(item, offer, service, artworkSrc) {
    return {
        id: item.id, label: item.label, category: item.category, description: item.description,
        icon: shopCardIcon(item.id), artworkSrc,
        buttonText: service?.text ?? offer.text,
        buttonTitle: service?.title ?? "",
        disabled: service?.disabled ?? offer.disabled,
        placementHint: offer.placementHint, ownedText: offer.ownedText
    };
}
/** Existing model publishers can stay dormant while the React UI is live. */
export function publishAngularShopCatalog(doc, view) {
    if (typeof doc.getElementById !== "function" ||
        !doc.getElementById("angular-shop-catalog") ||
        typeof doc.dispatchEvent !== "function" ||
        typeof CustomEvent !== "function")
        return;
    doc.dispatchEvent(new CustomEvent("lhs:shop-cards-updated", { detail: view }));
}
