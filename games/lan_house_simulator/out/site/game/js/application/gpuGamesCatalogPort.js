import { gameYear, WINDOWS_ERAS } from "../sim/era.js?v=0bd19d58dac2";
import { GPU_CATALOG } from "../sim/gpu.js?v=0bd19d58dac2";
import { GPU_GAME_CATALOG, quoteGpuGame, gpuGameHourlyRate, gpuGameInstalledOnPc, gpuGameAttraction, gpuGameInstallJob } from "../sim/gpuGames.js?v=0bd19d58dac2";
import { gpuDemandReport, gpuLicenseCoverage } from "../sim/gpuDemand.js?v=0bd19d58dac2";
import { gamePopularityPercent } from "../sim/gamePopularity.js?v=0bd19d58dac2";
import { stationPoweredOn, stationHasCustomer } from "../sim/stationPower.js?v=0bd19d58dac2";
export function createGpuGamesCatalogPort(getState) {
    return { snapshot() {
            const game = getState(), year = gameYear(game);
            const requested = gpuDemandReport(game);
            const currency = (value) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            const downloads = (game.gpuGameInstallJobs ?? []).slice().sort((a, b) => a.pc - b.pc).map(job => ({
                id: job.id, pc: job.pc,
                heading: "PC " + (job.pc + 1) + " · " + (GPU_GAME_CATALOG.find(x => x.id === job.id)?.name ?? "Jogo avançado"),
                durationMinutes: job.durationMinutes, elapsedMinutes: job.elapsedMinutes
            }));
            const note = game.economyVersion !== 2 ?
                "Os jogos com GPU são um recurso do modo histórico." :
                year < 2005 ? "Novos jogos que exigem placa de vídeo chegam em 2005." : null;
            const cards = note !== null ? [] : GPU_GAME_CATALOG.map(title => {
                const gpu = GPU_CATALOG.find(x => x.id === title.minGpu);
                const os = WINDOWS_ERAS.find(x => x.id === title.minWindows);
                const quote = quoteGpuGame(game, title.id);
                const bought = game.licensedGpuGames?.includes(title.id) === true;
                let status = (bought ? "Licenciado. " : quote.message + " ") +
                    (quote.eligiblePcs.length ? "Compatível com PC(s) " + quote.eligiblePcs.map(i => i + 1).join(", ") + "." : "Nenhuma máquina compatível ainda.") +
                    " Adicional máximo de R$ " + title.hourlyBonus.toFixed(2) +
                    "/h, somente para clientes de jogos avançados e dentro do teto anual." +
                    (year >= title.year ? " Popularidade atual: " + gamePopularityPercent(title.year, year) +
                        "% · procura adicional efetiva: +" + (gpuGameAttraction(game, title.id) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 3 }) +
                        "% (requer jogo licenciado, instalado e PC compatível ligado)." : "");
                if (bought && quote.eligiblePcs.length) {
                    const enabled = quote.eligiblePcs.filter(i => gpuGameInstalledOnPc(game, i, title.id));
                    status += enabled.length ?
                        " Instalado no(s) PC(s) " + enabled.map(i => i + 1).join(", ") +
                            ". Valor atual por hora: " + enabled.map(i => "PC " + (i + 1) + " R$ " + gpuGameHourlyRate(game, i, title.id).toFixed(2)).join(" · ") + "."
                        : " Nenhuma instalação ativa. Use os botões abaixo para instalar o jogo.";
                }
                const observed = requested.find(row => row.id === title.id);
                const demand = observed.requested ?
                    "Procura observada: " + observed.requested + " pedidos · " + observed.played +
                        " sessões no título · " + observed.basic + " sessões comuns · " +
                        observed.withoutSession + " pedidos sem sessão concluída · adicional recebido " +
                        currency(observed.premiumRevenue) + "." :
                    "Procura observada: nenhum pedido registrado nesta partida.";
                const coverage = gpuLicenseCoverage(game, title.id);
                const coverageText = coverage ?
                    "Cobertura da licença por adicionais recebidos: " +
                        currency(coverage.premiumRevenue) + " de " + currency(coverage.licenseCost) +
                        " (" + coverage.coveragePercent.toLocaleString("pt-BR") + "%). " +
                        (coverage.covered ? "Os adicionais igualaram o custo nominal da licença." :
                            "Faltam " + currency(coverage.remaining) + " em adicionais para igualar apenas a licença.") +
                        " Não inclui GPU, Windows, energia ou demais despesas; não é lucro." : null;
                const installations = [];
                let bulk = null;
                if (bought && quote.eligiblePcs.length) {
                    for (const i of quote.eligiblePcs) {
                        const installed = gpuGameInstalledOnPc(game, i, title.id);
                        const job = gpuGameInstallJob(game, i);
                        const downloading = job?.id === title.id;
                        const blocked = !stationPoweredOn(game, i) ? "Ligue o computador para alterar os jogos." :
                            stationHasCustomer(game, i) ? "Aguarde o cliente sair do PC." :
                                game.repairJobs?.some(j => j.pc === i && j.phase !== "leaving") ? "Aguarde a manutenção concluir." : "";
                        installations.push({
                            id: title.id, pc: i, downloading,
                            buttonLabel: downloading ? "Cancelar download PC " + (i + 1) :
                                (installed ? "Remover do PC " : "Instalar no PC ") + (i + 1),
                            buttonDisabled: !downloading && (!!blocked || !!job),
                            buttonTitle: downloading ? "Cancelar a instalação sem custo, preservando a licença." :
                                blocked || (job ? "Aguarde o download atual deste PC." : "Instalação e remoção gratuitas; a licença pertence à lan house."),
                            progress: downloading ? { durationMinutes: job.durationMinutes, elapsedMinutes: job.elapsedMinutes } : null
                        });
                    }
                    const pending = quote.eligiblePcs.filter(i => !gpuGameInstalledOnPc(game, i, title.id));
                    if (pending.length) {
                        const ready = pending.filter(i => !gpuGameInstallJob(game, i) && stationPoweredOn(game, i) && !stationHasCustomer(game, i) &&
                            !game.repairJobs?.some(j => j.pc === i && j.phase !== "leaving"));
                        bulk = { id: title.id, label: "Instalar nos PCs disponíveis (" + ready.length + "/" + pending.length + ")",
                            disabled: ready.length === 0, title: ready.length ? "Distribuir sem cobrança. PCs ocupados/desligados ficam para depois." :
                                "Aguarde PCs livres, ligados e fora de manutenção." };
                    }
                }
                return {
                    id: title.id, heading: title.name + " · " + title.year,
                    requirements: "Requer GPU " + (gpu?.name ?? title.minGpu) + " ou superior e " + (os?.name ?? title.minWindows) + " licenciado.",
                    status, demand, coverage: coverageText,
                    buyLabel: bought ? "Licenciado" : year < title.year ? "🔒 Disponível em " + title.year : "Licenciar · R$ " + title.cost,
                    buyDisabled: !quote.ok,
                    buyTitle: quote.ok ? "Licença para todo o estabelecimento, uso restrito a máquinas compatíveis." : quote.message,
                    installations, bulk
                };
            });
            return { downloads, note, cards };
        } };
}
