// js/gachaUI.js
import { state } from './gachaState.js';
import { machines, moonStoneInfo } from './gachaConfig.js';
import { playLegendaryRewardSound, playRewardSound } from './audio.js';

export const dom = {
    wallet: { connectBtn: document.getElementById('connect-wallet-btn'), connectView: document.getElementById('connect-wallet-view'), connectedView: document.getElementById('connected-view'), addressEl: document.getElementById('wallet-address'), moonstoneList: document.getElementById('moonstone-list') },
    gacha: { mainControls: document.getElementById('gacha-main-controls'), machineButtons: document.getElementById('machine-buttons'), button: document.getElementById('gacha-button'), actionSection: document.getElementById('action-section'), actionBtn: document.getElementById('action-btn'), actionMsg: document.getElementById('action-message') },
    info: { ratesTitle: document.getElementById('drop-rates-title'), ratesList: document.getElementById('drop-rates-list'), itemsTitle: document.getElementById('all-items-title'), itemsGrid: document.getElementById('all-items-grid') },
    panels: { gacha: document.getElementById('gacha-panel'), inventory: document.getElementById('inventory-panel'), history: document.getElementById('history-panel'), showGachaBtn: document.getElementById('show-gacha-btn'), showInventoryBtn: document.getElementById('show-inventory-btn'), showHistoryBtn: document.getElementById('show-history-btn'), inventoryGrid: document.getElementById('inventory-grid'), inventoryFilterButtons: document.getElementById('inventory-filter-buttons'), historyList: document.getElementById('history-list'), inventoryCount: document.getElementById('inventory-count'), emptyInventory: document.getElementById('empty-inventory'), emptyHistory: document.getElementById('empty-history') },
    modals: { result: { container: document.getElementById('result-modal'), content: document.getElementById('result-modal-content'), resultDisplay: document.getElementById('result-display'), closeBtn: document.getElementById('close-modal-btn') }, buyStone: { container: document.getElementById('buy-stone-modal'), title: document.getElementById('buy-stone-title'), image: document.getElementById('buy-stone-image'), details: document.getElementById('buy-stone-details'), price: document.getElementById('buy-stone-price'), confirmBtn: document.getElementById('confirm-buy-btn'), cancelBtn: document.getElementById('cancel-buy-btn') } },
    overlays: { legendaryFlash: document.getElementById('legendary-flash'), loading: { container: document.getElementById('loading-overlay'), message: document.getElementById('loading-message') }, toastContainer: document.getElementById('toast-container') }
};

export function updateGachaControls() {
    dom.gacha.button.classList.remove('btn-go');
    if (!state.isConnected) {
        dom.gacha.button.disabled = true;
        dom.gacha.button.textContent = "CONNECT WALLET TO START";
        return;
    }
    dom.gacha.button.textContent = "START RANDOM";
    const currentMachine = machines[state.currentMachineIndex];
    const requiredStoneId = currentMachine.requiredStoneId;
    const stoneBalance = state.userMoonStones[requiredStoneId];
    const stoneName = moonStoneInfo[requiredStoneId].name;
    if (stoneBalance < 1) {
        dom.gacha.actionSection.classList.remove('hidden');
        dom.gacha.actionMsg.textContent = `You don't have any ${stoneName} to roll.`;
        dom.gacha.actionBtn.textContent = `Buy ${stoneName}`;
        dom.gacha.actionBtn.dataset.action = 'buy';
        dom.gacha.button.disabled = true;
    } else {
        const isApproved = state.userApprovals[requiredStoneId];
        if (isApproved) {
            dom.gacha.actionSection.classList.add('hidden');
            dom.gacha.button.disabled = false;
            dom.gacha.button.classList.add('btn-go');
        } else {
            dom.gacha.actionSection.classList.remove('hidden');
            dom.gacha.actionMsg.textContent = `You must approve the use of ${stoneName} first.`;
            dom.gacha.actionBtn.textContent = `Approve ${stoneName}`;
            dom.gacha.actionBtn.dataset.action = 'approve';
            dom.gacha.button.disabled = true;
        }
    }
}

export function updateMoonStoneUI() {
    const stoneList = dom.wallet.moonstoneList;
    stoneList.innerHTML = '';
    for (const stoneId in state.userMoonStones) {
        const info = moonStoneInfo[stoneId];
        const balance = state.userMoonStones[stoneId];
        let li = document.createElement('div');
        li.dataset.stoneId = stoneId;
        li.className = `flex justify-between items-center p-1 rounded-md transition-colors duration-300 ${info.color}`;
        li.innerHTML = `<span>${info.name}</span> <span class="font-bold">${balance}</span>`;
        stoneList.appendChild(li);
    }
}

