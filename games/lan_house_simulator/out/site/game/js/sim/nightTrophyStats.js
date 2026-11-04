export function summarizeNightTrophies(trophies = []) {
    const counts = new Map();
    let finalsTwo = 0, finalsThree = 0;
    for (const trophy of trophies) {
        if (trophy.participants === 2)
            finalsTwo++;
        else if (trophy.participants === 3)
            finalsThree++;
        const previous = counts.get(trophy.winnerId);
        if (previous) {
            previous.titles++;
            previous.lastFridayDay = Math.max(previous.lastFridayDay, trophy.fridayDay);
        }
        else {
            counts.set(trophy.winnerId, { winnerId: trophy.winnerId, titles: 1, lastFridayDay: trophy.fridayDay });
        }
    }
    const champions = [...counts.values()].sort((a, b) => b.titles - a.titles ||
        b.lastFridayDay - a.lastFridayDay || a.winnerId - b.winnerId);
    return { total: trophies.length, uniqueChampions: champions.length,
        finalsTwo, finalsThree, champions };
}
