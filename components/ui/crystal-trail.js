// crystal-trail.js - Vanilla JS Adapter for CrystalTrailBackground inside Project 09 Card
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("crystalCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let crystals = [];

    // ResizeObserver to automatically resize the canvas to its card container
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = canvas.width = entry.contentRect.width;
        height = canvas.height = entry.contentRect.height;
      }
    });
    resizeObserver.observe(canvas.parentElement);

    class Crystal {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.life = 1;
        this.size = Math.random() * 8 + 4;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.1;
        this.vertices = [];
        const numVertices = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < numVertices; i++) {
          const angle = (i / numVertices) * Math.PI * 2;
          const radius = Math.random() * this.size + this.size / 2;
          this.vertices.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          });
        }
      }
      update() {
        this.life -= 0.01;
        this.angle += this.spin;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
          ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 107, 0, ${this.life * 0.8})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 107, 0, ${this.life * 0.1})`;
        ctx.fill();
        ctx.restore();
      }
    }

    let lastMousePos = { x: 0, y: 0 };

    window.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Only spawn crystals if the mouse is hovering over the card's bounding box
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        const currentMousePos = { x, y };
        const speed = Math.hypot(
          currentMousePos.x - lastMousePos.x,
          currentMousePos.y - lastMousePos.y
        );
        const crystalsToSpawn = Math.min(Math.floor(speed / 5), 5);

        for (let i = 0; i < crystalsToSpawn; i++) {
          if (crystals.length < 500) {
            crystals.push(new Crystal(x, y));
          }
        }
        lastMousePos = currentMousePos;
      }
    });

    const animate = () => {
      ctx.fillStyle = "rgba(10, 5, 20, 0.15)";
      ctx.fillRect(0, 0, width, height);

      crystals = crystals.filter((c) => c.life > 0);
      for (const crystal of crystals) {
        crystal.update();
        crystal.draw();
      }

      requestAnimationFrame(animate);
    };

    animate();
  });
})();
