import { iso, polygon, raisedCuboid } from "../isometric.js?v=0bd19d58dac2";
import { drawRasterCached, rasterCacheUsable } from "../rasterCache.js?v=0bd19d58dac2";
export const RETAIL_DISPLAY_CAPACITY = { soda: 9, candy: 12, snacks: 20 };
export function visibleRetailStock(stock, capacity) {
    return Number.isFinite(stock) ? Math.max(0, Math.min(capacity, Math.floor(stock))) : 0;
}
export function line(c, points, color, width) {
    c.beginPath();
    points.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.stroke();
}
export function rounded(c, x, y, w, h, r, color, stroke) {
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fillStyle = color;
    c.fill();
    if (stroke) {
        c.strokeStyle = stroke;
        c.lineWidth = 1;
        c.stroke();
    }
}
export function box(c, cam, x, y, w, d, z, h, top, front, side) {
    if (cam.rotation) {
        raisedCuboid(c, cam, x, y, w, d, z, h, [top, front, side]);
        return;
    }
    const at = (x, y, z) => iso({ x, y }, cam, z);
    polygon(c, [at(x + w, y, z), at(x + w, y + d, z), at(x + w, y + d, z + h), at(x + w, y, z + h)], side, "#41574f");
    polygon(c, [at(x, y + d, z), at(x + w, y + d, z), at(x + w, y + d, z + h), at(x, y + d, z + h)], front, "#41574f");
    polygon(c, [at(x, y, z + h), at(x + w, y, z + h), at(x + w, y + d, z + h), at(x, y + d, z + h)], top, "#6d7e6c");
}
export function face(c, cam, x, y, span, z, h, axis, paint) {
    // A face turned away from the fixed camera is hidden by the cabinet.
    if (cam.rotation) {
        const a = iso({ x, y }, cam), b = iso(axis === "x" ? { x: x + .1, y } : { x, y: y + .1 }, cam);
        if (b.y <= a.y)
            return;
    }
    // u always moves right on screen, so lettering is never mirrored on the rack.
    const a = iso(axis === "x" ? { x, y: y + span } : { x, y }, cam, z + h);
    const b = iso(axis === "x" ? { x, y } : { x: x + span, y }, cam, z + h);
    const d = iso(axis === "x" ? { x, y: y + span } : { x, y }, cam, z);
    c.save();
    c.transform((b.x - a.x) / 96, (b.y - a.y) / 96, 0, (d.y - a.y) / 180, a.x, a.y);
    paint();
    c.restore();
}
export function caption(c, text, x, y, size, color, maxWidth = 90) {
    c.fillStyle = color;
    c.font = "bold " + size + "px Arial,sans-serif";
    c.textAlign = "center";
    c.fillText(text, x, y, maxWidth);
}
export function drawCached(c, cam, p, keyParts, paint, useCache) {
    if (!useCache || !rasterCacheUsable(c)) {
        paint(c);
        return;
    }
    const anchor = iso(p, cam), z = cam.zoom;
    drawRasterCached(c, "retail", {
        key: JSON.stringify([z, cam.rotation ?? 0, ...keyParts]), anchorX: anchor.x, anchorY: anchor.y, snap: "floor", limit: 96,
        padX: Math.ceil((cam.rotation ? 150 : 90) * z) + 4, padY: Math.ceil((cam.rotation ? 180 : 116) * z) + 4,
        width: Math.ceil((cam.rotation ? 300 : 184) * z) + 8, height: Math.ceil((cam.rotation ? 300 : 181) * z) + 8
    }, paint);
}
