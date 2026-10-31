// Contact form (Formspree)
import { playAudio } from './audio.js';

const ENDPOINT = 'https://formspree.io/f/xvkkwapd';

const SUCCESS_TEXT = 'Message sent successfully! Ridwan will respond shortly.';
const ERROR_TEXT = 'Something went wrong. Please try again.';

export function initContactForm() {
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('contactSuccessMsg');
    const msgIcon = document.getElementById('contactMsgIcon');
    const msgText = document.getElementById('contactMsgText');
    const btn = form.querySelector('button[type="submit"]');
    let hideTimer;

    // Shows the banner as green (success) or red (error) without
    // destroying the icon/text elements inside it.
    function showMessage(ok, text) {
        msg.classList.remove(
            'hidden',
            'border-green-500', 'text-green-400',
            'border-red-500', 'text-red-400'
        );
        msg.classList.add(...(ok
            ? ['border-green-500', 'text-green-400']
            : ['border-red-500', 'text-red-400']));

        msgIcon.className = `ph ${ok ? 'ph-check-circle' : 'ph-warning-circle'} text-2xl inline-block align-middle mr-1`;
        msgText.textContent = text;

        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => msg.classList.add('hidden'), 6000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        playAudio('click');

        // Keep the button's icon + label so we can restore them afterwards
        const originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.textContent = 'SENDING...';

        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (!res.ok) {
                // Formspree returns a JSON body explaining the problem
                const data = await res.json().catch(() => ({}));
                const reason = data.errors?.map((err) => err.message).join(', ') || `HTTP ${res.status}`;
                throw new Error(reason);
            }

            form.reset();
            showMessage(true, SUCCESS_TEXT);
        } catch (err) {
            console.error('Contact form error:', err);
            showMessage(false, ERROR_TEXT);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    });
}