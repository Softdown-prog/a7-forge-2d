/** Stable rendering API: the three retail items are implemented in independent modules. */
export { RETAIL_DISPLAY_CAPACITY, visibleRetailStock } from "./retail/primitives.js?v=b715623ba9fb";
export { drawVendingMachine } from "./retail/vending.js?v=b715623ba9fb";
export { drawSnackShelf, snackShelfBagStyle, snackShelfPlacement } from "./retail/snackShelf.js?v=b715623ba9fb";
