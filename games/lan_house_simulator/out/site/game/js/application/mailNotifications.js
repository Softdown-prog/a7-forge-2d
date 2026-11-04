export function mailBaseline(messages) {
    return new Set((messages ?? []).map(n => n.id));
}
export function consumeNewMail(known, messages) {
    let count = 0;
    for (const mail of messages ?? []) {
        if (known.has(mail.id))
            continue;
        known.add(mail.id);
        if (!mail.read)
            count++;
    }
    return count;
}
