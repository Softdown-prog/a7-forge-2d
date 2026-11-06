export function renderTopGamesSubscription(host, snapshot, doc) {
    const card = doc.createElement("article");
    card.className = "shop-card top-games-subscription";
    const heading = doc.createElement("h3");
    heading.textContent = snapshot.title + " · assinatura mensal";
    const status = doc.createElement("p");
    status.className = "top-games-status";
    status.textContent = snapshot.status;
    const progress = doc.createElement("small");
    progress.className = "top-games-progress";
    progress.textContent = "Revistas recebidas: " + snapshot.received + " de " + snapshot.total + ".";
    const button = doc.createElement("button");
    button.type = "button";
    button.dataset.buy = snapshot.actionId;
    button.disabled = snapshot.actionDisabled;
    button.textContent = snapshot.buttonText;
    card.append(heading, status, progress, button);
    host.append(card);
}
