export function createShopCatalogRefresh(options) {
    return {
        refresh(force = true) {
            if (!options.isOpen())
                return;
            const host = options.host();
            if (!host)
                return;
            if (!options.changed(options.revision(), force))
                return;
            options.render(host);
        }
    };
}
