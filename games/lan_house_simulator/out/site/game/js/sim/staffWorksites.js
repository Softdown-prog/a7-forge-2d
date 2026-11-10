import { stationPoint } from "./layout.js?v=345c7fc7b8be";
/** Âncoras no piso, fora das mesas e do volume da lixeira.
 * A direção do PC é respeitada mesmo após o jogador girar a estação. */
export function technicianWorkPoint(pc) {
    return stationPoint(pc, .95, 1.20);
}
export function technicianContactPoint(pc) {
    return stationPoint(pc, .55, .60);
}
export function cleanerWorkPoint(bin) {
    return { x: bin.x + .46, y: bin.y + .40 };
}
/** Posição gráfica do funcionário não pode mudar só no render: o ponto
 * em que ele anda e aquele no qual fica parado são sempre o mesmo. */
export function workerGroundDistance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}
