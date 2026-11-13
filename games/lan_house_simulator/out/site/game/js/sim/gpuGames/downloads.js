import { isHistorical } from "../historicalEconomy.js?v=c12101473308";
import { stationPowerCount, stationPoweredOn, stationHasCustomer } from "../stationPower.js?v=c12101473308";
import { gpuGameSpec } from "./catalog.js?v=c12101473308";
import { gpuGameCompatible, gpuGameEligiblePcs, gpuGameInstalledOnPc } from "./compatibility.js?v=c12101473308";
/** Duração fixa no começo; upgrades de internet afetam apenas os próximos. */
export function gpuGameInstallDuration(s, id) {
    const base = id === "neon-rush" ? 18 : id === "circuito-competitivo" ? 28 : 40;
    return Math.max(5, Math.ceil(base / Math.max(1, Math.min(3, s.internetTier))));
}
export function gpuGameInstallJob(s, pc) {
    return s.gpuGameInstallJobs?.find(j => j.pc === pc);
}
export function gpuGameInstallPausedReason(s, pc) {
    if (!stationPoweredOn(s, pc))
        return "PC desligado";
    if (s.totalMinutes < s.offlineUntil)
        return "sem internet";
    if (stationHasCustomer(s, pc))
        return "PC ocupado";
    if (s.repairJobs?.some(j => j.pc === pc && j.phase !== "leaving"))
        return "em manutenção";
    // O download permanece em pausa quando a GPU ou a licença Windows muda.
    // Sem esse diagnóstico ele ficava retido sem motivo visível ao jogador.
    const job = gpuGameInstallJob(s, pc);
    const title = job && gpuGameSpec(job.id);
    if (title && !gpuGameCompatible(s, pc, title))
        return "GPU ou Windows incompatível";
    return null;
}
export function validGpuGameInstallJobs(value, s) {
    if (value === undefined)
        return true;
    if (!isHistorical(s) || !Array.isArray(value) ||
        value.length > stationPowerCount(s) || s.gpuGameInstalls === undefined)
        return false;
    const seen = new Set();
    return value.every((job) => {
        if (!job || typeof job !== "object" || Array.isArray(job))
            return false;
        if (!Number.isInteger(job.pc) || job.pc < 0 || job.pc >= stationPowerCount(s) || seen.has(job.pc))
            return false;
        seen.add(job.pc);
        return typeof job.id === "string" && !!gpuGameSpec(job.id) &&
            s.licensedGpuGames?.includes(job.id) === true &&
            s.gpuGameInstalls?.[job.pc]?.includes(job.id) !== true &&
            Number.isInteger(job.durationMinutes) && job.durationMinutes >= 5 && job.durationMinutes <= 40 &&
            Number.isInteger(job.elapsedMinutes) && job.elapsedMinutes >= 0 && job.elapsedMinutes < job.durationMinutes;
    });
}
/** Cada geração de internet suporta 1, 2 ou 3 PCs transferindo por
 * minuto do jogo. Não há custo extra, sorteio nem campo novo no save. */
export function gpuGameDownloadSlots(s) {
    return Math.max(1, Math.min(3, Math.trunc(s.internetTier || 1)));
}
/** Agendamento por rodízio: PCs pausados não ocupam a banda. O índice
 * do minuto absoluto garante o mesmo progresso após importar a partida. */
export function tickGpuGameInstallations(s) {
    const completed = [];
    if (!s.gpuGameInstallJobs?.length)
        return completed;
    const active = s.gpuGameInstallJobs.filter(job => {
        const spec = gpuGameSpec(job.id);
        return !!spec && !gpuGameInstallPausedReason(s, job.pc) && gpuGameCompatible(s, job.pc, spec);
    });
    const selected = new Set();
    if (active.length) {
        const count = Math.min(active.length, gpuGameDownloadSlots(s));
        const start = s.totalMinutes % active.length;
        for (let slot = 0; slot < count; slot++)
            selected.add(active[(start + slot) % active.length]);
    }
    const pending = [];
    for (const job of s.gpuGameInstallJobs) {
        if (!selected.has(job)) {
            pending.push(job);
            continue;
        }
        job.elapsedMinutes++;
        if (job.elapsedMinutes >= job.durationMinutes) {
            const installed = s.gpuGameInstalls?.[job.pc];
            if (installed && !installed.includes(job.id))
                installed.push(job.id);
            completed.push({ pc: job.pc, id: job.id });
        }
        else
            pending.push(job);
    }
    s.gpuGameInstallJobs = pending;
    return completed;
}
export function cancelGpuGameInstallation(s, pc, id) {
    const job = gpuGameInstallJob(s, pc);
    if (!job || job.id !== id)
        return { ok: false, message: "Não há download deste título no PC." };
    s.gpuGameInstallJobs = s.gpuGameInstallJobs.filter(j => j !== job);
    return { ok: true, message: "Download de " + gpuGameSpec(id).name + " cancelado no PC " + (pc + 1) + ". Sem custo." };
}
/** Preserva todos os títulos nas partidas antigas, mas não inventa instalação
 * em computadores adquiridos APÓS a primeira edição. */
