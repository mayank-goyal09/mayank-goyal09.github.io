// components/ui/liquid-metal-button.js
import { liquidMetalFragmentShader, ShaderMount } from "https://esm.sh/@paper-design/shaders@latest";

const THEMES = {
  analytics: { text: "#ffffff", bg: "#000000", border: "0px 0px 0px 2px rgba(10, 15, 25, 0.9), 0px 0px 0px 3px rgba(0, 210, 255, 0.8), 0 0 20px rgba(0, 210, 255, 0.4)" },
  python: { text: "#06b6d4", bg: "#000000", border: "0px 0px 0px 2px rgba(10, 15, 25, 0.9), 0px 0px 0px 3px rgba(6, 182, 212, 0.8), 0 0 20px rgba(6, 182, 212, 0.4)" },
  ml: { text: "#ffffff", bg: "#000000", border: "0px 0px 0px 2px rgba(10, 15, 25, 0.9), 0px 0px 0px 3px rgba(79, 172, 254, 0.8), 0 0 20px rgba(79, 172, 254, 0.4)" },
  dl: { text: "#ffffff", bg: "#000000", border: "0px 0px 0px 2px rgba(10, 15, 25, 0.9), 0px 0px 0px 3px rgba(224, 86, 253, 0.8), 0 0 20px rgba(224, 86, 253, 0.4)" },
  fastapi: { text: "#ffffff", bg: "#000000", border: "0px 0px 0px 2px rgba(10, 15, 25, 0.9), 0px 0px 0px 3px rgba(5, 196, 107, 0.8), 0 0 20px rgba(5, 196, 107, 0.4)" },
  genai: { text: "#ffffff", bg: "#000000", border: "0px 0px 0px 2px rgba(10, 15, 25, 0.9), 0px 0px 0px 3px rgba(255, 113, 239, 0.8), 0 0 20px rgba(255, 113, 239, 0.4)" },
  nlp: { text: "#cec216ff", bg: "#000000", border: "0px 0px 0px 2px rgba(10, 15, 25, 0.9), 0px 0px 0px 3px rgba(243, 156, 18, 0.8), 0 0 20px rgba(243, 156, 18, 0.4)" },
  default: { text: "#ffffff", bg: "#000000", border: "0px 0px 0px 2px rgba(10, 15, 25, 0.9), 0px 0px 0px 3px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.2)" }
};

export class LiquidMetalButton {
  constructor(element) {
    this.element = element;
    this.label = element.innerText || "Explore →";
    this.themeName = element.getAttribute("data-theme") || "default";
    this.theme = THEMES[this.themeName] || THEMES.default;
    this.width = parseInt(element.getAttribute("data-width")) || 200;
    this.height = parseInt(element.getAttribute("data-height")) || 46;

    this.init();
  }

  init() {
    this.element.innerHTML = "";
    this.element.style.textDecoration = "none";
    this.element.classList.add("liquid-metal-btn-wrapper");

    const perspective = document.createElement("div");
    perspective.className = "liquid-metal-btn-perspective";

    this.container = document.createElement("div");
    this.container.className = "liquid-metal-btn-container";
    this.container.style.width = `${this.width}px`;
    this.container.style.height = `${this.height}px`;

    // Label Layer
    const labelLayer = document.createElement("div");
    labelLayer.className = "liquid-metal-label-layer";
    const labelSpan = document.createElement("span");
    labelSpan.className = "liquid-metal-label";
    labelSpan.innerText = this.label;
    labelSpan.style.color = this.theme.text;
    labelLayer.appendChild(labelSpan);

    // Inner Layer
    const innerLayer = document.createElement("div");
    innerLayer.className = "liquid-metal-inner-layer";
    this.innerBg = document.createElement("div");
    this.innerBg.className = "liquid-metal-inner-bg";
    this.innerBg.style.background = this.theme.bg;
    innerLayer.appendChild(this.innerBg);

    // Canvas Layer
    const canvasLayer = document.createElement("div");
    canvasLayer.className = "liquid-metal-canvas-layer";
    this.canvasContainer = document.createElement("div");
    this.canvasContainer.className = "liquid-metal-canvas-container";
    if (this.theme.border) {
      this.canvasContainer.style.boxShadow = this.theme.border;
    }

    this.shaderRef = document.createElement("div");
    this.shaderRef.className = "shader-container-exploded";
    this.canvasContainer.appendChild(this.shaderRef);
    canvasLayer.appendChild(this.canvasContainer);

    // Trigger Layer
    this.trigger = document.createElement("button");
    this.trigger.className = "liquid-metal-trigger";

    this.container.appendChild(labelLayer);
    this.container.appendChild(innerLayer);
    this.container.appendChild(canvasLayer);
    this.container.appendChild(this.trigger);
    perspective.appendChild(this.container);
    this.element.appendChild(perspective);

    // Events
    this.trigger.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
    this.trigger.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
    this.trigger.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.trigger.addEventListener("mouseup", this.handleMouseUp.bind(this));
    this.trigger.addEventListener("click", this.handleClick.bind(this));

    this.loadShader();
  }

  loadShader() {
    try {
      this.shaderMount = new ShaderMount(
        this.shaderRef,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        },
        undefined,
        0.6
      );
    } catch (err) {
      console.error("Failed to load shader:", err);
    }
  }

  handleMouseEnter() {
    this.container.classList.add("hover");
    if (this.shaderMount && this.shaderMount.setSpeed) {
      this.shaderMount.setSpeed(1);
    }
  }

  handleMouseLeave() {
    this.container.classList.remove("hover");
    this.container.classList.remove("pressed");
    if (this.theme.border) {
      this.canvasContainer.style.boxShadow = this.theme.border;
    }
    this.innerBg.style.boxShadow = "none";
    if (this.shaderMount && this.shaderMount.setSpeed) {
      this.shaderMount.setSpeed(0.6);
    }
  }

  handleMouseDown() {
    this.container.classList.add("pressed");
    // Ensure inline styles override
    this.innerBg.style.boxShadow = "inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)";
  }

  handleMouseUp() {
    this.container.classList.remove("pressed");
    if (this.theme.border) {
      this.canvasContainer.style.boxShadow = this.theme.border;
    }
    this.innerBg.style.boxShadow = "none";
  }

  handleClick(e) {
    if (this.shaderMount && this.shaderMount.setSpeed) {
      this.shaderMount.setSpeed(2.4);
      setTimeout(() => {
        if (this.container.classList.contains("hover")) {
          this.shaderMount.setSpeed(1);
        } else {
          this.shaderMount.setSpeed(0.6);
        }
      }, 300);
    }

    const rect = this.trigger.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.className = "liquid-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    this.trigger.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // Simulate click on parent anchor if it's an anchor tag
    if (this.element.tagName.toLowerCase() === 'a') {
      const href = this.element.getAttribute('href');
      if (href) {
        setTimeout(() => {
          window.location.href = href;
        }, 150); // slight delay for ripple
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-liquid-button]").forEach(el => {
    new LiquidMetalButton(el);
  });
});
