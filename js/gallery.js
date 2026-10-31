// Gallery grid, category filter, and lightbox with a sub-gallery (multiple images per artwork)
import { playAudio } from './audio.js';
import { galleryData } from './gallery-data.js';

const BTN_ACTIVE = 'filter-btn active pixel-btn bg-maple-crimson text-maple-cream border-2 border-maple-gold px-4 py-2';
const BTN_INACTIVE = 'filter-btn pixel-btn bg-maple-bark text-maple-cream border-2 border-maple-terracotta px-4 py-2';

// Escape text before putting it into innerHTML
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Watermark shown over lightbox images (put your name/handle here)
const WATERMARK = 'YOUR NAME';
const watermarkHtml = `<div class="art-watermark" aria-hidden="true">${`<span>© ${esc(WATERMARK)}</span>`.repeat(24)}</div>`;

// Placeholder square (used when an item has no image or the image fails to load)
function placeholderSvg(item, large) {
    const [a, aw, b, bw, c, cw] = large ? [1, 14, 3, 10, 5, 6] : [2, 12, 4, 8, 6, 4];
    return `<svg class="w-full h-full" viewBox="0 0 16 16" fill="${esc(item.svgColor || '#C83228')}">
        <rect x="${a}" y="${a}" width="${aw}" height="${aw}"/>
        <rect x="${b}" y="${b}" width="${bw}" height="${bw}" fill="#F4B030"/>
        <rect x="${c}" y="${c}" width="${cw}" height="${cw}" fill="#2A0D0B"/>
    </svg>`;
}

// Normalize an item's images into [{ src, caption }].
// Supports: images: ['a.png', 'b.png'] | images: [{ src, caption }] | image: 'a.png'
function getSlides(item) {
    const list = item.images?.length ? item.images : (item.image ? [item.image] : []);
    return list.map(s => (typeof s === 'string' ? { src: s, caption: '' } : { src: s.src, caption: s.caption || '' }));
}

// Cover shown on the grid card
const getCover = (item) => item.image || getSlides(item)[0]?.src || null;

// If an <img> fails (typo, wrong case, missing file) swap in the placeholder
function attachImageFallback(root, item, large) {
    root.querySelectorAll('img[data-art]').forEach(img => {
        img.addEventListener('error', () => {
            console.warn(`Gallery image not found: ${img.getAttribute('src')}`);
            img.outerHTML = placeholderSvg(item, large);
        }, { once: true });
    });
}

