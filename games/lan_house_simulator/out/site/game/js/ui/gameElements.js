/** Validate the browser shell once; controllers receive stable, typed roots. */
export function locateGameElements(document) {
    const required = (selector) => {
        const element = document.querySelector(selector);
        if (!element)
            throw new Error("DOM do jogo incompleto: " + selector);
        return element;
    };
    const canvas = required("#game");
    return { document, canvas,
        admin: required("#admin"), events: required("#events"), status: required("#status"), controls: required("#open-admin"),
        shop: document.querySelector("#shop"), shopCatalog: document.querySelector("#shop-catalog"),
        startScreen: required("#start-screen"), gameApp: required("#game-app"), continueButton: required("#menu-continue"), settingsPanel: required("#menu-settings"), soundToggle: required("#option-sound"),
        importFile: required("#save-import-file"), saveMessage: required("#save-message"), exportButton: required("#save-export"),
        autosaveState: document.querySelector("#autosave-state"), autosaveIndicator: document.querySelector(".hud-autosave"),
        menuCanvas: document.querySelector("#menu-scene"),
        noticesList: document.querySelector("#notices-list"), maintenancePanel: required("#pc-maintenance"),
        gpuList: document.getElementById("gpu-catalog"), gpuPcChoice: document.getElementById("gpu-pc-choice"), licensePanel: document.getElementById("windows-license-list"), gpuGamePanel: document.getElementById("gpu-game-catalog"), eraGamePanel: document.getElementById("era-game-catalog"),
        retailControls: document.getElementById("retail-price-controls"), discControls: document.getElementById("disc-copy-price-controls"), printControls: document.getElementById("print-price-controls"),
        placementToolbar: document.getElementById("placement-toolbar"), placementHelp: document.getElementById("placement-help"), stage: canvas.closest(".stage")
    };
}
