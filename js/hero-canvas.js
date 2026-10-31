// Hero artwork: "Autumn Shrine Keep"
import { playAudio } from './audio.js';

export function initHeroCanvas() {
    const canvas = document.getElementById('heroPixelCanvas');
    const ctx = canvas.getContext('2d');
    const rect = (color, x, y, w, h) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };

    function draw() {
        const w = canvas.width;
        ctx.clearRect(0, 0, w, canvas.height);

        // Sky bands
        rect('#2A0D0B', 0, 0, w, 80);
        rect('#3D1B18', 0, 80, w, 60);
        rect('#D95B30', 0, 140, w, 60);

        // Moon / sun
        rect('#F4B030', 220, 40, 40, 40);

        // Mountains
        rect('#3D1B18', 0, 160, 100, 80);
        rect('#3D1B18', 80, 140, 120, 100);
        rect('#3D1B18', 180, 170, 140, 70);

        // Torii gate
        rect('#C83228', 110, 190, 100, 12); // top beam
        rect('#C83228', 120, 202, 80, 8);   // second beam
        rect('#C83228', 125, 210, 12, 70);  // left pillar
        rect('#C83228', 183, 210, 12, 70);  // right pillar

        // Autumn trees
        const treeColors = ['#C83228', '#EA8124', '#F4B030'];
        for (let i = 0; i < 6; i++) {
            const tx = 20 + i * 50;
            const ty = 210 + (i % 2) * 20;
            rect(treeColors[i % 3], tx, ty, 36, 36);
            rect(treeColors[i % 3], tx + 6, ty - 10, 24, 10);
            rect('#2A0D0B', tx + 14, ty + 36, 8, 20); // trunk
        }

        // Ground
        rect('#2A0D0B', 0, 270, w, 50);
        rect('#D95B30', 0, 270, w, 4);
    }

    canvas.addEventListener('click', () => {
        playAudio('click');
        rect('#F4B030', 0, 0, canvas.width, canvas.height); // flash
        setTimeout(draw, 100);
    });

    draw();
}
