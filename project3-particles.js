
class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.pos = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };

        this.closeEnoughTarget = 100;
        this.maxSpeed = Math.random() * 6 + 4;
        this.maxForce = this.maxSpeed * 0.05;
        this.particleSize = Math.random() * 6 + 6;
        this.isKilled = false;

        this.startColor = { r: 16, g: 185, b: 129 }; // Emerald-500
        this.targetColor = { r: 16, g: 185, b: 129 };
        this.colorWeight = 0;
        this.colorBlendRate = Math.random() * 0.0275 + 0.0025;

        // Initial random position outside
        const randomPos = this.generateRandomPos(canvasWidth / 2, canvasHeight / 2, (canvasWidth + canvasHeight) / 2);
        this.pos.x = randomPos.x;
        this.pos.y = randomPos.y;
    }

    generateRandomPos(x, y, mag) {
        const randomX = Math.random() * 1000;
        const randomY = Math.random() * 500;
        const direction = { x: randomX - x, y: randomY - y };
        const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (magnitude > 0) {
            direction.x = (direction.x / magnitude) * mag;
            direction.y = (direction.y / magnitude) * mag;
        }
        return { x: x + direction.x, y: y + direction.y };
    }

    move() {
        let proximityMult = 1;
        const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2));

        if (distance < this.closeEnoughTarget) {
            proximityMult = distance / this.closeEnoughTarget;
        }

        const towardsTarget = {
            x: this.target.x - this.pos.x,
            y: this.target.y - this.pos.y,
        };

        const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
        if (magnitude > 0) {
            towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
            towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
        }

        const steer = {
            x: towardsTarget.x - this.vel.x,
            y: towardsTarget.y - this.vel.y,
        };

        const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
        if (steerMagnitude > 0) {
            steer.x = (steer.x / steerMagnitude) * this.maxForce;
            steer.y = (steer.y / steerMagnitude) * this.maxForce;
        }

        this.acc.x += steer.x;
        this.acc.y += steer.y;

        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.acc.x = 0;
        this.acc.y = 0;
    }

    draw(ctx, drawAsPoints) {
        if (this.colorWeight < 1.0) {
            this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
        }

        const currentColor = {
            r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
            g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
            b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
        };

        ctx.fillStyle = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.6)`;
        if (drawAsPoints) {
            ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
        } else {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    kill(width, height) {
        if (!this.isKilled) {
            const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
            this.target.x = randomPos.x;
            this.target.y = randomPos.y;

            this.startColor = {
                r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
                g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
                b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
            };
            this.targetColor = { r: 5, g: 25, b: 15 }; // Dark emerald
            this.colorWeight = 0;
            this.isKilled = true;
        }
    }
}

class ParticleManager {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        this.particles = [];
        this.words = ["RESOLVER", "LOGISTICS", "LATENCY", "PRECISION"];
        this.wordIndex = 0;
        this.frameCount = 0;
        this.pixelSteps = 6;
        this.drawAsPoints = true;

        this.mouse = { x: 0, y: 0, isPressed: false, isRightClick: false };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.isPressed = true;
            this.mouse.isRightClick = e.button === 2;
        });
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isPressed = false;
            this.mouse.isRightClick = false;
        });
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        this.nextWord(this.words[0]);
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }

    nextWord(word) {
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = this.canvas.width;
        offscreenCanvas.height = this.canvas.height;
        const offscreenCtx = offscreenCanvas.getContext('2d');

        offscreenCtx.fillStyle = "white";
        // Responsive font size
        const fontSize = Math.min(this.canvas.width / 5, 120);
        offscreenCtx.font = `bold ${fontSize}px Syne, sans-serif`;
        offscreenCtx.textAlign = "center";
        offscreenCtx.textBaseline = "middle";
        offscreenCtx.fillText(word, this.canvas.width / 2, this.canvas.height / 2);

        const imageData = offscreenCtx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;

        // Custom emerald palette for Resolver project
        const newColor = {
            r: 16 + Math.random() * 30, // 16-46
            g: 185 + Math.random() * 60, // 185-245
            b: 129 + Math.random() * 60  // 129-189
        };

        let particleIndex = 0;
        const coordsIndexes = [];
        for (let i = 0; i < pixels.length; i += this.pixelSteps * 4) {
            coordsIndexes.push(i);
        }

        // Shuffle
        for (let i = coordsIndexes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
        }

        for (const coordIndex of coordsIndexes) {
            const alpha = pixels[coordIndex + 3];

            if (alpha > 128) {
                const x = (coordIndex / 4) % this.canvas.width;
                const y = Math.floor(coordIndex / 4 / this.canvas.width);

                let particle;
                if (particleIndex < this.particles.length) {
                    particle = this.particles[particleIndex];
                    particle.isKilled = false;
                    particleIndex++;
                } else {
                    particle = new Particle(this.canvas.width, this.canvas.height);
                    this.particles.push(particle);
                    particleIndex++;
                }

                particle.startColor = {
                    r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
                    g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
                    b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
                };
                particle.targetColor = newColor;
                particle.colorWeight = 0;
                particle.target.x = x;
                particle.target.y = y;
            }
        }

        for (let i = particleIndex; i < this.particles.length; i++) {
            this.particles[i].kill(this.canvas.width, this.canvas.height);
        }
    }

    animate() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.move();
            particle.draw(this.ctx, this.drawAsPoints);

            if (particle.isKilled) {
                if (particle.pos.x < 0 || particle.pos.x > this.canvas.width ||
                    particle.pos.y < 0 || particle.pos.y > this.canvas.height) {
                    this.particles.splice(i, 1);
                }
            }
        }

        if (this.mouse.isPressed && this.mouse.isRightClick) {
            this.particles.forEach(p => {
                const d = Math.sqrt(Math.pow(p.pos.x - this.mouse.x, 2) + Math.pow(p.pos.y - this.mouse.y, 2));
                if (d < 50) p.kill(this.canvas.width, this.canvas.height);
            });
        }

        this.frameCount++;
        if (this.frameCount % 240 === 0) {
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            this.nextWord(this.words[this.wordIndex]);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when the script loads
document.addEventListener('DOMContentLoaded', () => {
    // Create canvas dynamically if not present, or attach to existing
    const bgContainer = document.getElementById('card-particles');
    if (bgContainer) {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0';
        bgContainer.appendChild(canvas);
        new ParticleManager('particle-canvas');
    }
});
