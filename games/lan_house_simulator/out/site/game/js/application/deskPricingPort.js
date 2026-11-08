import { discMediaCost, discCopiesToday, DISC_COPIES_PER_DAY, MAX_DISC_PRICE } from "../sim/discCopy.js?v=7d5a5079cdfa";
import { printPaperInkCost, pagesPrintedToday, PRINT_PAGES_PER_DAY, PRINT_MAX_PRICE } from "../sim/printService.js?v=7d5a5079cdfa";
import { discEconomy, printEconomy } from "../sim/serviceEconomy.js?v=7d5a5079cdfa";
const money = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const walkIns = (n) => (n ?? 0) + (n === 1 ? " cliente atendido" : " clientes atendidos");
export function createDeskPricingPort(getState) {
    return {
        installed() { const s = getState(); return { discs: !!s.discCopier, printer: !!s.printer }; },
        discs() {
            const s = getState(), copier = s.discCopier;
            if (!copier)
                return null;
            const report = discEconomy(s);
            return {
                rows: ["cd", "dvd"].map(kind => {
                    const price = copier.prices[kind], material = discMediaCost(s, kind), margin = price - material;
                    return { kind, price: money(price), decreaseDisabled: price <= 1, increaseDisabled: price >= MAX_DISC_PRICE,
                        cost: "Mídia: " + money(material) + " · resultado por cópia: " + money(margin) + (margin < 0 ? " · este preço dá prejuízo" : "") };
                }),
                summary: copier.cdCopies + " CDs · " + copier.dvdCopies + " DVDs · faturamento " + money(copier.revenue) +
                    " · mídias " + money(copier.expenses) + " · resultado operacional " + money(report.operatingResult) +
                    " · " + walkIns(copier.walkIns) + " exclusivamente para cópias.",
                capacity: discCopiesToday(s) + " de " + DISC_COPIES_PER_DAY + " cópias feitas hoje. " +
                    (report.fullyRecovered ? "Investimento inicial recuperado; saldo líquido " + money(report.netAfterInvestment) + "." : "Faltam " +
                        money(report.remainingInvestment) + " para recuperar os R$ " + report.investment + " da máquina.") +
                    " Procura avulsa potencial: " + report.expectedWalkInAttemptsPerDay.toLocaleString("pt-BR") +
                    " entradas/dia antes de filas, orçamento e capacidade; não são vendas garantidas."
            };
        },
        printing() {
            const s = getState(), printer = s.printer;
            if (!printer)
                return null;
            const report = printEconomy(s);
            const step = s.economyVersion === 2 ? .5 : 1, material = printPaperInkCost(s), margin = printer.price - material;
            return {
                price: money(printer.price), step, decreaseDisabled: printer.price <= step, increaseDisabled: printer.price >= PRINT_MAX_PRICE,
                cost: "Papel e tinta: " + money(material) + " por página · margem: " + money(margin) +
                    (margin < 0 ? " · atenção: este preço dá prejuízo" : margin === 0 ? " · sem margem para recuperar a máquina" : ""),
                summary: printer.pages + " páginas realizadas · faturamento " + money(printer.revenue) +
                    " · materiais " + money(printer.expenses) + " · resultado operacional " + money(report.operatingResult) +
                    " · " + walkIns(printer.walkIns) + " exclusivamente para imprimir.",
                capacity: pagesPrintedToday(s) + " de " + PRINT_PAGES_PER_DAY + " páginas hoje. " +
                    (report.fullyRecovered ? "Investimento inicial recuperado; saldo líquido " + money(report.netAfterInvestment) + "." : "Faltam " +
                        money(report.remainingInvestment) + " para recuperar os R$ " + report.investment + " da impressora.") +
                    " Procura avulsa potencial: " + report.expectedWalkInAttemptsPerDay.toLocaleString("pt-BR") +
                    " entradas/dia antes de filas, orçamento e capacidade; não são vendas garantidas."
            };
        }
    };
}
