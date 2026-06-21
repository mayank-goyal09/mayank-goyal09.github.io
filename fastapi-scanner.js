// ============================================
// ⚡ FASTAPI - EVERVAULT CARD SCANNER ENGINE
// ============================================

const codeChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";

const scannerLeft = window.innerWidth / 2 - 2;
const scannerRight = window.innerWidth / 2 + 2;

class CardStreamController {
    constructor() {
        this.container = document.getElementById("cardStream");
        this.cardLine = document.getElementById("cardLine");
        this.speedIndicator = document.getElementById("speedValue");

        this.position = 0;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;

        this.lastTime = 0;
        this.lastMouseX = 0;
        this.mouseVelocity = 0;
        this.friction = 0.95;
        this.minVelocity = 30;

        this.containerWidth = 0;
        this.cardLineWidth = 0;

        this.init();
    }

    init() {
        this.populateCardLine();
        this.calculateDimensions();
        this.setupEventListeners();
        this.updateCardPosition();
        this.animate();
        this.startPeriodicUpdates();
    }

    calculateDimensions() {
        this.containerWidth = this.container.offsetWidth;
        const cardWidth = 480;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineWidth = (cardWidth + cardGap) * cardCount;
        this.repeatWidth = (cardWidth + cardGap) * this.projects.length;
    }

    setupEventListeners() {
        // Bind events to the container so user can scroll/drag anywhere in the section
        this.container.addEventListener("mousedown", (e) => this.startDrag(e));
        document.addEventListener("mousemove", (e) => this.onDrag(e));
        document.addEventListener("mouseup", () => this.endDrag());

        this.container.addEventListener(
            "touchstart",
            (e) => this.startDrag(e.touches[0]),
            { passive: false }
        );
        document.addEventListener("touchmove", (e) => this.onDrag(e.touches[0]), {
            passive: false,
        });
        document.addEventListener("touchend", () => this.endDrag());

        this.container.addEventListener("wheel", (e) => this.onWheel(e));
        this.container.addEventListener("selectstart", (e) => e.preventDefault());
        this.container.addEventListener("dragstart", (e) => e.preventDefault());

        window.addEventListener("resize", () => {
            this.calculateDimensions();
            this.updateCardPosition();
        });
    }

    startDrag(e) {
        // Ignore drag start if target is a button or link
        if (e.target.closest("a") || e.target.closest("button") || e.target.closest(".gradient-button")) {
            return;
        }
        e.preventDefault();

        this.isDragging = true;
        this.isAnimating = false;
        this.lastMouseX = e.clientX;
        this.mouseVelocity = 0;

        const transform = window.getComputedStyle(this.cardLine).transform;
        if (transform !== "none") {
            const matrix = new DOMMatrix(transform);
            this.position = matrix.m41;
        }

        this.cardLine.style.animation = "none";
        this.cardLine.classList.add("dragging");

        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
    }

    onDrag(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const deltaX = e.clientX - this.lastMouseX;
        this.position += deltaX;
        this.mouseVelocity = deltaX * 60;
        this.lastMouseX = e.clientX;

        this.updateCardPosition();
    }

    endDrag() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.cardLine.classList.remove("dragging");

        if (Math.abs(this.mouseVelocity) > this.minVelocity) {
            this.velocity = Math.abs(this.mouseVelocity);
            this.direction = this.mouseVelocity > 0 ? 1 : -1;
        } else {
            this.velocity = 120;
        }

        this.isAnimating = true;
        this.updateSpeedIndicator();

