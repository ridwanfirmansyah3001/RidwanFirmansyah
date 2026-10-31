// App entry point: wires every module together
import { playAudio, toggleSound } from './audio.js';

// Global SFX for any element tagged with data-sfx="click|hover"
document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-sfx]');
    if (!el) return;
    if (el.getAttribute('href') === '#') e.preventDefault(); // placeholder links
    playAudio(el.dataset.sfx);
});

document.getElementById('soundToggleBtn')?.addEventListener('click', toggleSound);

// Each section loads on its own: a missing file or a runtime error
// only disables that section and is reported in the console.
const sections = [
    ['./leaves.js', 'initLeaves'],
    ['./hero-image.js', 'initHeroImage'],
    ['./gallery.js', 'initGallery'],
    ['./draw-studio.js', 'initDrawStudio'],
    ['./contact.js', 'initContactForm']
];

for (const [path, fn] of sections) {
    import(path)
        .then((mod) => mod[fn]())
        .catch((err) => console.error(`[${path}] failed to load/init:`, err));
}