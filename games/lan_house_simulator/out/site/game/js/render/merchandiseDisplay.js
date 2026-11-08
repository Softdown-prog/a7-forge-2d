import { PRODUCTS, merchandiseStock } from '../sim/merchandise.js?v=c132abc69a79';
import { RETAIL_DISPLAY_CAPACITY } from './retailArt.js?v=c132abc69a79';
const groups = { soda: PRODUCTS.filter(p => p.category === 'soda'), candy: PRODUCTS.filter(p => p.category === 'candy'), snacks: PRODUCTS.filter(p => p.category === 'snacks') };
const cache = new WeakMap();
/** Rebuild bounded display only after a real stock change; sprites retain the same cache. */
export function merchandiseDisplay(s, category) {
    let cached = cache.get(s);
    if (!cached) {
        cached = {};
        cache.set(s, cached);
    }
    const products = groups[category], old = cached[category];
    if (old && products.every((p, i) => merchandiseStock(s, p.id) === old.counts[i]))
        return old.display;
    const counts = products.map(p => merchandiseStock(s, p.id)), remaining = [...counts], display = [];
    for (let round = 0; round < RETAIL_DISPLAY_CAPACITY[category]; round++) {
        let added = false;
        for (const [i, p] of products.entries())
            if (remaining[i] > 0 && display.length < RETAIL_DISPLAY_CAPACITY[category]) {
                display.push(p.id);
                remaining[i]--;
                added = true;
            }
        if (!added)
            break;
    }
    cached[category] = { counts, display };
    return display;
}
export function categoryStock(s, category) { return groups[category].reduce((n, p) => n + merchandiseStock(s, p.id), 0); }
