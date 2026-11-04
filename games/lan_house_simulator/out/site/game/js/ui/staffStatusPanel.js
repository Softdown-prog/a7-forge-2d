export function renderStaffStatusPanel(view, setText, doc) {
    const cleaner = doc.querySelector("#clean-bins");
    if (cleaner)
        cleaner.textContent = view.cleanerControl;
    const technician = doc.querySelector("#hire-technician");
    if (technician)
        technician.textContent = view.technicianControl;
    setText("staff-summary", view.summary);
    setText("cleaner-activity", view.cleanerActivity);
    setText("technician-activity", view.technicianActivity);
    for (const [id, progress] of [
        ["cleaner-progress", view.cleanerProgress],
        ["technician-progress", view.technicianProgress]
    ]) {
        const meter = doc.getElementById(id);
        if (meter instanceof HTMLProgressElement) {
            meter.hidden = progress === null;
            meter.value = progress ?? 0;
        }
    }
    setText("bin-status", view.binSummary);
    const cleanNow = doc.querySelector("#clean-bins-now");
    if (cleanNow) {
        cleanNow.textContent = view.cleaningLabel;
        cleanNow.disabled = view.cleaningDisabled;
    }
}
