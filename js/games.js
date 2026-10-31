// "Released Games" section: cards that link to each game's Steam page
import { gamesData } from './games-data.js';

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const steamUrl = (appId) => `https://store.steampowered.com/app/${appId}/`;
const steamHeader = (appId) => `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

export function initGames() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;

    gamesData.forEach(game => {
        // appId must be digits only; this also keeps the URL safe
        const appId = String(game.appId).replace(/\D/g, '');
        if (!appId) { console.warn('games-data: invalid appId for', game.title); return; }

        const cover = game.image || steamHeader(appId);
        const card = document.createElement('article');
        card.className = 'pixel-box p-4 bg-maple-bark group flex flex-col';
        card.innerHTML = `
            <a href="${steamUrl(appId)}" target="_blank" rel="noopener noreferrer" data-sfx="click"
               class="block bg-maple-mahogany border-2 border-maple-terracotta group-hover:border-maple-gold overflow-hidden aspect-[460/215]">
                <img src="${esc(cover)}" alt="${esc(game.title)} on Steam" loading="lazy"
                     class="w-full h-full object-cover transform group-hover:scale-105 transition-transform">
            </a>
            <div class="mt-4 flex-grow space-y-2">
                <div class="flex items-start justify-between gap-3">
                    <h3 class="font-pixelHeading text-lg text-maple-gold">${esc(game.title)}</h3>
                    <span class="font-pixelHeading text-xs text-maple-amber shrink-0">${esc(game.year || '')}</span>
                </div>
                <div class="font-pixelText text-lg text-maple-amber">${esc(game.role || '')}</div>
                <p class="font-pixelText text-xl text-maple-cream leading-snug">${esc(game.desc || '')}</p>
                <div class="flex flex-wrap gap-2 pt-1 font-pixelHeading text-[10px]">
                    ${(game.tags || []).map(t => `<span class="bg-maple-mahogany text-maple-amber border border-maple-amber px-2 py-0.5">${esc(t)}</span>`).join('')}
                </div>
            </div>
            <a href="${steamUrl(appId)}" target="_blank" rel="noopener noreferrer" data-sfx="click"
               class="pixel-btn mt-4 bg-maple-crimson text-maple-cream font-pixelHeading text-xs py-3 border-2 border-maple-gold flex items-center justify-center gap-2">
                <i class="ph ph-game-controller text-base"></i> VIEW ON STEAM
                <i class="ph ph-arrow-square-out text-base"></i>
            </a>
        `;

        // If Steam's image can't load and you gave a local one, fall back to it
        const img = card.querySelector('img');
        img.addEventListener('error', () => {
            console.warn(`Cover failed to load: ${img.getAttribute('src')}`);
            if (game.image && img.getAttribute('src') !== game.image) img.src = game.image;
        }, { once: true });

        grid.appendChild(card);
    });
}
