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
        const cardWidth = 400;
        const cardGap = 60;
        const cardCount = this.cardLine.children.length;
        this.cardLineWidth = (cardWidth + cardGap) * cardCount;
    }

    setupEventListeners() {
        this.cardLine.addEventListener("mousedown", (e) => this.startDrag(e));
        document.addEventListener("mousemove", (e) => this.onDrag(e));
        document.addEventListener("mouseup", () => this.endDrag());

        this.cardLine.addEventListener(
            "touchstart",
            (e) => this.startDrag(e.touches[0]),
            { passive: false }
        );
        document.addEventListener("touchmove", (e) => this.onDrag(e.touches[0]), {
            passive: false,
        });
        document.addEventListener("touchend", () => this.endDrag());

        this.cardLine.addEventListener("wheel", (e) => this.onWheel(e));
        this.cardLine.addEventListener("selectstart", (e) => e.preventDefault());
        this.cardLine.addEventListener("dragstart", (e) => e.preventDefault());

        window.addEventListener("resize", () => this.calculateDimensions());
    }

    startDrag(e) {
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

        this.cardLine.style.transform = `translateX(${this.position}px)`;
        this.updateCardClipping();
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
        const containerWidth = this.containerWidth;
        const cardLineWidth = this.cardLineWidth;

        if (this.position < -cardLineWidth) {
            this.position = containerWidth;
        } else if (this.position > containerWidth) {
            this.position = -cardLineWidth;
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
        this.position = this.containerWidth;
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
        this.updateCardClipping();
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
            description: "Netflix-style movie recommendation engine powered by TF-IDF NLP",
            tech: ["FastAPI", "TF-IDF", "TMDB API", "Streamlit", "Python"],
            github: "https://github.com/mayank-goyal09/movieflix-rec",
            live: "https://movieflix-rec.onrender.com/docs",
            streamlit: "https://movieflix-rec.streamlit.app",
            gradient: ["#E50914", "#8b5cf6"], // Netflix red to purple
            icon: "🎬",
            stats: "45K+ Movies | NLP Engine | Real-time Search"
        },
        {
            name: "CureLoop MLOps",
            subtitle: "Automated Disease Prediction",
            description: "Transforming static notebooks into a living, breathing AI system with full MLOps pipeline.",
            tech: ["FastAPI", "Scikit", "Docker", "Pytest", "HF Spaces"],
            github: "https://github.com/mayank-goyal09/CureLoop-MLOps",
            live: "https://mayankg09-cureloop-mlops.hf.space/docs",
            gradient: ["#10b981", "#3b82f6"], // Emerald to blue for healthcare
            icon: "🩺",
            stats: "CI/CD Pipeline | Hugging Face Deployed | Continual Learning"
        },
        // Add more projects here as you build them!
    ];

    createCardWrapper(index) {
        const wrapper = document.createElement("div");
        wrapper.className = "card-wrapper";

        const normalCard = document.createElement("div");
        normalCard.className = "card card-normal";

        // Get project data (cycle through projects array)
        const project = this.projects[index % this.projects.length];

        // Create canvas-based card with project info
        const canvas = document.createElement("canvas");
        canvas.width = 480;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");

        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 480, 300);
        gradient.addColorStop(0, project.gradient[0]);
        gradient.addColorStop(1, project.gradient[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 480, 300);

        // Add subtle pattern overlay
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        for (let i = 0; i < 480; i += 20) {
            ctx.fillRect(i, 0, 1, 300);
        }
        for (let i = 0; i < 300; i += 20) {
            ctx.fillRect(0, i, 480, 1);
        }

        // Draw project icon
        ctx.font = "60px Arial";
        ctx.textAlign = "left";
        ctx.fillText(project.icon, 25, 80);

        // Draw project name
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px 'Segoe UI', Arial";
        ctx.fillText(project.name, 100, 60);

        // Draw subtitle
        ctx.font = "18px 'Segoe UI', Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText(project.subtitle, 100, 85);

        // Draw horizontal line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(25, 115);
        ctx.lineTo(455, 115);
        ctx.stroke();

        // Draw description
        ctx.font = "15px 'Segoe UI', Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        const description = project.description;
        ctx.fillText(description.length > 60 ? description.slice(0, 60) + "..." : description, 25, 145);

        // Draw tech badges
        ctx.font = "bold 12px 'Courier New', monospace";
        let badgeX = 25;
        project.tech.slice(0, 4).forEach((tech, i) => {
            const badgeWidth = ctx.measureText(tech).width + 18;

            // Badge background
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            ctx.roundRect(badgeX, 170, badgeWidth, 26, 5);
            ctx.fill();

            // Badge text
            ctx.fillStyle = "#ffffff";
            ctx.fillText(tech, badgeX + 9, 188);

            badgeX += badgeWidth + 10;
        });

        // Draw stats
        ctx.font = "13px 'Segoe UI', Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillText(project.stats, 25, 230);

        // Draw "View Project" button
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.beginPath();
        ctx.roundRect(25, 255, 140, 32, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px 'Segoe UI', Arial";
        ctx.fillText("View Project →", 45, 277);

        // Convert canvas to image
        const cardImage = document.createElement("img");
        cardImage.className = "card-image";
        cardImage.src = canvas.toDataURL();
        cardImage.alt = project.name;

        // Make card clickable
        wrapper.style.cursor = "pointer";
        wrapper.addEventListener("click", () => {
            window.open(project.github, "_blank");
        });

        normalCard.appendChild(cardImage);

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
