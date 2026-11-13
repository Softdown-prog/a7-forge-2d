import { isHistorical, yearFromMinutes } from "../historicalEconomy.js?v=c12101473308";
import { stationPowerCount } from "../stationPower.js?v=c12101473308";
import { GPU_GAME_CATALOG, gpuGameSpec } from "./catalog.js?v=c12101473308";
import { gpuGameEligiblePcs } from "./compatibility.js?v=c12101473308";
/** License purchases and save checks are independent of background downloads. */
export function validGpuGameLicenses(value, s) {
    if (value === undefined)
        return true; // saves antigos não tinham catálogo avançado
    if (!isHistorical(s) || !s.licensedGames || !Array.isArray(value) ||
        value.length > GPU_GAME_CATALOG.length)
        return false;
    const seen = new Set();
    const year = yearFromMinutes(s.totalMinutes ?? 0);
    return value.every(id => {
        if (typeof id !== "string" || seen.has(id))
            return false;
        seen.add(id);
        const spec = gpuGameSpec(id);
        return !!spec && spec.year <= year;
    });
}
export function quoteGpuGame(s, id) {
    const game = gpuGameSpec(id), cost = game?.cost ?? 0;
    const eligiblePcs = game ? gpuGameEligiblePcs(s, game) : [];
    const reject = (message) => ({ ok: false, message, cost, eligiblePcs });
    if (!game)
        return reject("Jogo não encontrado no catálogo.");
    if (!isHistorical(s))
        return reject("Jogos GPU são exclusivos do modo histórico.");
    if (yearFromMinutes(s.totalMinutes) < game.year)
        return reject("Lançamento em " + game.year + ".");
    if (!s.licensedGames)
        return reject("Regularize primeiro o catálogo básico de jogos.");
    if (s.licensedGpuGames?.includes(game.id))
        return reject("Jogo já licenciado.");
    if (eligiblePcs.length === 0)
        return reject("Requer ao menos um PC com GPU " + game.minGpu + " ou superior, Windows " + game.minWindows + " licenciado e hardware compatível.");
    if (s.cash < cost)
        return reject("Caixa insuficiente: licença custa R$ " + cost + ".");
    return { ok: true, cost, eligiblePcs, message: "Licenciar " + game.name + " por R$ " + cost + " para " + eligiblePcs.length + " PC(s) compatível(is)." };
}
export function licenseGpuGame(s, id) {
    const quote = quoteGpuGame(s, id);
    if (!quote.ok)
        return { ok: false, message: quote.message };
    const game = gpuGameSpec(id);
    s.cash -= quote.cost;
    s.expenses += quote.cost;
    (s.licensedGpuGames ??= []).push(game.id);
    // Em partidas com instalações explícitas, habilitar o novo jogo somente
    // nos PCs que já eram compatíveis ao comprar a licença.
    if (s.gpuGameInstalls !== undefined) {
        const eligible = new Set(quote.eligiblePcs);
        s.gpuGameInstalls = Array.from({ length: stationPowerCount(s) }, (_, i) => {
            const titles = [...(s.gpuGameInstalls?.[i] ?? [])];
            if (eligible.has(i))
                titles.push(game.id);
            return titles;
        });
    }
    return { ok: true, message: game.name + " licenciado por R$ " + quote.cost + ". Instalação disponível nos PCs compatíveis." };
}