        document.body.style.userSelect = "";
        document.body.style.cursor = "";
    }

    animate() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.isAnimating && !this.isDragging) {
            if (this.velocity > this.minVelocity) {
                this.velocity *= this.friction;
            } else {
                this.velocity = Math.max(this.minVelocity, this.velocity);
            }

            this.position += this.velocity * this.direction * deltaTime;
            this.updateCardPosition();
            this.updateSpeedIndicator();
        }

        requestAnimationFrame(() => this.animate());
    }

    updateCardPosition() {
        const repeatWidth = this.repeatWidth;
        if (!repeatWidth) return;

        // Keep position within [-repeatWidth, 0] to wrap seamlessly
        while (this.position <= -repeatWidth) {
            this.position += repeatWidth;
        }
        while (this.position > 0) {
            this.position -= repeatWidth;
        }

        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
    }

    updateSpeedIndicator() {
        if (this.speedIndicator) {
            this.speedIndicator.textContent = Math.round(this.velocity);
        }
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        const btn = document.querySelector(".control-btn");
        if (btn) {
            btn.textContent = this.isAnimating ? "⏸️ Pause" : "▶️ Play";
        }

        if (this.isAnimating) {
            this.cardLine.style.animation = "none";
        }
    }

    resetPosition() {
        this.position = 0;
        this.velocity = 120;
        this.direction = -1;
        this.isAnimating = true;
        this.isDragging = false;

        this.cardLine.style.animation = "none";
        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.cardLine.classList.remove("dragging");

        this.updateSpeedIndicator();

        const btn = document.querySelector(".control-btn");
        if (btn) {
            btn.textContent = "⏸️ Pause";
        }
    }

    changeDirection() {
        this.direction *= -1;
        this.updateSpeedIndicator();
    }

    onWheel(e) {
        e.preventDefault();

        const scrollSpeed = 20;
        const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;

        this.position += delta;
        this.updateCardPosition();
    }

    generateCode(width, height) {
        const randInt = (min, max) =>
            Math.floor(Math.random() * (max - min + 1)) + min;
        const pick = (arr) => arr[randInt(0, arr.length - 1)];

        const header = [
            "// FastAPI Project Scanner • API Demo",
            "/* generated for visual effect – not executed */",
            "from fastapi import FastAPI, HTTPException",
            "from pydantic import BaseModel",
            "import uvicorn",
            "app = FastAPI(title='Project API')",
        ];

        const helpers = [
            "def validate_input(data): return data if data else None",
            "async def fetch_data(id: int): return await db.get(id)",
            "class Response(BaseModel): status: str; data: dict",
            "@app.middleware('http') async def log_requests(req, call_next):",
        ];

        const endpointBlock = (idx) => [
            `@app.get('/api/v1/resource${idx}')`,
            `async def get_resource_${idx}(id: int):`,
            "    result = await fetch_data(id)",
            "    if not result: raise HTTPException(404)",
            "    return {'status': 'success', 'data': result}",
            "",
        ];

        const modelBlock = [
            "class ProjectModel(BaseModel):",
            "    id: int",
            "    name: str",
            "    stack: list[str]",
            "    live_url: str | None = None",
            "",
            "@app.post('/projects')",
            "async def create_project(project: ProjectModel):",
            "    return {'created': project.dict()}",
        ];

        const deployBlock = [
            "# Docker deployment ready",
            "# uvicorn main:app --host 0.0.0.0 --port 8000",
            "if __name__ == '__main__':",
            "    uvicorn.run(app, host='0.0.0.0', port=8000)",
        ];

        const misc = [
            "RATE_LIMIT = 100  # requests per minute",
            "CACHE_TTL = 300  # seconds",
            "DB_POOL_SIZE = 10",
            "# OAuth2 + JWT authentication enabled",
            "# Redis caching layer active",
            "# Async database connections",
        ];

        const library = [];
        header.forEach((l) => library.push(l));
        helpers.forEach((l) => library.push(l));
        for (let b = 0; b < 3; b++)
            endpointBlock(b).forEach((l) => library.push(l));
        modelBlock.forEach((l) => library.push(l));
        deployBlock.forEach((l) => library.push(l));
        misc.forEach((l) => library.push(l));

        for (let i = 0; i < 40; i++) {
            const n1 = randInt(1, 9);
            const n2 = randInt(10, 99);
            library.push(`response_${i} = await api.get(${n1}${n2})`);
        }
        for (let i = 0; i < 20; i++) {
            library.push(
                `if status_code >= ${200 + (i % 4) * 100}: log.info('OK')`
            );
        }

        let flow = library.join(" ");
        flow = flow.replace(/\s+/g, " ").trim();
        const totalChars = width * height;
        while (flow.length < totalChars + width) {
            const extra = pick(library).replace(/\s+/g, " ").trim();
            flow += " " + extra;
        }

        let out = "";
        let offset = 0;
        for (let row = 0; row < height; row++) {
            let line = flow.slice(offset, offset + width);
            if (line.length < width) line = line + " ".repeat(width - line.length);
            out += line + (row < height - 1 ? "\n" : "");
            offset += width;
        }
        return out;
    }

    calculateCodeDimensions(cardWidth, cardHeight) {
        const fontSize = 11;
        const lineHeight = 13;
        const charWidth = 6;
        const width = Math.floor(cardWidth / charWidth);
        const height = Math.floor(cardHeight / lineHeight);
        return { width, height, fontSize, lineHeight };
    }

    // Project data - Add your FastAPI projects here!
    projects = [
        {
            name: "MovieFlix AI",
            subtitle: "AI Movie Recommender",
            description: "Netflix-style movie recommendation engine powered by TF-IDF NLP, serving personalized picks.",
            tech: ["FastAPI", "TF-IDF", "TMDB API", "Python"],
            github: "https://github.com/mayank-goyal09/movieflix-rec",
            live: "https://movieflix-rec.onrender.com/docs",
            streamlit: "https://movieflix-rec.streamlit.app",
            // Premium debit-card gradient: deep crimson ➜ dark maroon ➜ black cherry
            gradientStops: [
                { pos: 0.0, color: "#b80000" },
                { pos: 0.35, color: "#8b0000" },
                { pos: 0.7, color: "#4a0010" },
                { pos: 1.0, color: "#1a0008" },
            ],
            accentColor: "#ff4d4d",   // glow / highlight tint
            chipColor: "#ffd700",      // gold chip
            icon: "🎬",
            stats: "45K+ Movies  ·  NLP  ·  Cosine Search",
            cardNumber: "4539  ●●●●  ●●●●  8127",
        },
        {
            name: "CureLoop MLOps",
            subtitle: "Automated Disease Prediction",
            description: "CI/CD MLOps pipeline and continuous training system for automated disease prediction.",
            tech: ["FastAPI", "Scikit", "Docker", "Pytest"],
            github: "https://github.com/mayank-goyal09/CureLoop-MLOps",
            live: "https://mayankg09-cureloop-mlops.hf.space/docs",
            // Premium debit-card gradient: teal ➜ deep navy ➜ midnight
            gradientStops: [
                { pos: 0.0, color: "#0d9488" },
                { pos: 0.3, color: "#065f5b" },
                { pos: 0.65, color: "#0f2d4a" },
                { pos: 1.0, color: "#0a1628" },
            ],
            accentColor: "#34d399",
            chipColor: "#c0c0c0",      // silver chip
            icon: "🩺",
            stats: "CI/CD Pipeline  ·  Continuous Training",
            cardNumber: "5412  ●●●●  ●●●●  3901",
        },
        {
            name: "RedGlyph AI",
            subtitle: "AI Code Reviewer",
            description: "Multi-agent code reviewer leveraging Gemini 2.5 and LangGraph for automated quality reports.",
            tech: ["FastAPI", "Gemini", "LangGraph", "Docker"],
            github: "https://github.com/mayank-goyal09/RedGlyph",
            live: "https://mayankg09-redglyph.hf.space/app",
            // Premium debit-card gradient: deep ruby ➜ dark mahogany ➜ black cherry
            gradientStops: [
                { pos: 0.0, color: "#9a0000" },
                { pos: 0.35, color: "#660000" },
                { pos: 0.7, color: "#400000" },
                { pos: 1.0, color: "#1f0000" },
            ],
            accentColor: "#ff3333",
            chipColor: "#ffd700",
            icon: "🔍",
            stats: "Gemini 2.5 Flash  ·  LangGraph  ·  Reports",
            cardNumber: "699e  ●●●●  ●●●●  18e6",
        },
        {
            name: "DocIntel RAG",
            subtitle: "Private Document RAG",
            description: "Secure, local-first RAG engine bridging static PDFs with Mistral/Llama LLMs via FAISS.",
            tech: ["FastAPI", "FAISS", "LangChain", "Llama-3"],
            github: "https://github.com/mayank-goyal09/DocIntel",
            live: "https://mayankg09-docintel.hf.space/",
            // Premium debit-card gradient: royal purple ➜ deep indigo ➜ midnight violet
            gradientStops: [
                { pos: 0.0, color: "#4f46e5" },
                { pos: 0.35, color: "#3730a3" },
                { pos: 0.7, color: "#1e1b4b" },
                { pos: 1.0, color: "#0f072c" },
            ],
            accentColor: "#818cf8",
            chipColor: "#c0c0c0",
            icon: "📚",
            stats: "FAISS Vector DB  ·  Mistral  ·  Local RAG",
            cardNumber: "69cb  ●●●●  ●●●●  b370",
        },
        {
            name: "CityPulse AI",
            subtitle: "Spatio-Temporal Traffic Predictor",
            description: "Spatio-Temporal GNN forecasting engine predicting city-wide speed congestion ripples.",
            tech: ["FastAPI", "PyTorch", "ST-GCN", "Docker"],
            github: "https://github.com/mayank-goyal09/GraphTraffic-Net",
            live: "https://mayankg09-gnn-traffic-forcaster.hf.space/",
            // Premium debit-card gradient: vivid emerald ➜ dark teal ➜ deep forest green
            gradientStops: [
                { pos: 0.0, color: "#059669" },
                { pos: 0.35, color: "#047857" },
                { pos: 0.7, color: "#064e3b" },
                { pos: 1.0, color: "#022c22" },
            ],
            accentColor: "#34d399",
            chipColor: "#ffd700",
            icon: "🚦",
            stats: "207 Sensors  ·  ST-GCN Architecture  ·  Real-time Graph",
            cardNumber: "69f3  ●●●●  ●●●●  224e",
        },
        {
            name: "LoreWeaver AI",
            subtitle: "Multimodal AI Storyteller",
            description: "Interactive story generator pairing Gemini with vocal synthesis for custom audio narrations.",
            tech: ["Gradio", "Gemini", "Edge-TTS", "Pydub"],
            github: "https://github.com/mayank-goyal09/ScriptToSpeech-AI",
            live: "https://mayankg09-voice-story-engine.hf.space/",
            // Premium debit-card gradient: burning orange ➜ dark copper ➜ charcoal brown
            gradientStops: [
                { pos: 0.0, color: "#ea580c" },
                { pos: 0.35, color: "#c2410c" },
                { pos: 0.7, color: "#7c2d12" },
                { pos: 1.0, color: "#451a03" },
            ],
            accentColor: "#fb923c",
            chipColor: "#c0c0c0",
            icon: "🎭",
            stats: "Gemini 2.0  ·  Edge TTS  ·  Audio Stories",
            cardNumber: "6a08  ●●●●  ●●●●  a040",
        },
        {
            name: "ArchitectAI",
            subtitle: "AI Room Interior Designer",
            description: "Virtual staging application using Stable Diffusion ControlNet and Qwen-Image-Edit.",
            tech: ["Gradio", "ControlNet", "Qwen-Image", "Diffusers"],
            github: "https://github.com/mayank-goyal09/ArchitectAI-Virtual-Staging",
            live: "https://mayankg09-architectai-virtual-staging.hf.space/",
            // Premium debit-card gradient: electric violet ➜ deep purple ➜ plum velvet
            gradientStops: [
                { pos: 0.0, color: "#7c3aed" },
                { pos: 0.35, color: "#6d28d9" },
                { pos: 0.7, color: "#4c1d95" },
                { pos: 1.0, color: "#2e1065" },
            ],
            accentColor: "#a78bfa",
            chipColor: "#ffd700",
            icon: "🏡",
            stats: "ControlNet Staging  ·  Qwen Image Edit  ·  HF Serverless",
            cardNumber: "6a11  ●●●●  ●●●●  9926",
        },
        {
            name: "AegisGNN",
            subtitle: "Financial Fraud GCN Dashboard",
            description: "Interactive GNN anomaly detector mapping transactions into node networks for fraud classification.",
            tech: ["Flask", "PyTorch", "GCNConv", "Vis.js"],
            github: "https://github.com/mayank-goyal09/financial-fraud-gnn",
            live: "https://mayankg09-aegis-gnn-fraud.hf.space/",
            // Premium debit-card gradient: slate gray ➜ dark gunmetal ➜ deep charcoal
            gradientStops: [
                { pos: 0.0, color: "#374151" },
                { pos: 0.35, color: "#1f2937" },
                { pos: 0.7, color: "#111827" },
                { pos: 1.0, color: "#030712" },
            ],
            accentColor: "#9ca3af",
            chipColor: "#ffd700",
            icon: "🛡️",
            stats: "Graph Convolutions  ·  Heterogeneous Network  ·  Vis.js",
            cardNumber: "6a1f  ●●●●  ●●●●  c850",
        },
        {
            name: "Cortex-AI",
            subtitle: "Brain MRI Segmentation",
            description: "PACS workstation for brain tumor MRI segmentation using U-Net and a containerized FastAPI backend.",
            tech: ["FastAPI", "TensorFlow", "U-Net", "Docker"],
            github: "https://huggingface.co/spaces/mayankg09/brain-tumor-segmentation",
            live: "https://huggingface.co/spaces/mayankg09/brain-tumor-segmentation",
            gradientStops: [
                { pos: 0.0, color: "#1e3a8a" },
                { pos: 0.35, color: "#1e40af" },
                { pos: 0.7, color: "#1e3a8a" },
                { pos: 1.0, color: "#0f172a" },
            ],
            accentColor: "#3b82f6",
            chipColor: "#ffd700",
            icon: "🧠",
            stats: "0.835 Dice Coefficient  ·  Tensor execution <10ms",
            cardNumber: "4539  ●●●●  ●●●●  2209",
        },
    ];

    // ── Helper: wrap text into multiple lines ──
    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            if (ctx.measureText(testLine).width <= maxWidth) {
                currentLine = testLine;
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // ── Helper: draw rounded rectangle path ──
    roundRectPath(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    createCardWrapper(index) {
        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";

        const normalCard = document.createElement("div");
        normalCard.className = "card card-normal";

        const project = this.projects[index % this.projects.length];

        // ── Canvas setup (2× DPR for sharp text) ──
        const canvas = document.createElement("canvas");
        const W = 480, H = 300;
        const dpr = 2;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);

        const pad = 30;
        const contentW = W - pad * 2;

        // ═══════════════════════════════════════════
        // 1. PREMIUM GRADIENT BACKGROUND (no grid!)
        // ═══════════════════════════════════════════
        const bg = ctx.createLinearGradient(0, 0, W * 0.7, H);
        project.gradientStops.forEach(s => bg.addColorStop(s.pos, s.color));
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // 2. Subtle radial glow at top-left (3D depth)
        const glow = ctx.createRadialGradient(80, 60, 0, 80, 60, 280);
        glow.addColorStop(0, "rgba(255,255,255,0.12)");
        glow.addColorStop(0.5, "rgba(255,255,255,0.03)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        // 3. Bottom-right dark vignette (3D depth)
        const vignette = ctx.createRadialGradient(W, H, 0, W, H, 400);
        vignette.addColorStop(0, "rgba(0,0,0,0.35)");
        vignette.addColorStop(1, "transparent");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, W, H);

        // 4. Holographic diagonal light sweep
        ctx.save();
        const sweepGrad = ctx.createLinearGradient(W * 0.3, 0, W * 0.7, H);
        sweepGrad.addColorStop(0, "transparent");
        sweepGrad.addColorStop(0.35, "transparent");
        sweepGrad.addColorStop(0.48, "rgba(255,255,255,0.08)");
        sweepGrad.addColorStop(0.52, "rgba(255,255,255,0.14)");
        sweepGrad.addColorStop(0.56, "rgba(255,255,255,0.08)");
        sweepGrad.addColorStop(0.65, "transparent");
        sweepGrad.addColorStop(1, "transparent");
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        // 5. Top-edge subtle highlight (card edge shine)
        const edgeShine = ctx.createLinearGradient(0, 0, 0, 6);
        edgeShine.addColorStop(0, "rgba(255,255,255,0.18)");
        edgeShine.addColorStop(1, "transparent");
        ctx.fillStyle = edgeShine;
        ctx.fillRect(0, 0, W, 6);

        // ═══════════════════════════════════════════
        // 6. METALLIC CHIP (debit-card feel)
        // ═══════════════════════════════════════════
        const chipX = pad, chipY = 24, chipW = 44, chipH = 32, chipR = 5;
        // Outer chip
        const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
        chipGrad.addColorStop(0, project.chipColor);
        chipGrad.addColorStop(0.5, project.chipColor === "#ffd700" ? "#fff4b0" : "#e8e8e8");
        chipGrad.addColorStop(1, project.chipColor === "#ffd700" ? "#c9960c" : "#8a8a8a");
        ctx.fillStyle = chipGrad;
        this.roundRectPath(ctx, chipX, chipY, chipW, chipH, chipR);
        ctx.fill();
        // Chip inner lines
        ctx.strokeStyle = "rgba(0,0,0,0.15)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(chipX + chipW * 0.35, chipY + 3);
        ctx.lineTo(chipX + chipW * 0.35, chipY + chipH - 3);
        ctx.moveTo(chipX + chipW * 0.65, chipY + 3);
        ctx.lineTo(chipX + chipW * 0.65, chipY + chipH - 3);
        ctx.moveTo(chipX + 3, chipY + chipH * 0.5);
        ctx.lineTo(chipX + chipW - 3, chipY + chipH * 0.5);
        ctx.stroke();

        // ═══════════════════════════════════════════
        // 7. CONTACTLESS SYMBOL (top-right area)
        // ═══════════════════════════════════════════
        const clX = chipX + chipW + 14, clY = chipY + chipH / 2;
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.lineWidth = 1.5;
        for (let r = 5; r <= 13; r += 4) {
            ctx.beginPath();
            ctx.arc(clX, clY, r, -Math.PI * 0.35, Math.PI * 0.35);
            ctx.stroke();
        }

        // ═══════════════════════════════════════════
        // 8. PROJECT NAME + SUBTITLE (right side, top)
        // ═══════════════════════════════════════════
        const titleX = 160;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 26px 'Segoe UI', Arial";
        ctx.textAlign = "left";
        ctx.shadowColor = "rgba(0,0,0,0.4)";
        ctx.shadowBlur = 8;
        ctx.fillText(project.name, titleX, 40);
        ctx.shadowBlur = 0;

        ctx.font = "14px 'Segoe UI', Arial";
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.fillText(project.subtitle, titleX, 58);

        // ═══════════════════════════════════════════
        // 9. CARD NUMBER STRIPE (embossed feel)
        // ═══════════════════════════════════════════
        ctx.font = "500 15px 'Courier New', 'Roboto Mono', monospace";
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.letterSpacing = "3px";
        ctx.fillText(project.cardNumber || "4539  ●●●●  ●●●●  0000", pad, 78);

        // ═══════════════════════════════════════════
        // 10. SEPARATOR LINE (thin, elegant)
        // ═══════════════════════════════════════════
        const sepGrad = ctx.createLinearGradient(pad, 0, W - pad, 0);
        sepGrad.addColorStop(0, "rgba(255,255,255,0.0)");
        sepGrad.addColorStop(0.2, "rgba(255,255,255,0.25)");
        sepGrad.addColorStop(0.8, "rgba(255,255,255,0.25)");
        sepGrad.addColorStop(1, "rgba(255,255,255,0.0)");
        ctx.strokeStyle = sepGrad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad, 92);
        ctx.lineTo(W - pad, 92);
        ctx.stroke();

        // ═══════════════════════════════════════════
        // 11. DESCRIPTION – multi-line wrapped
        // ═══════════════════════════════════════════
        ctx.font = "13.5px 'Segoe UI', Arial";
        ctx.fillStyle = "rgba(255,255,255,0.82)";
        const descLines = this.wrapText(ctx, project.description, contentW);
        const descLineH = 19;
        let descY = 106;
        descLines.forEach((line) => {
            ctx.fillText(line, pad, descY);
            descY += descLineH;
        });

        // ═══════════════════════════════════════════
        // 12. TECH BADGES (frosted glass pills)
        // ═══════════════════════════════════════════
        let badgeY = descY + 4;
        ctx.font = "bold 11px 'Courier New', monospace";
        let badgeX = pad;
        const badgeH = 22;
        const badgeR = 11;

        project.tech.forEach((tech) => {
            const tw = ctx.measureText(tech).width + 18;
            if (badgeX + tw > W - pad) {
                badgeX = pad;
                badgeY += badgeH + 6;
            }
            // Frosted glass badge background
            ctx.fillStyle = "rgba(255,255,255,0.12)";
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, tw, badgeH, badgeR);
            ctx.fill();
            // Thin bright border
            ctx.strokeStyle = "rgba(255,255,255,0.25)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
            // Text
            ctx.fillStyle = "#ffffff";
            ctx.fillText(tech, badgeX + 9, badgeY + 15);
            badgeX += tw + 7;
        });

        // ═══════════════════════════════════════════
        // 13. STATS LINE
        // ═══════════════════════════════════════════
        const statsY = 224;
        ctx.font = "11px 'Segoe UI', Arial";
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fillText(project.stats, pad, statsY);

        // ═══════════════════════════════════════════
        // 14. VIEW PROJECT — Real DOM Button (animated gradient)
        //     Placed as HTML overlay for full CSS hover transitions
        // ═══════════════════════════════════════════
        const btnY = 238;
        const btnW = 150, btnH = 32;

        // ═══════════════════════════════════════════
        // 15. PROJECT ICON (bottom-right, large & faded)
        // ═══════════════════════════════════════════
        ctx.globalAlpha = 0.08;
        ctx.font = "120px Arial";
        ctx.textAlign = "right";
        ctx.fillText(project.icon, W - 15, H - 15);
        ctx.globalAlpha = 1;
        ctx.textAlign = "left";

        // ═══════════════════════════════════════════
        // 16. INNER BORDER GLOW (premium card edge)
        // ═══════════════════════════════════════════
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1.5;
        this.roundRectPath(ctx, 1, 1, W - 2, H - 2, 16);
        ctx.stroke();

        // ── Convert canvas to image ──
        const cardImage = document.createElement("img");
        cardImage.className = "card-image";
        cardImage.src = canvas.toDataURL();
        cardImage.alt = project.name;

        // ── Create real DOM gradient button overlay ──
        const viewBtn = document.createElement("a");
        viewBtn.className = "gradient-button";
        viewBtn.href = project.github;
        viewBtn.target = "_blank";
        viewBtn.rel = "noopener noreferrer";
        viewBtn.textContent = "View Project →";
        // Position the button exactly where the canvas button would be
        // Canvas coords: x=pad(30), y=btnY, w=150, h=32
        // But canvas is displayed at half its pixel size (dpr=2),
        // so CSS coords match the logical canvas coords directly.
        viewBtn.style.cssText = `
            position: absolute;
            left: ${pad}px;
            top: ${btnY}px;
            width: ${btnW}px;
            height: ${btnH}px;
            z-index: 20;
            pointer-events: auto;
        `;
        // Stop click from bubbling to card wrapper
        viewBtn.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // Make card clickable (whole card goes to github)
        wrapper.style.cursor = "pointer";
        wrapper.addEventListener("click", () => {
            window.open(project.github, "_blank");
        });

        normalCard.appendChild(cardImage);
        // Add the gradient button INSIDE normalCard so it clips with the scanner
        normalCard.appendChild(viewBtn);

        const asciiCard = document.createElement("div");
        asciiCard.className = "card card-ascii";

        const asciiContent = document.createElement("div");
        asciiContent.className = "ascii-content";

        const { width, height, fontSize, lineHeight } =
            this.calculateCodeDimensions(480, 300);
        asciiContent.style.fontSize = fontSize + "px";
        asciiContent.style.lineHeight = lineHeight + "px";
        asciiContent.textContent = this.generateProjectCode(project, width, height);

        asciiCard.appendChild(asciiContent);
        wrapper.appendChild(normalCard);
        wrapper.appendChild(asciiCard);

        return wrapper;
    }

    // Generate project-specific code snippets
    generateProjectCode(project, width, height) {
        const codeSnippets = {
            "MovieFlix AI": [
                "# 🎬 MovieFlix AI - TF-IDF Recommendation Engine",
                "from fastapi import FastAPI, HTTPException",
                "from sklearn.feature_extraction.text import TfidfVectorizer",
                "from sklearn.metrics.pairwise import cosine_similarity",
                "import httpx, pickle, numpy as np",
                "",
                "app = FastAPI(title='MovieFlix AI', version='2.0')",
                "",
                "# Load pre-trained TF-IDF model",
                "tfidf = TfidfVectorizer(stop_words='english')",
                "movies_df = pickle.load(open('movies.pkl', 'rb'))",
                "similarity_matrix = pickle.load(open('similarity.pkl', 'rb'))",
                "",
                "@app.get('/recommend/tfidf/{movie_id}')",
                "async def get_recommendations(movie_id: int):",
                "    idx = movies_df[movies_df['id'] == movie_id].index[0]",
                "    scores = list(enumerate(similarity_matrix[idx]))",
                "    scores = sorted(scores, key=lambda x: x[1], reverse=True)",
                "    return [movies_df.iloc[i[0]]['title'] for i in scores[1:11]]",
                "",
                "@app.get('/tmdb/search')",
                "async def search_tmdb(query: str):",
                "    response = await httpx.get(f'{TMDB_BASE}/search/movie',",
                "                               params={'api_key': API_KEY, 'query': query})",
                "    return response.json()['results'][:10]",
                "",
                "@app.get('/movie/id/{tmdb_id}')",
                "async def get_movie_details(tmdb_id: int):",
                "    response = await httpx.get(f'{TMDB_BASE}/movie/{tmdb_id}')",
                "    return {",
                "        'title': response['title'],",
                "        'poster': f'https://image.tmdb.org/t/p/w500{response[\"poster_path\"]}'",
                "        'rating': response['vote_average'],",
                "        'genres': [g['name'] for g in response['genres']]",
                "    }",
                "",
                "# Cosine Similarity: cos(θ) = (A·B) / (||A|| × ||B||)",
                "# TF-IDF: tf(t,d) × log(N/df(t))",
                "# Processing 45,000+ movies with O(1) lookups",
            ],
            "CureLoop MLOps": [
                "# 🩺 CureLoop MLOps - Disease Prediction API",
                "from fastapi import FastAPI, HTTPException",
                "from pydantic import BaseModel",
                "import joblib, numpy as np, pandas as pd",
                "",
                "app = FastAPI(title='CureLoop API', version='1.0')",
                "",
                "# Model loading pipeline",
                "try:",
                "    model = joblib.load('models/random_forest.pkl')",
                "    scaler = joblib.load('models/scaler.pkl')",
                "except Exception as e:",
                "    raise RuntimeError(f'Model load failed: {str(e)}')",
                "",
                "class PatientData(BaseModel):",
                "    symptoms: list[str]",
                "    age: int",
                "    history: str | None = None",
                "",
                "@app.post('/api/v1/predict')",
                "async def predict_disease(data: PatientData):",
                "    features = extract_features(data.symptoms)",
                "    scaled_features = scaler.transform([features])",
                "    ",
                "    prediction = model.predict(scaled_features)[0]",
                "    confidence = np.max(model.predict_proba(scaled_features))",
                "    ",
                "    if confidence < 0.65:",
                "        return {'status': 'review', 'message': 'Consult doctor'}",
                "        ",
                "    return {",
                "        'diagnosis': prediction,",
                "        'confidence': f'{confidence * 100:.1f}%',",
                "        'recommended_action': get_protocol(prediction)",
                "    }",
                "",
                "# CI/CD: GitHub Actions -> Pytest -> Docker -> HF Spaces",
                "# Automated Continuous Training Pipeline Trigger",
                "def retrain_model(): pass # Executes via workflow",
            ],
            "RedGlyph AI": [
                "# 🔍 RedGlyph AI - Code Reviewer Backend",
                "from fastapi import FastAPI, Request, HTTPException",
                "from pydantic import BaseModel",
                "from agents.reviewer_graph import get_default_graph, create_graph",
                "",
                "app = FastAPI(title='RedGlyph', version='2.0.0')",
                "",
                "class CodeRequest(BaseModel):",
                "    code: str",
                "",
                "@app.post('/review')",
                "async def review_code(request: CodeRequest, raw_req: Request):",
                "    custom_key = raw_req.headers.get('X-Custom-API-Key')",
                "    if custom_key:",
                "        graph = create_graph(api_key=custom_key)",
                "    else:",
                "        graph = get_default_graph()",
                "    ",
                "    result = graph.invoke({'code_snippet': request.code})",
                "    return result['report']",
            ],
            "DocIntel RAG": [
                "# 📚 DocIntel - Document RAG API",
                "from fastapi import FastAPI, UploadFile, File, Form",
                "from engine import final_result, process_uploaded_pdf",
                "",
                "app = FastAPI(title='DocIntel')",
                "",
                "@app.post('/api/upload')",
                "async def upload_document(file: UploadFile = File(...)):",
                "    contents = await file.read()",
                "    return process_uploaded_pdf(contents, file.filename)",
                "",
                "@app.post('/api/query')",
                "async def query_documents(query: str = Form(...)):",
                "    return final_result(query.strip())",
            ],
            "CityPulse AI": [
                "# 🚦 CityPulse AI - ST-GCN Traffic Forecasting",
                "import torch, numpy as np",
                "from fastapi import FastAPI",
                "from pydantic import BaseModel",
                "from models.st_gcn import TrafficForecaster",
                "",
                "app = FastAPI(title='Traffic Prediction API')",
                "",
                "@app.post('/ingest')",
                "async def ingest_data(payload: TrafficData):",
                "    history_buffer.append(payload.data)",
                "    if len(history_buffer) == 12:",
                "        x = torch.FloatTensor(history_buffer).unsqueeze(0).unsqueeze(-1)",
                "        pred = model(x, edge_index, edge_weight)",
                "        return (pred * std + mean).tolist()",
            ],
            "LoreWeaver AI": [
                "# 🎭 LoreWeaver AI - Voice Story Engine",
                "import gradio as gr",
                "from engine.storyteller import StoryTeller",
                "from engine.narrator import Narrator",
                "",
                "story_engine = StoryTeller()",
                "narrator_engine = Narrator()",
                "",
                "def process_story(keywords, genre, voice):",
                "    story = story_engine.generate_story(keywords, genre)",
                "    audio_path = narrator_engine.generate_audio_file(story, voice)",
                "    return story, audio_path",
            ],
            "ArchitectAI": [
                "# 🏡 ArchitectAI - Virtual Staging Engine",
                "import gradio as gr",
                "from src.processor import process_room_image",
                "from src.generator import generate_staging",
                "",
                "def run_staging(image, prompt):",
                "    processed = process_room_image(image)",
                "    staged = generate_staging(processed, prompt)",
                "    return staged",
            ],
            "AegisGNN": [
                "# 🛡️ AegisGNN - Anomaly Fraud Detection GCN",
                "from flask import Flask, jsonify, request",
                "from src.model import FraudGCN",
                "from src.trainer import get_fraud_scores",
                "",
                "app = Flask(__name__)",
                "",
                "@app.route('/api/suspects', methods=['GET'])",
                "def api_suspects():",
                "    scores = get_fraud_scores(model, graph)",
                "    return jsonify({'suspects': format_suspects(scores)})",
            ],
            "Cortex-AI": [
                "# 🧠 Cortex-AI - Brain MRI Segmentation API",
                "from fastapi import FastAPI, File, UploadFile",
                "from src.inference import Segmenter",
                "import numpy as np",
                "",
                "app = FastAPI(title='Cortex-AI', version='1.0')",
                "segmenter = Segmenter(model_path='models/unet.h5')",
                "",
                "@app.post('/api/segment')",
                "async def segment_mri(file: UploadFile = File(...)):",
                "    slice_data = np.frombuffer(await file.read(), dtype=np.float32)",
                "    mask = segmenter.predict_slice(slice_data)",
                "    return {'segmentation_mask': mask.tolist()}",
            ],
        };

        const snippets = codeSnippets[project.name] || this.getDefaultCodeSnippets();
        let flow = snippets.join(" ").replace(/\s+/g, " ");

        const totalChars = width * height;
        while (flow.length < totalChars + width) {
            flow += " " + snippets[Math.floor(Math.random() * snippets.length)];
        }

        let out = "";
        let offset = 0;
        for (let row = 0; row < height; row++) {
            let line = flow.slice(offset, offset + width);
            if (line.length < width) line = line + " ".repeat(width - line.length);
            out += line + (row < height - 1 ? "\n" : "");
            offset += width;
        }
        return out;
    }

    getDefaultCodeSnippets() {
        return [
            "from fastapi import FastAPI",
            "app = FastAPI()",
            "@app.get('/')",
            "async def root():",
            "    return {'status': 'OK'}"
        ];
    }

    updateCardClipping() {
        // Scanner positioned at 35% of viewport (left of center)
        const scannerX = window.innerWidth * 0.35;
        const scannerWidth = 8;
        const scannerLeft = scannerX - scannerWidth / 2;
        const scannerRight = scannerX + scannerWidth / 2;
        let anyScanningActive = false;

        document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
            const rect = wrapper.getBoundingClientRect();
            const cardLeft = rect.left;
            const cardRight = rect.right;
            const cardWidth = rect.width;

            const normalCard = wrapper.querySelector(".card-normal");
            const asciiCard = wrapper.querySelector(".card-ascii");

            if (cardLeft < scannerRight && cardRight > scannerLeft) {
                anyScanningActive = true;

                // Calculate how much of the card has passed the scanner (from left edge)
                const scannedAmount = Math.max(scannerRight - cardLeft, 0);
                const scannedPercent = Math.min((scannedAmount / cardWidth) * 100, 100);

                // Calculate how much of the card is still unscanned (from right edge)
                const unscannedPercent = 100 - scannedPercent;

                // Normal card: clip from LEFT by scannedPercent (hide scanned part)
                normalCard.style.setProperty("--clip-left", `${scannedPercent}%`);

                // ASCII card: clip from RIGHT by unscannedPercent (show only scanned part)
                asciiCard.style.setProperty("--clip-right", `${unscannedPercent}%`);

                if (!wrapper.hasAttribute("data-scanned") && scannedPercent > 5) {
                    wrapper.setAttribute("data-scanned", "true");
                    const scanEffect = document.createElement("div");
                    scanEffect.className = "scan-effect";
                    wrapper.appendChild(scanEffect);
                    setTimeout(() => {
                        if (scanEffect.parentNode) {
                            scanEffect.parentNode.removeChild(scanEffect);
                        }
                    }, 600);
                }
            } else {
                if (cardRight < scannerLeft) {
                    // Card has fully passed (is to the LEFT of scanner) - show full ASCII
                    normalCard.style.setProperty("--clip-left", "100%");
                    asciiCard.style.setProperty("--clip-right", "0%");
                } else if (cardLeft > scannerRight) {
                    // Card hasn't reached scanner yet (is to the RIGHT) - show full image
                    normalCard.style.setProperty("--clip-left", "0%");
                    asciiCard.style.setProperty("--clip-right", "100%");
                }
                wrapper.removeAttribute("data-scanned");
            }
        });

        if (window.setScannerScanning) {
            window.setScannerScanning(anyScanningActive);
        }
    }

    updateAsciiContent() {
        document.querySelectorAll(".ascii-content").forEach((content) => {
            if (Math.random() < 0.15) {
                const { width, height } = this.calculateCodeDimensions(400, 250);
                content.textContent = this.generateCode(width, height);
            }
        });
    }

    populateCardLine() {
        this.cardLine.innerHTML = "";
        const cardsCount = 30;
        for (let i = 0; i < cardsCount; i++) {
            const cardWrapper = this.createCardWrapper(i);
            this.cardLine.appendChild(cardWrapper);
        }
    }

    startPeriodicUpdates() {
        setInterval(() => {
            this.updateAsciiContent();
        }, 200);

        const updateClipping = () => {
            this.updateCardClipping();
            requestAnimationFrame(updateClipping);
        };
        updateClipping();
    }
}

