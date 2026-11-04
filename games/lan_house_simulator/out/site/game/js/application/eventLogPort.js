export function createEventLogPort(getState) {
    return { snapshot() {
            const recent = getState().eventLog.slice(0, 6);
            return { signature: JSON.stringify(recent), rows: recent.map(record => {
                    const match = record.match(/^(D\d+ [\d:]+) · (.*)$/);
                    const icon = /pagou|Venda/.test(record) ? "coins" :
                        /internet/i.test(record) ? "network" : /PC|computador/i.test(record) ? "computer" : "mail";
                    return { icon, time: match ? match[1] : null, text: match ? match[2] : record };
                }) };
        } };
}