export function initGallery() {
    const grid = document.getElementById('galleryGrid');
    const filters = document.getElementById('filterButtons');
    const modal = document.getElementById('artModal');
    const modalContent = document.getElementById('modalContent');

    // Lightbox state
    let view = { item: null, slides: [], index: 0 };
    const isOpen = () => !modal.classList.contains('hidden');

    function renderCards(items) {
        grid.innerHTML = '';
        items.forEach(item => {
            const cover = getCover(item);
            const count = getSlides(item).length;
            const card = document.createElement('div');
            card.className = 'pixel-box p-4 bg-maple-bark cursor-pointer group hover:border-maple-gold transition-all';
            card.addEventListener('click', () => openModal(item));

            const art = cover
                ? `<div class="w-full h-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                       <img data-art src="${esc(cover)}" alt="${esc(item.title)}" loading="lazy" class="pixelated w-full h-full object-contain">
                   </div>`
                : `<div class="w-24 h-24 transform group-hover:scale-110 transition-transform">${placeholderSvg(item, false)}</div>`;

            card.innerHTML = `
                <div class="bg-maple-mahogany border-2 border-maple-terracotta p-4 flex items-center justify-center h-48 relative overflow-hidden group-hover:border-maple-gold">
                    ${art}
                    ${count > 1 ? `<span class="absolute top-2 left-2 bg-maple-crimson text-maple-cream font-pixelHeading text-[10px] px-2 py-0.5 border border-maple-gold flex items-center gap-1"><i class="ph ph-images"></i> ${count}</span>` : ''}
                    <span class="absolute bottom-2 right-2 bg-maple-bark/90 text-maple-amber font-pixelHeading text-[10px] px-2 py-0.5 border border-maple-terracotta">
                        ${esc(item.dims)}
                    </span>
                </div>
                <div class="mt-3 space-y-1">
                    <div class="font-pixelHeading text-sm text-maple-gold group-hover:text-maple-cream">${esc(item.title)}</div>
                    <div class="font-pixelText text-base text-maple-amber flex justify-between">
                        <span class="capitalize">${esc(item.category)}</span>
                    </div>
                </div>
            `;
            attachImageFallback(card, item, false);
            grid.appendChild(card);
        });
    }

    function filter(cat) {
        playAudio('click');
        filters.querySelectorAll('.filter-btn').forEach(btn => {
            btn.className = btn.dataset.cat === cat ? BTN_ACTIVE : BTN_INACTIVE;
        });
        renderCards(cat === 'all' ? galleryData : galleryData.filter(i => i.category === cat));
    }

    // ---- Lightbox -------------------------------------------------
    function openModal(item) {
        playAudio('click');
        view = { item, slides: getSlides(item), index: 0 };
        renderModal();
        modal.classList.remove('hidden');
    }

    function renderModal() {
        const { item, slides, index } = view;
        const multi = slides.length > 1;
        const slide = slides[index];

        const main = slide
            ? `<img data-art id="modalMainImg" src="${esc(slide.src)}" alt="${esc(slide.caption || item.title)}"
                    class="pixelated max-w-full max-h-[55vh] w-auto h-auto object-contain">`
            : `<div class="w-32 h-32">${placeholderSvg(item, true)}</div>`;

        const arrows = multi ? `
            <button type="button" data-nav="-1" aria-label="Previous image"
                    class="pixel-btn absolute left-2 top-1/2 -translate-y-1/2 bg-maple-bark text-maple-gold border-2 border-maple-gold w-9 h-9 flex items-center justify-center">
                <i class="ph ph-caret-left text-lg"></i>
            </button>
            <button type="button" data-nav="1" aria-label="Next image"
                    class="pixel-btn absolute right-2 top-1/2 -translate-y-1/2 bg-maple-bark text-maple-gold border-2 border-maple-gold w-9 h-9 flex items-center justify-center">
                <i class="ph ph-caret-right text-lg"></i>
            </button>
            <span class="absolute top-2 right-2 bg-maple-bark/90 text-maple-amber font-pixelHeading text-[10px] px-2 py-0.5 border border-maple-terracotta">
                ${index + 1} / ${slides.length}
            </span>` : '';

        const thumbs = multi ? `
            <div class="flex gap-2 overflow-x-auto pb-2" id="modalThumbs">
                ${slides.map((s, i) => `
                    <button type="button" data-thumb="${i}" aria-label="Show image ${i + 1}"
                            class="shrink-0 w-16 h-16 bg-maple-mahogany border-2 ${i === index ? 'border-maple-gold' : 'border-maple-terracotta opacity-70 hover:opacity-100'}">
                        <img src="${esc(s.src)}" alt="" loading="lazy" class="pixelated w-full h-full object-contain">
                    </button>`).join('')}
            </div>` : '';

        modalContent.innerHTML = `
            <div class="relative overflow-hidden bg-maple-mahogany border-2 border-maple-gold p-6 flex items-center justify-center min-h-[220px]">
                ${main}
                ${watermarkHtml}
                ${arrows}
            </div>
            ${slide?.caption ? `<p class="font-pixelText text-lg text-maple-amber text-center">${esc(slide.caption)}</p>` : ''}
            ${thumbs}
            <div class="space-y-2">
                <h3 class="font-pixelHeading text-xl text-maple-gold">${esc(item.title)}</h3>
                <div class="flex flex-wrap gap-x-4 font-pixelText text-lg text-maple-amber border-b border-maple-terracotta pb-2">
                    <span>Category: <strong class="text-maple-cream capitalize">${esc(item.category)}</strong></span>
                    <span>Dimensions: <strong class="text-maple-cream">${esc(item.dims)}</strong></span>
                </div>
                <p class="font-pixelText text-xl text-maple-cream pt-2">${esc(item.desc)}</p>
            </div>
        `;
        attachImageFallback(modalContent, item, true);
    }

    function go(step) {
        const n = view.slides.length;
        if (n < 2) return;
        view.index = (view.index + step + n) % n;
        playAudio('hover');
        renderModal();
    }

    function closeModal() {
        playAudio('click');
        modal.classList.add('hidden');
    }

    // ---- Events ---------------------------------------------------
    filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (btn) filter(btn.dataset.cat);
    });

    // One delegated listener for arrows + thumbnails (they get re-rendered)
    modalContent.addEventListener('click', (e) => {
        const nav = e.target.closest('[data-nav]');
        if (nav) return go(Number(nav.dataset.nav));
        const thumb = e.target.closest('[data-thumb]');
        if (thumb) {
            view.index = Number(thumb.dataset.thumb);
            playAudio('hover');
            renderModal();
        }
    });

    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); }); // click backdrop
    document.addEventListener('keydown', (e) => {
        if (!isOpen()) return;
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
    });

    renderCards(galleryData);
}