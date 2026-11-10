import { iso } from "./isometric.js?v=229a76357973";
import { scenePointFromClient, sceneUnitsPerCssPixel } from "./sceneSurface.js?v=229a76357973";
export function createScenePicker(canvas, placementActions, getCamera, selection, coarsePointer) {
    function getCanvasPoint(e) {
        // Scene units are fixed; the backing store may hold more device pixels.
        return scenePointFromClient(canvas.getBoundingClientRect(), e.clientX, e.clientY);
    }
    function pickWall(x, y) {
        const camera = getCamera(), wallMode = selection().wallMode, available = wallMode ? placementActions.walls(wallMode) : [];
        let nearest = null, best = Infinity;
        for (const segment of available) {
            const [a, b] = placementActions.endpoints(segment);
            for (const height of (selection().wallMode === "build" ? [0] : [0, 38, 76])) {
                const pa = iso(a, camera, height), pb = iso(b, camera, height);
                const dx = pb.x - pa.x, dy = pb.y - pa.y, scale = Math.max(1, dx * dx + dy * dy);
                const t = Math.max(0, Math.min(1, ((x - pa.x) * dx + (y - pa.y) * dy) / scale));
                const d = Math.hypot(x - pa.x - t * dx, y - pa.y - t * dy);
                if (d < best) {
                    best = d;
                    nearest = segment;
                }
            }
        }
        return best <= Math.max(12, 22 * sceneUnitsPerCssPixel(canvas.getBoundingClientRect())) ? nearest : null;
    }
    function pickAnnexPc(x, y) {
        const camera = getCamera();
        let nearest = null, best = Infinity;
        for (const slot of placementActions.annexSlots()) {
            const p = iso({ x: slot.position.x + 0.35, y: slot.position.y + 0.55 }, camera, 4);
            const d = Math.hypot(x - p.x, y - p.y);
            if (d < best) {
                best = d;
                nearest = slot;
            }
        }
        return best < Math.max(22, 33 * camera.zoom) ? nearest : null;
    }
    function pickFurnitureSlot(x, y) {
        if (!selection().placingKind && !selection().relocating)
            return null;
        const moving = placementActions.furniture().find(p => p.slotId === selection().relocationFrom);
        const surface = selection().placingKind ? (selection().placingKind === "poster" ? "wall" : "floor") : moving ? (moving.kind === "poster" ? "wall" : "floor") : null;
        const camera = getCamera();
        let nearest = null, distance = Infinity;
        for (const slot of placementActions.slots()) {
            if (surface && slot.surface !== surface)
                continue;
            if (selection().relocating && !moving && !placementActions.furniture().some(p => p.slotId === slot.id))
                continue;
            const at = slot.surface === "wall" ? iso({ x: slot.x + (slot.axis === "y" ? 0 : .33), y: slot.y + (slot.axis === "y" ? .33 : 0) }, camera, 137) :
                iso({ x: slot.x + 0.25, y: slot.y + 0.20 }, camera, 9);
            const dist = Math.hypot(x - at.x, y - at.y);
            if (dist < distance) {
                distance = dist;
                nearest = slot;
            }
        }
        // O zoom CSS do visor reduz a área tocável real. Usar um raio em
        // pixels de tela para que os encaixes sejam selecionáveis no celular.
        const cssPixels = sceneUnitsPerCssPixel(canvas.getBoundingClientRect());
        const coarse = coarsePointer();
        return distance <= Math.max((coarse ? 48 : 23) * cssPixels, 38 * camera.zoom) ? nearest : null;
    }
    return { point: getCanvasPoint, wall: pickWall, annex: pickAnnexPc, furniture: pickFurnitureSlot };
}