let cardStream;

function toggleAnimation() {
    if (cardStream) {
        cardStream.toggleAnimation();
    }
}

function resetPosition() {
    if (cardStream) {
        cardStream.resetPosition();
    }
}

function changeDirection() {
    if (cardStream) {
        cardStream.changeDirection();
    }
}

// ============================================
// ✨ THREE.JS PARTICLE SYSTEM
// ============================================

class ParticleSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleCount = 400;
        this.canvas = document.getElementById("particleCanvas");

        if (this.canvas && typeof THREE !== 'undefined') {
            this.init();
        }
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(
            -window.innerWidth / 2,
            window.innerWidth / 2,
            125,
            -125,
            1,
            1000
        );
        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, 250);
        this.renderer.setClearColor(0x000000, 0);

        this.createParticles();
        this.animate();

        window.addEventListener("resize", () => this.onWindowResize());
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const velocities = new Float32Array(this.particleCount);

        const canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");

        const half = canvas.width / 2;
        const hue = 270; // Purple hue for FastAPI theme

        const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
        gradient.addColorStop(0.025, "#fff");
        gradient.addColorStop(0.1, `hsl(${hue}, 61%, 50%)`);
        gradient.addColorStop(0.25, `hsl(${hue}, 64%, 20%)`);
        gradient.addColorStop(1, "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(half, half, half, 0, Math.PI * 2);
        ctx.fill();

        const texture = new THREE.CanvasTexture(canvas);

        for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
            positions[i * 3 + 2] = 0;

            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;

            const orbitRadius = Math.random() * 200 + 100;
            sizes[i] = (Math.random() * (orbitRadius - 60) + 60) / 8;

            velocities[i] = Math.random() * 60 + 30;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        this.velocities = velocities;

        const alphas = new Float32Array(this.particleCount);
        for (let i = 0; i < this.particleCount; i++) {
            alphas[i] = (Math.random() * 8 + 2) / 10;
        }
        geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
        this.alphas = alphas;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: texture },
                size: { value: 15.0 },
            },
            vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        varying vec3 vColor;
        uniform float size;
        
        void main() {
          vAlpha = alpha;
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        uniform sampler2D pointTexture;
        varying float vAlpha;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            const alphas = this.particles.geometry.attributes.alpha.array;
            const time = Date.now() * 0.001;

            for (let i = 0; i < this.particleCount; i++) {
                positions[i * 3] += this.velocities[i] * 0.016;

                if (positions[i * 3] > window.innerWidth / 2 + 100) {
                    positions[i * 3] = -window.innerWidth / 2 - 100;
                    positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
                }

                positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;

                const twinkle = Math.floor(Math.random() * 10);
                if (twinkle === 1 && alphas[i] > 0) {
                    alphas[i] -= 0.05;
                } else if (twinkle === 2 && alphas[i] < 1) {
                    alphas[i] += 0.05;
                }

                alphas[i] = Math.max(0, Math.min(1, alphas[i]));
            }

            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.geometry.attributes.alpha.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.left = -window.innerWidth / 2;
        this.camera.right = window.innerWidth / 2;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, 250);
    }

    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
    }
}

