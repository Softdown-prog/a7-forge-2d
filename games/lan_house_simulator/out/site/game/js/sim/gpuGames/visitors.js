import { annualHourlyCeiling, isHistorical, sessionPrice, yearFromMinutes } from "../historicalEconomy.js?v=1507cb2cfb2d";
import { stationReadyForSessions } from "../stationPower.js?v=1507cb2cfb2d";
import { gamePopularityWeight } from "../gamePopularity.js?v=1507cb2cfb2d";
import { GPU_GAME_CATALOG, gpuGameSpec } from "./catalog.js?v=1507cb2cfb2d";
import { gpuGameEligiblePcs, gpuGamePlayableOnPc } from "./compatibility.js?v=1507cb2cfb2d";
/** Deterministic visitor choice, demand and permitted session surcharge. */
/** Procura adicional por um jogo GPU efetivamente ofertado hoje.
 * Uma licença sem instalação, PC ligado e compatível não anuncia algo que
 * a lan house não pode oferecer. Não afeta tarifa, compra ou licenças.
 */
export function gpuGameAttraction(s, id) {
    if (!isHistorical(s) || !s.licensedGames || !s.licensedGpuGames?.includes(id))
        return 0;
    const title = gpuGameSpec(id), year = yearFromMinutes(s.totalMinutes);
    if (!title || year < title.year)
        return 0;
    if (!gpuGameEligiblePcs(s, title).some(i => stationReadyForSessions(s, i) && gpuGamePlayableOnPc(s, i, id)))
        return 0;
    return .025 * gamePopularityWeight(title.year, year);
}
/** Até +7,5% para três títulos recentes, com desgaste natural até a nostalgia.
 * Sem RNG, estado persistido ou receitas extras.
 */
export function gpuGameVisitorMultiplier(s) {
    if (!isHistorical(s) || !s.licensedGames || !(s.licensedGpuGames?.length))
        return 1;
    const total = s.licensedGpuGames.reduce((sum, id) => sum + gpuGameAttraction(s, id), 0);
    return 1 + Math.min(.075, total);
}
/** A preferência é fixada na chegada, apenas entre títulos já lançados.
 * Atribuição determinística por ID, sem sorteio extra ou dependência das
 * licenças atualmente compradas; salva com o visitante para não mudar no reload.
 */
export function preferredGpuGame(s, visitorId) {
    if (!wantsGpuGame(s, visitorId))
        return undefined;
    const year = yearFromMinutes(s.totalMinutes);
    const launched = GPU_GAME_CATALOG.filter(game => game.year <= year);
    return launched[Math.floor(visitorId / 4) % launched.length]?.id;
}
/** Adicional local, limitado pelo teto horário anual.
 * Um título pedido nunca cobra o bônus de OUTRO título mais caro; sem
 * preferência especificada, preserva o maior bônus de saves antigos.
 */
export function gpuGameHourlyRate(s, index, requestedGameId) {
    if (!isHistorical(s) || yearFromMinutes(s.totalMinutes) < 2005 || !s.licensedGames)
        return s.pricePerHour;
    let maxBonus = 0;
    const ids = requestedGameId ? [requestedGameId] : (s.licensedGpuGames ?? []);
    for (const id of ids) {
        if (!gpuGamePlayableOnPc(s, index, id))
            continue;
        maxBonus = Math.max(maxBonus, gpuGameSpec(id).hourlyBonus);
    }
    return Math.max(s.pricePerHour, Math.min(annualHourlyCeiling(yearFromMinutes(s.totalMinutes)), s.pricePerHour + maxBonus));
}
/** Cobrança por sessão real: sem compra do título pedido, tarifa normal.
 * Argumento opcional conserva compatibilidade com clientes/saves antigos.
 */
export function gpuGameSessionPrice(s, index, minutes, wantsAdvancedGame, requestedGameId) {
    const hourly = wantsAdvancedGame ? gpuGameHourlyRate(s, index, requestedGameId) : s.pricePerHour;
    return sessionPrice(hourly, minutes);
}
/** Cerca de 1/4 dos visitantes, a partir de 2005, sem consumo de RNG. */
export function wantsGpuGame(s, visitorId) {
    return isHistorical(s) && yearFromMinutes(s.totalMinutes) >= 2005 && visitorId % 4 === 0;
}
