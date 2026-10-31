// Contact form (front-end demo only)
import { playAudio } from './audio.js';

export function initContactForm() {
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('contactSuccessMsg');
    let hideTimer;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        playAudio('click');

        // GitHub Pages is static hosting, so there is no backend here.
        // To receive real messages, POST the form to a service such as
        // Formspree / Web3Forms / Getform:
        //   fetch('https://formspree.io/f/YOUR_ID', { method: 'POST', body: new FormData(form) })

        msg.classList.remove('hidden');
        form.reset();
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => msg.classList.add('hidden'), 6000);
    });
}
