export function placementStatusSnapshot(s) {
    const active = Boolean(s.placingKind || s.relocating || s.wallMode || s.installingAnnexPc);
    const hint = s.installingAnnexPc ?
        (s.notice || "Escolha um círculo verde numa área ampliada (esquerda, direita ou fundos). PC completo: R$ " + s.annexPcCost + ". A cobrança só ocorre ao selecionar a vaga.") :
        s.wallMode ?
            (s.notice || (s.wallMode === "build" ? "Selecione a borda, confira a prévia e confirme. Cada segmento custa R$ " + s.wallCost + "." : "Toque numa divisória para " + (s.wallMode === "door" ? "instalar uma porta: R$ 80." : "remover parede ou porta."))) :
            s.relocating ?
                (s.notice || (s.relocationFrom ? "Escolha o destino verde ou toque em Girar para mudar a orientação." : "Toque no móvel em dourado e escolha a nova posição. Sem custos.")) :
                s.placingKind ? (s.notice || "Escolha uma posição verde para " + s.placingName + ". Clique para comprar e instalar; cancelar não cobra nada.") : "";
    return {
        toolbarVisible: active, stagePlacing: active,
        rotateHidden: !(s.placingKind && s.placingKind !== "poster") && (!s.relocating || !s.selectedFurnitureKind),
        rotateDisabled: s.placingKind ? s.placingKind === "poster" : !s.selectedFurnitureKind || s.selectedFurnitureKind === "poster",
        confirmWallHidden: !s.wallMode,
        confirmWallDisabled: !s.hasPendingWall || (s.wallMode === "build" && !s.canBuildPendingWall),
        turnWallHidden: s.wallMode !== "build",
        turnWallDisabled: !s.hasPendingWall,
        hint
    };
}
