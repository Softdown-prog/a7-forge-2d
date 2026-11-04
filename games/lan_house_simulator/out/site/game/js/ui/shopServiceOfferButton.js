export function renderShopServiceOffer(button, offer) {
    button.disabled = offer.disabled;
    button.title = offer.title;
    button.textContent = offer.text;
}
