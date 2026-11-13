/** Semana contínua do calendário fictício: 360 dias/ano.
 * 01/01/1998 foi uma quinta-feira; os próximos dias seguem ciclos de 7,
 * sem consultar Date, fuso horário ou calendário gregoriano ao mudar de ano.
 */
import { DAY_MINUTES } from "./types.js?v=c12101473308";
export const CAMPAIGN_WEEKDAYS = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"];
export function weekdayIndex(day) {
    if (!Number.isInteger(day) || day < 1)
        throw new RangeError("Dia da campanha inválido.");
    return (day + 2) % 7;
}
export function weekdayName(day) { return CAMPAIGN_WEEKDAYS[weekdayIndex(day)]; }
export function currentCampaignDay(s) {
    return Math.floor(s.totalMinutes / DAY_MINUTES) + 1;
}
export function nextFridayDay(day, includeCurrent = false) {
    let candidate = day + (includeCurrent ? 0 : 1);
    while (weekdayIndex(candidate) !== 4)
        candidate++;
    return candidate;
}
export function campaignDate(day) {
    if (!Number.isInteger(day) || day < 1)
        throw new RangeError("Dia da campanha inválido.");
    const zero = day - 1;
    return String(zero % 30 + 1).padStart(2, "0") + "/" +
        String(Math.floor(zero % 360 / 30) + 1).padStart(2, "0") + "/" + (1998 + Math.floor(zero / 360));
}
