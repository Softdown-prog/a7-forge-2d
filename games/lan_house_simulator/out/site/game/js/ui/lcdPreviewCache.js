/** Lazy, in-memory catalog artwork cache; does not access the active save.
 * The caller supplies a disposable sample and the matching renderer.
 */
export function createLcdPreviewCache(doc, makeSample, draw) {
    const previews = new Map();
    return (id) => {
        const cached = previews.get(id);
        if (cached)
            return cached;
        const surface = doc.createElement("canvas");
        surface.width = 320;
        surface.height = 190;
        const context = surface.getContext("2d");
        if (!context)
            return "";
        draw(context, makeSample(id));
        const url = surface.toDataURL();
        previews.set(id, url);
        return url;
    };
}
