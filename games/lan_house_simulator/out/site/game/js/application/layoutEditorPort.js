import { editableObjects, layoutPlacementIssue, layoutRemovalIssue, moveLayoutObject, removeLayoutObject } from "../sim/editableObjects.js?v=1507cb2cfb2d";
import { removablePartitions, removePartition, wallEndpoints } from "../sim/walls.js?v=1507cb2cfb2d";
import { furnitureSlots } from "../sim/shop.js?v=1507cb2cfb2d";
import { roomBounds } from "../sim/room.js?v=1507cb2cfb2d";
export function createLayoutEditorPort(getState, cameraForState) {
    return {
        objects: () => editableObjects(getState()),
        partitions: () => removablePartitions(getState()),
        partition: id => id ? removablePartitions(getState()).find(w => w.id === id) ?? null : null,
        slots: () => furnitureSlots(getState()),
        bounds: () => roomBounds(getState()),
        camera: () => cameraForState(getState()),
        endpoints: wall => wallEndpoints(wall),
        placementIssue: draft => layoutPlacementIssue(getState(), draft),
        removalIssue: id => layoutRemovalIssue(getState(), id),
        move: (id, draft) => moveLayoutObject(getState(), id, draft, draft.rotation),
        remove(id) {
            const s = getState();
            return removablePartitions(s).some(w => w.id === id)
                ? removePartition(s, id) : removeLayoutObject(s, id);
        }
    };
}
