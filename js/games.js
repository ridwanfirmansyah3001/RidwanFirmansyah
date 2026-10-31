// "Released Games" section: cards that link to each game's Steam page
import { gamesData } from './games-data.js';

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const steamUrl = (appId) => `https://store.steampowered.com/app/${appId}/`;
const steamHeader = (appId) => `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;

export function initGames() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) { console.error('games.js: #gamesGrid not found. Did you paste the <section id="games"> block into index.html?'); return; }
    if (!gamesData.length) console.warn('games.js: games-data.js has no entries.');

    gamesData.forEach(game => {
        // Accepts 1234567, '1234567' or a full Steam URL (.../app/1234567/Name/)
        const raw = String(game.appId ?? '').trim();
        const appId = (raw.match(/\/app\/(\d+)/) || raw.match(/^(\d+)$/) || [])[1];
        if (!appId) { console.warn(`games-data: could not read an appId from "${raw}" (${game.title})`); return; }

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

        // Fallbacks: Steam image -> your local image -> "unavailable" panel
        const img = card.querySelector('img');
        img.addEventListener('error', function onError() {
            console.warn(`Cover failed to load: ${img.getAttribute('src')}`);
            if (game.image && img.getAttribute('src') !== game.image) {
                img.src = game.image; // try the local image once
                return;
            }
            img.removeEventListener('error', onError);
            img.replaceWith(Object.assign(document.createElement('div'), {
                className: 'w-full h-full flex items-center justify-center font-pixelText text-xl text-maple-amber',
                textContent: 'Preview unavailable - click to open Steam'
            }));
        });

        grid.appendChild(card);
    });
}