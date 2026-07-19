/* =================================================================
   🚀 COSMIC ASSISTANT - ENHANCED RULE-BASED CHATBOT
   Answers questions ONLY about the portfolio database.
   Implements Mode A (Rule-Based Keyword Matching with strict scope).
   ================================================================= */

// ===== CONFIGURABLE CONSTANTS =====
// CONFIDENCE_THRESHOLD defines the minimum keyword matching score required
// to trigger an in-scope response. If the score is below this, the fallback message is sent.
const CONFIDENCE_THRESHOLD = 1;

// Define intents and their associated keywords for matching
const INTENT_KEYWORDS = {
    greetings: ["hello", "hi", "hey", "greet", "howdy", "whats up", "yo"],
    skills: ["skills", "skill", "technologies", "tech", "stack", "languages", "tools", "frameworks", "libraries", "capabilities", "expertise", "workbench", "pytorch", "tensorflow", "fastapi", "python", "sql", "pandas", "scikit-learn", "numpy", "power bi", "excel", "tableau"],
    projects: ["projects", "project", "built", "app", "apps", "dashboard", "dashboards", "system", "systems", "github", "portfolio"],
    experience: ["experience", "work", "job", "internship", "intern", "freelance", "spaceece", "kwerky", "media", "role", "position", "career", "professional", "company"],
    education: ["education", "degree", "qualification", "university", "college", "self-taught", "study", "studies", "btech", "b.tech", "school", "learn"],
    contact: ["contact", "email", "linkedin", "github", "twitter", "huggingface", "hugging face", "hf", "reach", "hire", "connect", "mail", "phone", "social", "socials", "message"],
    tips: ["tip", "tips", "advice", "learn", "study", "career advice", "how to"]
};

// Words that have higher weight in matching
const STRONG_KEYWORDS = ["skills", "experience", "education", "contact", "projects", "project", "email", "linkedin", "github", "huggingface", "hugging face"];

// Project category keywords for routing queries directly to specific categories
const CATEGORY_KEYWORDS = {
    "Data Analytics": ["data analytics", "data analytic", "analytics", "dashboard", "dashboards", "power bi", "excel", "tableau", "visualization"],
    "Machine Learning": ["machine learning", "ml projects", "ml project", "supervised", "unsupervised", "clustering", "classification", "regression", "scikit-learn", "scikit", "sklearn"],
    "Deep Learning": ["deep learning", "dl projects", "dl project", "neural network", "neural networks", "ann", "cnn", "lstm", "rnn", "gnn", "gcn", "transformer", "transformers", "pytorch", "tensorflow", "keras"],
    "FastAPI": ["fastapi", "fast api", "async api", "apis", "api", "mlops"],
    "Python/OOP": ["python projects", "python project", "python", "oop", "backend", "sqlite", "streamlit"],
    "Generative AI": ["generative ai", "genai", "gen ai", "rag", "agent", "agents", "vector db", "gemini", "llama", "mistral", "ollama"],
    "NLP": ["nlp", "natural language", "text analysis", "sentiment", "translation", "whisper", "speech"]
};

// Learning tips backup list
const STATIC_TIPS = [
    "Small, daily projects beat huge theoretical plans. Pick tiny data problems, commit them to GitHub, and improve one thing each iteration.",
    "Document everything. Your future self (and recruiters) will thank you for detailed READMEs.",
    "Deploy your projects! A live demo is worth a thousand lines of code. Streamlit makes this super easy.",
    "Focus on end-to-end pipelines. Going from raw data to deployed model is the real skill.",
    "Learn by building, not just reading. Start with a problem that interests you.",
    "Version control is non-negotiable. Commit early, commit often.",
    "The best portfolio project solves a real problem you personally care about.",
    "Feature engineering often matters more than model selection. Master your data first.",
    "Write code like someone else has to maintain it — that someone is usually future you.",
    "Don't chase every new framework. Master the fundamentals: Python, SQL, and statistics."
];

