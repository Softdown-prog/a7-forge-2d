/** Register exactly once at bootstrap; callers own any repeated setup prevention. */
export function installPageSaveLifecycle(options) {
    options.every(options.save, 8000);
    options.win.addEventListener("beforeunload", options.save);
    // Mobile tabs may be discarded without beforeunload.
    options.win.addEventListener("pagehide", options.save);
    options.doc.addEventListener("visibilitychange", () => {
        if (options.doc.hidden)
            options.save();
    });
}
