// js/particles.js
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createParticles(type) {
    particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 10 + 6,
            speed: Math.random() * 1.5 + 0.5,
            type,
            alpha: 0.7,
            text: Math.random() > 0.5 ? '0' : '1'
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "12px monospace";

    particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(p.text, p.x, p.y);
        p.y += p.speed;

        if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
        }
    });

    requestAnimationFrame(animateParticles);
}