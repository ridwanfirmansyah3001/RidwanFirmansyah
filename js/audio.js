// Web Audio API synthesizer for pixel SFX
let soundEnabled = true;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// name -> [oscillator type, start Hz, end Hz | null, gain, duration (s)]
const SFX = {
    hover: ['square', 320, 480, 0.03, 0.05],
    click: ['triangle', 520, 260, 0.08, 0.08],
    draw: ['sine', null, null, 0.02, 0.03] // frequency randomized below
};

export function playAudio(type) {
    if (!soundEnabled || !SFX[type]) return;
    try {
        initAudio();
        const [wave, f0, f1, vol, dur] = SFX[type];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        osc.type = wave;
        osc.frequency.setValueAtTime(f0 ?? 600 + Math.random() * 200, now);
        if (f1) osc.frequency.exponentialRampToValueAtTime(f1, now + dur);
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        osc.start(now);
        osc.stop(now + dur);
    } catch (e) {
        // Fail silently if audio is blocked by the browser
    }
}

export function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = document.getElementById('soundIcon');
    icon.className = soundEnabled ? 'ph ph-speaker-high text-lg' : 'ph ph-speaker-slash text-lg';
    if (soundEnabled) playAudio('click');
}
