/** Stable rendering API: the three retail items are implemented in independent modules. */
export { RETAIL_DISPLAY_CAPACITY, visibleRetailStock } from "./retail/primitives.js?v=f36771daf749";
export { drawVendingMachine } from "./retail/vending.js?v=f36771daf749";
export { drawSnackShelf, snackShelfBagStyle, snackShelfPlacement } from "./retail/snackShelf.js?v=f36771daf749";
