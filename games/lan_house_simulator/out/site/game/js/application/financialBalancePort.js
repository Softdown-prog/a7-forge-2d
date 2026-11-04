import { financialSnapshot, monthlyClosingSnapshot } from "../sim/financialClarity.js?v=fa1ff35e3337";
import { monthlyBills } from "../sim/economy.js?v=fa1ff35e3337";
export function createFinancialBalancePort(getState) {
    const money = (n) => "R$ " + n.toLocaleString("pt-BR");
    const currency = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    return {
        balance() {
            const state = getState();
            const statement = financialSnapshot(state);
            return {
                cash: money(state.cash),
                summary: "Caixa " + money(state.cash) + " · contas/mês " + money(monthlyBills(state)),
                profit: money(statement.netResult),
                negative: statement.netResult < 0,
                opening: currency(statement.openingCash),
                income: currency(statement.income),
                outgoing: currency(statement.outgoing),
                available: currency(statement.availableCash),
                reconciliation: statement.differenceCents === 0 ? null :
                    "Atenção: o caixa deste salvamento difere em " + currency(statement.differenceCents / 100) +
                        " do cálculo pelo capital inicial e pelos lançamentos. Confira o histórico em Finanças."
            };
        },
        billWatch() {
            const closing = monthlyClosingSnapshot(getState());
            if (closing.campaignEnding)
                return {
                    title: "Calendário encerrando",
                    status: "A campanha termina neste dia; não há outro fechamento agendado.",
                    warning: false
                };
            return {
                title: "Próximo fechamento em " + closing.daysRemaining +
                    (closing.daysRemaining === 1 ? " dia do jogo" : " dias do jogo"),
                status: "Provisão acumulada até agora: " + currency(closing.provision) +
                    ". " + (closing.coversProvision ? "O caixa atual cobre este valor." :
                    "Se a cobrança fosse agora, faltariam " + currency(closing.shortfall) + "."),
                warning: !closing.coversProvision && closing.daysRemaining <= 7
            };
        }
    };
}
