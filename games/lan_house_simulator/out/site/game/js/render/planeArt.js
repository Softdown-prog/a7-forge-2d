import { iso } from "./isometric.js?v=1507cb2cfb2d";
const FACES = { front: [0, 3], back: [1, 2], right: [0, 1], left: [2, 3] };
/** True when the given side of a counter-aligned object faces the camera. */
export function faceVisible(cam, face) {
    return FACES[face].includes(cam.rotation ?? 0);
}
/** Paint in a 100 × 60 box mapped onto a vertical wall of the object. */
export function panel(c, cam, x, y, span, z, h, axis, paint) {
    let a = iso({ x, y }, cam, z + h), b = iso({ x: x + (axis === "x" ? span : 0), y: y + (axis === "y" ? span : 0) }, cam, z + h);
    if (b.x < a.x)
        [a, b] = [b, a];
    c.save();
    c.transform((b.x - a.x) / 100, (b.y - a.y) / 100, 0, h * cam.zoom / 60, a.x, a.y);
    paint();
    c.restore();
}
/** Paint in a 100 × 60 box mapped onto a horizontal surface. */
export function top(c, cam, x, y, w, d, z, paint) {
    const a = iso({ x, y }, cam, z), b = iso({ x: x + w, y }, cam, z), e = iso({ x, y: y + d }, cam, z);
    c.save();
    c.transform((b.x - a.x) / 100, (b.y - a.y) / 100, (e.x - a.x) / 60, (e.y - a.y) / 60, a.x, a.y);
    paint();
    c.restore();
}
export function round(c, x, y, w, h, r, fill) {
    c.fillStyle = fill;
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fill();
}
/** Vertical two-stop gradient for the 100 × 60 panel box. */
export function vertical(c, from, to, y0 = 0, y1 = 60) {
    const g = c.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, from);
    g.addColorStop(1, to);
    return g;
}
/** A circle or ellipse on a horizontal plane, projected through the camera. */
export function flatEllipse(c, cam, cx, cy, rx, ry, z, fill, stroke, steps = 22) {
    c.beginPath();
    for (let i = 0; i < steps; i++) {
        const t = i / steps * Math.PI * 2, p = iso({ x: cx + Math.cos(t) * rx, y: cy + Math.sin(t) * ry }, cam, z);
        if (i)
            c.lineTo(p.x, p.y);
        else
            c.moveTo(p.x, p.y);
    }
    c.closePath();
    c.fillStyle = fill;
    c.fill();
    if (stroke) {
        c.strokeStyle = stroke;
        c.lineWidth = Math.max(.6, cam.zoom * .9);
        c.stroke();
    }
}
/** Soft contact shadow of an object resting on a surface at height `z`. */
export function contactShadow(c, cam, x, y, w, d, z, alpha = .2) {
    const pad = .03, pts = [
        iso({ x: x - pad, y: y - pad }, cam, z), iso({ x: x + w + pad * 2, y: y - pad }, cam, z),
        iso({ x: x + w + pad * 2, y: y + d + pad * 2 }, cam, z), iso({ x: x - pad, y: y + d + pad * 2 }, cam, z)
    ];
    c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
    c.closePath();
    c.fillStyle = "rgba(24,34,28," + alpha.toFixed(3) + ")";
    c.fill();
}
/** Straight segment between two world points at given heights. */
export function wire(c, cam, from, zFrom, to, zTo, color, width, sag = 0) {
    const a = iso(from, cam, zFrom), b = iso(to, cam, zTo);
    c.strokeStyle = color;
    c.lineWidth = Math.max(.6, width * cam.zoom);
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(a.x, a.y);
    if (sag)
        c.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + sag * cam.zoom, b.x, b.y);
    else
        c.lineTo(b.x, b.y);
    c.stroke();
}
