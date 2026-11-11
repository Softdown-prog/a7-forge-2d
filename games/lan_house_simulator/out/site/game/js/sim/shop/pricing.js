import { linuxMachineSpec } from "../linuxMachines.js?v=5a84ef5bc1ea";
import { DISC_COPIER_COST } from "../discCopy.js?v=5a84ef5bc1ea";
import { PRINTER_COST } from "../printService.js?v=5a84ef5bc1ea";
import { ANNEX_PC_COST } from "../stations.js?v=5a84ef5bc1ea";
import { WALL_COST } from "../walls.js?v=5a84ef5bc1ea";
import { expansionPrice } from "../room.js?v=5a84ef5bc1ea";
export function shopPrice(s, id) {
    if (linuxMachineSpec(id))
        return linuxMachineSpec(id).cost;
    if (id === "disc-copier")
        return DISC_COPIER_COST;
    if (id === "printer")
        return PRINTER_COST;
    if (id === "ps1")
        return 560;
    if (id === "wall")
        return WALL_COST;
    if (id === "door")
        return 80;
    if (id === "computer-annex")
        return ANNEX_PC_COST;
    if (id === "extend-west")
        return expansionPrice(s, "west");
    if (id === "extend-east")
        return expansionPrice(s, "east");
    if (id === "extend-north")
        return expansionPrice(s, "north");
    return id === "expand" ? 650 + s.expansionLevel * 450 : id === "computer" ? 320 : id === "poster" ? 45 : id === "plant" ? 85 : id === "table" ? 140 : 0;
}
