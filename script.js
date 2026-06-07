/* =================================================================
   🚀 MISSION CONTROL CONFIGURATION (Edit this JSON to change data)
   ================================================================= */
const portfolioConfig = {
  "typingEffect": {
    "roles": [
      "Data Analyst",
      "Data Scientist",
      "Machine Learning Engineer",
      "Deep Learning Engineer",
      "Natural Language Processing Egineer",
      "AI Master Enthusiast",
      "Market Researcher",
      "Prompt Engineer",
      "Python & OOP",
      "Dashboards & Reporting",
      "AI & Exploration"
    ],
    "speed": 80,
    "eraseSpeed": 40,
    "delay": 1400
  },
  "scrollReveal": {
    "threshold": 0.18
  },
  "aiAssistant": {
    "defaultGreeting": "Cosmic assistant online. How can I help you understand Mayank’s skills, projects, or contact options?",
    "quickPrompts": {
      "greeting": "hello",
      "skills": "What are Mayank's core skills?",
      "projects": "Tell me about Mayank's projects.",
      "contact": "How can I contact Mayank?",
      "random": "Give me a learning tip for data science."
    },
    "knowledgeBase": [
      {
        "keywords": ["hello", "hi", "hey"],
        "answer": "Hey, I’m the Cosmic Assistant on Mayank’s portfolio. Ask me about his skills, projects, or how to contact him."
      },
      {
        "keywords": ["skill", "stack", "tech"],
        "answer": "Mayank works across data analytics, machine learning, Python & OOP, SQL/databases, dashboards, AI experimentation, prompt engineering, and market research."
      },
      {
        "keywords": ["project", "work"],
        "answer": "Mayank’s featured work includes data analytics dashboards, Python/OOP backend systems, and machine learning apps. Use the Featured Showcase cards to open detailed project collections."
      },
      {
        "keywords": ["contact", "reach", "email", "linkedin"],
        "answer": "Best ways to reach Mayank: use the Open Channel contact form on this page or the Preferred Channels section with LinkedIn, GitHub, and X links."
      },
      {
        "keywords": ["mayank", "who are you"],
        "answer": "This assistant represents Mayank Goyal, a student-level data analyst and ML builder who prefers learning by shipping real projects and iterating from feedback."
      },
      {
        "keywords": ["tip", "learn", "study"],
        "answer": "Small, daily projects beat huge theoretical plans. Pick tiny data problems, commit them to GitHub, and improve one thing each iteration."
      }
    ],
    "fallbackAnswer": "I’m a local assistant focused on Mayank’s profile. Ask me things like “What skills does Mayank have?”, “What projects has he built?” or “How can I contact him?”."
  }
};


/* =================================================================
   ⚙️ SYSTEM LOGIC (Do not edit unless you are coding)
   ================================================================= */

// 1. Mobile Navigation
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

// 2. Scroll Reveal
const scrollElements = document.querySelectorAll(".animate-on-scroll");
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: portfolioConfig.scrollReveal.threshold });

scrollElements.forEach((el) => scrollObserver.observe(el));

// 3. Parallax Effect
const parallaxCards = document.querySelectorAll(".parallax-card");
parallaxCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// 4. Cosmic AI Assistant (Powered by JSON Config)
const aiOrb = document.getElementById("aiOrb");
const aiChatWindow = document.getElementById("aiChatWindow");
const aiCloseBtn = document.getElementById("aiCloseBtn");
const aiChatBody = document.getElementById("aiChatBody");
const aiInput = document.getElementById("aiInput");
const aiForm = document.getElementById("aiForm");
const quickButtons = document.querySelectorAll(".ai-quick-actions button");

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = `ai-msg ai-msg-${role}`;
  row.innerHTML = `<div class="ai-msg-bubble">${text}</div>`;
  aiChatBody.appendChild(row);
  aiChatBody.scrollTop = aiChatBody.scrollHeight;
}

function localBrain(prompt) {
  const t = prompt.toLowerCase();

  // Loop through JSON knowledge base
  const knowledge = portfolioConfig.aiAssistant.knowledgeBase;
  for (const entry of knowledge) {
    if (entry.keywords.some(keyword => t.includes(keyword))) {
      return entry.answer;
    }
  }
  return portfolioConfig.aiAssistant.fallbackAnswer;
}

function openAssistant() {
  if (!aiChatWindow) return;
  aiChatWindow.style.display = "flex";
  aiChatWindow.setAttribute("aria-hidden", "false");

  if (!aiChatBody.dataset.initialized) {
    addMessage("assistant", portfolioConfig.aiAssistant.defaultGreeting);
    aiChatBody.dataset.initialized = "true";
  }
  if (aiInput) aiInput.focus();
}

function closeAssistant() {
  if (!aiChatWindow) return;
  aiChatWindow.style.display = "none";
  aiChatWindow.setAttribute("aria-hidden", "true");
}

if (aiOrb) aiOrb.addEventListener("click", openAssistant);
if (aiCloseBtn) aiCloseBtn.addEventListener("click", closeAssistant);

quickButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const intent = btn.dataset.intent;
    const prompt = portfolioConfig.aiAssistant.quickPrompts[intent] || "hello";
    addMessage("user", prompt);
    setTimeout(() => {
      addMessage("assistant", localBrain(prompt));
    }, 400); // Small delay for realism
  });
});

if (aiForm && aiInput) {
  aiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = aiInput.value.trim();
    if (!text) return;
    addMessage("user", text);
    setTimeout(() => {
      addMessage("assistant", localBrain(text));
    }, 400);
    aiInput.value = "";
  });
}

// 5. Sound Control (Configured)
const audio = document.getElementById("space-audio");
const soundBtn = document.getElementById("sound-btn");
const soundIcon = document.getElementById("sound-icon");

if (audio && soundBtn) {
  audio.volume = 0.8;
  soundBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      soundBtn.classList.add("sound-active");
      soundBtn.style.borderColor = "#8c6eff";
    } else {
      audio.pause();
      soundBtn.classList.remove("sound-active");
      soundBtn.style.borderColor = "rgba(0, 234, 255, 0.3)";
    }
  });
}

// 6. Typing Effect (Powered by JSON Config)
(() => {
  const texts = portfolioConfig.typingEffect.roles;
  const typingEl = document.getElementById("typing-text");
  const cursorEl = document.querySelector(".command-text .cursor");

  if (!typingEl) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = texts[textIndex];

    if (cursorEl) {
      cursorEl.style.transform = isDeleting ? "translateY(4px) scaleX(-1)" : "translateY(4px) scaleX(1)";
    }

    if (!isDeleting) {
      typingEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, portfolioConfig.typingEffect.delay);
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }
    }
    setTimeout(type, isDeleting ? portfolioConfig.typingEffect.eraseSpeed : portfolioConfig.typingEffect.speed);
  }

  window.addEventListener("load", () => {
    if (cursorEl) cursorEl.classList.add("typing");
    setTimeout(type, 600);
  });
})();