export function updateMachineInfo() {
    const machine = machines[state.currentMachineIndex];
    dom.info.ratesTitle.textContent = `Drop Rates: ${machine.name}`;
    dom.info.ratesList.innerHTML = '';
    machine.dropRates.forEach(rate => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center';
        li.innerHTML = `<span style="color: ${rate.color};" class="font-semibold">${rate.rarity}</span><span>${(rate.rate * 100).toFixed(2)}%</span>`;
        dom.info.ratesList.appendChild(li);
    });
    document.querySelectorAll('#machine-buttons button').forEach((btn, index) => {
        btn.classList.toggle('btn-active-tab', index === state.currentMachineIndex);
        btn.classList.toggle('btn-liquid', index !== state.currentMachineIndex);
        btn.classList.toggle('bg-gray-700', index !== state.currentMachineIndex);
    });
}

export function updateAllItemsUI() {
    const machine = machines[state.currentMachineIndex];
    dom.info.itemsTitle.textContent = `Items in Gachapon`;
    dom.info.itemsGrid.innerHTML = '';
    machine.itemPool.forEach(item => {
        const rarityInfo = machine.dropRates.find(r => r.rarity === item.rarity);
        const div = document.createElement('div');
        // เพิ่ม padding และ border เพื่อให้ glow effect แสดงผลสวยงาม
        div.className = 'p-1 border-2 border-transparent rounded-lg flex flex-col items-center text-center item-preview-card';

        // เพิ่ม class สำหรับ SUPER LEGENDARY
        if (item.rarity === 'SUPER LEGENDARY') {
            div.classList.add('super-legendary-item');
        }

        div.innerHTML = `<img src="${item.img}" alt="${item.name}" class="w-12 h-12 object-cover rounded-md border-2" style="border-color: ${rarityInfo.color};"><p class="text-[10px] mt-1 leading-tight">${item.name}</p>`;
        dom.info.itemsGrid.appendChild(div);
    });
}

export function updateInventory() {
    dom.panels.inventoryGrid.innerHTML = '';
    dom.panels.inventoryFilterButtons.innerHTML = '';
    if (state.inventory.length > 0) {
        const allBtn = document.createElement('button');
        allBtn.textContent = 'All';
        allBtn.className = 'btn btn-liquid text-xs px-3 py-1 rounded-md';
        allBtn.onclick = () => { state.currentInventoryFilter = 'All'; updateInventory(); };
        dom.panels.inventoryFilterButtons.appendChild(allBtn);
        machines.forEach(machine => {
            const btn = document.createElement('button');
            btn.textContent = machine.name;
            btn.className = 'btn btn-liquid text-xs px-3 py-1 rounded-md';
            btn.onclick = () => { state.currentInventoryFilter = machine.name; updateInventory(); };
            dom.panels.inventoryFilterButtons.appendChild(btn);
        });
        document.querySelectorAll('#inventory-filter-buttons button').forEach(btn => {
            if (btn.textContent === state.currentInventoryFilter) {
                btn.classList.add('btn-active-tab');
                btn.classList.remove('bg-gray-700');
            } else {
                btn.classList.remove('btn-active-tab');
                btn.classList.add('bg-gray-700');
            }
        });
    }
    const filteredInventory = state.inventory.filter(item => state.currentInventoryFilter === 'All' || item.machineName === state.currentInventoryFilter);
    const itemCounts = filteredInventory.reduce((acc, item) => { acc[item.name] = (acc[item.name] || 0) + 1; return acc; }, {});
    if (Object.keys(itemCounts).length === 0) {
        dom.panels.inventoryGrid.appendChild(dom.panels.emptyInventory);
    } else {
        if(dom.panels.emptyInventory.parentElement) dom.panels.emptyInventory.remove();
        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 col-span-full';
        for (const itemName in itemCounts) {
            const item = state.inventory.find(i => i.name === itemName);
            const count = itemCounts[itemName];
            const card = createItemCard(item); // createItemCard จะถูกแก้ไขให้รองรับ SL
            const countBadge = `<div class="absolute top-1 right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-800">x${count}</div>`;
            card.innerHTML += countBadge;
            categoryGrid.appendChild(card);
        }
        dom.panels.inventoryGrid.appendChild(categoryGrid);
    }
    dom.panels.inventoryCount.textContent = state.inventory.length;
}

export function updateHistory() {
    dom.panels.historyList.innerHTML = '';
    if (state.history.length === 0) {
        dom.panels.historyList.appendChild(dom.panels.emptyHistory);
    } else {
        if(dom.panels.emptyHistory.parentElement) dom.panels.emptyHistory.remove();
        [...state.history].reverse().forEach(entry => {
            const li = document.createElement('li');
            li.className = "glass-panel p-2 rounded-lg text-sm";
            const itemsHtml = entry.items.map(item => {
                const machine = machines.find(m => m.itemPool.some(p => p.name === item.name));
                const rarityInfo = machine.dropRates.find(r => r.rarity === item.rarity);
                
                // เพิ่ม class สำหรับตัวอักษร SUPER LEGENDARY ใน History
                if (item.rarity === 'SUPER LEGENDARY') {
                    return `<span class="super-legendary-text">${item.name}</span>`;
                }
                return `<span style="color: ${rarityInfo.color}; text-shadow: 0 0 5px ${rarityInfo.color};">${item.name}</span>`;
            }).join(', ');
            li.innerHTML = `[${entry.date.toLocaleString('en-US')}] Pulled: ${itemsHtml}`;
            dom.panels.historyList.appendChild(li);
        });
    }
}