function currentGpuInstallRows(s) {
    const legacy = s.gpuGameInstalls === undefined;
    return Array.from({ length: stationPowerCount(s) }, (_, i) => legacy ? [...(s.licensedGpuGames ?? [])] : [...(s.gpuGameInstalls?.[i] ?? [])]);
}
function pcAvailableForGameManagement(s, index) {
    return stationPoweredOn(s, index) && !stationHasCustomer(s, index) &&
        !(s.repairJobs?.some(job => job.pc === index && job.phase !== "leaving") ?? false);
}
/** A licença já foi paga. A instalação exige PC ligado, livre e sem manutenção. */
export function toggleGpuGameInstallation(s, index, id) {
    const game = gpuGameSpec(id);
    if (!game || !s.licensedGpuGames?.includes(id) || !isHistorical(s))
        return { ok: false, message: "É necessário licenciar este jogo primeiro." };
    if (!Number.isInteger(index) || index < 0 || index >= stationPowerCount(s))
        return { ok: false, message: "Computador inexistente." };
    if (!stationPoweredOn(s, index))
        return { ok: false, message: "Ligue o PC " + (index + 1) + " antes de alterar os jogos." };
    if (stationHasCustomer(s, index))
        return { ok: false, message: "PC " + (index + 1) + " ocupado. Aguarde o cliente sair." };
    if (s.repairJobs?.some(job => job.pc === index && job.phase !== "leaving"))
        return { ok: false, message: "Aguarde o reparo do PC " + (index + 1) + "." };
    if (gpuGameInstallJob(s, index))
        return { ok: false, message: "O PC " + (index + 1) + " já está baixando um jogo." };
    const installed = gpuGameInstalledOnPc(s, index, id);
    if (!installed && !gpuGameCompatible(s, index, game))
        return { ok: false, message: "PC " + (index + 1) + " não possui GPU e Windows compatíveis." };
    // A transição inicial copia o estado antigo de todas as estações.
    s.gpuGameInstalls = currentGpuInstallRows(s);
    const row = s.gpuGameInstalls[index];
    if (installed) {
        s.gpuGameInstalls[index] = row.filter(title => title !== id);
        return { ok: true, message: game.name + " removido do PC " + (index + 1) + ". Sem custo." };
    }
    const durationMinutes = gpuGameInstallDuration(s, id);
    (s.gpuGameInstallJobs ??= []).push({ pc: index, id, durationMinutes, elapsedMinutes: 0 });
    return { ok: true, message: "Baixando " + game.name + " no PC " + (index + 1) +
            " · " + durationMinutes + " minutos do jogo. Sem custo." };
}
/** Distribuição gratuita para PCs aptos, sem mexer nas máquinas ocupadas
 * ou desligadas. Nenhuma mutação quando todas as estações estão bloqueadas.
 * O retorno informa quantas instalações foram realizadas ou adiadas. */
export function installGpuGameOnAvailablePcs(s, id) {
    const spec = gpuGameSpec(id);
    if (!spec || !isHistorical(s) || !s.licensedGpuGames?.includes(id))
        return { ok: false, message: "É necessário licenciar este jogo antes de distribuí-lo." };
    const missing = gpuGameEligiblePcs(s, spec).filter(i => !gpuGameInstalledOnPc(s, i, id));
    if (!missing.length)
        return { ok: false, message: spec.name + " já está instalado em todos os PCs compatíveis." };
    const available = missing.filter(i => pcAvailableForGameManagement(s, i) && !gpuGameInstallJob(s, i));
    if (!available.length)
        return { ok: false, message: "Não há PCs livres e ligados para instalar " + spec.name + " agora." };
    s.gpuGameInstalls = currentGpuInstallRows(s);
    const durationMinutes = gpuGameInstallDuration(s, id);
    (s.gpuGameInstallJobs ??= []).push(...available.map(pc => ({ pc, id, durationMinutes, elapsedMinutes: 0 })));
    const waiting = missing.length - available.length;
    return { ok: true, message: "Download de " + spec.name + " iniciado em " + available.length + " PC(s)" +
            (waiting ? "; " + waiting + " aguardando PC disponível" : "") +
            ". Duração: " + durationMinutes + " minutos do jogo. Sem custo." };
}
