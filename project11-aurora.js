// ============================================
// 🌌 PROJECT 11: SCHWARZSCHILD BLACK HOLE HERO SHADER
// Full Relativistic Keplerian Metric Raymarching Shader
// Ported from 21st.dev BlackHoleHeroSection
// ============================================

(function () {
    function initBlackHoleHeroShader() {
        const canvas = document.getElementById('auroraCanvas11');
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return;

        // Vertex Shader
        const vsSource = `
            attribute vec2 aPos;
            varying vec2 vUv;
            void main() {
                vUv = aPos * 0.5 + 0.5;
                gl_Position = vec4(aPos, 0.0, 1.0);
            }
        `;

        // Fragment Shader: Pure Schwarzschild Relativistic Raymarching + Keplerian Gas Shear
        const fsSource = `
            precision highp float;

            #define MAX_STEPS 240
            #define WIND_CYCLE 46.0

            varying vec2 vUv;

            uniform vec2  uRes;
            uniform float uTime;
            uniform vec3  uCamPos;
            uniform vec3  uRight;
            uniform vec3  uUp;
            uniform vec3  uFwd;
            uniform float uTanHalf;
            uniform vec2  uFocus;
            uniform float uSteps;
            uniform float uSkyR;
            uniform float uDiskIn;
            uniform float uDiskOut;
            uniform float uThick;
            uniform float uDensity;
            uniform float uSpin;
            uniform float uGrain;
            uniform float uBright;
            uniform float uDoppler;
            uniform vec3  uHot;
            uniform vec3  uMid;
            uniform vec3  uCool;
            uniform vec2  uJitter;
            uniform float uSeed;

            /* --- noise --- */
            float hash13(vec3 p) {
                p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
                p *= 17.0;
                return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
            }

            float vnoise(vec3 x) {
                vec3 i = floor(x);
                vec3 f = fract(x);
                f = f * f * (3.0 - 2.0 * f);
                float n000 = hash13(i + vec3(0.0, 0.0, 0.0));
                float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
                float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
                float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
                float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
                float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
                float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
                float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
                return mix(
                    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
                    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
                    f.z
                );
            }

            float fbm(vec3 p, float lod) {
                float a = 0.5;
                float s = 0.0;
                for (int i = 0; i < 4; i++) {
                    s += (i == 3 ? a * lod : a) * vnoise(p);
                    p = p * 2.03 + vec3(11.3, 7.1, 3.7);
                    a *= 0.5;
                }
                return s;
            }

            /* --- Keplerian Gas Disc --- */
            void gasAt(vec3 p, float rd, float dt, out float dens, out vec3 tint, out float heat) {
                float rn = clamp((rd - uDiskIn) / max(0.001, uDiskOut - uDiskIn), 0.0, 1.0);
                float tk = uThick * (0.35 + 1.25 * rn);
                float v = p.y / tk;
                float sheet = exp(-v * v);

                float lod = clamp(1.0 - dt * uGrain * 14.0, 0.0, 1.0);
                float phi = atan(p.z, p.x);
                float omega = uSpin * pow(uDiskIn / rd, 1.5);
                float lr = log(rd) * 1.1 + uSpin * uTime * 0.05;

                float u = uTime / WIND_CYCLE;
                float fA = fract(u);
                float fB = fract(u + 0.5);
                float w = abs(2.0 * fA - 1.0);

                float cloudsA = fbm(vec3(vec2(cos(phi + omega * fA * WIND_CYCLE),
                                              sin(phi + omega * fA * WIND_CYCLE)) * (rd * uGrain), lr), lod);
                float cloudsB = fbm(vec3(vec2(cos(phi + omega * fB * WIND_CYCLE),
                                              sin(phi + omega * fB * WIND_CYCLE)) * (rd * uGrain), lr + 40.0), lod);
                float clouds = mix(cloudsA, cloudsB, w);

                float filaments = clouds * clouds * 1.75;
                float inner = smoothstep(0.0, 0.07, rn);
                float outer = 1.0 - smoothstep(0.45, 1.0, rn);
                float prof = inner * outer * pow(uDiskIn / rd, 2.0);

                dens = max(0.0, filaments * 1.5 - 0.30) * sheet * prof * uDensity * 4.6;
                heat = pow(uDiskIn / rd, 0.8) * (0.72 + 0.55 * clouds);

                tint = mix(uCool, uMid, smoothstep(0.10, 0.52, heat));
                tint = mix(tint, uHot, smoothstep(0.52, 1.05, heat));
            }

            /* --- ACES Filmic Tone Mapping --- */
            vec3 aces(vec3 x) {
                return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy + uJitter - uFocus * uRes) / uRes.y;
                vec3 dir = normalize(uFwd + (uv.x * uRight + uv.y * uUp) * 2.0 * uTanHalf);

                vec3 pos = uCamPos;
                vec3 vel = dir;

                vec3 hv = cross(pos, vel);
                float h2 = dot(hv, hv);
                float h = sqrt(h2);
                float swept = 0.0;

                vec3 col = vec3(0.0);
                float transmit = 1.0;
                bool captured = false;

                float jitter = fract(sin(dot(gl_FragCoord.xy + uSeed, vec2(12.9898, 78.233))) * 43758.5453);

                for (int i = 0; i < MAX_STEPS; i++) {
                    if (float(i) >= uSteps) break;

                    float r2 = dot(pos, pos);
                    float r = sqrt(r2);

                    if (r < 1.0) { captured = true; break; }
                    if (r > uSkyR && dot(pos, vel) > 0.0) break;
                    if (transmit < 0.004) break;

                    float dt = clamp(0.14 * (r - 1.0), 0.025, 1.1);

                    if (r < uDiskOut * 1.25) {
                        float rn = clamp((r - uDiskIn) / max(0.001, uDiskOut - uDiskIn), 0.0, 1.0);
                        float tk = uThick * (0.35 + 1.25 * rn);
                        dt = min(dt, max(tk * 0.38, abs(pos.y) * 0.5));
                    }

                    swept += h * dt / r2;
                    float deep = exp(-1.3 * max(0.0, swept - 4.6));

                    jitter = fract(jitter + 0.6180339887);
                    vec3 mid = pos + vel * (dt * jitter);
                    float rd = length(mid.xz);

                    if (rd > uDiskIn && rd < uDiskOut && abs(mid.y) < uThick * 5.0) {
                        float dens;
                        float heat;
                        vec3 tint;
                        gasAt(mid, rd, dt, dens, tint, heat);

                        if (dens > 0.001) {
                            vec3 tang = normalize(cross(vec3(0.0, 1.0, 0.0), vec3(mid.x, 0.0, mid.z)));
                            float beta = min(0.85, sqrt(0.5 / max(rd, 1.5)));
                            float gam = inversesqrt(max(1e-4, 1.0 - beta * beta));
                            vec3 toObs = -normalize(vel);
                            float g = 1.0 / (gam * (1.0 - beta * dot(tang, toObs)));
                            g *= sqrt(max(0.05, 1.0 - 1.0 / rd));
                            float boost = pow(max(g, 0.02), 3.0 * uDoppler);

                            vec3 shift = mix(
                                vec3(1.0),
                                g > 1.0 ? vec3(0.86, 0.94, 1.14) : vec3(1.15, 0.82, 0.62),
                                clamp(abs(g - 1.0) * 1.6, 0.0, 1.0) * uDoppler
                            );

                            float emit = uBright * (0.26 + 2.0 * heat * heat);
                            col += tint * shift * (emit * boost * dens * transmit * dt * deep);
                            transmit *= exp(-dens * 0.30 * dt);
                        }
                    }

                    vec3 acc = -1.5 * h2 * pos / (r2 * r2 * r);
                    vel += acc * dt;
                    pos += vel * dt;
                }

                // ACES Tone Mapping & Gamma Correction
                vec3 finalCol = aces(col * 0.9);
                finalCol = pow(max(finalCol, 0.0), vec3(0.4545));

                gl_FragColor = vec4(finalCol, 1.0 - transmit);
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Quad Buffer
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             3, -1,
            -1,  3
        ]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'aPos');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniforms mapping
        const u = {};
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const info = gl.getActiveUniform(program, i);
            if (info) u[info.name] = gl.getUniformLocation(program, info.name);
        }

        // Color helper
        function hexToLinear(hex) {
            const h = hex.trim().replace("#", "");
            const full = h.length === 3 ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2] : h.slice(0,6);
            const n = parseInt(full, 16);
            const srgb = [((n >> 16) & 255)/255, ((n >> 8) & 255)/255, (n & 255)/255];
            return srgb.map(v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        }

        const RAD = Math.PI / 180;
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;

        window.addEventListener('mousemove', (e) => {
            targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        function resize() {
            const parent = canvas.parentElement;
            canvas.width = parent ? parent.clientWidth : window.innerWidth;
            canvas.height = parent ? parent.clientHeight : window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        window.addEventListener('resize', resize);
        resize();

        let frameIndex = 0;

        // Render loop
        function render(now) {
            const t = now * 0.001;

            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Camera Setup: elevation -5.5°, distance 24, roll -20° + subtle mouse parallax
            const az = (0 + mouseX * 2.5) * RAD;
            const el = Math.max(-88, Math.min(88, -5.5 + mouseY * 1.5)) * RAD;
            const dist = 24.0;
            const ce = Math.cos(el);
            const camX = dist * ce * Math.cos(az);
            const camY = dist * Math.sin(el);
            const camZ = dist * ce * Math.sin(az);

            const fx = -camX / dist, fy = -camY / dist, fz = -camZ / dist;
            let rx = fz, ry = 0, rz = -fx;
            const rl = Math.hypot(rx, ry, rz) || 1;
            rx /= rl; ry /= rl; rz /= rl;
            let ux = ry * fz - rz * fy;
            let uy = rz * fx - rx * fz;
            let uz = rx * fy - ry * fx;

            const rollRad = -20 * RAD;
            const cr = Math.cos(rollRad), sr = Math.sin(rollRad);
            const RX = rx * cr + ux * sr, RY = ry * cr + uy * sr, RZ = rz * cr + uz * sr;
            const UX = -rx * sr + ux * cr, UY = -ry * sr + uy * cr, UZ = -rz * sr + uz * cr;

            const hot = hexToLinear("#FFF3DE");
            const mid = hexToLinear("#FF9838");
            const cool = hexToLinear("#8E3A0B");

            gl.useProgram(program);

            gl.uniform2f(u.uRes, canvas.width, canvas.height);
            gl.uniform1f(u.uTime, t);
            gl.uniform3f(u.uCamPos, camX, camY, camZ);
            gl.uniform3f(u.uRight, RX, RY, RZ);
            gl.uniform3f(u.uUp, UX, UY, UZ);
            gl.uniform3f(u.uFwd, fx, fy, fz);
            gl.uniform1f(u.uTanHalf, Math.tan(42 * 0.5 * RAD));
            gl.uniform2f(u.uFocus, 0.68, 0.46); // Black hole focus on right side beside text
            gl.uniform1f(u.uSteps, 220);
            gl.uniform1f(u.uSkyR, 35.0);
            gl.uniform1f(u.uDiskIn, 3.0);
            gl.uniform1f(u.uDiskOut, 15.0);
            gl.uniform1f(u.uThick, 0.26);
            gl.uniform1f(u.uDensity, 1.0);
            gl.uniform1f(u.uSpin, 0.06 * 6.2831853);
            gl.uniform1f(u.uGrain, 0.48);
            gl.uniform1f(u.uBright, 1.1);
            gl.uniform1f(u.uDoppler, 0.35);
            gl.uniform3f(u.uHot, hot[0], hot[1], hot[2]);
            gl.uniform3f(u.uMid, mid[0], mid[1], mid[2]);
            gl.uniform3f(u.uCool, cool[0], cool[1], cool[2]);
            gl.uniform2f(u.uJitter, 0.0, 0.0);
            gl.uniform1f(u.uSeed, (frameIndex % 64) * 17.13);

            gl.drawArrays(gl.TRIANGLES, 0, 3);

            frameIndex++;
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlackHoleHeroShader);
    } else {
        initBlackHoleHeroShader();
    }
})();
