import { merchandiseDisplay } from "./merchandiseDisplay.js?v=0bd19d58dac2";
import { pcCount, pcPosition, roomWidth, online } from "../sim/engine.js?v=0bd19d58dac2";
import { roomBounds } from "../sim/room.js?v=0bd19d58dac2";
import { cameraForGame, objectCamera } from "./isometric.js?v=0bd19d58dac2";
import { cosmeticAvailable } from "../sim/premiumCosmetics.js?v=0bd19d58dac2";
import { drawVipAquarium } from "./aquariumArt.js?v=0bd19d58dac2";
import { drawPixelClock } from "./pixelClockArt.js?v=0bd19d58dac2";
import { yearFromMinutes } from "../sim/historicalEconomy.js?v=0bd19d58dac2";
import { vendingMachines, placedObject, counterPoint } from "../sim/layout.js?v=0bd19d58dac2";
import { drawVendingMachine, drawSnackShelf } from "./retailArt.js?v=0bd19d58dac2";
import { BIN_SPOTS, binSpots } from "../sim/services.js?v=0bd19d58dac2";
import { drawRoomWindows } from "./scene/windows.js?v=0bd19d58dac2";
import { RoomBackgroundCache } from "./scene/background.js?v=0bd19d58dac2";
import { drawLayoutOverlay } from "./scene/layoutOverlay.js?v=0bd19d58dac2";
import { drawComputerDesk } from "./scene/stations/computer.js?v=0bd19d58dac2";
import { collectConsoleEntries } from "./scene/stations/registry.js?v=0bd19d58dac2";
import { drawSceneCounter } from "./scene/stations/counter.js?v=0bd19d58dac2";
import { drawAnnexPcCandidates } from "./scene/annexPcOverlay.js?v=0bd19d58dac2";
import { drawDoorCandidates, drawWallPreview } from "./scene/wallOverlay.js?v=0bd19d58dac2";
import { drawEntryMarker } from "./scene/entryMarker.js?v=0bd19d58dac2";
import { drawRoomSign } from "./scene/roomSign.js?v=0bd19d58dac2";
import { drawRoomStatus } from "./scene/roomStatus.js?v=0bd19d58dac2";
import { drawExtraFurniture } from "./scene/furnitureArt.js?v=0bd19d58dac2";
import { drawPlacementCandidates, drawRelocationCandidates } from "./scene/furnitureOverlay.js?v=0bd19d58dac2";
import { drawInteriorWall, drawInteriorDoor } from "./scene/partitions.js?v=0bd19d58dac2";
import { drawGpuInstallMarkers } from "./scene/gpuInstallOverlay.js?v=0bd19d58dac2";
import { drawServiceAccessOverlay } from "./scene/serviceOverlay.js?v=0bd19d58dac2";
import { drawTrashBin } from "./scene/trashBin.js?v=0bd19d58dac2";
import { drawScenePostman } from "./scene/characters/postman.js?v=0bd19d58dac2";
import { drawSceneWorker } from "./scene/characters/worker.js?v=0bd19d58dac2";
import { drawSceneOwner } from "./scene/characters/owner.js?v=0bd19d58dac2";
import { drawSceneCustomer } from "./scene/characters/customer.js?v=0bd19d58dac2";
import { customerConsole, customerConsoleSeat } from "../sim/consoleLayout.js?v=0bd19d58dac2";
import { drawNightMatchMarkers, drawNightMatchReactions, nightMatchReactions } from "./nightMatchMarkers.js?v=0bd19d58dac2";
import { drawNightPrizePresentation } from "./nightPrizePresentation.js?v=0bd19d58dac2";
import { drawNightReopening } from "./nightReopening.js?v=0bd19d58dac2";
import { SCENE_WIDTH, SCENE_HEIGHT } from "./sceneSurface.js?v=0bd19d58dac2";
import { daylightAt, drawSceneLighting } from "./lighting.js?v=0bd19d58dac2";
export class SceneRenderer {
    ctx;
    heroHitbox = { x: 0, y: 0, width: 0, height: 0 };
    background = new RoomBackgroundCache();
    constructor(ctx) {
        this.ctx = ctx;
    }
    hitOwner(x, y) {
        const r = this.heroHitbox;
        return x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;
    }
    drawLayoutOverlay(s, selected, draft, time) {
        drawLayoutOverlay(this.ctx, s, selected, draft, time);
    }
    draw(s, elapsedSeconds) {
        const ctx = this.ctx, w = SCENE_WIDTH, h = SCENE_HEIGHT, roomW = roomWidth(s), camera = cameraForGame(s), bounds = roomBounds(s);
        const light = daylightAt(s.totalMinutes);
        this.background.draw(ctx, s, camera, bounds, w, h);
        // Glass follows the simulated hour; frames and sills stay in the cached background.
        this.windowPanes(camera, bounds, light);
        const entries = [
            { depth: placedObject(s, "shelf", { x: bounds.minX + .23, y: 2.92 }).x + placedObject(s, "shelf", { x: bounds.minX + .23, y: 2.92 }).y + .55, paint: () => this.shelf(camera, bounds.minX, s.inventory.snacks, placedObject(s, "shelf", { x: bounds.minX + .23, y: 2.92 }), merchandiseDisplay(s, "snacks")) },
            { depth: 6, paint: () => drawExtraFurniture(this.ctx, camera, s) },
            ...vendingMachines(s).map(m => ({
                depth: m.x + m.y + 0.25,
                paint: () => this.machine(camera, m.x, m.y, m.kind, elapsedSeconds, s.inventory[m.kind], m.rotation, merchandiseDisplay(s, m.kind))
            })),
            { depth: counterPoint(s, { x: 1.45, y: 1.05 }).x + counterPoint(s, { x: 1.45, y: 1.05 }).y - .5, paint: () => this.owner(camera, elapsedSeconds, s) },
            { depth: placedObject(s, "counter", { x: .9, y: 1.42 }).x + placedObject(s, "counter", { x: .9, y: 1.42 }).y + .8, paint: () => {
                    const counter = placedObject(s, "counter", { x: .9, y: 1.42 });
                    drawSceneCounter(ctx, camera, counter, s, elapsedSeconds);
                } },
            { depth: roomW + 6, paint: () => drawEntryMarker(ctx, camera, s) }
        ];
        // Aquário VIP preso à parede norte, sem ocupar espaço de circulação.
        if (cosmeticAvailable("aquarium-rgb", yearFromMinutes(s.totalMinutes))) {
            const point = { x: Math.min(bounds.maxX - 1.42, Math.max(bounds.minX + .8, 3.15)),
                y: bounds.minY + .13 };
            entries.push({ depth: point.x + point.y + .25,
                paint: () => drawVipAquarium(ctx, camera, point, elapsedSeconds) });
        }
        // Fixed north-wall mount, away from the aquarium; no new navigation obstacle.
        if (cosmeticAvailable("pixel-led-clock", yearFromMinutes(s.totalMinutes))) {
            const point = { x: Math.max(bounds.minX + .25, bounds.maxX - 1.62), y: bounds.minY + .016 };
            entries.push({ depth: point.x + point.y + .2,
                paint: () => drawPixelClock(ctx, camera, point, s.totalMinutes, elapsedSeconds) });
        }
        for (let i = 0; i < pcCount(s); i++) {
            const p = pcPosition(i, s);
            entries.push({ depth: p.x + p.y, paint: () => drawComputerDesk(ctx, camera, p, i, elapsedSeconds, online(s), s) });
        }
        entries.push(...collectConsoleEntries(ctx, camera, s, elapsedSeconds));
        for (let i = 0; i < BIN_SPOTS.length; i++) {
            const p = binSpots(s)[i];
            entries.push({ depth: p.x + p.y + .1, paint: () => this.trashBin(camera, p, s.binFill?.[i] ?? 0) });
        }
        for (const job of s.repairJobs ?? [])
            entries.push({ depth: job.x + job.y + .9, paint: () => this.worker(camera, job, elapsedSeconds, "technician", job.progress / job.duration, s) });
        if (s.cleaningJob) {
            const j = s.cleaningJob;
            entries.push({ depth: j.x + j.y + .9, paint: () => this.worker(camera, j, elapsedSeconds, "cleaner", j.progress / 9, s) });
        }
        if (s.postmanDelivery) {
            const postal = s.postmanDelivery;
            entries.push({ depth: postal.x + postal.y + .09,
                paint: () => this.postman(camera, postal, elapsedSeconds) });
        }
        for (const wall of s.interiorWalls ?? [])
            entries.push({ depth: wall.x + wall.y + 0.5, paint: () => drawInteriorWall(ctx, camera, wall) });
        for (const door of s.interiorDoors ?? [])
            entries.push({ depth: door.x + door.y + 0.5, paint: () => drawInteriorDoor(ctx, camera, door) });
        const matchReactions = nightMatchReactions(s);
        for (const c of s.customers) {
            const seated = c.stage === "sitting" || c.stage === "using" || c.stage === "standing";
            const location = seated && customerConsole(c)
                ? customerConsoleSeat(s, c) ?? c :
                seated && c.pcIndex !== null ? pcPosition(c.pcIndex, s) : c;
            entries.push({ depth: location.x + location.y + (seated ? 1.16 : 0.08), paint: () => this.customer(camera, c, elapsedSeconds, seated, s, matchReactions.find(reaction => reaction.playerId === c.id)) });
        }
        entries.sort((a, b) => a.depth - b.depth);
        for (const e of entries)
            e.paint();
        // Lamps, daylight and the evening tint sit over the room, under every label.
        drawSceneLighting(ctx, camera, s, elapsedSeconds, w, h);
        this.drawGpuInstallMarkers(s, camera, elapsedSeconds);
        drawRoomSign(ctx, camera, roomW);
        // Indicadores dos jogadores reais por cima do cenário e atrás do HUD geral.
        drawNightMatchMarkers(ctx, s, camera);
        drawNightMatchReactions(ctx, s, camera, elapsedSeconds, matchReactions);
        drawNightPrizePresentation(ctx, s, camera, elapsedSeconds);
        drawNightReopening(ctx, s, elapsedSeconds);
        drawRoomStatus(ctx, s);
    }
    /** Marcador flutuante, acima do PC real, usando o estado salvo da simulação. */
    drawGpuInstallMarkers(s, camera, elapsedSeconds) {
        drawGpuInstallMarkers(this.ctx, s, camera, elapsedSeconds);
    }
    /** Modo de inspeção acionado na aba Serviços, sem recalcular caminhos por frame.
     * Destaca o destino inacessível, não afirma identificar a parede culpada. */
    drawServiceAccessOverlay(s, issues, time) {
        drawServiceAccessOverlay(this.ctx, s, issues, time);
    }
    /** Positions and renders annex PC previews without mutating the purchase state. */
    drawAnnexPcCandidates(s, hovered) {
        drawAnnexPcCandidates(this.ctx, s, hovered);
    }
    drawDoorCandidates(s, hovered) {
        drawDoorCandidates(this.ctx, s, hovered);
    }
    drawWallPreview(s, wall, demolish) {
        drawWallPreview(this.ctx, s, wall, demolish);
    }
    drawPlacementCandidates(s, kind, hoveredId, rotation = 0) {
        drawPlacementCandidates(this.ctx, s, kind, hoveredId, rotation);
    }
    drawRelocationCandidates(s, fromSlot, hoveredId) {
        drawRelocationCandidates(this.ctx, s, fromSlot, hoveredId);
    }
    /** Glass tint per simulated hour: sky by day, amber at sunset, dark at night.
     * Mullions and the diagonal sheen are repainted on top each frame. */
    /** The glass only changes with the simulated minute, so it is rasterized once per light state and zoom
     * instead of being repainted (gradients, reflections, mullions) on every frame. */
    windowPanes(camera, bounds, light) {
        drawRoomWindows(this.ctx, camera, bounds, light);
    }
    shelf(camera, minX = 0, stock = 20, p = { x: minX + .23, y: 2.92 }, display) {
        drawSnackShelf(this.ctx, objectCamera(camera, p, .46, 1.22, p.rotation), minX, stock, true, p, display);
    }
    machine(camera, x, y, kind, t, stock, rotation = 0, display) {
        drawVendingMachine(this.ctx, objectCamera(camera, { x, y }, .66, .59, rotation), { x, y }, kind, t, stock, true, display);
    }
    trashBin(camera, p, fill) {
        drawTrashBin(this.ctx, camera, p, fill);
    }
    /** Visiting postman: same actor rig, procedural uniform, visible delivery animation. */
    postman(camera, job, t) {
        drawScenePostman(this.ctx, camera, job, t);
    }
    /** Trabalhadores agora usam EXATAMENTE a geometria, câmera e caminhada dos clientes. */
    worker(camera, job, time, kind, progress, s) {
        drawSceneWorker(this.ctx, camera, job, time, kind, progress, s);
    }
    owner(camera, t, s) {
        this.heroHitbox = drawSceneOwner(this.ctx, camera, t, s);
    }
    customer(camera, c, t, seated, s, reaction) {
        drawSceneCustomer(this.ctx, camera, c, t, seated, s, reaction);
    }
}
