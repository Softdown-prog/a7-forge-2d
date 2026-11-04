import { stockItem, contractSupplier, licenseGames, upgradeInternet, repairInternet } from "../sim/economy.js?v=fa1ff35e3337";
import { launchPromotion } from "../sim/promotion.js?v=fa1ff35e3337";
import { requestCleaning } from "../sim/services.js?v=fa1ff35e3337";
import { employeeHired, hireEmployee, dismissEmployee } from "../sim/staff.js?v=fa1ff35e3337";
const invalidItem = { ok: false, message: "Mercadoria inválida." };
const invalidRole = { ok: false, message: "Função de funcionário inválida." };
const isItem = (item) => item === "soda" || item === "candy" || item === "snacks";
const isRole = (role) => role === "cleaner" || role === "technician";
export function createServiceActionsPort(getState) {
    return {
        restock(item) { return isItem(item) ? stockItem(getState(), item) : invalidItem; },
        contractSupplier() { return contractSupplier(getState()); },
        promote() { return launchPromotion(getState()); },
        upgradeInternet() { return upgradeInternet(getState()); },
        repairInternet() { return repairInternet(getState()); },
        licenseGames() { return licenseGames(getState()); },
        toggleEmployee(role) {
            if (!isRole(role))
                return invalidRole;
            const state = getState();
            return employeeHired(state, role) ? dismissEmployee(state, role) : hireEmployee(state, role);
        },
        cleanNow() { return requestCleaning(getState()); }
    };
}
