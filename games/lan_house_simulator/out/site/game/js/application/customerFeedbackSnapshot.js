import { FEEDBACK_REASONS, summarizeFeedback } from "../sim/customerFeedback.js?v=345c7fc7b8be";
const signed = (value) => (value > 0 ? "+" : "") + value.toFixed(2);
export function customerFeedbackSnapshot(state) {
    const { records, positive, negative, totalDelta, reasons } = summarizeFeedback(state);
    return {
        summary: records.length
            ? positive + " elogio(s) com efeito · " + negative + " crítica(s) com efeito · saldo " +
                signed(totalDelta) + " pontos de reputação"
            : "Ainda não há avaliações que tenham alterado a reputação.",
        reasons: reasons.slice(0, 5).map(([reason, stats]) => ({
            label: FEEDBACK_REASONS[reason],
            stats: stats.positive + " elogio(s) · " + stats.negative + " crítica(s) · " + signed(stats.delta) + " pts"
        })),
        recent: records.slice(0, 8).map(entry => ({
            label: "Dia " + (Math.floor(entry.minute / 720) + 1) + " · " + FEEDBACK_REASONS[entry.reason] +
                (entry.kind === "desistencia" ? " · desistência" : entry.kind === "conexao" ? " · queda de conexão" : " · sessão"),
            delta: signed(entry.delta) + " pts",
            negative: entry.delta < 0
        }))
    };
}
