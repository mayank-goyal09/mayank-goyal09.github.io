import fs from 'fs';
import path from 'path';

function includesWordSequence(text, sequence) {
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

// Helper to simulate the exact query matching logic of chatbot.js
class ChatbotTester {
    constructor(portfolioData) {
        this.portfolioData = portfolioData;
        this.CONFIDENCE_THRESHOLD = 1;

        this.INTENT_KEYWORDS = {
            greetings: ["hello", "hi", "hey", "greet", "howdy", "whats up", "yo"],
            skills: ["skills", "skill", "technologies", "tech", "stack", "languages", "tools", "frameworks", "libraries", "capabilities", "expertise", "workbench", "pytorch", "tensorflow", "fastapi", "python", "sql", "pandas", "scikit-learn", "numpy", "power bi", "excel", "tableau"],
            projects: ["projects", "project", "built", "app", "apps", "dashboard", "dashboards", "system", "systems", "github", "portfolio"],
            experience: ["experience", "work", "job", "internship", "intern", "freelance", "spaceece", "kwerky", "media", "role", "position", "career", "professional", "company"],
            education: ["education", "degree", "qualification", "university", "college", "self-taught", "study", "studies", "btech", "b.tech", "school", "learn"],
            contact: ["contact", "email", "linkedin", "github", "twitter", "huggingface", "hugging face", "hf", "reach", "hire", "connect", "mail", "phone", "social", "socials", "message"],
            tips: ["tip", "tips", "advice", "learn", "study", "career advice", "how to"]
        };

        this.STRONG_KEYWORDS = ["skills", "experience", "education", "contact", "projects", "project", "email", "linkedin", "github", "huggingface", "hugging face"];

        this.CATEGORY_KEYWORDS = {
            "Data Analytics": ["data analytics", "data analytic", "analytics", "dashboard", "dashboards", "power bi", "excel", "tableau", "visualization"],
            "Machine Learning": ["machine learning", "ml projects", "ml project", "supervised", "unsupervised", "clustering", "classification", "regression", "scikit-learn", "scikit", "sklearn"],
            "Deep Learning": ["deep learning", "dl projects", "dl project", "neural network", "neural networks", "ann", "cnn", "lstm", "rnn", "gnn", "gcn", "transformer", "transformers", "pytorch", "tensorflow", "keras"],
            "FastAPI": ["fastapi", "fast api", "async api", "apis", "api", "mlops"],
            "Python/OOP": ["python projects", "python project", "python", "oop", "backend", "sqlite", "streamlit"],
            "Generative AI": ["generative ai", "genai", "gen ai", "rag", "agent", "agents", "vector db", "gemini", "llama", "mistral", "ollama"],
            "NLP": ["nlp", "natural language", "text analysis", "sentiment", "translation", "whisper", "speech"]
        };
    }

    findMatchingProject(query, projects) {
        if (!projects || !Array.isArray(projects)) return null;
        const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        for (const p of projects) {
            const coreName = p.name.split(/[-–—:(]/)[0].trim();
            const cleanCore = coreName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
            
            if (cleanCore.length >= 3 && includesWordSequence(cleanQuery, cleanCore)) {
                return p;
            }
        }
        return null;
    }

    findMatchingCategory(query) {
        const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        for (const [cat, keywords] of Object.entries(this.CATEGORY_KEYWORDS)) {
            for (const keyword of keywords) {
                const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
                if (includesWordSequence(cleanQuery, cleanKeyword)) {
                    return cat;
                }
            }
        }
        return null;
    }

    generateResponse(input) {
        const k = this.portfolioData;
        const q = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

        // 1. Check for specific project name matches
        const matchedProject = this.findMatchingProject(q, k.projects);
        if (matchedProject) {
            return `[Matched Project: ${matchedProject.name}]`;
        }

        // 2. Check for project category matches
        const matchedCategory = this.findMatchingCategory(q);
        if (matchedCategory) {
            return `[Matched Category: ${matchedCategory}]`;
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

        const words = q.split(/\s+/);

        for (const [intent, keywords] of Object.entries(this.INTENT_KEYWORDS)) {
            for (const keyword of keywords) {
                const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
                if (includesWordSequence(q, cleanKeyword)) {
                    const isStrong = this.STRONG_KEYWORDS.includes(keyword);
                    scores[intent] += isStrong ? 2 : 1;
                }
            }
        }

        let bestIntent = null;
        let maxScore = 0;
        for (const [intent, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                bestIntent = intent;
            }
        }

        if (maxScore >= this.CONFIDENCE_THRESHOLD && bestIntent) {
            return `[Matched Intent: ${bestIntent}]`;
        }

        return "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me.";
    }
}

// Load the JSON data
const dataPath = path.join(process.cwd(), 'data', 'portfolio.json');
const portfolioData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const tester = new ChatbotTester(portfolioData);

// Test cases
const testCases = [
    { input: "What projects have you built?", expected: "[Matched Intent: projects]" },
    { input: "What's your favorite pizza topping?", expected: "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me." },
    { input: "What is the capital of France?", expected: "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me." },
    { input: "Tell me about your React experience", expected: "[Matched Intent: experience]" }, 
    { input: "Can you write me a poem?", expected: "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me." },
    { input: "asdkjasjd", expected: "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me." },
    { input: "Tell me about SmartHarvest", expected: "[Matched Project: SmartHarvest – Crop Recommendation Engine]" },
    { input: "Show me FastAPI projects", expected: "[Matched Category: FastAPI]" },
    
    // Tricky / Borderline Inputs
    { input: "What's your capital city experience with APIs?", expected: "[Matched Category: FastAPI]" }, // Matches "experience" and "apis" (FastAPI keyword)
    { input: "React", expected: "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me." }, // Not a keyword, should fallback
    { input: "Tell me about your Reactt experience", expected: "[Matched Intent: experience]" }, // Matches "experience"
    { input: "WHAT PROJECTS?!", expected: "[Matched Intent: projects]" }, // Case/punctuation test
    { input: "tell me about smartharvest.", expected: "[Matched Project: SmartHarvest – Crop Recommendation Engine]" }, // Case/trailing punctuation test
    { input: "hi", expected: "[Matched Intent: greetings]" }, // Short greeting
    { input: "huggingface", expected: "[Matched Intent: contact]" }, // Hugging Face keyword
    { input: "", expected: "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me." } // Empty string
];

console.log("=== RUNNING CHATBOT SCOPE TESTS ===");
let allPassed = true;
testCases.forEach((tc, idx) => {
    const actual = tester.generateResponse(tc.input);
    const passed = actual.includes(tc.expected) || actual === tc.expected;
    console.log(`\nTest #${idx + 1}: "${tc.input}"`);
    console.log(`Expected: ${tc.expected}`);
    console.log(`Actual:   ${actual}`);
    console.log(`Status:   ${passed ? "🟢 PASSED" : "🔴 FAILED"}`);
    if (!passed) allPassed = false;
});

console.log("\n==================================");
console.log(allPassed ? "🎉 ALL TESTS PASSED SUCCESSFULLY!" : "❌ SOME TESTS FAILED.");
process.exit(allPassed ? 0 : 1);