let particleSystem;

// ============================================
// 🔦 PARTICLE SCANNER (Canvas-based)
// ============================================

class ParticleScanner {
    constructor() {
        this.canvas = document.getElementById("scannerCanvas");
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext("2d");
        this.animationId = null;

        // Use window.innerWidth for viewport-centered scanner
        this.w = window.innerWidth;
        this.h = 300;
        this.particles = [];
        this.count = 0;
        this.maxParticles = 800;
        this.intensity = 0.8;
        this.lightBarX = this.w * 0.35;
        this.lightBarWidth = 3;
        this.fadeZone = 60;

        this.scanTargetIntensity = 1.8;
        this.scanTargetParticles = 2500;
        this.scanTargetFadeZone = 35;

        this.scanningActive = false;

        this.baseIntensity = this.intensity;
        this.baseMaxParticles = this.maxParticles;
        this.baseFadeZone = this.fadeZone;

        this.currentIntensity = this.intensity;
        this.currentMaxParticles = this.maxParticles;
        this.currentFadeZone = this.fadeZone;
        this.transitionSpeed = 0.05;

        this.setupCanvas();
        this.createGradientCache();
        this.initParticles();
        this.animate();

        window.addEventListener("resize", () => this.onResize());
    }

    setupCanvas() {
        this.w = window.innerWidth;
        this.lightBarX = this.w * 0.35;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.canvas.style.width = this.w + "px";
        this.canvas.style.height = this.h + "px";
        this.ctx.clearRect(0, 0, this.w, this.h);
    }

