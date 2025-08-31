// js/utils.js
import { machines } from './gachaConfig.js';

export function getRarityColor(rarity) {
    const allDropRates = machines.flatMap(machine => machine.dropRates);
    const rarityInfo = allDropRates.find(rate => rate.rarity === rarity);
    return rarityInfo ? rarityInfo.color : '#FFFFFF'; // Default to white if not found
}