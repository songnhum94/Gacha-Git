// js/gachaWeb3.js
import { state } from './gachaState.js';
import { dom, updateMoonStoneUI, updateGachaControls } from './gachaUI.js';
import { initAudio, isAudioInitialized } from './audio.js';
import { switchToSingleView, handleResize } from './gachaScene.js'; // Import handleResize

async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this feature!');
        return;
    }
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        handleWalletConnected(address);
    } catch (error) {
        console.error("Error connecting to wallet:", error);
    }
}

function handleWalletConnected(address) {
    console.log("Wallet connected. Initializing UI for user:", address);
    state.walletAddress = address;
    state.isConnected = true;
    
    dom.wallet.addressEl.textContent = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    dom.wallet.connectView.classList.add('hidden');
    dom.wallet.connectedView.classList.remove('hidden');
    dom.gacha.mainControls.classList.remove('hidden');
    
    updateMoonStoneUI();
    updateGachaControls();
    
    if (!isAudioInitialized()) {
        Tone.start().then(initAudio);
    }

    // FIX: Use a short timeout to ensure the DOM has updated and the container has dimensions
    // This will correctly size the canvas on mobile after it becomes visible.
    setTimeout(() => {
        handleResize();
        switchToSingleView(state.currentMachineIndex);
    }, 50);
}

export { connectWallet };
