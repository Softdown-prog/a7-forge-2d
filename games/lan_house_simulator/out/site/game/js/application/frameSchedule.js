export function createFrameSchedule() {
    let lastFrame = 0, elapsed = 0, lastScene = 0, lastMenu = 0, lastUi = 0;
    return {
        begin(timestamp) {
            if (lastFrame === 0)
                lastFrame = timestamp;
            const dt = Math.max(0, Math.min(0.08, (timestamp - lastFrame) / 1000));
            lastFrame = timestamp;
            elapsed += dt;
            return { dt, elapsed };
        },
        scene(timestamp, flags) {
            const interval = flags.coarse ? 1000 / 30 : 0;
            const ready = flags.playing && !flags.accountOpen && flags.visible && !flags.hidden &&
                !flags.adminOpen && !flags.shopOpen && !flags.noticesOpen && timestamp - lastScene >= interval;
            if (ready)
                lastScene = interval ? timestamp - ((timestamp - lastScene) % interval) : timestamp;
            return ready;
        },
        menu(timestamp, flags) {
            return !flags.playing && !flags.accountOpen && flags.hasRenderer &&
                flags.previewAvailable && !flags.hidden && !flags.reduceMotion && timestamp - lastMenu > 90;
        },
        menuPainted(timestamp) { lastMenu = timestamp; },
        hud(timestamp, flags) {
            const ready = flags.playing && !flags.accountOpen && timestamp - lastUi > 450 &&
                timestamp - flags.lastScroll > 160 && !flags.pointerHeld && timestamp - flags.lastInput > 120;
            if (ready)
                lastUi = timestamp;
            return ready;
        }
    };
}
