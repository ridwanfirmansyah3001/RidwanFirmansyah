// Contact form
import { playAudio } from './audio.js';

const ENDPOINT = 'https://formspree.io/f/xvkkwapd';

export function initContactForm() {
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('contactSuccessMsg');
    const btn = form.querySelector('button[type="submit"]');
    let hideTimer;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        playAudio('click');

        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';

        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            msg.textContent = 'Message sent! Thank you.';
            msg.classList.remove('hidden');
            form.reset();
        } catch (err) {
            console.error(err);
            msg.textContent = 'Something went wrong. Please try again.';
            msg.classList.remove('hidden');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => msg.classList.add('hidden'), 6000);
        }
    });
}