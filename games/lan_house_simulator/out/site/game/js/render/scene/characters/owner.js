import { counterPoint, placedObject } from "../../../sim/layout.js?v=1507cb2cfb2d";
import { copyingAnimationActive } from "../../../sim/discCopy.js?v=1507cb2cfb2d";
import { printingAnimationActive } from "../../../sim/printService.js?v=1507cb2cfb2d";
import { cosmeticAvailable } from "../../../sim/premiumCosmetics.js?v=1507cb2cfb2d";
import { yearFromMinutes } from "../../../sim/historicalEconomy.js?v=1507cb2cfb2d";
import { actorHitbox } from "../../actorArt.js?v=1507cb2cfb2d";
import { drawActorSprite as drawActor } from "../../actorSprites.js?v=1507cb2cfb2d";
export function drawSceneOwner(ctx, camera, t, s) {
    const position = counterPoint(s, { x: 1.45, y: 1.05 }), r = placedObject(s, "counter", { x: .9, y: 1.42 }).rotation ?? 0;
    // Mesmo rosto e uniforme em todos os quadros; o balcão oclui parcialmente o corpo.
    const printAt = s?.printer?.lastPrintedMinute ?? -1, copyAt = s?.discCopier?.lastCopiedMinute ?? -1;
    // Prioridade ao serviço pago mais recente; ambos os equipamentos animam independente.
    const pose = s && copyingAnimationActive(s) && copyAt >= printAt ? "copying" :
        s && printingAnimationActive(s) ? "printing" :
            s?.postmanDelivery?.phase === "handing" ? "receiving" : "idle";
    drawActor(ctx, camera, { ...position, kind: "owner", id: 0, time: t, pose,
        direction: ["south", "west", "north", "east"][r],
        premiumCyber: !!s && cosmeticAvailable("tony-cyber", yearFromMinutes(s.totalMinutes)) });
    return actorHitbox(camera, position.x, position.y);
}
