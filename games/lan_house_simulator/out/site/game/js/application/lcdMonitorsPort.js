import { pcCount } from "../sim/engine.js?v=faa670fa6ec3";
import { gameYear } from "../sim/era.js?v=faa670fa6ec3";
import { LCD_CATALOG, installedLcd, lcdSpec, stationModelName, stationOccupied } from "../sim/computerModels.js?v=faa670fa6ec3";
import { stationPoweredOn } from "../sim/stationPower.js?v=faa670fa6ec3";
export function createLcdMonitorsPort(getState) {
    return { snapshot(selectedPc) {
            const game = getState(), year = gameYear(game), count = pcCount(game);
            const index = Math.max(0, Math.min(count - 1, selectedPc));
            const current = lcdSpec(installedLcd(game, index));
            const busy = stationOccupied(game, index) || !!game.repairJobs?.some(job => job.pc === index);
            const isOn = stationPoweredOn(game, index);
            const needsHardware = (game.pcTiers?.[index] ?? 1) < 3;
            return {
                choices: Array.from({ length: count }, (_, i) => ({ index: i, label: "PC " + (i + 1), selected: i === index })),
                installedLabel: "PC " + (index + 1) + " · instalado: " + stationModelName(game, index) + " · ano " + year,
                models: LCD_CATALOG.map(model => {
                    const locked = year < model.year, owned = current?.id === model.id, older = !!current && current.year > model.year;
                    const benefit = (owned || older) ?
                        "Satisfação do kit: +" + Math.round(model.bonus * 1000) / 10 + " p.p. em relação ao CRT." :
                        "Satisfação +" + Math.round((model.bonus - (current?.bonus ?? 0)) * 1000) / 10 + " p.p. · economia de energia em relação ao CRT.";
                    return {
                        id: model.id, name: model.name, year: model.year, description: model.description, locked,
                        artAlt: "Estação " + model.name, title: model.year + " · " + model.name, benefit,
                        buttonLabel: owned ? "Instalado" : older ? "Geração anterior" : locked ? "🔒 Chega em " + model.year :
                            needsHardware ? "Requer hardware 3" : busy ? "Estação ocupada" : isOn ? "Desligue a estação" :
                                game.cash < model.cost ? "Caixa insuficiente · R$ " + model.cost : "Instalar · R$ " + model.cost,
                        buttonDisabled: owned || older || locked || needsHardware || busy || isOn || game.cash < model.cost
                    };
                })
            };
        } };
}
