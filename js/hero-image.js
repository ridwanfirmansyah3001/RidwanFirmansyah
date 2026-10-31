import { playAudio } from './audio.js';

export function initHeroImage() {
    const img = document.getElementById('heroImage');
    if (!img) return; // don't break the other modules if the image is missing

    img.addEventListener('click', () => {
        playAudio('click');
        img.classList.add('brightness-150');
        setTimeout(() => img.classList.remove('brightness-150'), 100);
    });
}