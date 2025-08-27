import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// --- Configuration ---
const machines = [
    {
        name: "12 Zodiac",
        themeColors: { base: 0xf97316, top: 0x6366f1 },
        dropRates: [
            { rarity: "LEGENDARY", rate: 0.02, color: "#FFD700" },
            { rarity: "EPIC", rate: 0.05, color: "#9400D3" },
            { rarity: "RARE", rate: 0.13, color: "#1E90FF" },
            { rarity: "UNCOMMON", rate: 0.25, color: "#32CD32" },
            { rarity: "COMMON", rate: 0.55, color: "#A9A9A9" },
        ],
        itemPool: [
            { name: "5. ปีมะโรง (Dragon)", rarity: "LEGENDARY", img: "https://img2.pic.in.th/pic/5.--Dragon.png" },
                    { name: "3. ปีขาล (Tiger)", rarity: "EPIC", img: "https://img5.pic.in.th/file/secure-sv1/3.--Tiger.png" },
                    { name: "7. ปีมะเมีย (Horse)", rarity: "EPIC", img: "https://img5.pic.in.th/file/secure-sv1/7.--Horse.png" },
                    { name: "10. ปีระกา (Rooster)", rarity: "RARE", img: "https://img2.pic.in.th/pic/10.--Rooster.png" },
                    { name: "9. ปีวอก (Monkey)", rarity: "RARE", img: "https://img5.pic.in.th/file/secure-sv1/9.--Monkey.png" },
                    { name: "12. ปีกุน (Pig)", rarity: "RARE", img: "https://img5.pic.in.th/file/secure-sv1/12.--Pig.png" },
                    { name: "6. ปีมะเส็ง (Snake)", rarity: "UNCOMMON", img: "https://img5.pic.in.th/file/secure-sv1/6.--Snake.png" },
                    { name: "8. ปีมะแม (Goat)", rarity: "UNCOMMON", img: "https://img2.pic.in.th/pic/8.--Goat.png" },
                    { name: "11. ปีจอ (Dog)", rarity: "UNCOMMON", img: "https://img2.pic.in.th/pic/11.--Dog.png" },
                    { name: "4. ปีเถาะ (Rabbit)", rarity: "COMMON", img: "https://img2.pic.in.th/pic/4.--Rabbit.png" },
                    { name: "1. ปีชวด (Rat)", rarity: "COMMON", img: "https://img5.pic.in.th/file/secure-sv1/1.--Rat.png" },
                    { name: "2. ปีฉลู (Ox)", rarity: "COMMON", img: "https://img2.pic.in.th/pic/2.--Ox.png" },
        ]
    },
    {
        name: "13 Kingdom",
        themeColors: { base: 0x22c55e, top: 0x0ea5e9 },
        dropRates: [
            { rarity: "LEGENDARY", rate: 0.02, color: "#FFD700" },
            { rarity: "EPIC", rate: 0.05, color: "#9400D3" },
            { rarity: "RARE", rate: 0.13, color: "#1E90FF" },
            { rarity: "UNCOMMON", rate: 0.25, color: "#32CD32" },
            { rarity: "COMMON", rate: 0.55, color: "#A9A9A9" },
        ],
        itemPool: [
            { name: "Card #13", rarity: "LEGENDARY", img: "https://placehold.co/150x150/FFD700/000000?text=13" },
            { name: "Card #12", rarity: "EPIC", img: "https://placehold.co/150x150/9400D3/FFFFFF?text=12" },
            { name: "Card #11", rarity: "EPIC", img: "https://placehold.co/150x150/9400D3/FFFFFF?text=11" },
            { name: "Card #10", rarity: "RARE", img: "https://placehold.co/150x150/1E90FF/FFFFFF?text=10" },
            { name: "Card #9", rarity: "RARE", img: "https://placehold.co/150x150/1E90FF/FFFFFF?text=9" },
            { name: "Card #8", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=8" },
            { name: "Card #7", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=7" },
            { name: "Card #6", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=6" },
            { name: "Card #5", rarity: "COMMON", img: "https://placehold.co/150x150/A9A9A9/FFFFFF?text=5" },
            { name: "Card #4", rarity: "COMMON", img: "https://placehold.co/150x150/A9A9A9/FFFFFF?text=4" },
            { name: "Card #3", rarity: "COMMON", img: "https://placehold.co/150x150/A9A9A9/FFFFFF?text=3" },
            { name: "Card #2", rarity: "COMMON", img: "https://placehold.co/150x150/A9A9A9/FFFFFF?text=2" },
            { name: "Card #1", rarity: "COMMON", img: "https://placehold.co/150x150/A9A9A9/FFFFFF?text=1" },
        ]
    },
    {
        name: "20 Cosmic",
        themeColors: { base: 0x64748b, top: 0xef4444 },
        dropRates: [
            { rarity: "LEGENDARY", rate: 0.02, color: "#FFD700" },
            { rarity: "EPIC", rate: 0.05, color: "#9400D3" },
            { rarity: "RARE", rate: 0.13, color: "#1E90FF" },
            { rarity: "UNCOMMON", rate: 0.25, color: "#32CD32" },
            { rarity: "COMMON", rate: 0.55, color: "#A9A9A9" },
        ],
        itemPool: [
            { name: "Card #20", rarity: "LEGENDARY", img: "https://placehold.co/150x150/FFD700/000000?text=20" },
            { name: "Card #19", rarity: "EPIC", img: "https://placehold.co/150x150/9400D3/FFFFFF?text=19" },
            { name: "Card #18", rarity: "EPIC", img: "https://placehold.co/150x150/9400D3/FFFFFF?text=18" },
            { name: "Card #17", rarity: "RARE", img: "https://placehold.co/150x150/1E90FF/FFFFFF?text=17" },
            { name: "Card #16", rarity: "RARE", img: "https://placehold.co/150x150/1E90FF/FFFFFF?text=16" },
            { name: "Card #15", rarity: "RARE", img: "https://placehold.co/150x150/1E90FF/FFFFFF?text=15" },
            { name: "Card #14", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=14" },
            { name: "Card #13", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=13" },
            { name: "Card #12", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=12" },
            { name: "Card #11", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=11" },
            { name: "Card #10", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=10" },
            ...Array.from({ length: 9 }, (_, i) => ({ name: `Card #${i + 1}`, rarity: "COMMON", img: `https://placehold.co/150x150/A9A9A9/FFFFFF?text=${i+1}`}))
        ]
    },
    {
        name: "21 Minted NFT",
        themeColors: { base: 0x9333ea, top: 0xfacc15 },
        dropRates: [
            { rarity: "LEGENDARY", rate: 0.02, color: "#FFD700" },
            { rarity: "EPIC", rate: 0.05, color: "#9400D3" },
            { rarity: "RARE", rate: 0.13, color: "#1E90FF" },
            { rarity: "UNCOMMON", rate: 0.25, color: "#32CD32" },
            { rarity: "COMMON", rate: 0.55, color: "#A9A9A9" },
        ],
        itemPool: [
            { name: "Card #21", rarity: "LEGENDARY", img: "https://placehold.co/150x150/FFD700/000000?text=21" },
            { name: "Card #20", rarity: "EPIC", img: "https://placehold.co/150x150/9400D3/FFFFFF?text=20" },
            { name: "Card #19", rarity: "EPIC", img: "https://placehold.co/150x150/9400D3/FFFFFF?text=19" },
            { name: "Card #18", rarity: "RARE", img: "https://placehold.co/150x150/1E90FF/FFFFFF?text=18" },
            { name: "Card #17", rarity: "RARE", img: "https://placehold.co/150x150/1E90FF/FFFFFF?text=17" },
            { name: "Card #16", rarity: "RARE", img: "https://placehold.co/150x150/1E90FF/FFFFFF?text=16" },
            { name: "Card #15", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=15" },
            { name: "Card #14", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=14" },
            { name: "Card #13", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=13" },
            { name: "Card #12", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=12" },
            { name: "Card #11", rarity: "UNCOMMON", img: "https://placehold.co/150x150/32CD32/FFFFFF?text=11" },
            ...Array.from({ length: 10 }, (_, i) => ({ name: `Card #${i + 1}`, rarity: "COMMON", img: `https://placehold.co/150x150/A9A9A9/FFFFFF?text=${i+1}`}))
        ]
    }
];

// --- State Management ---
let inventory = [], history = [], walletAddress = '';
let isConnected = false, isAnimating = false, isShaking = false;
let currentMachineIndex = 0;
let currentInventoryFilter = 'All';

// --- DOM Elements ---
const walletSection = {
    connectBtn: document.getElementById('connect-wallet-btn'),
    connectView: document.getElementById('connect-wallet-view'),
    connectedView: document.getElementById('connected-view'),
    addressEl: document.getElementById('wallet-address'),
};
const gachaSection = {
    mainControls: document.getElementById('gacha-main-controls'),
    machineButtons: document.getElementById('machine-buttons'),
    buttons: document.querySelectorAll('#gacha-buttons button'),
};
const infoSection = {
    ratesTitle: document.getElementById('drop-rates-title'),
    ratesList: document.getElementById('drop-rates-list'),
    itemsTitle: document.getElementById('all-items-title'),
    itemsGrid: document.getElementById('all-items-grid'),
};
const displayPanels = {
    gacha: document.getElementById('gacha-panel'),
    inventory: document.getElementById('inventory-panel'),
    history: document.getElementById('history-panel'),
    showGachaBtn: document.getElementById('show-gacha-btn'),
    showInventoryBtn: document.getElementById('show-inventory-btn'),
    showHistoryBtn: document.getElementById('show-history-btn'),
    inventoryGrid: document.getElementById('inventory-grid'),
    inventoryFilterButtons: document.getElementById('inventory-filter-buttons'),
    historyList: document.getElementById('history-list'),
    inventoryCount: document.getElementById('inventory-count'),
    emptyInventory: document.getElementById('empty-inventory'),
    emptyHistory: document.getElementById('empty-history'),
};
const modal = {
    container: document.getElementById('result-modal'),
    content: document.getElementById('result-modal-content'),
    grid: document.getElementById('result-grid'),
    closeBtn: document.getElementById('close-modal-btn'),
};
const legendaryFlash = document.getElementById('legendary-flash');

// --- Audio System ---
let audioInitialized = false;
let suspenseSynth, rewardSynth, legendarySynth;

function initAudio() {
    if (audioInitialized) return;
    
    Tone.Transport.bpm.value = 110;

    suspenseSynth = new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        envelope: { attack: 0.01, decay: 0.2, release: 0.2 },
        modulation: { type: "square" },
        modulationEnvelope: { attack: 0.01, decay: 0.2, release: 0.2 }
    }).toDestination();

    rewardSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "fatsine", count: 3, spread: 40 },
        envelope: { attack: 0.01, decay: 0.4, sustain: 0.7, release: 0.4 }
    }).toDestination();

    legendarySynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle8' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
        volume: -5
    }).toDestination();
    
    audioInitialized = true;
}

let suspenseSequence;
function playSuspenseSound() {
    if (!audioInitialized) return;
    const pentatonicScale = ['E2', 'G3', 'A3', 'B3', 'D4', 'E4'];
    suspenseSequence = new Tone.Sequence((time, note) => {
        suspenseSynth.triggerAttackRelease(note, "16n", time);
    }, pentatonicScale, "8n").start(0);
    
    Tone.Transport.start();
}

function stopSuspenseSound() {
    if (suspenseSequence) {
        suspenseSequence.stop(0);
        Tone.Transport.stop();
    }
}

function playRewardSound() {
     if (!audioInitialized) return;
     rewardSynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "0.8s", Tone.now());
}

function playLegendaryRewardSound() {
    if (!audioInitialized) return;
    const now = Tone.now();
    legendarySynth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '0.4', now);
    legendarySynth.triggerAttackRelease(['G5', 'C6', 'E6'], '0.4', now + 0.3);
}


// --- 3D Scene Setup ---
let scene, camera, renderer, controls, starField;
let machine3DObjects = [];
const canvasContainer = document.getElementById('canvas-container');
const canvas = document.getElementById('gacha-canvas');

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 25;
    controls.enablePan = false;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Starfield
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starVertices.push(x, y, z);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.7 });
    starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);


    const fontLoader = new FontLoader();
    fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.157.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        machines.forEach((machineData, index) => {
            const group = new THREE.Group();
            const colors = machineData.themeColors;
            const darkMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.4 });
            const accentMat = new THREE.MeshStandardMaterial({ color: colors.top, metalness: 0.6, roughness: 0.3, emissive: colors.top, emissiveIntensity: 0.3 });
            const glassMat = new THREE.MeshStandardMaterial({ 
                color: 0xffffff, 
                transparent: true, 
                opacity: 0.15, 
                roughness: 0.05, 
                metalness: 0.2,
                envMapIntensity: 3
            });
            
            const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.3, 64), darkMat);
            const midSection = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 1.5, 64), darkMat);
            midSection.position.y = 0.9;
            const topRing = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 64), darkMat);
            topRing.position.y = 1.75;
            
            const glassDome = new THREE.Mesh(new THREE.SphereGeometry(1.1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
            glassDome.position.y = 1.85;
            glassDome.scale.y = 2.25;
            
            const dispenser = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.4), darkMat);
            dispenser.position.set(0, 0.4, 1.1);

            const capsulesGroup = new THREE.Group();
            const capsules = [];
            for (let i = 0; i < 25; i++) {
                const capsuleColor = new THREE.Color();
                capsuleColor.setHSL(Math.random(), 0.8, 0.6);
                const capsuleMat = new THREE.MeshStandardMaterial({
                    color: capsuleColor,
                    metalness: 0.6,
                    roughness: 0.1,
                    emissive: capsuleColor,
                    emissiveIntensity: 0.2
                });
                const capsule = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), capsuleMat);
                
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 0.9;
                capsule.position.set(
                    Math.cos(angle) * radius,
                    1.0 + (Math.random() * 1.5),
                    Math.sin(angle) * radius
                );
                capsule.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
                capsulesGroup.add(capsule);
                capsules.push(capsule);
            }
            
            const leverGroup = new THREE.Group();
            const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16), darkMat);
            handle.rotation.z = Math.PI / 2;
            handle.position.x = 0.4;
            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), accentMat);
            knob.position.x = 0.8;
            leverGroup.add(handle, knob);
            leverGroup.position.set(1.1, 1, 0);
            leverGroup.name = "lever";

            group.add(base, midSection, topRing, glassDome, dispenser, capsulesGroup, leverGroup);
            group.position.y = -1.5;
            group.position.x = (index - (machines.length - 1) / 2) * 6;
            group.name = `machine_${index}`;
            scene.add(group);
            
            const nftTextMaterial = new THREE.MeshStandardMaterial({ emissive: 0xffffff });
            machine3DObjects.push({ group, lever: leverGroup, capsules, nftTextMaterial });

            const machineNameGeo = new TextGeometry(machineData.name.toUpperCase(), { font, size: 0.2, height: 0.05 });
            machineNameGeo.center();
            const machineNameMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, emissive: 0xFFD700, emissiveIntensity: 0.4 });
            const machineNameText = new THREE.Mesh(machineNameGeo, machineNameMat);
            machineNameText.position.y = -1.8;
            group.add(machineNameText);

            const text = "NFT COLLECTION";
            const textGroup = new THREE.Group();
            const radius = 1.11;
            const angleStep = Math.PI * 0.5 / text.length;
            const startAngle = -angleStep * (text.length -1) / 2;
            for (let i = 0; i < text.length; i++) {
                const charGeo = new TextGeometry(text[i], { font, size: 0.15, height: 0.02 });
                charGeo.center();
                const charMesh = new THREE.Mesh(charGeo, nftTextMaterial);
                const angle = startAngle + i * angleStep;
                charMesh.position.set(Math.sin(angle) * radius, 0, Math.cos(angle) * radius);
                charMesh.rotation.y = angle;
                textGroup.add(charMesh);
            }
            textGroup.position.y = 1.2;
            group.add(textGroup);
        });
    });

    camera.position.z = 15;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (starField) {
        starField.rotation.y += 0.0001;
    }
    machine3DObjects.forEach(obj => {
        if (obj.nftTextMaterial) {
            const hue = (Date.now() * 0.0002) % 1;
            obj.nftTextMaterial.emissive.setHSL(hue, 1, 0.6);
        }
    });

    if (isShaking && machine3DObjects[currentMachineIndex] && machine3DObjects[currentMachineIndex].capsules) {
        const containerRadius = 0.95;
        const containerHeight = { min: 1.0, max: 2.8 };

        machine3DObjects[currentMachineIndex].capsules.forEach(capsule => {
            capsule.position.add(capsule.userData.velocity);
            const horizontalDist = Math.sqrt(capsule.position.x**2 + capsule.position.z**2);
            if (horizontalDist > containerRadius) {
                const normal = new THREE.Vector3(capsule.position.x, 0, capsule.position.z).normalize();
                capsule.userData.velocity.reflect(normal);
                capsule.position.setLength(containerRadius);
            }
            if (capsule.position.y < containerHeight.min || capsule.position.y > containerHeight.max) {
                capsule.userData.velocity.y *= -1;
                capsule.position.y = Math.max(containerHeight.min, Math.min(containerHeight.max, capsule.position.y));
            }
        });
    }
    renderer.render(scene, camera);
}

