export function createFrameFeedbackPort(getState, audio, queues) {
    return {
        payments(playing) {
            for (const e of (playing ? (getState().paymentEffects?.splice(0) ?? []) : [])) {
                queues.payments.push({ ...e, age: 0 });
                if (queues.payments.length > 12)
                    queues.payments.shift();
                audio.income("payment");
            }
        },
        sales(playing) {
            for (const e of (playing ? (getState().saleEffects?.splice(0) ?? []) : [])) {
                if (Number.isFinite(e.amount) && Number.isFinite(e.x) && Number.isFinite(e.y)) {
                    queues.sales.push({ amount: e.amount, x: e.x, y: e.y, age: 0 });
                    if (queues.sales.length > 12)
                        queues.sales.shift();
                }
                audio.income("sale");
                if (e.item === "soda")
                    audio.soda();
                else
                    audio.candy();
            }
        },
        prints(playing) {
            for (const e of (playing ? (getState().printEffects?.splice(0) ?? []) : [])) {
                if (Number.isInteger(e.customerId))
                    audio.printer();
            }
        },
        keyboards(playing) {
            for (const e of (playing ? (getState().keyboardEffects?.splice(0) ?? []) : [])) {
                if (Number.isInteger(e.customerId) && Number.isInteger(e.pcIndex))
                    audio.keyboard();
            }
        },
        speech(playing) {
            for (const e of (playing ? (getState().speechEffects?.splice(0) ?? []) : [])) {
                queues.speech.push({ ...e, age: 0 });
                if (queues.speech.length > 8)
                    queues.speech.shift();
            }
        }
    };
}
