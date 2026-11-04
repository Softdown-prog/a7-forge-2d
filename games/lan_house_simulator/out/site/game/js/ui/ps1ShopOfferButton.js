export function renderPs1ShopOfferButton(button, offer) {
    button.disabled = offer.disabled;
    button.textContent = offer.text;
}
