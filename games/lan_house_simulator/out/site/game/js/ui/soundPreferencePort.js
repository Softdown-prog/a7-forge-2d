export function createSoundPreferencePort(storage) {
    const key = "lhs.sound";
    return {
        read() {
            try {
                return storage.get(key) !== "off";
            }
            catch {
                return true;
            }
        },
        update(enabled, mixer) {
            // Audio must switch even if private mode or quota prevents persistence.
            mixer.setEnabled(enabled);
            try {
                storage.set(key, enabled ? "on" : "off");
            }
            catch { }
        }
    };
}
