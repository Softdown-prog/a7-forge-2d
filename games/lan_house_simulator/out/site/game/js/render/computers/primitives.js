import { iso, polygon, raisedCuboid } from "../isometric.js?v=c12101473308";
export function raisedBox(c, cam, x, y, w, d, z, h, top, front, side) {
    if (cam.rotation) {
        raisedCuboid(c, cam, x, y, w, d, z, h, [top, front, side]);
        return;
    }
    const at = (px, py, pz) => iso({ x: px, y: py }, cam, pz);
    polygon(c, [at(x + w, y, z), at(x + w, y + d, z), at(x + w, y + d, z + h), at(x + w, y, z + h)], side, "#6c665b");
    polygon(c, [at(x, y + d, z), at(x + w, y + d, z), at(x + w, y + d, z + h), at(x, y + d, z + h)], front, "#756650");
    polygon(c, [at(x, y, z + h), at(x + w, y, z + h), at(x + w, y + d, z + h), at(x, y + d, z + h)], top, "#9a896f");
}
export function path(c, points, color, width) {
    c.beginPath();
    points.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y));
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineCap = "round";
    c.lineJoin = "round";
    c.stroke();
}
export function plane(c, cam, x, y, w, z, h, paint) {
    if (cam.rotation === 1 || cam.rotation === 2)
        return;
    const a = iso({ x, y }, cam, z + h), b = iso({ x: x + w, y }, cam, z + h), d = iso({ x, y }, cam, z);
    c.save();
    c.transform((b.x - a.x) / 96, (b.y - a.y) / 96, 0, (d.y - a.y) / 100, a.x, a.y);
    paint();
    c.restore();
}
export function round(c, x, y, w, h, r, color, outline) {
    c.beginPath();
    c.roundRect(x, y, w, h, r);
    c.fillStyle = color;
    c.fill();
    if (outline) {
        c.strokeStyle = outline;
        c.lineWidth = 1.5;
        c.stroke();
    }
}
