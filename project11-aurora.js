// ============================================
// 🌌 PROJECT 11: BLACK HOLE CANVAS SHADER (STABLE PARALLAX & LIQUID PLASMA)
// Fixed camera tilt bounds so ring NEVER disappears on mouse movement!
// ============================================

(function () {
    function initBlackHoleShader() {
        const canvas = document.getElementById('auroraCanvas11');
        if (!canvas) return;

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return;

        // Vertex Shader
        const vsSource = `
            attribute vec2 aPosition;
            void main() {
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `;

        // Fragment Shader: Stable Parallax Liquid Plasma Multi-Ring Shader
        const fsSource = `
            precision highp float;

            uniform vec2 uResolution;
            uniform float uTime;
            uniform vec2 uMouse;
            uniform float uDoppler;
            uniform float uBendingMult;
            uniform float uSpin;

            #define MAX_STEPS 180
            #define STEP_SIZE 0.035
            #define SCHWARZSCHILD_R 0.26
            #define PHOTON_SPHERE 0.38
            #define DISC_INNER 0.42
            #define DISC_OUTER 1.65

            // Matrix rotation around Z axis (Tilt towards left)
            mat3 rotateZ(float angle) {
                float s = sin(angle);
                float c = cos(angle);
                return mat3(
                    c, -s, 0.0,
                    s,  c, 0.0,
                    0.0, 0.0, 1.0
                );
            }

            // Matrix rotation around Y axis (Yaw)
            mat3 rotateY(float angle) {
                float s = sin(angle);
                float c = cos(angle);
                return mat3(
                    c, 0.0, s,
                    0.0, 1.0, 0.0,
                    -s, 0.0, c
                );
            }

            // Matrix rotation around X axis (Pitch)
            mat3 rotateX(float angle) {
                float s = sin(angle);
                float c = cos(angle);
                return mat3(
                    1.0, 0.0, 0.0,
                    0.0, c, -s,
                    0.0, s, c
                );
            }

            // Simplex-style noise for liquid plasma turbulence
            float hash(vec2 p) {
                p = fract(p * vec2(123.34, 456.21));
                p += dot(p, p + 45.32);
                return fract(p.x * p.y);
            }

            float noise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));
                return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
            }

            float fbm(vec2 p) {
                float v = 0.0;
                float a = 0.5;
                mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
                for (int i = 0; i < 4; i++) {
                    v += a * noise(p);
                    p = rot * p * 2.05;
                    a *= 0.5;
                }
                return v;
            }

            // Liquid Plasma Multi-Ring Accretion Disc Sample
            vec4 sampleDisk(vec3 pos) {
                float r = length(pos.xz);
                if (r < DISC_INNER || r > DISC_OUTER) return vec4(0.0);

                // Thin sheet plane with comfortable thickness tolerance
                float thickness = 0.035 * (r / DISC_INNER);
                float h = exp(-abs(pos.y) * abs(pos.y) / (thickness * thickness));
                if (h < 0.003) return vec4(0.0);

                // Angle & spiral coordinates
                float phi = atan(pos.z, pos.x);
                float speed = 1.6 / sqrt(r);
                float t = uTime * uSpin * 0.4;

                // Liquid Swirling Fluid Distortion
                float liquidFlow = sin(phi * 5.0 - t * 2.2) * 0.12 + cos(r * 14.0 - t * 1.8) * 0.08;
                vec2 liquidUV = vec2(r * 4.5 + liquidFlow, phi * 3.5 + t * speed);
                float n = fbm(liquidUV * 1.8);

                // Multi-Frequency Razor-Thin Concentric Ring Filaments (15-20 sharp lines!)
                float r1 = sin(r * 65.0 - t * 1.5) * 0.5 + 0.5;
                float r2 = sin(r * 140.0 + t * 2.5) * 0.5 + 0.5;
                float r3 = sin(r * 260.0 - t * 3.5) * 0.5 + 0.5;
                float fineRings = pow(r1, 3.0) * 0.40 + pow(r2, 4.0) * 0.35 + pow(r3, 5.0) * 0.25;

                float density = smoothstep(DISC_OUTER, DISC_INNER + 0.25, r) * smoothstep(DISC_INNER, DISC_INNER + 0.1, r);
                density *= h * (0.25 + 0.75 * fineRings) * (0.4 + 0.6 * n);

                // Relativistic Doppler Beaming
                float doppler = 1.0;
                if (uDoppler > 0.5) {
                    float velAlongRay = sin(phi) * (pos.x > 0.0 ? 1.0 : -1.0);
                    doppler = pow(1.0 + velAlongRay * 0.3, 2.2);
                }

                // Soft Copper Amber Spectrum
                vec3 colInner = vec3(2.4, 1.8, 1.1); // Warm gold
                vec3 colMid = vec3(1.7, 0.85, 0.16); // Deep copper amber
                vec3 colOuter = vec3(0.85, 0.22, 0.02); // Dark crimson

                float relR = (r - DISC_INNER) / (DISC_OUTER - DISC_INNER);
                vec3 col = mix(colInner, colMid, smoothstep(0.0, 0.2, relR));
                col = mix(col, colOuter, smoothstep(0.2, 1.0, relR));

                col *= doppler * density * 1.9;

                return vec4(col, density * h * 0.42);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy - uResolution.xy * 0.5) / uResolution.y;

                // Camera position setup
                vec3 camPos = vec3(0.0, 0.22, -3.5);
                vec3 rayDir = normalize(vec3(uv.x, uv.y, 1.5));

                // Tilt Left Matrix (+0.38 rad / +22.0 Degrees)
                float tiltAngle = 0.38;

                // Controlled, subtle mouse parallax (prevents ring disappearing!)
                float rotY = (uMouse.x - 0.5) * 0.10 + uTime * uSpin * 0.03;
                float rotX = (uMouse.y - 0.5) * 0.06 + 0.22;

                mat3 rotMat = rotateZ(tiltAngle) * rotateX(rotX) * rotateY(rotY);

                // Shift black hole center rightwards (x = 0.62)
                vec3 bhCenter = vec3(0.62, 0.0, 0.0);

                vec3 pos = rotMat * (camPos - bhCenter);
                vec3 dir = rotMat * rayDir;

                vec3 accumColor = vec3(0.0);
                float accumAlpha = 0.0;
                bool hitEventHorizon = false;

                // Relativistic Raymarching Loop
                for (int i = 0; i < MAX_STEPS; i++) {
                    float r = length(pos);

                    // 1. Event Horizon Shadow Sphere (Pitch Black Center)
                    if (r < SCHWARZSCHILD_R) {
                        hitEventHorizon = true;
                        break;
                    }

                    // 2. Gravitational Deflection Vector Bending
                    vec3 gravityDir = -normalize(pos);
                    float bendFactor = (1.3 * SCHWARZSCHILD_R / (r * r)) * STEP_SIZE * uBendingMult;
                    dir = normalize(dir + gravityDir * bendFactor);

                    // 3. Sample Accretion Disc Volume
                    vec4 diskSample = sampleDisk(pos);
                    if (diskSample.a > 0.0) {
                        accumColor += diskSample.rgb * (1.0 - accumAlpha) * diskSample.a;
                        accumAlpha += diskSample.a;
                        if (accumAlpha >= 0.98) break;
                    }

                    // Step ray
                    pos += dir * STEP_SIZE;

                    // Ray escaped
                    if (r > 7.0) break;
                }

                // Event horizon shadow mask
                if (hitEventHorizon) {
                    accumColor *= 0.0;
                } else {
                    // Soft Photon sphere halo ring
                    float minR = length(pos);
                    float halo = exp(-abs(minR - PHOTON_SPHERE) * 16.0) * 0.25;
                    accumColor += vec3(2.2, 1.5, 0.75) * halo * (1.0 - accumAlpha);
                }

                // Soft Tone Mapping & Compression
                vec3 finalCol = accumColor / (1.0 + accumColor * 0.55);
                finalCol = pow(finalCol, vec3(0.85));

                gl_FragColor = vec4(finalCol, accumAlpha);
            }
        `;

        // Shader Helper
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
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1,
        ]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniform Locations
        const uResolution = gl.getUniformLocation(program, 'uResolution');
        const uTime = gl.getUniformLocation(program, 'uTime');
        const uMouse = gl.getUniformLocation(program, 'uMouse');
        const uDoppler = gl.getUniformLocation(program, 'uDoppler');
        const uBendingMult = gl.getUniformLocation(program, 'uBendingMult');
        const uSpin = gl.getUniformLocation(program, 'uSpin');

        let mouseX = 0.5, mouseY = 0.5;
        let targetMouseX = 0.5, targetMouseY = 0.5;
        let spinActive = 1.0;
        let dopplerActive = 1.0;
        let bendingMult = 1.8;

        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX / window.innerWidth;
            targetMouseY = e.clientY / window.innerHeight;
        });

        function resize() {
            const parent = canvas.parentElement;
            canvas.width = parent ? parent.clientWidth : window.innerWidth;
            canvas.height = parent ? parent.clientHeight : window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        window.addEventListener('resize', resize);
        resize();

        // Render Loop
        function render(now) {
            const timeSec = now * 0.001;

            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            gl.uniform2f(uResolution, canvas.width, canvas.height);
            gl.uniform1f(uTime, timeSec);
            gl.uniform2f(uMouse, mouseX, mouseY);
            gl.uniform1f(uDoppler, dopplerActive);
            gl.uniform1f(uBendingMult, bendingMult);
            gl.uniform1f(uSpin, spinActive);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlackHoleShader);
    } else {
        initBlackHoleShader();
    }
})();
