export function createServiceAccessInspectionCache(compute, now) {
    let cached = [];
    let updatedAt = -10000;
    return {
        inspect(force = false) {
            const current = now();
            // Preserve the 1600ms threshold, including strict greater-than comparison.
            if (force || current - updatedAt > 1600) {
                const next = compute();
                cached = next;
                updatedAt = current;
            }
            return cached;
        },
        snapshot: () => cached,
        invalidate() { cached = []; updatedAt = -10000; }
    };
}
