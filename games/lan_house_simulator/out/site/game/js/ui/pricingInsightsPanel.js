export function renderHourlyPricingInsights(view, setText) {
    setText("price-demand-insight", view.demand);
    setText("price-satisfaction-insight", view.satisfaction);
    setText("price-caution", view.caution);
    setText("price-scenario-lower", view.lower);
    setText("price-scenario-current", view.current);
    setText("price-scenario-higher", view.higher);
}
export function renderEnergyYearOutlook(view, setText) {
    setText("energy-year-outlook", view.label);
}
