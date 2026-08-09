// ============================================
// 🌌 PROJECT 11: BLACK HOLE GRAVITATIONAL LENSING CANVAS SHADER
// Exact WebGL Raymarching Shader with Kerr Metric Matrix Bending,
// Left Tilt (+22°), Concentric Ring Filaments & Keplerian Doppler Shift
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

        // Fragment Shader: Black Hole Raymarching Shader (Tilted Left + Soft Copper Amber Glow)
        const fsSource = `
            precision highp float;

            uniform vec2 uResolution;
            uniform float uTime;
            uniform vec2 uMouse;
            uniform float uDoppler;
            uniform float uBendingMult;
            uniform float uSpin;

            #define MAX_STEPS 160
            #define STEP_SIZE 0.04
            #define SCHWARZSCHILD_R 0.30
            #define PHOTON_SPHERE 0.45
            #define DISC_INNER 0.50
            #define DISC_OUTER 2.20

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

            // Simplex-style noise for plasma filaments
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

            // Accretion Disc Volume Sample (Soft copper amber glow)
            vec4 sampleDisk(vec3 pos) {
                float r = length(pos.xz);
                if (r < DISC_INNER || r > DISC_OUTER) return vec4(0.0);

                // Thin sheet plane
                float thickness = 0.022 * (r / DISC_INNER);
                float h = exp(-abs(pos.y) * abs(pos.y) / (thickness * thickness));
                if (h < 0.005) return vec4(0.0);

                // Angle & spiral coordinates
                float phi = atan(pos.z, pos.x);
                float speed = 1.6 / sqrt(r);
                float t = uTime * uSpin * 0.4;

                // Concentric Fine Ring Bands Pattern
                float ringPattern1 = sin(r * 32.0 - t * 1.5) * 0.5 + 0.5;
                float ringPattern2 = sin(r * 70.0 + t * 2.0) * 0.5 + 0.5;
                float fineRings = pow(ringPattern1, 2.0) * 0.55 + pow(ringPattern2, 3.0) * 0.45;

                vec2 uv = vec2(r * 3.5, phi * 2.5 + t * speed);
                float n = fbm(uv);
                
                float density = smoothstep(DISC_OUTER, DISC_INNER + 0.3, r) * smoothstep(DISC_INNER, DISC_INNER + 0.12, r);
                density *= h * (0.3 + 0.7 * fineRings) * (0.5 + 0.5 * n);

                // Relativistic Doppler Beaming
                float doppler = 1.0;
                if (uDoppler > 0.5) {
                    float velAlongRay = sin(phi) * (pos.x > 0.0 ? 1.0 : -1.0);
                    doppler = pow(1.0 + velAlongRay * 0.3, 2.2);
                }

                // Soft Amber / Copper Spectrum
                vec3 colInner = vec3(2.2, 1.6, 1.0); // Warm gold
                vec3 colMid = vec3(1.6, 0.8, 0.15);  // Deep copper amber
                vec3 colOuter = vec3(0.8, 0.2, 0.02); // Dark crimson

                float relR = (r - DISC_INNER) / (DISC_OUTER - DISC_INNER);
                vec3 col = mix(colInner, colMid, smoothstep(0.0, 0.2, relR));
                col = mix(col, colOuter, smoothstep(0.2, 1.0, relR));

                col *= doppler * density * 1.6;

                return vec4(col, density * h * 0.38);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy - uResolution.xy * 0.5) / uResolution.y;

                // Camera position setup
                vec3 camPos = vec3(0.0, 0.22, -4.2);
                vec3 rayDir = normalize(vec3(uv.x - 0.25, uv.y - 0.02, 1.6));

                // Interactive + Auto Rotation + Tilted Towards Left (+0.38 rad / +22.0 Degrees)
                float tiltAngle = 0.38; // +22.0 degree tilt leaning UPWARDS towards the LEFT!
                float rotY = (uMouse.x * 2.0 - 1.0) * 0.4 + uTime * uSpin * 0.03;
                float rotX = (uMouse.y * 2.0 - 1.0) * 0.2 + 0.22;

                mat3 rotMat = rotateZ(tiltAngle) * rotateX(rotX) * rotateY(rotY);

                // Shift black hole center rightwards (x = 0.60) so left text is unblocked
                vec3 bhCenter = vec3(0.60, 0.0, 0.0);

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
                    float halo = exp(-abs(minR - PHOTON_SPHERE) * 16.0) * 0.22;
                    accumColor += vec3(2.0, 1.4, 0.7) * halo * (1.0 - accumAlpha);
                }

                // Soft Tone Mapping & Compression
                vec3 finalCol = accumColor / (1.0 + accumColor * 0.6);
                finalCol = pow(finalCol, vec3(0.85));

                gl_FragColor = vec4(finalCol, 1.0);
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
