/** The caller owns the cached paths; this mapper never mutates or recalculates geometry. */
export function serviceAccessStatusSnapshot(issues) {
    const count = issues.length;
    return {
        count,
        summary: count ? count + " destino(s) sem passagem para atendimento." :
            "Nenhum destino com necessidade de atendimento está bloqueado.",
        destinations: count ? issues.map(issue => issue.label + " · sem rota desde a porta").join(" · ") :
            "Uma ocorrência futura só será verificada quando precisar de atendimento.",
        showDisabled: count === 0,
        showLabel: "Ver bloqueios no salão (" + count + ")",
        mapHint: count ? issues.map(issue => issue.label).join(", ") +
            ": sem acesso. Abra uma porta ou reorganize o salão." :
            "Nenhum destino está bloqueado. Você pode fechar as marcações."
    };
}
