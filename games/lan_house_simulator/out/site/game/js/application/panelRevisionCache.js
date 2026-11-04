/** Memoizes panel revisions using the existing JSON equality rule. */
export function createPanelRevisionCache() {
    const revisions = new Map();
    return (name, revision, force) => {
        const key = JSON.stringify(revision);
        if (!force && revisions.get(name) === key)
            return false;
        revisions.set(name, key);
        return true;
    };
}
