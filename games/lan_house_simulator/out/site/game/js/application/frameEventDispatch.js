export function dispatchFrameEvents(options) {
    const arrivedMail = options.playing ? options.countNewMail() : 0;
    if (arrivedMail > 0 && !options.isDocumentHidden())
        options.notifyMail();
    options.feedback.payments(options.playing);
    options.updateServed();
    options.feedback.sales(options.playing);
    options.feedback.prints(options.playing);
    options.feedback.keyboards(options.playing);
    options.updatePurchases();
    options.feedback.speech(options.playing);
}
