// js/main.js
import { state } from './gachaState.js';
import { machines } from './gachaConfig.js';
import { playClickSound, playSuccessSound, playErrorSound } from './audio.js';
import { dom, updateGachaControls, updateMachineInfo, showBuyStoneModal, hideBuyStoneModal, showLoading, hideLoading, showToast, updateMoonStoneUI, updateInventory, updateHistory, updateAllItemsUI } from './gachaUI.js';
import { connectWallet } from './gachaWeb3.js';
import { init3D, switchToSingleView, triggerGachaAnimation, handleResize } from './gachaScene.js';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

function setupEventListeners() {
    dom.wallet.connectBtn.addEventListener('click', () => {
        playClickSound();
        connectWallet();
    });

    dom.gacha.actionBtn.addEventListener('click', async () => {
        playClickSound();
        const action = dom.gacha.actionBtn.dataset.action;
        const requiredStoneId = machines[state.currentMachineIndex].requiredStoneId;
        if (action === 'approve') {
            showLoading("Waiting for confirmation...");
            try {
                await delay(2000);
                state.userApprovals[requiredStoneId] = true;
                hideLoading();
                playSuccessSound();
                showToast("Approval Successful!", "success");
                updateGachaControls();
            } catch (error) {
                hideLoading();
                playErrorSound();
                showToast("Transaction Rejected", "error");
            }
        } else if (action === 'buy') {
            showBuyStoneModal();
        }
    });

    dom.gacha.button.addEventListener('click', async () => {
        playClickSound();
        if (!state.isConnected || state.isAnimating) return;
        showLoading("Confirming roll...");
        try {
            await delay(1500);
            hideLoading();
            playSuccessSound();
            showToast("Transaction Confirmed!", "success");
            const requiredStoneId = machines[state.currentMachineIndex].requiredStoneId;
            if (state.userMoonStones[requiredStoneId] >= 1) {
                state.userMoonStones[requiredStoneId]--;
                updateMoonStoneUI();
                updateGachaControls();
                triggerGachaAnimation();
            }
        } catch (error) {
            hideLoading();
            playErrorSound();
            showToast("Transaction Failed", "error");
        }
    });

    dom.modals.result.closeBtn.addEventListener('click', () => {
        playClickSound();
        dom.modals.result.content.classList.add('modal-leave');
        dom.modals.result.content.classList.remove('modal-enter');
        setTimeout(() => dom.modals.result.container.classList.add('hidden'), 300);
    });

    dom.modals.buyStone.confirmBtn.addEventListener('click', async () => {
        playClickSound();
        hideBuyStoneModal();
        showLoading("Processing purchase...");
        try {
            await delay(2000);
            const requiredStoneId = machines[state.currentMachineIndex].requiredStoneId;
            state.userMoonStones[requiredStoneId] += 1;
            hideLoading();
            playSuccessSound();
            showToast("Moon Stone purchased successfully!", "success");
            updateMoonStoneUI();
            updateGachaControls();
        } catch (error) {
            hideLoading();
            playErrorSound();
            showToast("Purchase failed", "error");
        }
    });

    dom.modals.buyStone.cancelBtn.addEventListener('click', () => {
        playClickSound();
        hideBuyStoneModal();
    });

    const tabs = [
        { btn: dom.panels.showGachaBtn, panel: dom.panels.gacha },
        { btn: dom.panels.showInventoryBtn, panel: dom.panels.inventory },
        { btn: dom.panels.showHistoryBtn, panel: dom.panels.history }
    ];
    tabs.forEach(tab => {
        tab.btn.addEventListener('click', () => {
            playClickSound();
            tabs.forEach(otherTab => {
                otherTab.panel.classList.add('hidden');
                otherTab.btn.classList.remove('btn-active-tab');
                otherTab.btn.classList.add('bg-gray-700', 'hover:bg-gray-600');
            });
            tab.panel.classList.remove('hidden');
            tab.btn.classList.add('btn-active-tab');
            tab.btn.classList.remove('bg-gray-700', 'hover:bg-gray-600');
        });
    });
}

function setupResponsiveCanvas() {
    const canvasElement = document.getElementById('gacha-canvas');
    const mobileWrapper = document.getElementById('mobile-canvas-wrapper');
    const desktopWrapper = document.getElementById('desktop-canvas-wrapper');
    function moveCanvas() {
        if (window.innerWidth < 768) {
            if (canvasElement.parentElement !== mobileWrapper) {
                mobileWrapper.appendChild(canvasElement);
            }
        } else {
            if (canvasElement.parentElement !== desktopWrapper) {
                desktopWrapper.appendChild(canvasElement);
            }
        }
        handleResize();
    }
    window.addEventListener('resize', moveCanvas);
    moveCanvas();
}

function initialize() {
    machines.forEach((machine, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn text-sm py-2 rounded-lg';
        btn.textContent = machine.name;
        btn.onclick = () => {
            playClickSound();
            // Allow clicking to change the machine, even if not connected
            if (state.isAnimating || state.currentMachineIndex === index) return;
            state.currentMachineIndex = index;
            switchToSingleView(index);
            updateMachineInfo();
            updateGachaControls();
            updateAllItemsUI();
        };
        dom.gacha.machineButtons.appendChild(btn);
    });
    
    init3D();
    updateMachineInfo();
    updateAllItemsUI();
    updateGachaControls();
    updateInventory();
    updateHistory();
    setupEventListeners();
    setupResponsiveCanvas();
}

initialize();