const resizeObserver = new ResizeObserver(entries => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});
resizeObserver.observe(canvasContainer);

// --- Gacha Logic ---
function drawItem() {
    const machine = machines[currentMachineIndex];
    let random = Math.random();
    let cumulative = 0;
    for (const rateInfo of machine.dropRates) {
        cumulative += rateInfo.rate;
        if (random < cumulative) {
            const rarity = rateInfo.rarity;
            const possibleItems = machine.itemPool.filter(item => item.rarity === rarity);
            const drawnItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
            return { ...drawnItem, id: Date.now() + Math.random(), machineName: machine.name };
        }
    }
    return null;
}

function performRoll(amount) {
    const results = [];
    for (let i = 0; i < amount; i++) {
        results.push(drawItem());
    }
    inventory.push(...results);
    history.push({ date: new Date(), items: results });
    updateUI();
    showResultModal(results);
}

function triggerGachaAnimation(amount) {
    if (isAnimating) return;

    isAnimating = true;
    isShaking = true;
    gachaSection.buttons.forEach(b => b.disabled = true);
    
    playSuspenseSound();

    const lever = machine3DObjects[currentMachineIndex].lever;
    const tl = gsap.timeline();

    tl.to(camera.position, { z: 5, duration: 0.3, ease: 'back.in(1.7)' });
    tl.to(lever.rotation, { z: -Math.PI / 1.5, duration: 0.3, ease: "power3.in" }, "-=0.1");
    tl.to(lever.rotation, { z: 0, duration: 0.6, ease: "back.out(2)" });

    const capsuleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.2 });
    const capsule = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), capsuleMat);
    capsule.position.set(0, -0.5, 1.0);
    machine3DObjects[currentMachineIndex].group.add(capsule);
    
    tl.from(capsule.scale, { x: 0, y: 0, z: 0, duration: 0.2, ease: 'back.out(1.7)' }, "<0.2");
    tl.to(capsule.position, { y: -1.2, duration: 0.5, ease: "bounce.out" }, "<");
    tl.to(scene.position, { x: '+=0.05', yoyo: true, repeat: 5, duration: 0.05, ease: 'power1.inOut' }, "-=0.5");
    tl.to(scene.position, { x: 0, duration: 0.2});

    tl.call(() => { 
        isShaking = false;
        stopSuspenseSound();
    }, [], "-=0.8");

    tl.to(camera.position, {
        z: 8,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
            machine3DObjects[currentMachineIndex].group.remove(capsule);
            performRoll(amount);
            isAnimating = false;
            gachaSection.buttons.forEach(b => b.disabled = false);
        }
    }, ">0.5");
}