// ===== CHATBOT CLASS =====
class CosmicAssistant {
    constructor() {
        this.isOpen = false;
        this.messagesContainer = null;
        this.inputField = null;
        this.currentPage = this.detectCurrentPage();
        this.portfolioData = null;
        this.isLoading = true;
        this.loadError = false;
    }

    detectCurrentPage() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('data-analytics')) return 'data-analytics';
        if (path.includes('machine-learning')) return 'machine-learning';
        if (path.includes('python-projects')) return 'python-projects';
        if (path.includes('deep-learning')) return 'deep-learning';
        if (path.includes('fastapi')) return 'fastapi';
        if (path.includes('generative-ai')) return 'generative-ai';
        if (path.includes('nlp')) return 'nlp';
        return 'home';
    }

    async loadPortfolioData() {
        try {
            const response = await fetch('data/portfolio.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.portfolioData = await response.json();
            this.isLoading = false;
            console.log('Portfolio database loaded successfully.');
        } catch (error) {
            console.error('Failed to load portfolio database:', error);
            this.isLoading = false;
            this.loadError = true;
            // Display load error in chat
            this.addMessage('assistant', `⚠️ **Warning:** Could not load the portfolio database (\`data/portfolio.json\`). This usually happens when opening the site directly via the \`file://\` protocol due to browser security restrictions. Please run this site using a local web server (e.g., Live Server) or deploy it.`);
        }
    }

    init() {
        this.createChatbotUI();
        this.bindEvents();
        this.loadPortfolioData();
    }

    getQuickActionsHTML() {
        const commonButtons = `
            <button data-action="greeting">👋 Hi</button>
            <button data-action="skills">💼 Skills</button>
            <button data-action="contact">📧 Contact</button>
        `;
        
        switch (this.currentPage) {
            case 'data-analytics':
                return `
                    ${commonButtons}
                    <button data-action="da-projects">📊 Analytics</button>
                    <button data-action="tip">💡 Tip</button>
                `;
            case 'machine-learning':
                return `
                    ${commonButtons}
                    <button data-action="ml-projects">🤖 ML</button>
                    <button data-action="tip">💡 Tip</button>
                `;
            case 'python-projects':
                return `
                    ${commonButtons}
                    <button data-action="py-projects">🐍 Python</button>
                    <button data-action="tip">💡 Tip</button>
                `;
            case 'deep-learning':
                return `
                    ${commonButtons}
                    <button data-action="dl-projects">🧠 Deep</button>
                    <button data-action="tip">💡 Tip</button>
                `;
            case 'fastapi':
                return `
                    ${commonButtons}
                    <button data-action="fastapi-projects">⚡ FastAPI</button>
                    <button data-action="tip">💡 Tip</button>
                `;
            case 'generative-ai':
                return `
                    ${commonButtons}
                    <button data-action="genai-projects">🎨 GenAI</button>
                    <button data-action="tip">💡 Tip</button>
                `;
            case 'nlp':
                return `
                    ${commonButtons}
                    <button data-action="nlp-projects">💬 NLP</button>
                    <button data-action="tip">💡 Tip</button>
                `;
            default:
                return `
                    ${commonButtons}
                    <button data-action="projects">🚀 All Projects</button>
                    <button data-action="tip">💡 Tip</button>
                `;
        }
    }

    createChatbotUI() {
        // Create the chatbot wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'cosmic-chat-wrapper';
        wrapper.innerHTML = `
            <!-- Floating Orb Button -->
            <button class="cosmic-orb" id="cosmicOrb" aria-label="Open Cosmic Assistant"></button>

            <!-- Chat Window -->
            <div class="cosmic-chat-window" id="cosmicChatWindow" aria-hidden="true">
                <div class="chat-header">
                    <div class="chat-header-left">
                        <div class="status-indicator">
                            <span class="status-dot"></span>
                        </div>
                        <div class="header-text">
                            <h3>Cosmic Assistant</h3>
                            <p>Ask about skills, experience, or projects</p>
                        </div>
                    </div>
                    <button class="chat-close-btn" id="chatCloseBtn" aria-label="Close">×</button>
                </div>

                <!-- Scope Expectation Indicator -->
                <div class="scope-indicator" style="background: rgba(255, 255, 255, 0.05); font-size: 11px; padding: 6px 12px; color: rgba(255, 255, 255, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center;">
                    🔒 Answers based on portfolio data only
                </div>

                <div class="chat-messages" id="chatMessages">
                    <!-- Messages will be injected here -->
                </div>

                <div class="chat-quick-actions" id="quickActions">
                    ${this.getQuickActionsHTML()}
                </div>

                <form class="chat-input-form" id="chatInputForm">
                    <input type="text" id="chatInput" placeholder="Ask about projects, skills..." autocomplete="off" />
                    <button type="submit">Send</button>
                </form>
            </div>
        `;

        document.body.appendChild(wrapper);

        // Save references
        this.messagesContainer = document.getElementById('chatMessages');
        this.inputField = document.getElementById('chatInput');
    }

    bindEvents() {
        const orb = document.getElementById('cosmicOrb');
        const closeBtn = document.getElementById('chatCloseBtn');
        const form = document.getElementById('chatInputForm');
        const quickActions = document.getElementById('quickActions');

        orb.addEventListener('click', () => this.toggle());
        closeBtn.addEventListener('click', () => this.close());

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = this.inputField.value.trim();
            if (text) {
                this.handleUserMessage(text);
                this.inputField.value = '';
            }
        });

        quickActions.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const window = document.getElementById('cosmicChatWindow');
        const orb = document.getElementById('cosmicOrb');

        window.style.display = 'flex';
        window.setAttribute('aria-hidden', 'false');
        orb.classList.add('orb-active');
        this.isOpen = true;

        // Show welcome message if first time
        if (!this.messagesContainer.dataset.initialized) {
            this.showWelcomeMessage();
            this.messagesContainer.dataset.initialized = 'true';
        }

        this.inputField.focus();
    }

    close() {
        const window = document.getElementById('cosmicChatWindow');
        const orb = document.getElementById('cosmicOrb');

        window.style.display = 'none';
        window.setAttribute('aria-hidden', 'true');
        orb.classList.remove('orb-active');
        this.isOpen = false;
    }

    showWelcomeMessage() {
        const name = this.portfolioData?.name || "Mayank Goyal";
        let welcomeText = `👋 **Hey there! I'm the Cosmic Assistant** for ${name}'s portfolio.\n\n`;

        switch (this.currentPage) {
            case 'data-analytics':
                welcomeText += `📊 You're exploring the **Data Analytics** projects! I can tell you about any of the dashboards, SQL analyses, or visualization projects here.\n\nTry asking about "Marketing Dashboard" or "Olympic Analytics"!`;
                break;
            case 'machine-learning':
                welcomeText += `🤖 Welcome to the **Machine Learning Lab**! I know all about the supervised and unsupervised projects here.\n\nAsk me about "SmartHarvest", "Geo-Pulse", or any ML project!`;
                break;
            case 'python-projects':
                welcomeText += `🐍 You're in the **Python & OOP** section! These are applications built with Python.\n\nAsk about the "YouTube Studio Automation" flagship project or any backend system!`;
                break;
            case 'deep-learning':
                welcomeText += `🧠 Welcome to the **Deep Learning Lab**! Here you'll find ANNs, CNNs, LSTMs, and GNNs.\n\nAsk about "ASL Digits Recognizer", "AegisGNN", or "CityPulse AI"!`;
                break;
            case 'fastapi':
                welcomeText += `⚡ You're exploring the **FastAPI Lab**! I can tell you about high-performance async APIs, ML deployments, and backend microservices here.\n\nTry asking about "MovieFlix AI" or "CureLoop MLOps"!`;
                break;
            case 'generative-ai':
                welcomeText += `🎨 Welcome to the **Generative AI Lab**! Here you'll find Private RAG bases, NDA risk analyzers, multi-modal bots, and image generators.\n\nAsk about "DocIntel", "RedGlyph", or "ArchitectAI"!`;
                break;
            case 'nlp':
                welcomeText += `💬 Welcome to the **Natural Language Processing Lab**! Explore sequence models, address resolvers, and real-time audio interception engines.\n\nAsk about "Why Summarizer", "Address ResolveR", or "Beep-for-Abuse"!`;
                break;
            default:
                welcomeText += `I can answer questions based **only** on Mayank's official portfolio data. Try asking about:\n• 💼 **Experience** - Work history & roles\n• 🛠️ **Skills** - Applied developer workbench\n• 🚀 **Projects** - Over 60+ projects\n• 📧 **Contact** - Email, [Hugging Face](https://huggingface.co/mayankg09) & social profiles\n• 🎓 **Education** - Certs & study background\n\nJust ask or use the quick buttons below!`;
        }

        this.addMessage('assistant', welcomeText);
    }

    addMessage(role, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message chat-message-${role}`;

        // Process markdown-like formatting
        const formattedText = this.formatMessage(text);

        msgDiv.innerHTML = `
            <div class="message-bubble">
                ${formattedText}
            </div>
        `;

        this.messagesContainer.appendChild(msgDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    formatMessage(text) {
        // Convert **bold** to <strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Convert markdown links [text](url) to <a> tags
        text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        // Convert raw URLs (not inside a tag or bracket) to links
        text = text.replace(/(?<!href=")(?<!">)(https?:\/\/[^\s<()[\]]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
        // Convert newlines to <br>
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    handleUserMessage(text) {
        this.addMessage('user', text);

        // Simulate typing delay
        setTimeout(() => {
            const response = this.generateResponse(text);
            this.addMessage('assistant', response);
        }, 400 + Math.random() * 300);
    }

    handleQuickAction(action) {
        const prompts = {
            'greeting': 'Hello!',
            'skills': 'What are Mayank\'s skills?',
            'projects': 'Tell me about all of Mayank\'s projects',
            'ml-projects': 'Show me Machine Learning projects',
            'dl-projects': 'Tell me about Deep Learning projects',
            'da-projects': 'Tell me about Data Analytics projects',
            'py-projects': 'Show me Python projects',
            'fastapi-projects': 'Tell me about FastAPI projects',
            'genai-projects': 'Tell me about Generative AI projects',
            'nlp-projects': 'Show me NLP projects',
            'contact': 'How can I contact Mayank?',
            'experience': 'What is Mayank\'s work experience?',
            'tip': 'Give me a learning tip'
        };

        const prompt = prompts[action] || 'Hello!';
        this.handleUserMessage(prompt);
    }

    includesWordSequence(text, sequence) {
        const textWords = text.split(/\s+/);
        const seqWords = sequence.split(/\s+/);
        
        for (let i = 0; i <= textWords.length - seqWords.length; i++) {
            let match = true;
            for (let j = 0; j < seqWords.length; j++) {
                if (textWords[i + j] !== seqWords[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return true;
        }
        return false;
    }

    generateResponse(input) {
        if (this.isLoading) {
            return `⏳ I am still loading the portfolio database. Please try again in a moment.`;
        }
        if (this.loadError || !this.portfolioData) {
            return `⚠️ The portfolio database failed to load. Answers are currently unavailable.`;
        }

        const k = this.portfolioData;
        const q = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

        // 1. Check for specific project name matches directly
        const matchedProject = this.findMatchingProject(q, k.projects);
        if (matchedProject) {
            return this.formatProjectResponse(matchedProject);
        }

        // 2. Check for project category matches directly
        const matchedCategory = this.findMatchingCategory(q);
        if (matchedCategory) {
            return this.formatCategoryResponse(matchedCategory, k.projects);
        }

        // 3. Initialize intent scores
        const scores = {
            greetings: 0,
            skills: 0,
            projects: 0,
            experience: 0,
            education: 0,
            contact: 0,
            tips: 0
        };

        for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
            for (const keyword of keywords) {
                const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
                if (this.includesWordSequence(q, cleanKeyword)) {
                    const isStrong = STRONG_KEYWORDS.includes(keyword);
                    scores[intent] += isStrong ? 2 : 1;
                }
            }
        }

        // Find the intent with the highest score
        let bestIntent = null;
        let maxScore = 0;
        for (const [intent, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                bestIntent = intent;
            }
        }

        // 4. Return response if score meets confidence threshold
        if (maxScore >= CONFIDENCE_THRESHOLD && bestIntent) {
            switch (bestIntent) {
                case 'greetings':
                    return `👋 **Hey there!** I'm the portfolio assistant for ${k.name}.\n\nI can help you explore my work across **60+ projects** in these areas:\n• 📊 **Data Analytics**\n• 🤖 **Machine Learning**  \n• 🧠 **Deep Learning**\n• 🐍 **Python/OOP**\n• ⚡ **FastAPI**\n• 🎨 **Generative AI**\n• 💬 **NLP**\n\nWhat would you like to explore?`;
                
                case 'skills': {
                    let response = `🛠️ **${k.name}'s Developer Workbench (Applied Skills)**\n\n`;
                    k.skills.forEach(skill => {
                        response += `🧠 **${skill.name}**:\n• ${skill.desc}\n\n`;
                    });
                    response += `Would you like to explore projects under any of these domains?`;
                    return response;
                }
                
                case 'projects': {
                    let response = `🚀 **${k.name}'s Complete Portfolio**\n\n`;
                    // Unique categories list
                    const categories = [...new Set(k.projects.map(p => p.category))];
                    categories.forEach(cat => {
                        const count = k.projects.filter(p => p.category === cat).length;
                        let pageLink = "#";
                        if (cat === "Data Analytics") pageLink = "data-analytics-projects.html";
                        else if (cat === "Machine Learning") pageLink = "machine-learning.html";
                        else if (cat === "Deep Learning") pageLink = "deep-learning.html";
                        else if (cat === "Python/OOP") pageLink = "python-projects.html";
                        else if (cat === "FastAPI") pageLink = "fastapi.html";
                        else if (cat === "Generative AI") pageLink = "generative-ai.html";
                        else if (cat === "NLP") pageLink = "nlp.html";
                        
                        response += `• [${cat}](${pageLink}) (${count} projects)\n`;
                    });
                    response += `\n**Featured Spotlight Projects:**\n`;
                    k.projects.slice(0, 4).forEach(p => {
                        response += `• **${p.name}** (${p.category}) - ${p.stats}\n`;
                    });
                    response += `\nWhich category or project interests you?`;
                    return response;
                }
                
                case 'experience': {
                    let response = `💼 **Professional Experience**\n\n`;
                    k.experience.forEach(exp => {
                        response += `🏢 **${exp.role}** @ ${exp.company}\n📅 ${exp.duration}\n${exp.details}\n\n`;
                    });
                    return response;
                }
                
                case 'education': {
                    let response = `🎓 **Education & Certs**\n\n`;
                    k.education.forEach(edu => {
                        response += `• **${edu.degree}**\n  🏫 ${edu.institute} (${edu.year})\n\n`;
                    });
                    return response;
                }
                
                case 'contact': {
                    const c = k.contact;
                    return `📬 **Contact Mayank**\n\n📧 **Email:** ${c.email}\n\n🔗 **Social Links:**\n• [LinkedIn](${c.linkedin})\n• [GitHub](${c.github})\n• [Twitter/X](${c.twitter})\n• [Hugging Face](${c.huggingface || 'https://huggingface.co/mayankg09'})\n\nYou can also use the contact form on the main page. Mayank typically responds within 24 hours!`;
                }
                
                case 'tips': {
                    const tipsList = k.tips || STATIC_TIPS;
                    const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];
                    return `💡 **Learning Tip from Mayank:**\n\n"${randomTip}"\n\nWant another tip? Just ask!`;
                }
            }
        }

        // 5. Unanswered question handling (Log and return strict fallback)
        this.logUnansweredQuestion(input);
        return "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me.";
    }

    findMatchingProject(query, projects) {
        if (!projects || !Array.isArray(projects)) return null;
        const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        for (const p of projects) {
            // Get core name (before dash/colon/parenthesis)
            const coreName = p.name.split(/[-–—:(]/)[0].trim();
            const cleanCore = coreName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
            
            if (cleanCore.length >= 3 && this.includesWordSequence(cleanQuery, cleanCore)) {
                return p;
            }
        }
        return null;
    }

    formatProjectResponse(p) {
        let response = `📂 **Project Spotlight: ${p.name}**\n`;
        response += `*Category: ${p.category}*\n\n`;
        response += `${p.description}\n\n`;
        response += `🛠️ **Tech Stack:** ${p.tech.join(' • ')}\n`;
        response += `📊 **Stats/Impact:** ${p.stats}\n\n`;
        
        const links = [];
        if (p.link) links.push(`[Try It Live](${p.link})`);
        if (p.github) links.push(`[GitHub Code](${p.github})`);
        
        if (links.length > 0) {
            response += `🔗 ${links.join(' • ')}`;
        }
        return response;
    }

    findMatchingCategory(query) {
        const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
            for (const keyword of keywords) {
                const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
                if (this.includesWordSequence(cleanQuery, cleanKeyword)) {
                    return cat;
                }
            }
        }
        return null;
    }

    formatCategoryResponse(cat, projects) {
        if (!projects || !Array.isArray(projects)) return `No projects found in category "${cat}".`;
        const projectsInCat = projects.filter(p => p.category.toLowerCase() === cat.toLowerCase());
        const totalCount = projectsInCat.length;
        const sliced = projectsInCat.slice(0, 4);

        let response = `📊 **${cat} Projects** (${totalCount} total)\n\n`;
        sliced.forEach(p => {
            response += `• **${p.name}**\n  ${p.description.substring(0, 120)}...\n  🛠️ ${p.tech.join(' • ')}\n  🔗 ` + (p.link ? `[Live Demo](${p.link}) • ` : '') + `[GitHub Code](${p.github})\n\n`;
        });

        let pageLink = "#";
        if (cat === "Data Analytics") pageLink = "data-analytics-projects.html";
        else if (cat === "Machine Learning") pageLink = "machine-learning.html";
        else if (cat === "Deep Learning") pageLink = "deep-learning.html";
        else if (cat === "Python/OOP") pageLink = "python-projects.html";
        else if (cat === "FastAPI") pageLink = "fastapi.html";
        else if (cat === "Generative AI") pageLink = "generative-ai.html";
        else if (cat === "NLP") pageLink = "nlp.html";

        response += `Explore the full list on the [${cat} Projects page](${pageLink})!`;
        return response;
    }

    logUnansweredQuestion(question) {
        console.log(`Logging unanswered question: "${question}"`);
        
        // 1. Log to local storage
        try {
            const unmatched = JSON.parse(localStorage.getItem('unmatched_questions') || '[]');
            if (!unmatched.includes(question)) {
                unmatched.push(question);
                localStorage.setItem('unmatched_questions', JSON.stringify(unmatched));
            }
        } catch (e) {
            console.error('Failed to write to localStorage:', e);
        }

        // 2. Try to log to local backend if running
        fetch('/api/unanswered', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        }).catch(err => {
            console.log('Backend logging unavailable (expected on static host)');
        });
    }
}

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    const assistant = new CosmicAssistant();
    assistant.init();
});
