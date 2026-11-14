import { polygon } from "../isometric.js?v=e74c7026ec87";
import { line, rounded } from "./primitives.js?v=e74c7026ec87";
export const CANDY_COLORS = ["#d7af74", "#ac8291", "#81a98b", "#719aaf"];
export function drawCandy(c, x, y, color, index) {
    if (index % 3 === 0) {
        polygon(c, [{ x, y: y + 6 }, { x: x + 3, y: y + 10 }, { x, y: y + 15 }], color);
        polygon(c, [{ x: x + 14, y: y + 6 }, { x: x + 11, y: y + 10 }, { x: x + 14, y: y + 15 }], color);
        rounded(c, x + 2, y + 5, 10, 12, 3, color, "#527060");
    }
    else
        rounded(c, x + 1, y + 3, 12, 17, 2, color, "#527060");
    rounded(c, x + 3, y + 8, 8, 7, 1, "#eee5c4");
    c.fillStyle = index % 2 ? "#735148" : "#997441";
    c.fillRect(x + 5, y + 10, 4, 3);
    line(c, [{ x: x + 2, y: y + 4 }, { x: x + 11, y: y + 4 }], "#f1dca6", 1);
}
