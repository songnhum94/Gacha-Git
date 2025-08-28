// js/audio.js
let audioInitialized = false;
let suspenseSynth, rewardSynth, legendarySynth, clickSound, successSound, errorSound, suspenseSequence;

export function initAudio() {
    if (audioInitialized) return;
    try {
        suspenseSynth = new Tone.FMSynth({ harmonicity: 3, modulationIndex: 10, envelope: { attack: 0.01, decay: 0.2, release: 0.2 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.01, decay: 0.2, release: 0.2 } }).toDestination();
        rewardSynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "fatsine", count: 3, spread: 40 }, envelope: { attack: 0.01, decay: 0.4, sustain: 0.7, release: 0.4 } }).toDestination();
        legendarySynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'triangle8' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }, volume: -5 }).toDestination();
        clickSound = new Tone.MembraneSynth({ pitchDecay: 0.01, octaves: 2, envelope: { attack: 0.001, decay: 0.2, sustain: 0 } }).toDestination();
        successSound = new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 } }).toDestination();
        errorSound = new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 } }).toDestination();
        audioInitialized = true;
    } catch (e) {
        console.error("Could not initialize audio.", e);
    }
}

export function isAudioInitialized() {
    return audioInitialized;
}

export function playSuspenseSound() { 
    if (!audioInitialized) return; 
    const pentatonicScale = ['E2', 'G3', 'A3', 'B3', 'D4', 'E4']; 
    suspenseSequence = new Tone.Sequence((time, note) => { 
        suspenseSynth.triggerAttackRelease(note, "16n", time); 
    }, pentatonicScale, "8n").start(0); 
    Tone.Transport.start(); 
}
export function stopSuspenseSound() { 
    if (suspenseSequence) { 
        suspenseSequence.stop(0); 
        Tone.Transport.stop(); 
    } 
}
export function playRewardSound() { if (!audioInitialized) return; rewardSynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "0.8s", Tone.now()); }
export function playLegendaryRewardSound() { if (!audioInitialized) return; const now = Tone.now(); legendarySynth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '0.4', now); legendarySynth.triggerAttackRelease(['G5', 'C6', 'E6'], '0.4', now + 0.3); }
export function playClickSound() { if (!audioInitialized) return; clickSound.triggerAttackRelease("C2", "8n"); }
export function playSuccessSound() { if (!audioInitialized) return; successSound.triggerAttackRelease("C5", "0.5s", Tone.now()); }
export function playErrorSound() { if (!audioInitialized) return; errorSound.triggerAttackRelease("G2", "0.3s", Tone.now()); }
