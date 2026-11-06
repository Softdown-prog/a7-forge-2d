export function topGamesKnowsGame(s, platform, gameId) {
    return (s.topGamesReceivedIssues ?? []).includes("top-games-" + platform + "-" + gameId);
}
export function topGamesCanBuy(s, platform, gameId, alreadyOwned) {
    // Old campaigns without the marker have no retroactive magazine debt.
    return s.topGamesUnlockMode !== "magazines" || alreadyOwned > 0 ||
        topGamesKnowsGame(s, platform, gameId);
}
export function validTopGamesUnlockMode(s) {
    return s.topGamesUnlockMode === undefined ||
        (s.topGamesUnlockMode === "magazines" && s.economyVersion === 2);
}
