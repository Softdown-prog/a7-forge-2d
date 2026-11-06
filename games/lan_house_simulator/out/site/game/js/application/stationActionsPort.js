import { pcCount } from "../sim/engine.js?v=1426089a9f9b";
import { buyPlatform, buyPart, HARDWARE_LABELS } from "../sim/hardware.js?v=1426089a9f9b";
import { buyGpu, GPU_CATALOG } from "../sim/gpu.js?v=1426089a9f9b";
import { WINDOWS_ERAS, licenseWindows } from "../sim/era.js?v=1426089a9f9b";
import { LCD_CATALOG, buyLcdKit } from "../sim/computerModels.js?v=1426089a9f9b";
import { toggleStationPower } from "../sim/stationPower.js?v=1426089a9f9b";
import { installLinux, bootWindows } from "../sim/linuxQuest.js?v=1426089a9f9b";
import { repairComputer, upgradeComputer } from "../sim/economy.js?v=1426089a9f9b";
const invalid = { ok: false, message: "Estação ou item inválido." };
const validIndex = (state, index) => Number.isInteger(index) && index >= 0 && index < pcCount(state);
const isKind = (kind) => Object.hasOwn(HARDWARE_LABELS, kind);
const isEdition = (id) => WINDOWS_ERAS.some(x => x.id === id);
const isGpu = (id) => GPU_CATALOG.some(x => x.id === id);
const isLcd = (id) => LCD_CATALOG.some(x => x.id === id);
export function createStationActionsPort(getState) {
    return {
        count: () => pcCount(getState()),
        isHardwareTab: tab => tab === "platform" || isKind(tab),
        isHardwareKind: isKind, isWindowsEdition: isEdition, isGpuId: isGpu, isLcdId: isLcd,
        platform(index, id) { const s = getState(); return validIndex(s, index) && id ? buyPlatform(s, index, id) : invalid; },
        component(index, kind, id) { const s = getState(); return validIndex(s, index) && isKind(kind) && !!id ? buyPart(s, index, kind, id) : invalid; },
        gpu(index, id) { const s = getState(); return validIndex(s, index) && isGpu(id) ? buyGpu(s, index, id) : invalid; },
        windows(index, id) { const s = getState(); return validIndex(s, index) && isEdition(id) ? licenseWindows(s, index, id) : invalid; },
        linux(index, action) {
            const s = getState();
            return validIndex(s, index) ?
                action === "install" ? installLinux(s, index) : action === "windows" ? bootWindows(s, index) : invalid : invalid;
        },
        lcd(index, id) { const s = getState(); return validIndex(s, index) && isLcd(id) ? buyLcdKit(s, index, id) : invalid; },
        power(index) { const s = getState(); return validIndex(s, index) ? toggleStationPower(s, index) : invalid; },
        repair(index) { const s = getState(); return validIndex(s, index) ? repairComputer(s, index) : invalid; },
        upgrade(index) { const s = getState(); return validIndex(s, index) ? upgradeComputer(s, index) : invalid; }
    };
}