// --- UI Update & Rendering ---
function updateUI() { updateInventory(); updateHistory(); }

function createItemCard(item, count, isResult = false) {
    const machine = machines.find(m => m.itemPool.some(p => p.name === item.name));
    const rarityInfo = machine.dropRates.find(r => r.rarity === item.rarity);
    const card = document.createElement('div');
    card.className = `item-card glass-panel rounded-lg overflow-hidden flex flex-col items-center p-2 border-2`;
    card.style.borderColor = rarityInfo.color;
    
    if (item.rarity === 'LEGENDARY') {
        card.classList.add('legendary-card');
    } else {
        card.style.boxShadow = `0 0 15px ${rarityInfo.color}60`;
    }
    
    let countBadge = '';
    if (count > 1) {
        countBadge = `<div class="absolute top-1 right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-800">x${count}</div>`;
    }

    card.innerHTML = `
        ${countBadge}
        <img src="${item.img}" alt="${item.name}" class="w-full h-auto object-cover rounded-md aspect-square">
        <p class="text-xs font-bold mt-2 text-center text-white">${item.name}</p>
        <p class="text-xs font-semibold" style="color: ${rarityInfo.color};">${item.rarity}</p>
    `;
    if (isResult) card.classList.add('opacity-0', 'transform', 'scale-90');
    return card;
}

