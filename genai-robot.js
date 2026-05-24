/* ============================================================
   🤖 GENAI ROBOT — Cute Spherical Space Bot
   Celestial Deep-Space Nebula Edition
   ⚡ PERFORMANCE OPTIMIZED — Reduced particle counts, throttled
   star updates, lower shadow resolution, capped pixel ratio
   ============================================================ */

(function () {
    'use strict';

    // ─── CONFIG ───
    var CFG = {
        bgColor: 0x120321,           // Deep Midnight Purple
        bodyColor: 0x8b7ebd,
        bodyColorLight: 0xa99dd4,
        screenColor: 0x0a3a3a,
        screenGlow: 0x00e5cc,
        eyeColor: 0x00ffdd,
        smileColor: 0x00ffdd,
        earColor: 0x7a6ba8,
        boltColor: 0xb0a0d0,
        boltRingColor: 0xc06090,
        headTrackSpeed: 0.06,
        eyeTrackSpeed: 0.1,
        idleBobSpeed: 0.8,
        idleBobAmt: 0.12,
        breathSpeed: 1.0,
        breathAmt: 0.01,
        clickBounce: 0.45
    };

    var SPEECH = [
        "Hey! I'm your GenAI guide. Hover over the projects around me! 🤖",
        "That Discord Bot handles text, images & audio — all locally with Ollama! 🎮",
        "The News Curator runs fully autonomously — zero human input! 📰",
        "RedGlyph reviews your code like a senior engineer! 🔴",
        "LoreWeaver-AI generates rich stories with Edge Neural voices in under 2 seconds! 🎭",
        "I can see your cursor... following it with my eyes! 👀",
        "Click me again — I love the attention! ✨",
        "These projects showcase the power of Generative AI 🧠"
    ];

    // ─── STATE ─── 
    var mouseNdcX = 0, mouseNdcY = 0;
    var hoveredProject = null;
    var clickCount = 0;
    var speechIdx = 0;
    var clock = new THREE.Clock();
    var bouncing = false, bounceV = 0, bounceY = 0;
    var excited = false, excitedT = 0;
    var squishing = false, squishT = 0;
    var frameCount = 0; // For throttling heavy updates

    // ─── SCENE ───
    var container = document.getElementById('robotScene');
    if (!container) {
        console.error('Robot container #robotScene not found');
        return;
    }

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(CFG.bgColor);
    scene.fog = new THREE.FogExp2(0x120321, 0.008);

    var W = window.innerWidth, H = window.innerHeight;
    var camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 2.0, 6.5);
    camera.lookAt(0, 1.2, 0);

    var renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    renderer.setSize(W, H);
    // ⚡ PERF: Cap pixel ratio at 1.5 instead of 2
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    // ⚡ PERF: Use BasicShadowMap instead of PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // ─── LIGHTING — Internal Nebula Glow ───

    // Ambient: deep midnight purple wash
    scene.add(new THREE.AmbientLight(0x2a0845, 0.4));

    // Key light: warm violet from top-right
    var keyLight = new THREE.DirectionalLight(0xeeddff, 0.9);
    keyLight.position.set(5, 10, 7);
    keyLight.castShadow = true;
    // ⚡ PERF: Reduced shadow map from 2048 to 1024
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill: Cyan tint from left — internal nebula illumination
    var fillLight = new THREE.DirectionalLight(0x00BFFF, 0.4);
    fillLight.position.set(-4, 5, 3);
    scene.add(fillLight);

    // Rim: Electric Violet from behind — backlit rim lighting effect
    var rimLight = new THREE.DirectionalLight(0x7b2ff7, 0.5);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // Magenta accent from below-right — nebula internal glow
    var magentaLight = new THREE.PointLight(0xFF00FF, 0.35, 15);
    magentaLight.position.set(4, -1, 2);
    scene.add(magentaLight);

    // Cyan accent from left — nebula internal glow
    var cyanLight = new THREE.PointLight(0x00FFFF, 0.3, 12);
    cyanLight.position.set(-5, 2, 1);
    scene.add(cyanLight);

    // Glow under the robot — deep purple
    var underGlow = new THREE.PointLight(0x7b2ff7, 0.5, 8);
    underGlow.position.set(0, -0.5, 0);
    scene.add(underGlow);

    // ─── BACKGROUND GEN: GLOW TEXTURE ───
    function createGlowTexture() {
        var canvas = document.createElement('canvas');
        canvas.width = 32;  // ⚡ PERF: Reduced from 64 to 32
        canvas.height = 32;
        var ctx = canvas.getContext('2d');
        var grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    }
    var glowTex = createGlowTexture();

    // ─── 4-POINTED STAR GLOW TEXTURE ───
    function createStarBurstTexture() {
        var canvas = document.createElement('canvas');
        canvas.width = 64;  // ⚡ PERF: Reduced from 128 to 64
        canvas.height = 64;
        var ctx = canvas.getContext('2d');
        var cx = 32, cy = 32;

        // Soft core glow
        var coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
        coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coreGrad.addColorStop(0.15, 'rgba(255, 255, 255, 0.7)');
        coreGrad.addColorStop(0.4, 'rgba(200, 220, 255, 0.15)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, 0, 64, 64);

        // 4-pointed spikes
        ctx.globalCompositeOperation = 'lighter';
        for (var s = 0; s < 4; s++) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(s * Math.PI / 2);
            var spikeGrad = ctx.createLinearGradient(0, 0, 0, -30);
            spikeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            spikeGrad.addColorStop(0.3, 'rgba(200, 220, 255, 0.2)');
            spikeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = spikeGrad;
            ctx.beginPath();
            ctx.moveTo(-1.5, 0);
            ctx.lineTo(0, -30);
            ctx.lineTo(1.5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        return new THREE.CanvasTexture(canvas);
    }
    var starBurstTex = createStarBurstTexture();

    // ─── STARFIELD — Pinprick Stars ───
    // ⚡ PERF: Reduced from 12000 to 5000 (still looks rich)
    var starCount = 5000;
    var starGeo = new THREE.BufferGeometry();
    var starPositions = new Float32Array(starCount * 3);
    var starColors = new Float32Array(starCount * 3);

    for (var i = 0; i < starCount; i++) {
        var x = (Math.random() - 0.5) * 180;
        var y = (Math.random() - 0.5) * 110;
        var z = -8 - Math.random() * 95;
        starPositions[i * 3] = x;
        starPositions[i * 3 + 1] = y;
        starPositions[i * 3 + 2] = z;

        var color = new THREE.Color();
        var c = Math.random();
        if (c < 0.80) color.setHex(0xffffff);
        else if (c < 0.88) color.setHex(0xddeeff);
        else if (c < 0.94) color.setHex(0x00ffff);
        else if (c < 0.98) color.setHex(0xff00ff);
        else color.setHex(0x7b2ff7);

        var brightness = 0.4 + Math.random() * 0.6;
        starColors[i * 3] = color.r * brightness;
        starColors[i * 3 + 1] = color.g * brightness;
        starColors[i * 3 + 2] = color.b * brightness;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    var starMat = new THREE.PointsMaterial({
        size: 0.6,
        map: glowTex,
        transparent: true,
        opacity: 1.0,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    var stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ─── TWINKLING STARS — Bright pulsing layer ───
    // ⚡ PERF: Reduced from 1200 to 500 (still sparkly)
    var twinkleCount = 500;
    var twinkleGeo = new THREE.BufferGeometry();
    var twinklePos = new Float32Array(twinkleCount * 3);
    var twinkleCol = new Float32Array(twinkleCount * 3);
    var twinklePhases = new Float32Array(twinkleCount);
    var twinkleSpeeds = new Float32Array(twinkleCount);
    var twinkleBaseColors = new Float32Array(twinkleCount * 3);

    for (var ti = 0; ti < twinkleCount; ti++) {
        twinklePos[ti * 3] = (Math.random() - 0.5) * 160;
        twinklePos[ti * 3 + 1] = (Math.random() - 0.5) * 100;
        twinklePos[ti * 3 + 2] = -5 - Math.random() * 80;

        var tc = Math.random();
        var tColor = new THREE.Color();
        if (tc < 0.70) tColor.setHex(0xffffff);
        else if (tc < 0.85) tColor.setHex(0xccddff);
        else if (tc < 0.95) tColor.setHex(0x88ddff);
        else tColor.setHex(0xff99ee);

        twinkleBaseColors[ti * 3] = tColor.r;
        twinkleBaseColors[ti * 3 + 1] = tColor.g;
        twinkleBaseColors[ti * 3 + 2] = tColor.b;
        twinkleCol[ti * 3] = tColor.r;
        twinkleCol[ti * 3 + 1] = tColor.g;
        twinkleCol[ti * 3 + 2] = tColor.b;

        twinklePhases[ti] = Math.random() * Math.PI * 2;
        twinkleSpeeds[ti] = 2.0 + Math.random() * 5.0;
    }

    twinkleGeo.setAttribute('position', new THREE.BufferAttribute(twinklePos, 3));
    twinkleGeo.setAttribute('color', new THREE.BufferAttribute(twinkleCol, 3));

    var twinkleMat = new THREE.PointsMaterial({
        size: 1.2,
        map: glowTex,
        transparent: true,
        opacity: 1.0,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    var twinkleStars = new THREE.Points(twinkleGeo, twinkleMat);
    scene.add(twinkleStars);

    // ─── LARGE 4-POINTED GLOWING STARS ───
    // ⚡ PERF: Reduced from 60 to 25
    var bigStarCount = 25;
    var bigStarGeo = new THREE.BufferGeometry();
    var bigStarPos = new Float32Array(bigStarCount * 3);
    var bigStarCol = new Float32Array(bigStarCount * 3);

    for (var bi = 0; bi < bigStarCount; bi++) {
        bigStarPos[bi * 3] = (Math.random() - 0.5) * 140;
        bigStarPos[bi * 3 + 1] = (Math.random() - 0.5) * 90;
        bigStarPos[bi * 3 + 2] = -8 - Math.random() * 60;

        var bsc = Math.random();
        var bsColor = new THREE.Color();
        if (bsc < 0.5) bsColor.setHex(0xffffff);
        else if (bsc < 0.7) bsColor.setHex(0xddccff);
        else if (bsc < 0.85) bsColor.setHex(0x00ddff);
        else bsColor.setHex(0xff88dd);

        bigStarCol[bi * 3] = bsColor.r;
        bigStarCol[bi * 3 + 1] = bsColor.g;
        bigStarCol[bi * 3 + 2] = bsColor.b;
    }

    bigStarGeo.setAttribute('position', new THREE.BufferAttribute(bigStarPos, 3));
    bigStarGeo.setAttribute('color', new THREE.BufferAttribute(bigStarCol, 3));

    var bigStarMat = new THREE.PointsMaterial({
        size: 4.0,
        map: starBurstTex,
        transparent: true,
        opacity: 0.5,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });
    var bigStars = new THREE.Points(bigStarGeo, bigStarMat);
    scene.add(bigStars);

    // ─── NEBULA CLOUDS — Subtle Cosmic Atmosphere ───
    var nebulaGroup = new THREE.Group();
    scene.add(nebulaGroup);

    function createNebulaLayer(centers, size, opacity) {
        // ⚡ PERF: Reduced from 300 to 150 (still atmospheric)
        var count = 150;
        var geo = new THREE.BufferGeometry();
        var pos = new Float32Array(count * 3);
        var col = new Float32Array(count * 3);

        for (var i = 0; i < count; i++) {
            var center = centers[Math.floor(Math.random() * centers.length)];
            var r = center.radius * Math.cbrt(Math.random());
            var theta = Math.random() * 2 * Math.PI;
            var phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = center.x + r * Math.sin(phi) * Math.cos(theta) * 1.8;
            pos[i * 3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta) * 0.8;
            pos[i * 3 + 2] = center.z + r * Math.cos(phi) * 0.6;

            var cVar = (Math.random() - 0.5) * 0.12;
            col[i * 3] = Math.max(0, Math.min(1, center.r + cVar));
            col[i * 3 + 1] = Math.max(0, Math.min(1, center.g + cVar));
            col[i * 3 + 2] = Math.max(0, Math.min(1, center.b + cVar));
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        var mat = new THREE.PointsMaterial({
            size: size,
            map: glowTex,
            transparent: true,
            opacity: opacity,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        var pts = new THREE.Points(geo, mat);
        nebulaGroup.add(pts);
    }

    // Central stellar dust trail — magenta/cyan pockets
    createNebulaLayer([
        { x: 0, y: 0, z: -12, r: 0.88, g: 0.0, b: 0.88, radius: 8 },
        { x: -8, y: 0.5, z: -14, r: 0.7, g: 0.0, b: 0.9, radius: 12 },
        { x: 8, y: -0.5, z: -14, r: 0.7, g: 0.0, b: 0.9, radius: 12 },
        { x: -3, y: 1, z: -10, r: 0.0, g: 0.8, b: 0.9, radius: 6 },
        { x: 4, y: -1, z: -11, r: 0.9, g: 0.2, b: 0.6, radius: 5 },
    ], 30.0, 0.015);

    // Dense core behind robot — kept subtle
    createNebulaLayer([
        { x: 0, y: 0, z: -15, r: 0.48, g: 0.12, b: 0.97, radius: 14 },
        { x: -6, y: 3, z: -18, r: 0.3, g: 0.0, b: 0.5, radius: 16 },
        { x: 6, y: -3, z: -18, r: 0.3, g: 0.0, b: 0.5, radius: 16 },
        { x: 0, y: -5, z: -16, r: 0.9, g: 0.0, b: 0.7, radius: 10 },
    ], 35.0, 0.012);

    // Diffuse outer clouds — very subtle edges
    createNebulaLayer([
        { x: -20, y: 8, z: -28, r: 0.0, g: 0.55, b: 0.85, radius: 22 },
        { x: 20, y: -8, z: -28, r: 0.0, g: 0.55, b: 0.85, radius: 22 },
        { x: 5, y: 12, z: -25, r: 0.0, g: 0.9, b: 0.9, radius: 15 },
        { x: -14, y: -10, z: -22, r: 0.0, g: 0.9, b: 0.9, radius: 14 },
    ], 35.0, 0.015);

    // ─── MATERIALS ───
    // ⚡ PERF: Reduced geometry segments on the robot meshes
    var matBody = new THREE.MeshStandardMaterial({ color: CFG.bodyColor, metalness: 0.7, roughness: 0.25 });
    var matBodyLight = new THREE.MeshStandardMaterial({ color: CFG.bodyColorLight, metalness: 0.6, roughness: 0.3 });
    var matScreen = new THREE.MeshStandardMaterial({
        color: CFG.screenColor,
        emissive: CFG.screenGlow,
        emissiveIntensity: 0.15,
        metalness: 0.3,
        roughness: 0.4
    });
    var matEye = new THREE.MeshBasicMaterial({ color: CFG.eyeColor });
    var matSmile = new THREE.MeshBasicMaterial({ color: CFG.smileColor });
    var matEar = new THREE.MeshStandardMaterial({ color: CFG.earColor, metalness: 0.6, roughness: 0.3 });
    var matBolt = new THREE.MeshStandardMaterial({ color: CFG.boltColor, metalness: 0.8, roughness: 0.15 });
    var matBoltRing = new THREE.MeshStandardMaterial({ color: CFG.boltRingColor, metalness: 0.6, roughness: 0.3 });

    // ─── BUILD CUTE SPACE BOT ───
    var robot = new THREE.Group();

    // ── MAIN SPHERICAL BODY ──
    // ⚡ PERF: Reduced segments from 32 to 24
    var bodySphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 24, 24),
        matBody
    );
    bodySphere.position.y = 1.6;
    bodySphere.castShadow = true;
    robot.add(bodySphere);

    // Slight highlight sphere
    var bodyHighlight = new THREE.Mesh(
        new THREE.SphereGeometry(1.12, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.4),
        matBodyLight
    );
    bodyHighlight.position.y = 1.6;
    robot.add(bodyHighlight);

    // ── RIM LIGHT GLOW RING — backlit neon edge ──
    // ⚡ PERF: Reduced torus segments from 64 to 32
    var rimGlowGeo = new THREE.TorusGeometry(1.15, 0.015, 12, 32);
    var rimGlowMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.35
    });
    var rimGlow = new THREE.Mesh(rimGlowGeo, rimGlowMat);
    rimGlow.position.y = 1.6;
    rimGlow.rotation.x = Math.PI / 2;
    robot.add(rimGlow);

    // Second rim ring — magenta
    var rimGlow2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.14, 0.012, 12, 32),
        new THREE.MeshBasicMaterial({ color: 0xe040a0, transparent: true, opacity: 0.2 })
    );
    rimGlow2.position.y = 1.6;
    rimGlow2.rotation.x = Math.PI * 0.55;
    rimGlow2.rotation.z = 0.3;
    robot.add(rimGlow2);

    // ── HEAD GROUP (for tracking) ──
    var headGroup = new THREE.Group();
    headGroup.position.y = 1.6;

    // ── FACE SCREEN ──
    var screenShape = new THREE.Shape();
    var sw = 0.75, sh = 0.55, sr = 0.15;
    screenShape.moveTo(-sw + sr, -sh);
    screenShape.lineTo(sw - sr, -sh);
    screenShape.quadraticCurveTo(sw, -sh, sw, -sh + sr);
    screenShape.lineTo(sw, sh - sr);
    screenShape.quadraticCurveTo(sw, sh, sw - sr, sh);
    screenShape.lineTo(-sw + sr, sh);
    screenShape.quadraticCurveTo(-sw, sh, -sw, sh - sr);
    screenShape.lineTo(-sw, -sh + sr);
    screenShape.quadraticCurveTo(-sw, -sh, -sw + sr, -sh);

    var screenGeo = new THREE.ShapeGeometry(screenShape, 8);
    var screen = new THREE.Mesh(screenGeo, matScreen);
    screen.position.set(0, 0.05, 0.97);
    headGroup.add(screen);

    // Screen border glow
    var screenEdge = new THREE.Mesh(
        new THREE.RingGeometry(0.72, 0.78, 24),
        new THREE.MeshBasicMaterial({ color: CFG.screenGlow, transparent: true, opacity: 0.2 })
    );
    screenEdge.position.set(0, 0.05, 0.98);
    headGroup.add(screenEdge);

    // ── CUTE EYES ──
    var eyeGroup = new THREE.Group();
    eyeGroup.position.set(0, 0.18, 0.99);

    function createHappyEye(xPos) {
        var eyeShape = new THREE.Shape();
        var ew = 0.2, eh = 0.16;
        eyeShape.moveTo(-ew, 0);
        eyeShape.quadraticCurveTo(-ew * 0.3, eh * 2.2, 0, eh * 0.6);
        eyeShape.quadraticCurveTo(ew * 0.3, eh * 2.2, ew, 0);
        eyeShape.quadraticCurveTo(ew * 0.3, eh * 1.4, 0, eh * 0.1);
        eyeShape.quadraticCurveTo(-ew * 0.3, eh * 1.4, -ew, 0);

        var eyeMesh = new THREE.Mesh(
            new THREE.ShapeGeometry(eyeShape, 12),
            matEye
        );
        eyeMesh.position.x = xPos;
        return eyeMesh;
    }

    var leftEye = createHappyEye(-0.25);
    var rightEye = createHappyEye(0.25);
    eyeGroup.add(leftEye);
    eyeGroup.add(rightEye);

    // Eye glow lights
    var leftEyeLight = new THREE.PointLight(CFG.eyeColor, 0.4, 2);
    leftEyeLight.position.set(-0.25, 0, 0.1);
    eyeGroup.add(leftEyeLight);

    var rightEyeLight = new THREE.PointLight(CFG.eyeColor, 0.4, 2);
    rightEyeLight.position.set(0.25, 0, 0.1);
    eyeGroup.add(rightEyeLight);

    headGroup.add(eyeGroup);

    // ── CUTE SMILE ──
    var smileShape = new THREE.Shape();
    smileShape.moveTo(-0.28, 0);
    smileShape.quadraticCurveTo(0, -0.22, 0.28, 0);
    smileShape.quadraticCurveTo(0, -0.15, -0.28, 0);

    var smile = new THREE.Mesh(
        new THREE.ShapeGeometry(smileShape, 12),
        matSmile
    );
    smile.position.set(0, -0.1, 0.99);
    headGroup.add(smile);

    robot.add(headGroup);

    // ── EARMUFF / SIDE PODS ──
    function createEarPod(xPos) {
        var earGroup = new THREE.Group();

        var ear = new THREE.Mesh(
            new THREE.SphereGeometry(0.32, 12, 12),
            matEar
        );
        ear.position.set(xPos * 1.3, 0, 0);
        ear.castShadow = true;
        earGroup.add(ear);

        // Connector ring
        var ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.12, 0.04, 6, 12),
            matBolt
        );
        ring.position.set(xPos * 1.05, 0, 0);
        ring.rotation.y = Math.PI / 2;
        earGroup.add(ring);

        earGroup.position.y = 1.6;
        return earGroup;
    }

    var leftEar = createEarPod(-1);
    var rightEar = createEarPod(1);
    robot.add(leftEar);
    robot.add(rightEar);

    // ── BOLT / SCREW ON TOP ──
    var boltGroup = new THREE.Group();
    boltGroup.position.set(0, 2.75, 0);

    var boltShaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6),
        matBolt
    );
    boltShaft.castShadow = true;
    boltGroup.add(boltShaft);

    var boltHead = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.12, 6),
        matBolt
    );
    boltHead.position.y = 0.22;
    boltHead.castShadow = true;
    boltGroup.add(boltHead);

    var boltTopRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.14, 0.03, 6, 12),
        matBoltRing
    );
    boltTopRing.position.y = 0.15;
    boltTopRing.rotation.x = Math.PI / 2;
    boltGroup.add(boltTopRing);

    for (var threadI = 0; threadI < 3; threadI++) {
        var threadRing = new THREE.Mesh(
            new THREE.TorusGeometry(0.1, 0.02, 6, 12),
            matBoltRing
        );
        threadRing.position.y = -0.08 - threadI * 0.1;
        threadRing.rotation.x = Math.PI / 2;
        boltGroup.add(threadRing);
    }

    boltGroup.rotation.z = 0.2;
    boltGroup.rotation.x = -0.1;
    robot.add(boltGroup);

    // ── SHADOW BLOB ──
    var shadowBlob = new THREE.Mesh(
        new THREE.CircleGeometry(1.0, 24),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 })
    );
    shadowBlob.rotation.x = -Math.PI / 2;
    shadowBlob.position.y = 0.01;
    robot.add(shadowBlob);

    // ── FLOATING SPARKLES around the bot ──
    // ⚡ PERF: Reduced from 10 to 6
    var sparkleCount = 6;
    var sparkles = [];
    for (var sp = 0; sp < sparkleCount; sp++) {
        var sparkle = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 4, 4),
            new THREE.MeshBasicMaterial({
                color: sp % 3 === 0 ? 0x00ffdd : (sp % 3 === 1 ? 0xaa88ff : 0xff88dd),
                transparent: true,
                opacity: 0.7
            })
        );
        var angle = (sp / sparkleCount) * Math.PI * 2;
        sparkle.userData = { angle: angle, radius: 1.6 + Math.random() * 0.5, speed: 0.3 + Math.random() * 0.3, yOffset: Math.random() * 0.8 - 0.4 };
        sparkle.position.set(
            Math.cos(angle) * sparkle.userData.radius,
            1.6 + sparkle.userData.yOffset,
            Math.sin(angle) * sparkle.userData.radius
        );
        robot.add(sparkle);
        sparkles.push(sparkle);
    }

    robot.position.set(0, 0, 0);
    scene.add(robot);

    // ─── Small floating planet in background ───
    var planet = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 12, 12),
        new THREE.MeshStandardMaterial({
            color: 0x4a5577,
            metalness: 0.4,
            roughness: 0.6,
            emissive: 0x1a1530,
            emissiveIntensity: 0.3
        })
    );
    planet.position.set(7, -2, -10);
    scene.add(planet);

    // Second small planet/asteroid
    var planet2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 8, 8),
        new THREE.MeshStandardMaterial({
            color: 0x665588,
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0x2a1845,
            emissiveIntensity: 0.2
        })
    );
    planet2.position.set(-8, 3, -12);
    scene.add(planet2);

    // ─── ANIMATIONS ───
    function animHead() {
        var tY = mouseNdcX * 0.35;
        var tX = -mouseNdcY * 0.2;
        headGroup.rotation.y += (tY - headGroup.rotation.y) * CFG.headTrackSpeed;
        headGroup.rotation.x += (tX - headGroup.rotation.x) * CFG.headTrackSpeed;
        headGroup.rotation.z += (mouseNdcX * -0.06 - headGroup.rotation.z) * 0.04;
    }

    function animEyes() {
        var tx = mouseNdcX * 0.05;
        var ty = mouseNdcY * 0.04;
        eyeGroup.position.x += (tx - eyeGroup.position.x) * CFG.eyeTrackSpeed;
        eyeGroup.position.y += (0.15 + ty - eyeGroup.position.y) * CFG.eyeTrackSpeed;
    }

    function animIdle(t) {
        var bob = Math.sin(t * CFG.idleBobSpeed) * CFG.idleBobAmt;
        var breath = Math.sin(t * CFG.breathSpeed) * CFG.breathAmt;
        robot.position.y = bob + bounceY;
        robot.rotation.z = Math.sin(t * 0.4) * 0.015;
        robot.rotation.x = Math.sin(t * 0.3) * 0.008;
        var s = 1 + breath;
        if (squishing) {
            squishT += 0.08;
            var squash = 1 - Math.sin(squishT) * 0.15;
            var stretch = 1 + Math.sin(squishT) * 0.08;
            robot.scale.set(stretch * s, squash * s, stretch * s);
            if (squishT > Math.PI) { squishing = false; squishT = 0; }
        } else {
            robot.scale.set(s, s, s);
        }
    }

    function animBounce() {
        if (!bouncing) return;
        bounceV -= 4.0 * 0.016;
        bounceY += bounceV * 0.016 * 60;
        if (bounceY < 0) {
            bounceY = 0;
            bounceV *= -0.45;
            if (Math.abs(bounceV) < 0.04) {
                bouncing = false;
                bounceY = 0;
                bounceV = 0;
            }
        }
    }

    var defaultEyeColor = new THREE.Color(CFG.eyeColor);
    var hoverEyeColor = new THREE.Color(0xff0044); // Red/pink color
    var currentEyeColor = new THREE.Color(CFG.eyeColor);

    function animGlow(t) {
        // Eye Color Transition (turns red when hovering over projects)
        var targetColor = hoveredProject ? hoverEyeColor : defaultEyeColor;
        currentEyeColor.lerp(targetColor, 0.15);
        matEye.color.copy(currentEyeColor);
        matSmile.color.copy(currentEyeColor);
        leftEyeLight.color.copy(currentEyeColor);
        rightEyeLight.color.copy(currentEyeColor);

        // Screen glow pulsing
        var p = (Math.sin(t * 2.0) + 1) / 2;
        var baseIntensity = excited ? 0.3 : 0.15;
        matScreen.emissiveIntensity = baseIntensity + p * 0.1;

        // Eye glow
        var ep = (Math.sin(t * 2.5) + 1) / 2;
        var eyeIntensity = excited ? 0.6 + ep * 0.5 : 0.3 + ep * 0.2;
        leftEyeLight.intensity = eyeIntensity;
        rightEyeLight.intensity = eyeIntensity;

        // Rim glow pulse
        rimGlowMat.opacity = 0.2 + Math.sin(t * 1.5) * 0.15;

        // Sparkle pulse
        for (var si = 0; si < sparkles.length; si++) {
            var sp = sparkles[si];
            sp.material.opacity = 0.3 + Math.sin(t * 2 + si) * 0.4;
        }

        // ⚡ PERF: Removed per-frame boltRing emissive allocation (was creating new Color every frame!)
        var boltPulse = (Math.sin(t * 1.5) + 1) / 2;
        matBoltRing.emissiveIntensity = 0.1 + boltPulse * 0.2;

        // Big star twinkle
        bigStarMat.opacity = 0.5 + Math.sin(t * 0.8) * 0.2;
    }

    function animSparkles(t) {
        for (var si = 0; si < sparkles.length; si++) {
            var sp = sparkles[si];
            var ud = sp.userData;
            var a = ud.angle + t * ud.speed;
            sp.position.x = Math.cos(a) * ud.radius;
            sp.position.z = Math.sin(a) * ud.radius;
            sp.position.y = 1.6 + ud.yOffset + Math.sin(t * 1.2 + si) * 0.15;
        }
    }

    function animExcited() {
        if (!excited) return;
        excitedT += 0.016;
        if (excitedT > 2.0) { excited = false; excitedT = 0; }
    }

    function animBolt(t) {
        boltGroup.rotation.y = t * 0.3;
    }

    // ⚡ PERF: Set the emissive color once (was being set every frame!)
    matBoltRing.emissive = new THREE.Color(CFG.boltRingColor);

    function animStars(t) {
        // Subtle drift rotations
        stars.rotation.y = t * 0.005;
        stars.rotation.x = t * 0.002;
        bigStars.rotation.y = t * 0.003;
        bigStars.rotation.x = t * 0.001;
        nebulaGroup.rotation.y = t * 0.003;
        nebulaGroup.rotation.z = Math.sin(t * 0.2) * 0.01;
        nebulaGroup.position.y = Math.sin(t * 0.12) * 0.5;

        // ⚡ PERF: Only update star positions every 3rd frame
        if (frameCount % 3 !== 0) return;

        // Gliding animation (moving forward in Z axis)
        var zSpeed = 0.048; // Adjusted for 3-frame interval

        // Glide normal stars
        var sPos = starGeo.getAttribute('position');
        for (var i = 0; i < starCount; i++) {
            sPos.array[i * 3 + 2] += zSpeed * 0.5;
            if (sPos.array[i * 3 + 2] > 5) sPos.array[i * 3 + 2] = -95;
        }
        sPos.needsUpdate = true;

        // Glide big stars
        var bPos = bigStarGeo.getAttribute('position');
        for (var i = 0; i < bigStarCount; i++) {
            bPos.array[i * 3 + 2] += zSpeed * 1.5;
            if (bPos.array[i * 3 + 2] > 10) bPos.array[i * 3 + 2] = -60;
        }
        bPos.needsUpdate = true;

        // Twinkle animation + Gliding for twinkling stars
        var tPos = twinkleGeo.getAttribute('position');
        var colAttr = twinkleGeo.getAttribute('color');
        for (var ti = 0; ti < twinkleCount; ti++) {
            // Glide
            tPos.array[ti * 3 + 2] += zSpeed;
            if (tPos.array[ti * 3 + 2] > 5) tPos.array[ti * 3 + 2] = -80;

            // Twinkle brightness pulsing
            var brightness = 0.1 + 0.9 * ((Math.sin(t * twinkleSpeeds[ti] + twinklePhases[ti]) + 1) / 2);
            colAttr.array[ti * 3] = twinkleBaseColors[ti * 3] * brightness;
            colAttr.array[ti * 3 + 1] = twinkleBaseColors[ti * 3 + 1] * brightness;
            colAttr.array[ti * 3 + 2] = twinkleBaseColors[ti * 3 + 2] * brightness;
        }
        tPos.needsUpdate = true;
        colAttr.needsUpdate = true;

        // Big stars gentle twinkle
        bigStarMat.opacity = 0.4 + 0.4 * Math.sin(t * 1.8);
    }

    function animEars(t) {
        var earBob = Math.sin(t * 1.2) * 0.03;
        leftEar.position.y = 1.6 + earBob;
        rightEar.position.y = 1.6 - earBob;
    }

    function animRimGlow(t) {
        rimGlow.rotation.z = t * 0.2;
        rimGlow2.rotation.z = 0.3 + t * -0.15;
    }

    function animPlanets(t) {
        planet.position.y = -2 + Math.sin(t * 0.3) * 0.3;
        planet.rotation.y = t * 0.1;
        planet2.position.y = 3 + Math.sin(t * 0.25 + 1) * 0.2;
        planet2.rotation.y = t * -0.08;
    }

    // ─── MAIN LOOP ───
    function loop() {
        requestAnimationFrame(loop);
        var t = clock.getElapsedTime();
        frameCount++;

        animIdle(t);
        animHead();
        animEyes();
        animBounce();
        animGlow(t);
        animSparkles(t);
        animExcited();
        animBolt(t);
        animStars(t);
        animEars(t);
        animRimGlow(t);
        animPlanets(t);

        renderer.render(scene, camera);
    }
    loop();

    // ─── EVENTS ───
    document.addEventListener('mousemove', function (e) {
        mouseNdcX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseNdcY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    renderer.domElement.addEventListener('click', function (e) {
        var rc = new THREE.Raycaster();
        var mv = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1
        );
        rc.setFromCamera(mv, camera);
        var hits = rc.intersectObjects(robot.children, true);
        if (hits.length > 0) triggerClick();
    });

    function triggerClick() {
        clickCount++;
        bouncing = true; bounceV = CFG.clickBounce;
        squishing = true; squishT = 0;
        excited = true; excitedT = 0;
        showSpeech();
    }

    var pokeBtn = document.getElementById('pokeBtn');
    if (pokeBtn) pokeBtn.addEventListener('click', triggerClick);

    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', function () {
        camera.position.set(0, 2.0, 6.5);
        camera.lookAt(0, 1.2, 0);
    });

    // ─── PROJECT CARD HOVER ───
    var cards = document.querySelectorAll('.project-card');
    cards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            hoveredProject = card.dataset.project;
            excited = true; excitedT = 0;
            var title = card.querySelector('.card-title');
            showProjectSpeech(title ? title.textContent : '');
        });
        card.addEventListener('mouseleave', function () {
            hoveredProject = null;
        });
    });

    // ─── SPEECH BUBBLE ───
    var bubble = document.getElementById('speechBubble');
    var speechEl = document.getElementById('speechContent');
    var speechTimer = null;

    function showSpeech() {
        if (!bubble || !speechEl) return;
        speechEl.textContent = SPEECH[speechIdx % SPEECH.length];
        speechIdx++;
        bubble.classList.add('visible');
        clearTimeout(speechTimer);
        speechTimer = setTimeout(function () { bubble.classList.remove('visible'); }, 4000);
    }

    function showProjectSpeech(title) {
        if (!bubble || !speechEl) return;
        var msgs = {
            'LegalGuard': "Dual-engine contract scanner — 150+ legal patterns + Flan-T5 AI! ⚖️",
            'Discord': "Multi-modal AI bot — text, images, audio & vision, all locally with Ollama! 🎮",
            'DocIntel': "Private RAG System utilizing FAISS & local LLMs for secure data querying! 🧠",
            'News': "Fully autonomous pipeline — RSS → LLM → Voice → Email! 📰",
            'RedGlyph': "AI code reviewer — catches bugs like a senior engineer! 🔴",
            'PatternPunk': "Seamless fabric texture generator using Neural Circular Padding & Real-ESRGAN! 👗",
            'AutoDoc': "AI code documenter using AST parsing and CodeT5 to inject docstrings! 🚀",
            'LoreWeaver': "Multimodal AI story engine — dynamic scripts via Gemini 3.0 & neural vocal acting via Edge TTS! 🎭",
            'ArchitectAI': "Virtual staging engine using Hugging Face backend & Qwen-Image-Edit-2511! 🛋️"
        };
        var msg = "Check this out — one of my favorite builds! ✨";
        var keys = Object.keys(msgs);
        for (var i = 0; i < keys.length; i++) {
            if (title.indexOf(keys[i]) !== -1) { msg = msgs[keys[i]]; break; }
        }
        speechEl.textContent = msg;
        bubble.classList.add('visible');
        clearTimeout(speechTimer);
        speechTimer = setTimeout(function () { bubble.classList.remove('visible'); }, 3500);
    }

    // Initial greeting
    setTimeout(showSpeech, 1800);

    // ─── RESIZE ───
    window.addEventListener('resize', function () {
        var w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

})();
