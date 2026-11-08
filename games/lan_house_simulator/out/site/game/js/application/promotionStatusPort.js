import { promotionCost, isPromotionActive, promotionCanAttractVisitors, promotionAdmissionMinutesRemaining } from "../sim/promotion.js?v=c416c21ccd84";
import { GAME_LAST_MINUTE } from "../sim/mailCalendar.js?v=c416c21ccd84";
export function createPromotionStatusPort(getState) {
    return { snapshot() {
            const state = getState();
            const promoting = isPromotionActive(state);
            const admissionsOpen = promotionCanAttractVisitors(state);
            const price = promotionCost(state);
            const priceLabel = price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            return {
                description: "Custo atual: " + priceLabel +
                    ". Aumenta em 40% a chance de chegada até 20h30, desde que haja PCs ligados ou bancadas de PlayStation disponíveis. Lotação e filas reduzem o resultado; não garante clientes nem vendas.",
                status: promoting
                    ? admissionsOpen
                        ? "Panfletagem ativa! +40% na chance de novos visitantes. Restam " +
                            promotionAdmissionMinutesRemaining(state) + " minutos de entrada (até 20h30)."
                        : "Panfletagem contratada hoje. Novos clientes não entram após 20h30; a campanha termina às 22h."
                    : state.totalMinutes >= GAME_LAST_MINUTE
                        ? "Calendário encerrado: não é possível contratar panfletagem."
                        : admissionsOpen
                            ? "Sem panfletagem hoje. Divulgue sua lan house para aumentar a procura até 20h30."
                            : "Novas entradas encerradas às 20h30. A panfletagem estará disponível amanhã.",
                buttonLabel: promoting ? "✓ Divulgação contratada hoje" :
                    !admissionsOpen ? "📣 Panfletagem indisponível após 20h30" :
                        "📣 Fazer panfletagem · " + priceLabel,
                buttonDisabled: promoting || !admissionsOpen || state.cash < price
            };
        } };
}