function updateInventory() {
    displayPanels.inventoryGrid.innerHTML = '';
    displayPanels.inventoryFilterButtons.innerHTML = '';

    const uniqueMachineNames = [...new Set(inventory.map(item => item.machineName || "Unknown"))];
    
    if (inventory.length > 0) {
        const allBtn = document.createElement('button');
        allBtn.textContent = 'All';
        allBtn.className = 'btn btn-liquid text-xs px-3 py-1 rounded-md';
        allBtn.onclick = () => {
            currentInventoryFilter = 'All';
            updateInventory();
        };
        displayPanels.inventoryFilterButtons.appendChild(allBtn);

        machines.forEach(machine => {
            const btn = document.createElement('button');
            btn.textContent = machine.name;
            btn.className = 'btn btn-liquid text-xs px-3 py-1 rounded-md';
            btn.onclick = () => {
                currentInventoryFilter = machine.name;
                updateInventory();
            };
            displayPanels.inventoryFilterButtons.appendChild(btn);
        });

        document.querySelectorAll('#inventory-filter-buttons button').forEach(btn => {
            if (btn.textContent === currentInventoryFilter) {
                btn.classList.add('btn-active-tab');
                btn.classList.remove('bg-gray-700');
            } else {
                btn.classList.remove('btn-active-tab');
                btn.classList.add('bg-gray-700');
            }
        });
    }
    
    const filteredInventory = inventory.filter(item => currentInventoryFilter === 'All' || item.machineName === currentInventoryFilter);

    const itemCounts = filteredInventory.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});

    if (Object.keys(itemCounts).length === 0) {
        displayPanels.inventoryGrid.appendChild(displayPanels.emptyInventory);
    } else {
        displayPanels.emptyInventory.remove();
        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-4 col-span-full';

        for (const itemName in itemCounts) {
            const item = inventory.find(i => i.name === itemName);
            const count = itemCounts[itemName];
            categoryGrid.appendChild(createItemCard(item, count));
        }
        displayPanels.inventoryGrid.appendChild(categoryGrid);
    }
    displayPanels.inventoryCount.textContent = inventory.length;
}

