import { choice, story } from "../builders.js?v=5a84ef5bc1ea";
/** Independent story catalogue entry: privacy-exposure. */
export const definition = story("Dados pessoais ficaram no computador", "Uma pessoa encontrou arquivos pessoais do cliente anterior. A configuração das estações precisa de revisão.", "problem", [
    choice("privacy-specialist", "Contratar revisão profissional", 185, "Limpa perfis e configura proteção das estações", "good", { reputation: 2 }),
    choice("privacy-clean", "Fazer limpeza assistida dos perfis", 65, "Reduz o problema, mas requer acompanhamento", "mixed", { reputation: 1 }),
    choice("privacy-ignore", "Minimizar a reclamação", 0, "Clientes podem deixar de confiar no estabelecimento", "bad", { reputation: -5, visitors: .87, visitorDays: 12 })
], "O cliente foi informado das medidas tomadas e a confiança começou a voltar.", "A limpeza removeu arquivos antigos, mas outra estação apresentou configuração parecida.", "Outro cliente encontrou arquivos esquecidos e a notícia afetou a reputação do salão.");
