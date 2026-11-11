/** Revision-aware cloud save operations; local game state is restored only with confirmation. */
export function createCloudSaveController(port, deps) {
    let revision;
    return {
        reset() { revision = undefined; },
        async read(backup = false, restoreGame = false) {
            if (!deps.hasSession())
                throw Error("Entre na conta primeiro.");
            const result = await deps.api("/v1/saves/main" + (backup ? "?backup=true" : ""));
            revision = result.revision;
            if (!result.save) {
                deps.cloudState.textContent = "Não há save nesta posição da nuvem.";
                return;
            }
            if (restoreGame) {
                const restore = port.prepareRestore(JSON.stringify(result.save));
                if (window.confirm(backup ? "Restaurar o backup neste navegador?" : "Restaurar a partida da nuvem neste navegador?"))
                    restore();
            }
            deps.cloudState.textContent = restoreGame ? "Consulta concluída." : "Save encontrado na nuvem; revisão consultada. Restauração não foi automática.";
        },
        async save() {
            if (revision === undefined)
                throw Error("Consulte a nuvem antes de salvar.");
            const result = await deps.api("/v1/saves/main", { expectedRevision: revision,
                save: JSON.parse(port.exportSaveText()) });
            revision = result.revision;
            deps.cloudState.textContent = "Save confirmado na nuvem. O save local permanece preservado.";
        }
    };
}