function updateHistory() {
    displayPanels.historyList.innerHTML = '';
    if (history.length === 0) {
        displayPanels.historyList.appendChild(displayPanels.emptyHistory);
    } else {
        displayPanels.emptyHistory.remove();
        [...history].reverse().forEach(entry => {
            const li = document.createElement('li');
            li.className = "glass-panel p-2 rounded-lg text-sm";
            const itemsHtml = entry.items.map(item => {
                const machine = machines.find(m => m.itemPool.some(p => p.name === item.name));
                const rarityInfo = machine.dropRates.find(r => r.rarity === item.rarity);
                return `<span style="color: ${rarityInfo.color}; text-shadow: 0 0 5px ${rarityInfo.color};">${item.name}</span>`;
            }).join(', ');
            li.innerHTML = `[${entry.date.toLocaleString('th-TH')}] สุ่มได้: ${itemsHtml}`;
            displayPanels.historyList.appendChild(li);
        });
    }
}
function showResultModal(results) {
    const hasLegendary = results.some(item => item.rarity === 'LEGENDARY');

    if (hasLegendary) {
        legendaryFlash.classList.add('flash');
        playLegendaryRewardSound();
        setTimeout(() => {
            legendaryFlash.classList.remove('flash');
        }, 800);
    } else {
        playRewardSound();
    }

    modal.grid.innerHTML = '';
    results.forEach((item, index) => {
        const card = createItemCard(item, 1, true); // Always show count 1 in results
        modal.grid.appendChild(card);
        setTimeout(() => {
            card.classList.remove('opacity-0', 'scale-90');
            card.classList.add('opacity-100', 'scale-100', 'transition-all', 'duration-500');
        }, index * 100 + (hasLegendary ? 300 : 0));
    });
    modal.container.classList.remove('hidden');
    modal.content.classList.add('modal-enter');
    modal.content.classList.remove('modal-leave');
}

