// ============================================
// 🌊 INTERACTIVE LIQUID GRADIENT BACKGROUND
// Custom color scheme for Mayank Goyal Portfolio
// ============================================

(function () {
    'use strict';

    // Wait for DOM and Three.js
    function init() {
        if (typeof THREE === 'undefined') {
            console.warn('Liquid Gradient: Three.js not loaded');
            return;
        }

        // ========== TOUCH TEXTURE CLASS ==========
        class TouchTexture {
            constructor() {
                this.size = 64;
                this.width = this.height = this.size;
                this.maxAge = 64;
                this.radius = 0.25 * this.size;
                this.speed = 1 / this.maxAge;
                this.trail = [];
                this.last = null;
                this.initTexture();
            }

            initTexture() {
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                this.ctx = this.canvas.getContext("2d");
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.texture = new THREE.Texture(this.canvas);
            }

            update() {
                this.clear();
                let speed = this.speed;
                for (let i = this.trail.length - 1; i >= 0; i--) {
                    const point = this.trail[i];
                    let f = point.force * speed * (1 - point.age / this.maxAge);
                    point.x += point.vx * f;
                    point.y += point.vy * f;
                    point.age++;
                    if (point.age > this.maxAge) {
                        this.trail.splice(i, 1);
                    } else {
                        this.drawPoint(point);
                    }
                }
                this.texture.needsUpdate = true;
            }

            clear() {
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            addTouch(point) {
                let force = 0;
                let vx = 0;
                let vy = 0;
                const last = this.last;
                if (last) {
                    const dx = point.x - last.x;
                    const dy = point.y - last.y;
                    if (dx === 0 && dy === 0) return;
                    const dd = dx * dx + dy * dy;
                    let d = Math.sqrt(dd);
                    vx = dx / d;
                    vy = dy / d;
                    force = Math.min(dd * 20000, 2.0);
                }
                this.last = { x: point.x, y: point.y };
                this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
            }

            drawPoint(point) {
                const pos = {
                    x: point.x * this.width,
                    y: (1 - point.y) * this.height
                };

                let intensity = 1;
                if (point.age < this.maxAge * 0.3) {
                    intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
                } else {
                    const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
                    intensity = -t * (t - 2);
                }
                intensity *= point.force;

                const radius = this.radius;
                let color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`;
                let offset = this.size * 5;
                this.ctx.shadowOffsetX = offset;
                this.ctx.shadowOffsetY = offset;
                this.ctx.shadowBlur = radius * 1;
                this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

                this.ctx.beginPath();
                this.ctx.fillStyle = "rgba(255,0,0,1)";
                this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // ========== GRADIENT BACKGROUND CLASS ==========
        class GradientBackground {
            constructor(sceneManager) {
                this.sceneManager = sceneManager;
                this.mesh = null;

                // Your custom color palette converted to RGB (0-1)
                // Dark Blue Teal: #1a3a52 → (0.102, 0.227, 0.322)
                // Medium Blue Gray: #2d4a5e → (0.176, 0.290, 0.369)
                // Dark Slate Gray: #3a3a4a → (0.227, 0.227, 0.290)
                // Deep Purple Gray: #2d2438 → (0.176, 0.141, 0.220)
                // Darkest Blue: #0f2838 → (0.059, 0.157, 0.220)
                // Light Gray Blue: #4a4a5a → (0.290, 0.290, 0.353)
                // Dark Purple Black: #1f1a2d → (0.122, 0.102, 0.176)

                this.uniforms = {
                    uTime: { value: 0 },
                    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                    uColor1: { value: new THREE.Vector3(0.102, 0.227, 0.322) },  // #1a3a52 Dark Blue Teal
                    uColor2: { value: new THREE.Vector3(0.176, 0.290, 0.369) },  // #2d4a5e Medium Blue Gray
                    uColor3: { value: new THREE.Vector3(0.227, 0.227, 0.290) },  // #3a3a4a Dark Slate Gray
                    uColor4: { value: new THREE.Vector3(0.176, 0.141, 0.220) },  // #2d2438 Deep Purple Gray
                    uColor5: { value: new THREE.Vector3(0.059, 0.157, 0.220) },  // #0f2838 Darkest Blue
                    uColor6: { value: new THREE.Vector3(0.122, 0.102, 0.176) },  // #1f1a2d Dark Purple Black
                    uSpeed: { value: 0.8 },
                    uIntensity: { value: 1.0 },
                    uTouchTexture: { value: null },
                    uGrainIntensity: { value: 0.05 },
                    uDarkBase: { value: new THREE.Vector3(0.059, 0.157, 0.220) }  // #0f2838 Darkest Blue as base
                };
            }

            init() {
                const viewSize = this.sceneManager.getViewSize();
                const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);

                const material = new THREE.ShaderMaterial({
                    uniforms: this.uniforms,
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vec3 pos = position.xyz;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
                            vUv = uv;
                        }
                    `,
                    fragmentShader: `
                        uniform float uTime;
                        uniform vec2 uResolution;
                        uniform vec3 uColor1;
                        uniform vec3 uColor2;
                        uniform vec3 uColor3;
                        uniform vec3 uColor4;
                        uniform vec3 uColor5;
                        uniform vec3 uColor6;
                        uniform float uSpeed;
                        uniform float uIntensity;
                        uniform sampler2D uTouchTexture;
                        uniform float uGrainIntensity;
                        uniform vec3 uDarkBase;
                        
                        varying vec2 vUv;
                        
                        #define PI 3.14159265359
                        
                        float grain(vec2 uv, float time) {
                            vec2 grainUv = uv * uResolution * 0.5;
                            float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
                            return grainValue * 2.0 - 1.0;
                        }
                        
                        vec3 getGradientColor(vec2 uv, float time) {
                            float gradientRadius = 0.55;
                            
                            // Multiple animated centers
                            vec2 center1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
                            vec2 center2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
                            vec2 center3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
                            vec2 center4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
                            vec2 center5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
                            vec2 center6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
                            
                            float dist1 = length(uv - center1);
                            float dist2 = length(uv - center2);
                            float dist3 = length(uv - center3);
                            float dist4 = length(uv - center4);
                            float dist5 = length(uv - center5);
                            float dist6 = length(uv - center6);
                            
                            float influence1 = 1.0 - smoothstep(0.0, gradientRadius, dist1);
                            float influence2 = 1.0 - smoothstep(0.0, gradientRadius, dist2);
                            float influence3 = 1.0 - smoothstep(0.0, gradientRadius, dist3);
                            float influence4 = 1.0 - smoothstep(0.0, gradientRadius, dist4);
                            float influence5 = 1.0 - smoothstep(0.0, gradientRadius, dist5);
                            float influence6 = 1.0 - smoothstep(0.0, gradientRadius, dist6);
                            
                            // Rotation layers
                            vec2 rotatedUv1 = uv - 0.5;
                            float angle1 = time * uSpeed * 0.15;
                            rotatedUv1 = vec2(
                                rotatedUv1.x * cos(angle1) - rotatedUv1.y * sin(angle1),
                                rotatedUv1.x * sin(angle1) + rotatedUv1.y * cos(angle1)
                            );
                            rotatedUv1 += 0.5;
                            
                            float radialGradient1 = length(rotatedUv1 - 0.5);
                            float radialInfluence1 = 1.0 - smoothstep(0.0, 0.8, radialGradient1);
                            
                            // Blend colors with dynamic intensities
                            vec3 color = vec3(0.0);
                            color += uColor1 * influence1 * (0.55 + 0.45 * sin(time * uSpeed));
                            color += uColor2 * influence2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2));
                            color += uColor3 * influence3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8));
                            color += uColor4 * influence4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3));
                            color += uColor5 * influence5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1));
                            color += uColor6 * influence6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9));
                            
                            // Add radial overlays
                            color += mix(uColor1, uColor3, radialInfluence1) * 0.3;
                            
                            // Apply intensity and tone map to prevent white wash
                            color *= uIntensity;
                            color /= max(1.0, max(color.r, max(color.g, color.b)));
                            
                            // Enhanced color saturation
                            float luminance = dot(color, vec3(0.299, 0.587, 0.114));
                            color = mix(vec3(luminance), color, 1.25);
                            
                            // Ensure minimum brightness with dark base
                            float brightness = length(color);
                            float mixFactor = clamp(brightness * 1.2, 0.25, 1.0);
                            color = mix(uDarkBase, color, mixFactor);
                            
                            return color;
                        }
                        
                        void main() {
                            vec2 uv = vUv;
                            
                            // Apply water distortion from touch texture
                            vec4 touchTex = texture2D(uTouchTexture, uv);
                            float vx = -(touchTex.r * 2.0 - 1.0);
                            float vy = -(touchTex.g * 2.0 - 1.0);
                            float intensity = touchTex.b;
                            uv.x += vx * 0.6 * intensity;
                            uv.y += vy * 0.6 * intensity;
                            
                            // Ripple effect
                            vec2 center = vec2(0.5);
                            float dist = length(uv - center);
                            float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.03 * intensity;
                            uv += vec2(ripple);
                            
                            vec3 color = getGradientColor(uv, uTime);
                            
                            // Apply grain effect
                            float grainValue = grain(uv, uTime);
                            color += grainValue * uGrainIntensity;
                            
                            // Subtle color shifting
                            float timeShift = uTime * 0.3;
                            color.r += sin(timeShift) * 0.015;
                            color.g += cos(timeShift * 1.4) * 0.015;
                            color.b += sin(timeShift * 1.2) * 0.02;
                            
                            // Ensure dark base shows through
                            float brightness = length(color);
                            float mixFactor = clamp(brightness * 1.2, 0.2, 1.0);
                            color = mix(uDarkBase, color, mixFactor);
                            
                            color = clamp(color, vec3(0.0), vec3(1.0));
                            
                            gl_FragColor = vec4(color, 1.0);
                        }
                    `
                });

                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.z = 0;
                this.sceneManager.scene.add(this.mesh);
            }

            update(delta) {
                if (this.uniforms.uTime) {
                    this.uniforms.uTime.value += delta;
                }
            }

            onResize(width, height) {
                const viewSize = this.sceneManager.getViewSize();
                if (this.mesh) {
                    this.mesh.geometry.dispose();
                    this.mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1);
                }
                if (this.uniforms.uResolution) {
                    this.uniforms.uResolution.value.set(width, height);
                }
            }
        }

        // ========== MAIN APP CLASS ==========
        class LiquidGradientApp {
            constructor() {
                this.container = document.getElementById('liquidGradientCanvas');
                if (!this.container) {
                    console.warn('Liquid Gradient: Container not found');
                    return;
                }

                this.renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    powerPreference: "high-performance",
                    alpha: false
                });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.container.appendChild(this.renderer.domElement);

                this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
                this.camera.position.z = 50;
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x0f2838); // Darkest Blue
                this.clock = new THREE.Clock();

                this.touchTexture = new TouchTexture();
                this.gradientBackground = new GradientBackground(this);
                this.gradientBackground.uniforms.uTouchTexture.value = this.touchTexture.texture;

                this.init();
            }

            init() {
                this.gradientBackground.init();
                this.tick();

                window.addEventListener("resize", () => this.onResize());
                window.addEventListener("mousemove", (ev) => this.onMouseMove(ev));
                window.addEventListener("touchmove", (ev) => this.onTouchMove(ev));
            }

            onTouchMove(ev) {
                const touch = ev.touches[0];
                this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
            }

            onMouseMove(ev) {
                this.mouse = {
                    x: ev.clientX / window.innerWidth,
                    y: 1 - ev.clientY / window.innerHeight
                };
                this.touchTexture.addTouch(this.mouse);
            }

            getViewSize() {
                const fovInRadians = (this.camera.fov * Math.PI) / 180;
                const height = Math.abs(this.camera.position.z * Math.tan(fovInRadians / 2) * 2);
                return { width: height * this.camera.aspect, height };
            }

            update(delta) {
                this.touchTexture.update();
                this.gradientBackground.update(delta);
            }

            render() {
                const delta = this.clock.getDelta();
                const clampedDelta = Math.min(delta, 0.1);
                this.renderer.render(this.scene, this.camera);
                this.update(clampedDelta);
            }

            tick() {
                this.render();
                requestAnimationFrame(() => this.tick());
            }

            onResize() {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.gradientBackground.onResize(window.innerWidth, window.innerHeight);
            }
        }

        // Create the app
        new LiquidGradientApp();
        console.log('🌊 Liquid Gradient initialized!');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