    onResize() {
        this.w = window.innerWidth;
        this.lightBarX = this.w * 0.35;
        this.setupCanvas();
    }

    createGradientCache() {
        this.gradientCanvas = document.createElement("canvas");
        this.gradientCtx = this.gradientCanvas.getContext("2d");
        this.gradientCanvas.width = 16;
        this.gradientCanvas.height = 16;

        const half = this.gradientCanvas.width / 2;
        const gradient = this.gradientCtx.createRadialGradient(
            half,
            half,
            0,
            half,
            half,
            half
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(196, 181, 253, 0.8)");
        gradient.addColorStop(0.7, "rgba(139, 92, 246, 0.4)");
        gradient.addColorStop(1, "transparent");

        this.gradientCtx.fillStyle = gradient;
        this.gradientCtx.beginPath();
        this.gradientCtx.arc(half, half, half, 0, Math.PI * 2);
        this.gradientCtx.fill();
    }

    random(min, max) {
        if (arguments.length < 2) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    createParticle() {
        const intensityRatio = this.intensity / this.baseIntensity;
        const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
        const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

        return {
            x:
                this.lightBarX +
                this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
            y: this.randomFloat(0, this.h),

            vx: this.randomFloat(0.2, 1.0) * speedMultiplier,
            vy: this.randomFloat(-0.15, 0.15) * speedMultiplier,

            radius: this.randomFloat(0.4, 1) * sizeMultiplier,
            alpha: this.randomFloat(0.6, 1),
            decay: this.randomFloat(0.005, 0.025) * (2 - intensityRatio * 0.5),
            originalAlpha: 0,
            life: 1.0,
            time: 0,
            startX: 0,

            twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
            twinkleAmount: this.randomFloat(0.1, 0.25),
        };
    }

    initParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.time++;

        particle.alpha =
            particle.originalAlpha * particle.life +
            Math.sin(particle.time * particle.twinkleSpeed) * particle.twinkleAmount;

        particle.life -= particle.decay;

        if (particle.x > this.w + 10 || particle.life <= 0) {
            this.resetParticle(particle);
        }
    }

    resetParticle(particle) {
        particle.x =
            this.lightBarX +
            this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
        particle.y = this.randomFloat(0, this.h);
        particle.vx = this.randomFloat(0.2, 1.0);
        particle.vy = this.randomFloat(-0.15, 0.15);
        particle.alpha = this.randomFloat(0.6, 1);
        particle.originalAlpha = particle.alpha;
        particle.life = 1.0;
        particle.time = 0;
        particle.startX = particle.x;
    }

    drawParticle(particle) {
        if (particle.life <= 0) return;

        let fadeAlpha = 1;

        if (particle.y < this.fadeZone) {
            fadeAlpha = particle.y / this.fadeZone;
        } else if (particle.y > this.h - this.fadeZone) {
            fadeAlpha = (this.h - particle.y) / this.fadeZone;
        }

        fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

        this.ctx.globalAlpha = particle.alpha * fadeAlpha;
        this.ctx.drawImage(
            this.gradientCanvas,
            particle.x - particle.radius,
            particle.y - particle.radius,
            particle.radius * 2,
            particle.radius * 2
        );
    }

    drawLightBar() {
        const verticalGradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
        verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        verticalGradient.addColorStop(
            this.fadeZone / this.h,
            "rgba(255, 255, 255, 1)"
        );
        verticalGradient.addColorStop(
            1 - this.fadeZone / this.h,
            "rgba(255, 255, 255, 1)"
        );
        verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.globalCompositeOperation = "lighter";

        const targetGlowIntensity = this.scanningActive ? 3.5 : 1;

        if (!this.currentGlowIntensity) this.currentGlowIntensity = 1;

        this.currentGlowIntensity +=
            (targetGlowIntensity - this.currentGlowIntensity) * this.transitionSpeed;

        const glowIntensity = this.currentGlowIntensity;
        const lineWidth = this.lightBarWidth;
        const glow1Alpha = this.scanningActive ? 1.0 : 0.8;
        const glow2Alpha = this.scanningActive ? 0.8 : 0.6;
        const glow3Alpha = this.scanningActive ? 0.6 : 0.4;

        const coreGradient = this.ctx.createLinearGradient(
            this.lightBarX - lineWidth / 2,
            0,
            this.lightBarX + lineWidth / 2,
            0
        );
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        coreGradient.addColorStop(
            0.3,
            `rgba(255, 255, 255, ${0.9 * glowIntensity})`
        );
        coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`);
        coreGradient.addColorStop(
            0.7,
            `rgba(255, 255, 255, ${0.9 * glowIntensity})`
        );
        coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = coreGradient;

        const radius = 15;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.lightBarX - lineWidth / 2,
            0,
            lineWidth,
            this.h,
            radius
        );
        this.ctx.fill();

        const glow1Gradient = this.ctx.createLinearGradient(
            this.lightBarX - lineWidth * 2,
            0,
            this.lightBarX + lineWidth * 2,
            0
        );
        glow1Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
        glow1Gradient.addColorStop(
            0.5,
            `rgba(196, 181, 253, ${0.8 * glowIntensity})`
        );
        glow1Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

        this.ctx.globalAlpha = glow1Alpha;
        this.ctx.fillStyle = glow1Gradient;

        const glow1Radius = 25;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.lightBarX - lineWidth * 2,
            0,
            lineWidth * 4,
            this.h,
            glow1Radius
        );
        this.ctx.fill();

        const glow2Gradient = this.ctx.createLinearGradient(
            this.lightBarX - lineWidth * 4,
            0,
            this.lightBarX + lineWidth * 4,
            0
        );
        glow2Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
        glow2Gradient.addColorStop(
            0.5,
            `rgba(139, 92, 246, ${0.4 * glowIntensity})`
        );
        glow2Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

        this.ctx.globalAlpha = glow2Alpha;
        this.ctx.fillStyle = glow2Gradient;

        const glow2Radius = 35;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.lightBarX - lineWidth * 4,
            0,
            lineWidth * 8,
            this.h,
            glow2Radius
        );
        this.ctx.fill();

        if (this.scanningActive) {
            const glow3Gradient = this.ctx.createLinearGradient(
                this.lightBarX - lineWidth * 8,
                0,
                this.lightBarX + lineWidth * 8,
                0
            );
            glow3Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
            glow3Gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.2)");
            glow3Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

            this.ctx.globalAlpha = glow3Alpha;
            this.ctx.fillStyle = glow3Gradient;

            const glow3Radius = 45;
            this.ctx.beginPath();
            this.ctx.roundRect(
                this.lightBarX - lineWidth * 8,
                0,
                lineWidth * 16,
                this.h,
                glow3Radius
            );
            this.ctx.fill();
        }

        this.ctx.globalCompositeOperation = "destination-in";
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = verticalGradient;
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    render() {
        const targetIntensity = this.scanningActive
            ? this.scanTargetIntensity
            : this.baseIntensity;
        const targetMaxParticles = this.scanningActive
            ? this.scanTargetParticles
            : this.baseMaxParticles;
        const targetFadeZone = this.scanningActive
            ? this.scanTargetFadeZone
            : this.baseFadeZone;

        this.currentIntensity +=
            (targetIntensity - this.currentIntensity) * this.transitionSpeed;
        this.currentMaxParticles +=
            (targetMaxParticles - this.currentMaxParticles) * this.transitionSpeed;
        this.currentFadeZone +=
            (targetFadeZone - this.currentFadeZone) * this.transitionSpeed;

        this.intensity = this.currentIntensity;
        this.maxParticles = Math.floor(this.currentMaxParticles);
        this.fadeZone = this.currentFadeZone;

        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.clearRect(0, 0, this.w, this.h);

        this.drawLightBar();

        this.ctx.globalCompositeOperation = "lighter";
        for (let i = 1; i <= this.count; i++) {
            if (this.particles[i]) {
                this.updateParticle(this.particles[i]);
                this.drawParticle(this.particles[i]);
            }
        }

        const currentIntensity = this.intensity;
        const currentMaxParticles = this.maxParticles;

        if (Math.random() < currentIntensity && this.count < currentMaxParticles) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }

        const intensityRatio = this.intensity / this.baseIntensity;

        if (intensityRatio > 1.1 && Math.random() < (intensityRatio - 1.0) * 1.2) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }

        if (intensityRatio > 1.3 && Math.random() < (intensityRatio - 1.3) * 1.4) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }

        if (intensityRatio > 1.5 && Math.random() < (intensityRatio - 1.5) * 1.8) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }

        if (intensityRatio > 2.0 && Math.random() < (intensityRatio - 2.0) * 2.0) {
            const particle = this.createParticle();
            particle.originalAlpha = particle.alpha;
            particle.startX = particle.x;
            this.count++;
            this.particles[this.count] = particle;
        }

        if (this.count > currentMaxParticles + 200) {
            const excessCount = Math.min(15, this.count - currentMaxParticles);
            for (let i = 0; i < excessCount; i++) {
                delete this.particles[this.count - i];
            }
            this.count -= excessCount;
        }
    }

    animate() {
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    startScanning() {
        this.scanningActive = true;
    }

    stopScanning() {
        this.scanningActive = false;
    }

    setScanningActive(active) {
        this.scanningActive = active;
    }

    getStats() {
        return {
            intensity: this.intensity,
            maxParticles: this.maxParticles,
            currentParticles: this.count,
            lightBarWidth: this.lightBarWidth,
            fadeZone: this.fadeZone,
            scanningActive: this.scanningActive,
            canvasWidth: this.w,
            canvasHeight: this.h,
        };
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.particles = [];
        this.count = 0;
    }
}

let particleScanner;

// ============================================
// 🚀 INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    cardStream = new CardStreamController();
    particleSystem = new ParticleSystem();
    particleScanner = new ParticleScanner();

    window.setScannerScanning = (active) => {
        if (particleScanner) {
            particleScanner.setScanningActive(active);
        }
    };

    window.getScannerStats = () => {
        if (particleScanner) {
            return particleScanner.getStats();
        }
        return null;
    };
});