function updateMachineInfo() {
    const machine = machines[currentMachineIndex];
    infoSection.ratesTitle.textContent = `Drop Rate: ${machine.name}`;
    infoSection.itemsTitle.textContent = `Items in Gachapon`;
    
    infoSection.ratesList.innerHTML = '';
    machine.dropRates.forEach(rate => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center';
        li.innerHTML = `<span style="color: ${rate.color};" class="font-semibold">${rate.rarity}</span><span>${(rate.rate * 100).toFixed(2)}%</span>`;
        infoSection.ratesList.appendChild(li);
    });

    infoSection.itemsGrid.innerHTML = '';
    machine.itemPool.forEach(item => {
        const rarityInfo = machine.dropRates.find(r => r.rarity === item.rarity);
        const div = document.createElement('div');
        div.className = 'flex flex-col items-center text-center item-preview-card';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="w-12 h-12 object-cover rounded-md border-2" style="border-color: ${rarityInfo.color};">
            <p class="text-[10px] mt-1 leading-tight">${item.name}</p>
        `;
        infoSection.itemsGrid.appendChild(div);
    });
    
    document.querySelectorAll('#machine-buttons button').forEach((btn, index) => {
        btn.classList.toggle('btn-active-tab', index === currentMachineIndex);
        btn.classList.toggle('btn-liquid', index !== currentMachineIndex);
        btn.classList.toggle('bg-gray-700', index !== currentMachineIndex);
    });
}

function switchToSingleView(newIndex) {
    controls.minDistance = 8;
    controls.maxDistance = 15;
    gsap.to(camera.position, { z: 8, duration: 0.8, ease: 'power3.inOut'});
    gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'power3.inOut' });

    machine3DObjects.forEach((obj, index) => {
        if (index !== newIndex) {
            gsap.to(obj.group.scale, {
                x: 0.001, y: 0.001, z: 0.001,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => { obj.group.visible = false; }
            });
        } else {
            gsap.to(obj.group.position, {
                x: 0,
                duration: 0.8,
                ease: 'power3.inOut'
            });
            gsap.to(obj.group.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.1
            });
             obj.group.visible = true;
        }
    });
}

// --- Event Listeners ---
walletSection.connectBtn.addEventListener('click', () => {
    walletAddress = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    isConnected = true;
    walletSection.connectView.classList.add('hidden');
    walletSection.connectedView.classList.remove('hidden');
    gachaSection.mainControls.classList.remove('hidden');
    
    if (!audioInitialized) {
        Tone.start();
        initAudio();
    }
    
    switchToSingleView(currentMachineIndex);
});

gachaSection.buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (!isConnected || isAnimating) return;
        const amount = parseInt(button.dataset.amount);
        triggerGachaAnimation(amount);
    });
});

modal.closeBtn.addEventListener('click', () => {
     modal.content.classList.add('modal-leave');
     modal.content.classList.remove('modal-enter');
     setTimeout(() => modal.container.classList.add('hidden'), 300);
});

const tabs = [
    { btn: displayPanels.showGachaBtn, panel: displayPanels.gacha },
    { btn: displayPanels.showInventoryBtn, panel: displayPanels.inventory },
    { btn: displayPanels.showHistoryBtn, panel: displayPanels.history }
];

tabs.forEach(tab => {
    tab.btn.addEventListener('click', () => {
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

// --- Initial Setup ---
function initialize() {
    machines.forEach((machine, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn text-sm py-2 rounded-lg';
        btn.textContent = machine.name;
        btn.onclick = () => {
            if (isAnimating || !isConnected) return;
            
            const oldIndex = currentMachineIndex;
            if (oldIndex === index) return;
            currentMachineIndex = index;
            
            switchToSingleView(currentMachineIndex);
            updateMachineInfo();
        };
        gachaSection.machineButtons.appendChild(btn);
    });

    init3D();
    updateMachineInfo();
    updateUI();
}

initialize();
