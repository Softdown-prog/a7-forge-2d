export function renderShopCatalogOfferButton(button, offer) {
    button.disabled = offer.disabled;
    button.textContent = offer.text;
}
