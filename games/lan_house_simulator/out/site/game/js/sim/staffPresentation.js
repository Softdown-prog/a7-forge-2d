import { employeeHired } from "./staff.js?v=1507cb2cfb2d";
/** Presentação pura dos serviços: não modifica chamados, economia nem saves. */
export function workProgress(job) {
    if (job.phase !== "working")
        return null;
    const duration = "duration" in job ? job.duration : 9;
    return Math.min(100, Math.max(0, Math.floor(100 * job.progress / Math.max(1, duration))));
}
/** Resumo legível no mapa e em Administração; fases vêm dos jobs reais. */
export function workPhaseLabel(role, job) {
    if (job.phase === "arriving")
        return "A caminho";
    if (job.phase === "leaving")
        return "Saindo";
    return role === "cleaner" ? "Limpando" : "Reparando";
}
export function staffActivity(s, role) {
    const jobs = role === "cleaner" ? (s.cleaningJob ? [s.cleaningJob] : []) : (s.repairJobs ?? []);
    if (!jobs.length)
        return { phase: "idle",
            label: employeeHired(s, role) ? "Contratado · aguardando necessidade" : "Sem contrato · serviço avulso disponível",
            percent: null, activeJobs: 0 };
    // Atendimento em andamento tem prioridade, depois deslocamento e saída.
    const primary = jobs.find(j => j.phase === "working") ?? jobs.find(j => j.phase === "arriving") ?? jobs[0];
    const progress = workProgress(primary);
    const target = role === "technician" && "pc" in primary ? " · PC " + (primary.pc + 1) : "";
    const others = jobs.length > 1 ? " · +" + (jobs.length - 1) + " atendimento(s)" : "";
    const done = primary.phase === "leaving" ? " · atendimento encerrado" : "";
    const label = workPhaseLabel(role, primary) + target +
        (progress === null ? "" : " · " + progress + "%") + done + others;
    return { phase: primary.phase, label, percent: progress, activeJobs: jobs.length };
}
