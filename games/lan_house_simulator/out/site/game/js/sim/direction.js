export function directionFromDelta(dx, dy, previous = "south") {
    if (Math.abs(dx) + Math.abs(dy) < 0.0001)
        return previous;
    if (Math.abs(dx) > Math.abs(dy))
        return dx > 0 ? "east" : "west";
    return dy > 0 ? "south" : "north";
}
export function movementDirection(from, to, previous = "south") {
    return directionFromDelta(to.x - from.x, to.y - from.y, previous);
}
