export function refreshGpuDownloadMeters(panel, active, port) {
    if (!panel || !active)
        return;
    const bandwidth = panel.querySelector("[data-gpu-bandwidth]");
    if (bandwidth)
        bandwidth.textContent = port.bandwidth();
    for (const label of Array.from(panel.querySelectorAll("[data-gpu-download-status]"))) {
        const pc = Number(label.dataset.gpuGamePc), status = port.progress(pc, label.dataset.gpuDownloadStatus ?? "");
        if (status)
            label.textContent = status.label;
    }
    for (const meter of Array.from(panel.querySelectorAll("[data-gpu-download-progress]"))) {
        const pc = Number(meter.dataset.gpuGamePc), status = port.progress(pc, meter.dataset.gpuDownloadProgress ?? "");
        if (status)
            meter.value = status.minutesElapsed;
    }
}
