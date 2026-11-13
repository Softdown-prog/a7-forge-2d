import { createAccountClient } from "./accountClient.js?v=c12101473308";
import { renderCosmeticCard } from "./account/cosmeticCard.js?v=c12101473308";
import { ensureAccountDialog } from "./account/dialog.js?v=c12101473308";
import { createCloudSaveController } from "./account/cloudSaves.js?v=c12101473308";
import { renderHistory } from "./account/history.js?v=c12101473308";
import { renderDonate } from "./account/donate.js?v=c12101473308";
const cookiesText = (amount) => amount.toLocaleString("pt-BR") + " Cookies";
function line(text, cls = "") {
    const node = document.createElement("p");
    node.className = cls;
    node.textContent = text;
    return node;
}
export function mountCloudControls(_anchor, port) {
    const COOKIE_COSMETICS = port.catalog;
    const dialog = ensureAccountDialog();
    const find = (selector) => dialog.querySelector(selector);
    const alert = find("#account-alert");
    const balance = find("#account-balance"), spent = find("#account-spent"), owned = find("#account-owned");
    const connection = find("#account-connection"), authBox = find("#account-login-box");
    const email = find("#account-email"), password = find("#account-password");
    const catalog = find("#account-catalog"), inventory = find("#account-inventory"), history = find("#account-transactions");
    const donate = find("#account-donate"), cloudState = find("#account-cloud-state");
    let config = null, store = null, client = null;
    let account = null;
    let loading = false, openOfflineReason = "A conexão de conta ainda não está disponível nesta versão.";
    const unequipped = new Set();
    const controls = Array.from(dialog.querySelectorAll("button"));
    const cloudSaves = createCloudSaveController(port, { api: (path, body) => api(path, body), hasSession: () => !!client?.hasSession(), cloudState });
    const cosmeticName = (id) => COOKIE_COSMETICS.find(i => i.id === id)?.name ?? "Item " + id;
    const isConfigured = () => !!(config?.enabled && config.apiUrl.startsWith("https://") && config.firebaseApiKey);
    const status = (message, kind = "info") => {
        alert.textContent = message;
        alert.dataset.kind = kind;
    };
    function switchTab(next) {
        for (const section of Array.from(dialog.querySelectorAll("[data-account-page]")))
            section.hidden = section.dataset.accountPage !== next;
        for (const btn of Array.from(dialog.querySelectorAll("[data-account-tab]")))
            btn.setAttribute("aria-selected", String(btn.dataset.accountTab === next));
    }
    function setBusy(active) {
        loading = active;
        for (const b of controls)
            b.disabled = active;
        // Não executa requisições durante cada frame de renderização.
    }
    async function action(fn) {
        if (loading)
            return;
        setBusy(true);
        try {
            await fn();
        }
        catch (e) {
            if (e?.status === 401)
                clearAccount();
            status(e instanceof Error ? e.message : "Não foi possível concluir. A partida local permanece salva.", "error");
        }
        finally {
            setBusy(false);
            render();
        }
    }
    function clearAccount() {
        client?.signOut();
        account = null;
        cloudSaves.reset();
        port.verifyCosmetics([]);
        unequipped.clear();
    }
    function synchronizeAccount(next) {
        account = next;
        port.verifyCosmetics(Array.isArray(next.entitlements) ? next.entitlements : []);
        for (const id of unequipped)
            port.toggleCosmetic(id, false);
        render();
    }
    const refresh = async () => {
        if (!client?.hasSession())
            throw Error("Entre na conta para consultar seu saldo.");
        const data = await api("/v1/account");
        if (!Number.isSafeInteger(data.cookiesBalance) || !Number.isSafeInteger(data.cookiesSpentTotal) || !Array.isArray(data.entitlements) || !Array.isArray(data.transactions))
            throw Error("Dados da conta indisponíveis. Tente atualizar novamente.");
        synchronizeAccount(data);
        status("Saldo, itens e movimentações atualizados.", "success");
    };
    async function connected(profile) {
        if (!profile.emailVerified) {
            account = null;
            port.verifyCosmetics([]);
            throw Error("Confirme seu email para acessar os Cookies. Use Minha conta no site para reenviar a confirmação.");
        }
        cloudSaves.reset();
        unequipped.clear();
        await refresh();
        authBox.open = false;
    }
    async function api(path, body) {
        if (!client || !isConfigured())
            throw Error("Entre na conta primeiro.");
        return client.api(path, body);
    }
    function createCosmeticCard(item, isOwned) {
        return renderCosmeticCard(item, isOwned, {
            year: port.year(), unequipped, loading, hasSession: !!client?.hasSession(),
            balance: account?.cookiesBalance ?? null,
            serverPrice: store?.items?.[item.id]?.cookies, configured: isConfigured(),
            onToggle: (id, enabled) => port.toggleCosmetic(id, enabled), onStatus: status,
            onRedeem: redeem
        });
    }
    function redeem(item) {
        void action(async () => {
            if (!client?.hasSession() || !account || store?.items?.[item.id]?.cookies !== item.cookies)
                throw Error("Este item não está liberado no servidor.");
            if (!window.confirm(`Resgatar ${item.name} por ${item.cookies} Cookies? O desconto é permanente.`))
                return;
            await api("/v1/items/" + encodeURIComponent(item.id) + "/purchase", {});
            await refresh();
            switchTab("inventory");
            status("Item resgatado e registrado na sua conta.", "success");
        });
    }
    function render() {
        balance.textContent = account ? cookiesText(account.cookiesBalance) : "—";
        spent.textContent = account ? cookiesText(account.cookiesSpentTotal) : "—";
        owned.textContent = account ? String(account.entitlements.filter(id => COOKIE_COSMETICS.some(i => i.id === id)).length) : "—";
        connection.textContent = client?.hasSession() && account ? "Conta conectada. Saldo e resgates verificados pelo servidor." :
            isConfigured() ? "Faça login para ver os seus Cookies. Nenhum saldo é estimado pelo jogo." : openOfflineReason;
        authBox.hidden = !isConfigured();
        find("#account-refresh").disabled = !client?.hasSession() || loading;
        find("#account-logout").disabled = !client?.hasSession() || loading;
        catalog.replaceChildren();
        const ownedIds = new Set(account?.entitlements ?? []);
        for (const item of COOKIE_COSMETICS)
            catalog.append(createCosmeticCard(item, ownedIds.has(item.id)));
        inventory.replaceChildren();
        const acquired = COOKIE_COSMETICS.filter(item => ownedIds.has(item.id));
        if (!client?.hasSession())
            inventory.append(line("Entre na sua conta para consultar os itens adquiridos.", "account-empty"));
        else if (!acquired.length)
            inventory.append(line("Nenhum cosmético adquirido ainda.", "account-empty"));
        else
            for (const item of acquired)
                inventory.append(createCosmeticCard(item, true));
        renderHistory(history, account, !!client?.hasSession(), cosmeticName);
        renderDonate(donate, store);
    }
    for (const btn of Array.from(dialog.querySelectorAll("[data-account-tab]")))
        btn.addEventListener("click", () => switchTab(btn.dataset.accountTab));
    find("#account-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", e => { if (e.target === dialog)
        dialog.close(); });
    for (const id of ["menu-account", "open-account"]) {
        document.getElementById(id)?.addEventListener("click", () => {
            if (!dialog.open)
                dialog.showModal();
            switchTab("summary");
            render();
            if (client?.hasSession())
                void action(refresh);
        });
    }
    find("#account-refresh").addEventListener("click", () => void action(refresh));
    find("#account-signin").addEventListener("click", () => void action(async () => {
        if (!client)
            throw Error(openOfflineReason);
        const entered = password.value;
        password.value = "";
        clearAccount();
        await connected(await client.signIn(email.value.trim(), entered));
    }));
    find("#account-signup").addEventListener("click", () => window.open("/conta/?modo=cadastro", "_top"));
    find("#account-recovery").addEventListener("click", () => window.open("/conta/?modo=recuperar", "_top"));
    find("#account-logout").addEventListener("click", () => void action(async () => {
        clearAccount();
        password.value = "";
        authBox.open = true;
        status("Conta desconectada. Seu progresso local permanece salvo.");
    }));
    find("#account-cloud-check").addEventListener("click", () => void action(() => cloudSaves.read(false, false)));
    find("#account-cloud-load").addEventListener("click", () => void action(() => cloudSaves.read(false, true)));
    find("#account-cloud-backup").addEventListener("click", () => void action(() => cloudSaves.read(true, true)));
    find("#account-cloud-save").addEventListener("click", () => void action(() => cloudSaves.save()));
    switchTab("summary");
    status("Sua conta é opcional. A partida gratuita funciona normalmente.");
    render();
    void (async () => {
        try {
            const response = await fetch("./online-config.json", { cache: "no-store" });
            config = await response.json();
            if (!isConfigured()) {
                openOfflineReason = "Minha Conta está pronta, mas a conexão online deste deploy está desativada. O saldo só aparecerá depois da configuração do login.";
                status(openOfflineReason);
                render();
                return;
            }
            client = createAccountClient(config);
            const res = await fetch(config.apiUrl + "/v1/config", { signal: AbortSignal.timeout(20_000) });
            if (!res.ok)
                throw Error("Configuração do servidor indisponível.");
            store = await res.json();
            if (client.hasSession())
                await action(async () => { const profile = await client.restore(); if (profile)
                    await connected(profile); });
            else
                status("Entre na conta para consultar seus Cookies e cosméticos.");
        }
        catch {
            openOfflineReason = "Não foi possível conectar à conta neste momento. Nenhum saldo foi alterado.";
            status(openOfflineReason, "error");
        }
        render();
    })();
}
