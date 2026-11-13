import { choice, story } from "../builders.js?v=c12101473308";
/** Independent story catalogue entry: lost-document. */
export const definition = story("Cliente perdeu um trabalho importante", "Uma máquina travou durante uma atividade e o cliente diz ter perdido horas de trabalho.", "problem", [
    choice("document-refund", "Devolver o valor e oferecer ajuda", 45, "Acolhe a reclamação e revisa a máquina", "good", { reputation: 2 }),
    choice("document-extra", "Oferecer sessão gratuita", 20, "Compensa parte do transtorno", "mixed", { reputation: 1 }),
    choice("document-refuse", "Recusar qualquer compensação", 0, "Conflito pode se tornar público", "bad", { reputation: -4, visitors: .94, visitorDays: 7 })
], "O cliente aceitou a ajuda e voltou depois para agradecer.", "O cliente aceitou o crédito, mas ainda está preocupado com o conteúdo perdido.", "O cliente contou o caso a conhecidos, gerando críticas ao atendimento da lan house.");
