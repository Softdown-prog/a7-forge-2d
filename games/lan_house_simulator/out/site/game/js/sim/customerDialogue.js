export const PRAISE_LINES = [
    "Curti demais!",
    "PC voando hoje!",
    "Atendimento nota dez!",
    "Volto com certeza!",
    "Que lugar bacana!",
    "Jogatina foi boa!"
];
export const COMPLAINT_LINES = {
    queue: ["Que fila enorme!", "Essa fila não anda!", "Cadê um PC livre?"],
    outage: ["Internet caiu!", "Conexão tá instável!", "Assim não dá pra jogar!"],
    "slow-internet": ["Internet lenta!", "Conexão tá instável!", "Assim não dá pra jogar!"],
    wait: ["Demorou demais!", "Essa fila não anda!", "Cadê um PC livre?"],
    price: ["Está caro!", "Esse preço tá salgado!"]
};
/** Indexado pelo ID já existente do cliente: falas variadas sem consumo de RNG. */
export function praiseLine(customerId) {
    return PRAISE_LINES[Math.abs(Math.trunc(customerId)) % PRAISE_LINES.length];
}
export function complaintLine(reason, customerId) {
    const lines = COMPLAINT_LINES[reason];
    return lines[Math.abs(Math.trunc(customerId)) % lines.length];
}
/** Falas são apenas apresentação: seleção determinística, sem consumir o RNG do jogo. */
export const SPEECH_COOLDOWN_MINUTES = 14;
export function shouldShowCustomerSpeech(customerId, text, minute, kind) {
    // 30% de críticas (informação útil), 15% de elogios. Evita balões a cada compra.
    let hash = (Math.imul(Math.trunc(customerId), 0x9e3779b1) ^ Math.imul(Math.trunc(minute), 0x85ebca6b)) >>> 0;
    for (let i = 0; i < text.length; i++)
        hash = Math.imul(hash ^ text.charCodeAt(i), 16777619) >>> 0;
    return hash % 100 < (kind === "complaint" ? 30 : 15);
}