function createItemCard(item) {
    const machine = machines.find(m => m.itemPool.some(p => p.name === item.name));
    const rarityInfo = machine ? machine.dropRates.find(r => r.rarity === item.rarity) : null;
    const color = rarityInfo ? rarityInfo.color : '#A9A9A9';

    const card = document.createElement('div');
    card.className = `item-card glass-panel rounded-lg overflow-hidden flex flex-col items-center p-2 border-2 w-full`;
    card.style.borderColor = color;

    // เตรียม HTML สำหรับ Rarity text
    let rarityTextHTML = `<p class="text-xs font-semibold" style="color: ${color};">${item.rarity}</p>`;

    if (item.rarity === 'SUPER LEGENDARY') {
        card.classList.add('super-legendary-item'); // เพิ่ม glow ให้กรอบการ์ด
        // เปลี่ยน HTML ของ Rarity text ให้ใช้ class แสงรุ้ง
        rarityTextHTML = `<p class="text-xs font-semibold super-legendary-text">${item.rarity}</p>`;
    } else if (item.rarity === 'LEGENDARY') {
        card.classList.add('legendary-card');
    } else {
        card.style.boxShadow = `0 0 15px ${color}60`;
    }

    card.innerHTML = `<img src="${item.img}" alt="${item.name}" class="w-full h-auto object-cover rounded-md aspect-square"><p class="text-sm font-bold mt-2 text-center text-white">${item.name}</p>${rarityTextHTML}`;
    return card;
}

export function showResultModal(result) {
    const hasLegendary = result.rarity === 'LEGENDARY';
    const isSuperLegendary = result.rarity === 'SUPER LEGENDARY';

    // --- ส่วนจัดการแสงวาบเต็มหน้าจอ ---
    document.body.classList.remove('super-legendary-screen-flash');
    if (isSuperLegendary) {
        requestAnimationFrame(() => {
            document.body.classList.add('super-legendary-screen-flash');
        });
        playLegendaryRewardSound();
        setTimeout(() => {
             document.body.classList.remove('super-legendary-screen-flash');
        }, 1500);
    } else if (hasLegendary) {
        dom.overlays.legendaryFlash.classList.add('flash');
        playLegendaryRewardSound();
        setTimeout(() => dom.overlays.legendaryFlash.classList.remove('flash'), 800);
    } else {
        playRewardSound();
    }

    dom.modals.result.resultDisplay.innerHTML = '';
    const card = createItemCard(result);
    card.classList.add('opacity-0', 'transform', 'scale-90');

    // --- ส่วนจัดการพื้นหลังการ์ด ---
    if (isSuperLegendary) {
        dom.modals.result.content.classList.add('super-legendary-card-bg');
    } else {
        dom.modals.result.content.classList.remove('super-legendary-card-bg');
    }

    dom.modals.result.resultDisplay.appendChild(card);
    setTimeout(() => {
        card.classList.remove('opacity-0', 'scale-90');
        card.classList.add('opacity-100', 'scale-100', 'transition-all', 'duration-500');
    }, 100 + (hasLegendary || isSuperLegendary ? 300 : 0));
    
    dom.modals.result.container.classList.remove('hidden');
    dom.modals.result.content.classList.add('modal-enter');
    dom.modals.result.content.classList.remove('modal-leave');
}

export function showBuyStoneModal() {
    const requiredStoneId = machines[state.currentMachineIndex].requiredStoneId;
    const stone = moonStoneInfo[requiredStoneId];
    dom.modals.buyStone.title.textContent = `Buy ${stone.name}`;
    dom.modals.buyStone.image.src = stone.img;
    dom.modals.buyStone.details.textContent = stone.details;
    dom.modals.buyStone.price.textContent = "Price: 0.0358 BNB";
    dom.modals.buyStone.container.classList.remove('hidden');
}

export function hideBuyStoneModal() {
    dom.modals.buyStone.container.classList.add('hidden');
}

export function showLoading(message = "Processing...") {
    dom.overlays.loading.message.textContent = message;
    dom.overlays.loading.container.style.display = 'flex';
}

export function hideLoading() {
    dom.overlays.loading.container.style.display = 'none';
}

export function showToast(message, type = 'info') {
    const colors = { success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500' };
    const toast = document.createElement('div');
    toast.className = `toast text-white px-6 py-3 rounded-lg shadow-lg ${colors[type]}`;
    toast.textContent = message;
    dom.overlays.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

