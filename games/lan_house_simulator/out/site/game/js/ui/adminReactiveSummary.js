const previous = new WeakMap();
export function publishAngularAdminSummary(doc, area, summary) {
    // The native area is named "computers", while its existing Angular host
    // is singular. The incorrect plural host silently suppressed every update.
    const host = area === "computers" ? "angular-computer-workspace" : "angular-" + area + "-workspace";
    if (!doc.getElementById(host) ||
        typeof doc.dispatchEvent !== "function" ||
        typeof CustomEvent !== "function")
        return false;
    const key = JSON.stringify(summary);
    let states = previous.get(doc);
    if (!states) {
        states = new Map();
        previous.set(doc, states);
    }
    if (states.get(area) === key)
        return false;
    states.set(area, key);
    doc.dispatchEvent(new CustomEvent("lhs:admin-" + area + "-updated", { detail: summary }));
    return true;
}
