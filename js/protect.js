// Casual-save deterrents for gallery images (right-click, drag, long-press).
// NOTE: this cannot stop screenshots or DevTools. It only blocks the easy routes.
const PROTECTED_SELECTORS = ['#galleryGrid', '#modalContent', '#gamesGrid'];

export function initProtect() {
    PROTECTED_SELECTORS.forEach(sel => {
        const root = document.querySelector(sel);
        if (!root) return;

        root.classList.add('protected'); // CSS in styles.css disables drag/select/touch-callout

        // No right-click menu ("Save image as...") on artwork
        root.addEventListener('contextmenu', (e) => e.preventDefault());

        // No dragging images out to the desktop or another tab
        root.addEventListener('dragstart', (e) => e.preventDefault());
    });
}
