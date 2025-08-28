// js/gachaScene.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { state } from './gachaState.js';
import { machines } from './gachaConfig.js';
import { updateGachaControls, updateInventory, updateHistory, showResultModal } from './gachaUI.js';
import { playSuspenseSound, stopSuspenseSound } from './audio.js';

let scene, camera, renderer, controls, starField;
let machine3DObjects = [];
const canvas = document.getElementById('gacha-canvas');

function drawItem() {
    const machine = machines[state.currentMachineIndex];
    let random = Math.random();
    let cumulative = 0;
    for (const rateInfo of machine.dropRates) {
        cumulative += rateInfo.rate;
        if (random < cumulative) {
            const rarity = rateInfo.rarity;
            const possibleItems = machine.itemPool.filter(item => item.rarity === rarity);
            return possibleItems[Math.floor(Math.random() * possibleItems.length)];
        }
    }
    return null;
}

function performRoll() {
    const drawnItem = drawItem();
    if (drawnItem) {
        const result = { ...drawnItem, id: Date.now() + Math.random(), machineName: machines[state.currentMachineIndex].name };
        state.inventory.push(result);
        state.history.push({ date: new Date(), items: [result] });
        updateInventory();
        updateHistory();
        showResultModal(result);
    }
}

export function triggerGachaAnimation() {
    if (state.isAnimating) return;
    state.isAnimating = true;
    state.isShaking = true;
    playSuspenseSound();
    const lever = machine3DObjects[state.currentMachineIndex].lever;
    const tl = gsap.timeline();
    tl.to(camera.position, { z: 5, duration: 0.3, ease: 'back.in(1.7)' });
    tl.to(lever.rotation, { z: -Math.PI / 1.5, duration: 0.3, ease: "power3.in" }, "-=0.1");
    tl.to(lever.rotation, { z: 0, duration: 0.6, ease: "back.out(2)" });
    const capsuleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.2 });
    const capsule = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), capsuleMat);
    capsule.position.set(0, -0.5, 1.0);
    machine3DObjects[state.currentMachineIndex].group.add(capsule);
    tl.from(capsule.scale, { x: 0, y: 0, z: 0, duration: 0.2, ease: 'back.out(1.7)' }, "<0.2");
    tl.to(capsule.position, { y: -1.2, duration: 0.5, ease: "bounce.out" }, "<");
    tl.to(scene.position, { x: '+=0.05', yoyo: true, repeat: 5, duration: 0.05, ease: 'power1.inOut' }, "-=0.5");
    tl.to(scene.position, { x: 0, duration: 0.2 });
    tl.call(() => { state.isShaking = false; stopSuspenseSound(); }, [], "-=0.8");
    tl.to(camera.position, { z: 8, duration: 0.5, ease: 'power2.out', onComplete: () => {
        machine3DObjects[state.currentMachineIndex].group.remove(capsule);
        performRoll();
        state.isAnimating = false;
        updateGachaControls();
    }}, ">0.5");
}

export function switchToSingleView(newIndex) {
    if (!controls) return;
    controls.minDistance = 8;
    controls.maxDistance = 15;
    gsap.to(camera.position, { z: 8, duration: 0.8, ease: 'power3.inOut' });
    gsap.to(controls.target, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'power3.inOut' });
    machine3DObjects.forEach((obj, index) => {
        if (index !== newIndex) {
            gsap.to(obj.group.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.5, ease: 'power2.in', onComplete: () => { obj.group.visible = false; } });
        } else {
            gsap.to(obj.group.position, { x: 0, duration: 0.8, ease: 'power3.inOut' });
            gsap.to(obj.group.scale, { x: 1, y: 1, z: 1, duration: 0.1 });
            obj.group.visible = true;
        }
    });
}

function animate() {
    if(!renderer) return;
    requestAnimationFrame(animate);
    controls.update();
    if (starField) { starField.rotation.y += 0.0001; }
    machine3DObjects.forEach(obj => {
        if (obj.nftTextMaterial) {
            const hue = (Date.now() * 0.0002) % 1;
            obj.nftTextMaterial.emissive.setHSL(hue, 1, 0.6);
        }
    });
    if (state.isShaking && machine3DObjects[state.currentMachineIndex]?.capsules) {
        const containerRadius = 0.95;
        const containerHeight = { min: 1.0, max: 2.8 };
        machine3DObjects[state.currentMachineIndex].capsules.forEach(capsule => {
            capsule.position.add(capsule.userData.velocity);
            const horizontalDist = Math.sqrt(capsule.position.x ** 2 + capsule.position.z ** 2);
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

export function handleResize() {
    if (!camera || !renderer) return;
    const parent = canvas.parentElement;
    if (parent) {
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        if (width > 0 && height > 0) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    }
}

export function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    const initialParent = canvas.parentElement;
    if (initialParent) {
        renderer.setSize(initialParent.clientWidth, initialParent.clientHeight);
        camera.aspect = initialParent.clientWidth / initialParent.clientHeight;
        camera.updateProjectionMatrix();
    }

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
            const glassMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, roughness: 0.05, metalness: 0.2, envMapIntensity: 3 });
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
                const capsuleMat = new THREE.MeshStandardMaterial({ color: capsuleColor, metalness: 0.6, roughness: 0.1, emissive: capsuleColor, emissiveIntensity: 0.2 });
                const capsule = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), capsuleMat);
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 0.9;
                capsule.position.set(Math.cos(angle) * radius, 1.0 + (Math.random() * 1.5), Math.sin(angle) * radius);
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
            const startAngle = -angleStep * (text.length - 1) / 2;
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
