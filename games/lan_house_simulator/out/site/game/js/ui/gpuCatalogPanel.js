export function renderGpuCatalogPanel(choicesHost, catalogHost, view, setText, doc, sync) {
    const choices = doc.createElement("div"), catalog = doc.createElement("div");
    for (const station of view.stations) {
        const button = doc.createElement("button");
        button.type = "button";
        button.dataset.gpuSelect = String(station.index);
        button.className = "gpu-station" + (station.selected ? " selected" : "");
        button.textContent = station.label;
        button.setAttribute("aria-pressed", String(station.selected));
        choices.append(button);
    }
    setText("gpu-replacement-note", view.replacementNote);
    for (const model of view.models) {
        const card = doc.createElement("article");
        card.className = "gpu-card" + (model.locked ? " gpu-locked" : "");
        const art = doc.createElement("img");
        art.src = model.artSrc;
        art.alt = model.artAlt;
        art.loading = "lazy";
        const info = doc.createElement("div");
        info.className = "gpu-info";
        const title = doc.createElement("strong");
        title.textContent = model.title;
        const details = doc.createElement("small");
        details.textContent = model.details;
        const buy = doc.createElement("button");
        buy.type = "button";
        buy.className = "slice";
        buy.dataset.gpuBuy = model.id;
        buy.textContent = model.buttonLabel;
        buy.disabled = model.disabled;
        info.append(title, details, buy);
        card.append(art, info);
        catalog.append(card);
    }
    sync(choicesHost, choices);
    sync(catalogHost, catalog);
}
