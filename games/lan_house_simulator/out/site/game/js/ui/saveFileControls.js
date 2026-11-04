export function installSaveFileControls(actions) {
    const { importFile, importButton, exportButton, canExport, exportSnapshot, importText, notify } = actions;
    exportButton.addEventListener("click", () => {
        if (!canExport()) {
            notify("Nenhuma partida disponível para exportar.");
            return;
        }
        try {
            const { contents, filename } = exportSnapshot();
            const blob = new Blob([contents], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.append(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);
            notify("Partida salva em arquivo. Você pode carregá-la em outro navegador.");
        }
        catch {
            notify("Não foi possível exportar esta partida.");
        }
    });
    importButton?.addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", async () => {
        const file = importFile.files?.[0];
        importFile.value = "";
        if (!file)
            return;
        if (file.size > 2_000_000) {
            notify("O arquivo excede o limite de 2 MB.");
            return;
        }
        try {
            await importText(await file.text());
        }
        catch (error) {
            notify(error instanceof Error ? error.message : "Não foi possível importar o arquivo.");
        }
    });
}
