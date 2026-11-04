export function createEventLogRefresh(snapshot, render) {
    let lastSignature = "";
    return { refresh() {
            const value = snapshot();
            if (value.signature === lastSignature)
                return false;
            render(value);
            lastSignature = value.signature;
            return true;
        } };
}
