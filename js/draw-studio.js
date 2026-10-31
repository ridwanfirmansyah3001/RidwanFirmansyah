// Interactive 16x16 pixel drawing studio
import { playAudio } from './audio.js';

const PALETTE = ['#2A0D0B', '#3D1B18', '#C83228', '#D95B30', '#EA8124', '#F4B030', '#FAF0DB', '#4A5D3B'];
const BG_COLOR = '#2A0D0B';
const GRID_SIZE = 16;

const TOOL_ACTIVE = 'pixel-btn bg-maple-terracotta text-maple-cream text-xs font-pixelHeading py-2 border-2 border-maple-gold flex items-center justify-center gap-1';
const TOOL_INACTIVE = 'pixel-btn bg-maple-bark text-maple-cream text-xs font-pixelHeading py-2 border-2 border-maple-terracotta flex items-center justify-center gap-1';

export function initDrawStudio() {
    const canvas = document.getElementById('interactiveCanvas');
    const ctx = canvas.getContext('2d');
    const paletteEl = document.getElementById('drawPalette');
    const pixelSize = canvas.width / GRID_SIZE;

    let selectedColor = PALETTE[2];
    let currentTool = 'pencil';
    let isDrawing = false;

    // Palette swatches
    PALETTE.forEach((color, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', `Color ${color}`);
        btn.className = `w-8 h-8 border-2 ${idx === 2 ? 'border-maple-gold scale-110' : 'border-maple-mahogany'}`;
        btn.style.backgroundColor = color;
        btn.addEventListener('click', () => {
            playAudio('click');
            selectedColor = color;
            paletteEl.querySelectorAll('button').forEach(b => {
                b.classList.remove('border-maple-gold', 'scale-110');
                b.classList.add('border-maple-mahogany');
            });
            btn.classList.remove('border-maple-mahogany');
            btn.classList.add('border-maple-gold', 'scale-110');
        });
        paletteEl.appendChild(btn);
    });

    // Tools
    const pencilBtn = document.getElementById('drawToolPencil');
    const eraserBtn = document.getElementById('drawToolEraser');

    function setTool(tool) {
        playAudio('click');
        currentTool = tool;
        pencilBtn.className = tool === 'pencil' ? TOOL_ACTIVE : TOOL_INACTIVE;
        eraserBtn.className = tool === 'eraser' ? TOOL_ACTIVE : TOOL_INACTIVE;
    }
    pencilBtn.addEventListener('click', () => setTool('pencil'));
    eraserBtn.addEventListener('click', () => setTool('eraser'));

    // Drawing
    function drawPixel(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / (rect.width / GRID_SIZE));
        const y = Math.floor((e.clientY - rect.top) / (rect.height / GRID_SIZE));
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            ctx.fillStyle = currentTool === 'pencil' ? selectedColor : BG_COLOR;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            playAudio('draw');
        }
    }

    function clear() {
        ctx.fillStyle = BG_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    document.getElementById('clearCanvasBtn').addEventListener('click', () => {
        playAudio('click');
        clear();
    });

    // Mouse
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; drawPixel(e); });
    canvas.addEventListener('mousemove', (e) => { if (isDrawing) drawPixel(e); });
    window.addEventListener('mouseup', () => { isDrawing = false; });

    // Touch (passive:false so preventDefault stops page scrolling while drawing)
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        drawPixel(e.touches[0]);
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
        if (isDrawing) drawPixel(e.touches[0]);
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', () => { isDrawing = false; });

    clear();
}
