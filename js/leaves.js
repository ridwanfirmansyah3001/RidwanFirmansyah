// Falling pixel maple leaves (background canvas)
const LEAF_COLORS = ['#C83228', '#D95B30', '#EA8124', '#F4B030'];
const LEAF_COUNT = 35;

export function initLeaves() {
    const canvas = document.getElementById('leafCanvas');
    const ctx = canvas.getContext('2d');

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Leaf {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.floor(Math.random() * 3 + 3) * 2;
            this.speedY = Math.random() * 1.2 + 0.5;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
            this.color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = (Math.random() - 0.5) * 0.03;
        }
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.02) + this.speedX;
            this.angle += this.spinSpeed;
            if (this.y > canvas.height + 20) this.reset();
        }
        draw() {
            const s = this.size;
            ctx.save();
            ctx.translate(Math.floor(this.x), Math.floor(this.y));
            ctx.fillStyle = this.color;
            ctx.fillRect(-s / 2, -s / 2, s, s);
            ctx.fillRect(-s, 0, s * 2, s / 2);
            ctx.fillRect(0, -s, s / 2, s * 2);
            ctx.restore();
        }
    }

    const leaves = Array.from({ length: LEAF_COUNT }, () => new Leaf());

    const frame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        leaves.forEach(leaf => { leaf.update(); leaf.draw(); });
        requestAnimationFrame(frame);
    };

    // Skip the animation for users who prefer reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        frame();
    }
}
