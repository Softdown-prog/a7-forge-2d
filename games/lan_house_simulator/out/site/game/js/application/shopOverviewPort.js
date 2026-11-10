import { roomBounds } from "../sim/room.js?v=229a76357973";
import { wallZoneCount } from "../sim/walls.js?v=229a76357973";
import { pcCount } from "../sim/engine.js?v=229a76357973";
export function createShopOverviewPort(getState, getObjectCount, getAnnexSlotCount) {
    return { snapshot() {
            const game = getState();
            const objectCount = getObjectCount();
            const partitionCount = (game.interiorWalls?.length ?? 0) + (game.interiorDoors?.length ?? 0);
            const b = roomBounds(game), e = game.roomExtensions ?? { west: 0, east: 0, south: 0 };
            const cashText = "Caixa R$ " + game.cash + " · PCs " + pcCount(game) + "/" +
                (3 + game.expansionLevel * 2 + getAnnexSlotCount()) +
                " · Tamanho do salão " + (b.maxX - b.minX) + "×" + (b.maxY - b.minY) +
                " · Ampliações: esquerda " + e.west + "/5 · direita " + e.east + "/5 · fundos " + (e.north ?? 0) + "/5 · Salas " + wallZoneCount(game);
            return {
                organizeText: "Organizar salão: " + objectCount + " objetos",
                demolishText: "Remover paredes e portas (" + partitionCount + ")",
                demolishDisabled: !partitionCount,
                cashText
            };
        } };
}
