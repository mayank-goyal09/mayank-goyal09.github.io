/* =================================================================
   🚀 COSMIC ASSISTANT - ENHANCED CHATBOT FOR MAYANK GOYAL PORTFOLIO
   Features advanced glassmorphism, responsive curves, and custom logic.
   ================================================================= */

const portfolioKnowledge = {
    // ===== OWNER INFO =====
    owner: {
        name: "Mayank Goyal",
        title: "Data Analyst | ML Engineer | AI Enthusiast",
        email: "itsmaygal09@gmail.com",
        linkedin: "https://www.linkedin.com/in/mayank-goyal-4b8756363",
        github: "https://github.com/mayank-goyal09",
        twitter: "https://x.com/mem0ews",
        about: `I build software to solve specific, practical problems. No fluff, no corporate buzzwords—just clean layouts and tools designed to do exactly what they were built to do.

I don't care about surface-level professional titles. I prefer to let the work speak for itself, focusing my energy on functional categories like client-side architecture and building tangible systems from the ground up. If you want to know what I am capable of, look at the codebase, not a label.

I have a strong preference for local development and data privacy. Whenever possible, I choose to spin up lightweight local setups—like running Mistral via Ollama—to avoid unnecessary subscription costs and keep data completely secure and self-contained.

Clean folder structures and tight, modular layouts aren't an afterthought for me; they are foundational to a stable project. I spend the extra time making sure a repository is organized logically so it can be maintained, scaled, and understood immediately by other developers.

I build things that address real, day-to-day operational friction—whether that means connecting git commits to tracking tickets or automating messy proof-of-delivery paperwork for logistics. If a tool doesn't make a concrete process more efficient, it's just noise.

My approach is straightforward: clear goals, direct communication, and spending less time debating theories and more time handling edge cases. I don't treat system constraints or bugs like a crisis; they are just puzzles to be systematically broken down and cleared.

A portfolio shouldn't be an exercise in creative writing. Every project featured here was built to work reliably in the real world. If you appreciate straightforward engineering without the corporate theater, you'll navigate through my work just fine.`
    },

    // ===== EXPERIENCE =====
    experience: {
        role: "Data Analyst Intern",
        company: "SpaceECE, Pune",
        duration: "Jul 2025 - Oct 2025",
        description: "Successfully completed a Business Analysis internship focusing on data-driven dashboard creation. Recognized by leadership for diligence and inquisitive analytical approach.",
        projects: ["Umang & Udaan Dashboard", "Intern Exit Analysis", "Education & Test Analysis", "Process Optimization"]
    },

    // ===== SKILLS =====
    skills: [
        { name: "Local Intelligence & Language Models", desc: "Local RAG engine deployment, Mistral via Ollama pipelines, PyTorch, TensorFlow, MediaPipe, LSTM sequence modeling" },
        { name: "Data Architecture & Automation", desc: "Automated document ingestion, fuzzy matching, relational schemas, Spatio-Temporal Graph Neural Networks, 1D-CNN signal models, Pandas, Scikit-learn, Supabase, Advanced SQL" },
        { name: "Backends & Deployment Interfaces", desc: "High-performance asynchronous backends, real-time inference APIs, strict OOP patterns, modular structures, FastAPI, Streamlit, Git Architecture" }
    ],

    // ===== DATA ANALYTICS PROJECTS =====
    dataAnalyticsProjects: [
        {
            name: "Real-Time Safety Intelligence",
            spotlight: true,
            desc: "An advanced environmental defense system that ingests live weather API streams to calculate instantaneous safety risks. Transforms chaotic atmospheric data into actionable 'Go/No-Go' safety protocols for field operations.",
            tech: ["OpenWeather API", "Python", "Real-time Dashboard"],
            stats: "Live monitoring, ~25ms latency, 6 risk types analyzed",
            github: "https://github.com/mayank-goyal09/environmental-safety-dashboard"
        },
        {
            name: "Marketing Analytics Dashboard",
            desc: "Comprehensive Power BI marketing performance dashboard tracking campaign ROI and customer engagement with real-time data refresh.",
            tech: ["Power BI", "Marketing KPIs"],
            stats: "10+ KPIs tracked, Real-time data refresh",
            github: "https://github.com/mayank-goyal09/Marketing-PowerBI-Dashboard"
        },
        {
            name: "E-commerce Revenue Intelligence",
            desc: "Deep-dive analysis on Target's e-commerce sales patterns and customer behavior using Python and SQL.",
            tech: ["Python", "SQL", "Pandas"],
            stats: "100K+ records analyzed, 15+ key insights extracted",
            github: "https://github.com/mayank-goyal09/target-ecommerce-sales-analysis"
        },
        {
            name: "Aviation Operations Analytics",
            desc: "Interactive Excel dashboard analyzing 1,701 flight records for delay patterns and trends spanning 5 years of historical data.",
            tech: ["Excel", "Data Visualization"],
            stats: "1.7K flights analyzed, 5 years of historical data",
            github: "https://github.com/mayank-goyal09/flight-delay-analysis-dashboard"
        },
        {
            name: "Workforce Intelligence Dashboard",
            desc: "Strategic HR dashboard monitoring 2,458+ employees across demographics and performance with 8+ department coverage.",
            tech: ["Excel", "HR Analytics"],
            stats: "2.5K+ employees tracked, 8+ departments",
            github: "https://github.com/mayank-goyal09/hr-analytics-dashboard"
        },
        {
            name: "Olympic Performance Analytics",
            desc: "Analyzed 32 years of Olympic data (200+ countries) to reveal athletic dominance patterns using Python and Pandas.",
            tech: ["Python", "Pandas", "Data Visualization"],
            stats: "32 years data coverage, 200+ countries",
            github: "https://github.com/mayank-goyal09/olympic-legacy-1976-2008"
        },
        {
            name: "Pizza Sales SQL Analysis",
            desc: "SQL analysis extracting revenue trends and customer ordering patterns with 20+ complex SQL queries.",
            tech: ["SQL", "Revenue Analysis"],
            stats: "1000+ transactions, 20+ SQL queries",
            github: "https://github.com/mayank-goyal09/pizza-sales-sql-analysis"
        },
        {
            name: "Query Optimization & Data Manipulation",
            desc: "Comprehensive notebook demonstrating advanced SQL optimization, indexing, and Python data manipulation techniques.",
            tech: ["Python", "SQL", "Query Optimization"],
            stats: "50+ code examples, 10+ topics covered",
            github: "https://github.com/mayank-goyal09/python-SQL-notebook"
        },
        {
            name: "Titanic Survival Analytics",
            desc: "Interactive Excel dashboard analyzing 891 Titanic passengers to predict survival outcomes with 8+ predictive factors.",
            tech: ["Excel", "Predictive Analytics"],
            stats: "891 passengers analyzed, 8+ predictive factors",
            github: "https://github.com/mayank-goyal09/titanic-survival-dashboard"
        },
        {
            name: "IPL Cricket Analytics",
            desc: "Power BI dashboard tracking team performance and cricket statistics across 15+ IPL seasons with 50+ metrics.",
            tech: ["Power BI", "Sports Analytics"],
            stats: "15+ seasons covered, 50+ metrics tracked",
            github: "https://github.com/mayank-goyal09/IPL-PowerBI-Dashboard"
        },
        {
            name: "AI-ML-Job-Pulse",
            desc: "Data Analysis project exploring AI/ML job trends, skill demand, salary patterns, and market insights.",
            tech: ["Python", "Pandas", "Data Analysis"],
            stats: "100+ job listings, 15+ skills analyzed",
            github: "https://github.com/mayank-goyal09/AI-ML-Job-Pulse"
        },
        {
            name: "Performance Predictors EDA",
            desc: "Exploratory Data Analysis on Student Performance Dataset uncovering key factors influencing academic outcomes.",
            tech: ["Python", "EDA", "Pandas", "NumPy"],
            stats: "17 Q&A analysis, 10+ insights found",
            github: "https://github.com/mayank-goyal09/performance-predictors-eda"
        }
    ],

    // ===== MACHINE LEARNING PROJECTS =====
    machineLearningProjects: [
        // SUPERVISED LEARNING
        {
            name: "SmartHarvest – Crop Recommendation Engine",
            type: "Supervised - Classification",
            desc: "End-to-end ML system recommending the most suitable crop using soil nutrients (NPK), climate, and soil properties. Achieves ~95% accuracy with Random Forest.",
            tech: ["Python", "Scikit-learn", "Streamlit", "Random Forest"],
            stats: "~95% accuracy with feature-engineered agronomic variables",
            liveApp: "https://smartharvest-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/SmartHarvest"
        },
        {
            name: "Mr. Cardio Disease Astrologer",
            type: "Supervised - Classification",
            desc: "KNN-based heart disease prediction using indicators like cholesterol, blood pressure and heart rate with interactive risk estimation UI.",
            tech: ["Python", "Scikit-learn", "KNN", "Streamlit"],
            stats: "Interactive healthcare UI for risk estimation",
            liveApp: "https://mr-cardio-disease-astrologer-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/Mr.-cardio-disease-astrologer"
        },
        {
            name: "Lending Logic – Loan Approval System",
            type: "Supervised - Classification",
            desc: "Gaussian Naïve Bayes model predicting loan approval probability using engineered financial features with ~92% accuracy.",
            tech: ["Python", "Scikit-learn", "Naïve Bayes", "Streamlit"],
            stats: "~92% accuracy with focus on reducing false positives",
            liveApp: "https://lending-logic-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/lending-logic"
        },
        {
            name: "CardioPredict – SVM Heart Risk Model",
            type: "Supervised - Classification",
            desc: "Support Vector Machine model predicting heart disease risk from clinical features, tuned for medical risk prediction.",
            tech: ["Python", "Scikit-learn", "SVM", "Streamlit"],
            stats: "Margin-based classifier optimized for healthcare",
            liveApp: "https://cardiopredict-svm-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/CardioPredict-SVM"
        },
        {
            name: "Mobile Market Segmenter",
            type: "Supervised - Classification",
            desc: "KNN classification model grouping mobile users into market segments based on usage behavior and demographic patterns.",
            tech: ["Python", "Scikit-learn", "KNN", "Streamlit"],
            stats: "Simple, interpretable classification segmentation",
            liveApp: "https://mobile-market-segmenter-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/mobile-market-segmenter"
        },
        {
            name: "Personality Type Predictor",
            type: "Supervised - Classification",
            desc: "Logistic Regression model mapping behavioral traits to personality categories with clean feature pipeline for survey-style inputs.",
            tech: ["Python", "Scikit-learn", "Pandas", "Streamlit"],
            stats: "Clean survey feature pipeline, real-time predictions",
            liveApp: "https://personality-type-predictor-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/personality-type-predictor"
        },
        {
            name: "Ride Price Predictor",
            type: "Supervised - Regression",
            desc: "Linear Regression estimator predicting ride fares based on distance, duration, time of day, and ride type.",
            tech: ["Python", "Scikit-learn", "Pandas", "Streamlit"],
            stats: "Baseline pricing model for ride-hailing apps",
            liveApp: "https://ride-price-predictor-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/ride-price-predictor"
        },
        {
            name: "Experience to Earnings",
            type: "Supervised - Regression",
            desc: "KNN regression model predicting salary from years of experience, capturing non-linear salary curves.",
            tech: ["Python", "Scikit-learn", "Streamlit"],
            stats: "Non-linear salary curve capturing, neighbor-based regression",
            liveApp: "https://experience-to-earnings-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/experience-to-earnings"
        },
        {
            name: "Student Performance Analyzer",
            type: "Supervised - Regression",
            desc: "End-to-end ML regression model predicting student exam scores with hyperparameter tuning, feature engineering, and feature importance analysis.",
            tech: ["Python", "Scikit-learn", "Streamlit", "Pandas"],
            stats: "MAE: 6.89, RMSE%: ~17.44%, feature importance analysis",
            liveApp: "https://student-performance-analyzer-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/student-performance-analyzer"
        },
        {
            name: "PERSONA PULSE – MBTI Personality Classification",
            type: "Supervised - Classification",
            desc: "End-to-end ML pipeline for MBTI personality type classification using questionnaire data with leakage-safe pipeline and full model interpretability.",
            tech: ["Python", "Scikit-learn", "Pandas", "Streamlit"],
            stats: "Logistic Regression (~0.92 F1), real-time predictions",
            liveApp: "https://persona-pulse-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/PERSONA-PULSE"
        },
        {
            name: "Used Car Price Predictor",
            type: "Supervised - Regression",
            desc: "Random Forest Regressor predicting fair selling prices of used cars from 45K+ CarDekho listings with R² ≈ 0.92.",
            tech: ["Python", "Scikit-learn", "Random Forest", "Streamlit"],
            stats: "R² ≈ 0.92, 45K+ listings analyzed",
            liveApp: "https://used-car-price-modeling-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/used-car-price-modeling"
        },
        {
            name: "Cardiovascular Health Risk Assessment",
            type: "Supervised - Classification",
            desc: "Interpretable ML system using a Decision Tree Classifier on 70K+ patient records to predict cardiovascular disease risk from vitals, lab values, and lifestyle factors.",
            tech: ["Python", "Scikit-learn", "Streamlit", "Pandas", "Plotly", "Joblib"],
            stats: "Analyzed 70K+ records, BMI & age feature engineering",
            liveApp: "https://healthrisk-decision-tree-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/healthrisk-decision-tree"
        },
        {
            name: "Delivery Oracle – E-commerce Intelligence",
            type: "Supervised - Regression & Classification",
            desc: "End-to-end delivery intelligence system using Olist dataset with Ridge regression for ETA and Logistic Regression for late-delivery risk.",
            tech: ["Python", "Scikit-learn", "Ridge", "Streamlit"],
            stats: "Multi-model delivery prediction system",
            liveApp: "https://delivery-oracle-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/delivery-oracle"
        },
        {
            name: "Medicine Recommendation System",
            type: "Supervised - Classification",
            desc: "AI-powered diagnostic tool using Decision Tree to predict diseases from symptoms and provide personalized recommendations.",
            tech: ["Python", "Scikit-learn", "Decision Tree", "Streamlit"],
            stats: "Symptom-based disease prediction with medication recommendations",
            liveApp: "https://medicine-recommendation-system-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/medicine-recommendation-system"
        },
        {
            name: "ATP Tennis Match Outcome Classifier",
            type: "Supervised - Classification",
            desc: "ML-powered sports analytics using Random Forest to predict ATP tennis match winners across 59K+ matches with 99.5% accuracy.",
            tech: ["Python", "Scikit-learn", "Random Forest", "Streamlit"],
            stats: "99.5% accuracy, 20 years of ATP history (2000-2019)",
            liveApp: "https://atp-tennis-match-outcome-classifier-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/ATP-Tennis-Match-Outcome-Classifier"
        },
        {
            name: "OHLCV Next-Day Close Predictor",
            type: "Supervised - Regression",
            desc: "Time-series ML mini product predicting next-day stock closing prices using OHLCV features, Decision Tree Regression, and a naive tomorrow ≈ today baseline comparison.",
            tech: ["Python", "Scikit-learn", "Streamlit", "Pandas", "Plotly", "yfinance", "Joblib"],
            stats: "GridSearchCV with TimeSeriesSplit, real-time yfinance fetch",
            liveApp: "https://ohlcv-nextday-close-predictor-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/ohlcv-nextday-close-predictor"
        },
        {
            name: "PJM Energy Demand Forecaster",
            type: "Supervised - Regression",
            desc: "End-to-end ML system predicting hourly electricity demand using 10+ years of PJM load data with Random Forest (R² ≈ 0.95).",
            tech: ["Python", "Scikit-learn", "Random Forest", "Streamlit"],
            stats: "MAE ≈ 500 MW, RMSE ≈ 700 MW, R² ≈ 0.95",
            liveApp: "https://pjm-energy-demand-forecaster-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/PJM-Energy-Demand-Forecaster"
        },
        {
            name: "VociPark – Parkinson's Disease Detection",
            type: "Supervised - Classification",
            desc: "End-to-end Parkinson's detection from voice data using SVM classifier optimized via GridSearchCV with ~82% test accuracy.",
            tech: ["Python", "Scikit-learn", "SVM", "Streamlit"],
            stats: "~82% test accuracy, ~0.80 balanced accuracy",
            liveApp: "https://vocipark-parkinson-s-detection-from-voice-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/VociPark-Parkinson-s-Detection-from-Voice"
        },
        // UNSUPERVISED LEARNING
        {
            name: "Vineyard Voyager – Wine Classification",
            type: "Unsupervised - Clustering",
            desc: "K-Means clustering identifying wine quality tiers from chemical properties without labels, optimized via silhouette scores.",
            tech: ["Python", "Scikit-learn", "Pandas"],
            stats: "3 distinct clusters, silhouette optimization",
            github: "https://github.com/mayank-goyal09/vineyard-voyager"
        },
        {
            name: "Retail Radar – Customer Segmentation",
            type: "Unsupervised - Clustering",
            desc: "Hierarchical clustering grouping customers into natural purchase behavior segments with dendrogram-based optimal cluster detection.",
            tech: ["Python", "Scikit-learn", "Dendrogram"],
            stats: "Dendrogram-based optimal cluster detection",
            github: "https://github.com/mayank-goyal09/retail-radar-engine"
        },
        {
            name: "Geo-Pulse – Smart City Traffic Intelligence",
            type: "Unsupervised - Clustering",
            desc: "Production-ready geospatial ML system identifying traffic accident hotspots using DBSCAN clustering on 3M+ US accident records.",
            tech: ["Python", "Scikit-learn", "DBSCAN", "Pydeck", "Streamlit"],
            stats: "3M+ records, 87 hotspot clusters in LA, 3km optimal radius",
            liveApp: "https://geo-pulse-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/Geo-Pulse"
        },
        {
            name: "Developer Persona Segmentation",
            type: "Unsupervised - Clustering",
            desc: "ML-powered developer persona segmentation using MiniBatch K-Means on Stack Overflow 2025 survey (~42K developers).",
            tech: ["Python", "Scikit-learn", "K-Means", "Streamlit"],
            stats: "3 personas: Modern Web Builders (45%), Generalists (35%), Veterans (20%)",
            liveApp: "https://developer-persona-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/Developer-persona"
        },
        {
            name: "PCA Sommelier – Wine Intelligence Studio",
            type: "Unsupervised - Dimensionality Reduction",
            desc: "Portfolio-ready PCA wine analysis lab that reduces high-dimensional wine chemistry into 2-3 principal components.",
            tech: ["Python", "Scikit-learn", "PCA", "Streamlit"],
            stats: "Interactive PCA pipeline with explained variance analysis",
            liveApp: "https://pca-sommelier-project.streamlit.app",
            github: "https://github.com/mayank-goyal09/pca-prism"
        }
    ],

    // ===== PYTHON/OOP PROJECTS =====
    pythonProjects: [
        {
            name: "YouTube Studio Automation",
            flagship: true,
            desc: "An enterprise-grade data pipeline that interfaces with the YouTube Data API to mirror raw metrics into a local SQLite Data Warehouse, enabling granular SQL-driven insights.",
            tech: ["Python Automation", "YouTube Data API", "SQLite", "ETL Pipeline", "Streamlit"],
            features: ["Automated Data Ingestion Loop", "Raw SQL Access to Analytics", "Custom Metric Engineering", "Zero-Dependency Architecture"],
            liveApp: "https://youtube-dashboard-appql-w6tacoledpx4fgpmkdtth4.streamlit.app/",
            github: "https://github.com/mayank-goyal09/YouTube-Studio"
        },
        {
            name: "LedgerAPI",
            desc: "Enterprise Bank Management System with production-ready backend architecture featuring account management, transaction processing, and audit trails.",
            tech: ["Python OOP", "SQLite", "Backend"],
            features: ["Account Management", "Transaction Processing", "Audit Trails", "Inter-transfers"],
            github: "https://github.com/mayank-goyal09/LedgerAPI"
        },
        {
            name: "Smart Inventory Billing System",
            desc: "Complete inventory and billing solution for retail management with stock management and multi-payment support.",
            tech: ["Streamlit", "SQLite", "OOP"],
            features: ["Stock Management", "Billing System", "Multi-payment", "Dashboard"],
            github: "https://github.com/mayank-goyal09/smart-inventory-billing-system"
        },
        {
            name: "Maygal Book Vault",
            desc: "Digital library management system with advanced book tracking, member management, and fine calculation.",
            tech: ["Streamlit", "Python OOP", "SQLite"],
            features: ["Book Cataloging", "Member Management", "Issue/Return", "Fine Calculation"],
            github: "https://github.com/mayank-goyal09/Maygal-book-vault"
        },
        {
            name: "The File Forge",
            desc: "Advanced file management system with batch processing capabilities and auto organization.",
            tech: ["Streamlit", "File Handling", "Python"],
            features: ["File Operations", "Batch Processing", "Format Conversion", "Auto Organization"],
            github: "https://github.com/mayank-goyal09/the-file-forge"
        },
        {
            name: "Bank Management System",
            desc: "User-friendly bank account system with Streamlit frontend, transaction history, balance inquiry, and simple data persistence.",
            tech: ["Streamlit", "Python OOP", "Data Persistence"],
            features: ["Account Creation", "Deposits/Withdrawals", "Balance Inquiry", "Transaction Log"],
            github: "https://github.com/mayank-goyal09/bank-management-system"
        },
        {
            name: "RPS R.A.N.D.O.M",
            desc: "Intelligent CLI-based Rock-Paper-Scissors game featuring best-of-N series, score tracking, move validation, and match history.",
            tech: ["Python Game", "AI Logic", "CLI"],
            features: ["Best-of-N Series", "Score Tracking", "Move Validation", "Match History"],
            github: "https://github.com/mayank-goyal09/rps-random"
        },
        {
            name: "Gridlock Game",
            desc: "NumPy-powered Tic-Tac-Toe with web interface demonstrating array manipulation and Python game logic.",
            tech: ["NumPy", "Streamlit", "Game Logic"],
            features: ["NumPy Arrays", "Win Detection", "Interactive UI", "Game State"],
            liveApp: "https://gridlock-game-bdoqnt2uavckvypewafl8g.streamlit.app/",
            github: "https://github.com/mayank-goyal09/Gridlock-Game"
        }
    ],

    // ===== DEEP LEARNING PROJECTS =====
    deepLearningProjects: [
        {
            name: "Smart Price Predictor – Smartphone Pricing",
            type: "ANN",
            desc: "AI-powered Multi-Layer Perceptron classifying smartphones into 4 price categories based on 20+ hardware specs with premium dark glassmorphism UI.",
            tech: ["Python", "TensorFlow/Keras", "Streamlit"],
            stats: "4-Class Classification, 20+ hardware features, Real-time confidence scores",
            liveApp: "https://ram-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/ram-battery-camera-to--"
        },
        {
            name: "Student Performance Predictor (ANN)",
            type: "ANN",
            desc: "Robust ANN regression system predicting student final grades using UCI dataset, analyzing demographic, social & study factors.",
            tech: ["Python", "TensorFlow/Keras", "Scikit-learn", "Streamlit"],
            stats: "End-to-end pipeline with Dropout & Early Stopping",
            liveApp: "https://student-performance-ann-regreappr-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/student-performance-ann-regressor"
        },
        {
            name: "ASL Digits Recognizer",
            type: "CNN",
            desc: "Custom 3-layer CNN achieving ~96% accuracy on ASL digits (0-9) with dual deployment — Streamlit web app + OpenCV real-time webcam inference.",
            tech: ["Python", "TensorFlow/Keras", "OpenCV", "Streamlit"],
            stats: "~96% accuracy, 3 Conv2D-MaxPool blocks, Webcam ROI Cropping",
            liveApp: "https://asl-digit-recognition-cnn-opencv-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/asl-digit-recognition-cnn-opencv"
        },
        {
            name: "Brand Spotter — Logo Detection",
            type: "CNN",
            desc: "Advanced CNN-based logo detection and brand recognition system powered by transfer learning to identify and classify company logos in images.",
            tech: ["Python", "TensorFlow/Keras", "OpenCV", "Deep Learning"],
            stats: "Multi-brand detection, real-time recognition, transfer learning",
            liveApp: "https://brand-spotter-projecttt.streamlit.app/",
            github: "https://github.com/mayank-goyal09/Brand-Spotter.git"
        },
        {
            name: "NoiseNinja — Acoustic Anomaly Detector",
            type: "CNN",
            desc: "Unsupervised CNN Autoencoder trained on healthy machine sounds to detect acoustic anomalies in real-time streams via MSE reconstruction loss.",
            tech: ["Python", "TensorFlow/Keras", "Flask", "Librosa", "Chart.js"],
            stats: "Unsupervised Autoencoder, Mel-spectrogram dashboard, mic streaming",
            liveApp: "https://mayank-goyal09.github.io/NoiseNinja/templates/index.html",
            github: "https://github.com/mayank-goyal09/NoiseNinja"
        },
        {
            name: "Pulse Nova 1D",
            type: "1D-CNN",
            desc: "AI-powered detection of life-threatening heart rhythm abnormalities from raw ECG signals using a deep 1D Convolutional Neural Network.",
            tech: ["Python", "TensorFlow/Keras", "Streamlit", "Docker"],
            stats: "MIT-BIH Arrhythmia Dataset, 96.48% accuracy, Z-score normalization",
            liveApp: "https://pulse-nova-1d-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/Pulse-Nova-1D"
        },
        {
            name: "FaunaFind — Autonomous Biodiversity Monitor",
            type: "CNN/YOLO",
            desc: "Production-grade, local-first ML pipeline designed to automate wildlife population tracking using YOLOv8 edge inference.",
            tech: ["Python", "YOLOv8", "OpenCV", "Pandas", "Streamlit"],
            stats: "YOLOv8 edge inference, quality-control filters, async data logging",
            liveApp: "https://faunafind-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/faunafind"
        },
        {
            name: "WeatherLens AI — Multi-City LSTM Forecasting",
            type: "RNN/LSTM",
            desc: "End-to-end deep learning weather forecasting system using LSTM networks to predict 7-day (168 hours) temperature across 4 major global cities.",
            tech: ["Python", "TensorFlow/Keras", "Open-Meteo API", "Streamlit"],
            stats: "Multi-step LSTM, 4-city coverage, Beats baseline",
            liveApp: "https://multi-city-lstm-weather-forecast-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/multi-city-lstm-weather-forecast"
        },
        {
            name: "Gold Price Oracle — AI Prediction",
            type: "RNN/LSTM",
            desc: "Self-updating LSTM prediction engine forecasting gold prices with live market data and autonomous retraining pipelines.",
            tech: ["Python", "TensorFlow/Keras", "Streamlit", "GitHub Actions"],
            stats: "Autonomous self-retraining via GitHub Actions, live market feed",
            liveApp: "https://timeseries-au-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/TimeSeries-Au"
        },
        {
            name: "Deep Crop Yield Forecaster",
            type: "RNN/LSTM",
            desc: "Advanced Stacked LSTM deep learning forecaster predicting agricultural crop yields using historical time series and environmental variables.",
            tech: ["Python", "TensorFlow/Keras", "Pandas", "Geopandas"],
            stats: "Stacked LSTM architecture, time-series forecasting, NDVI integration",
            liveApp: "https://deep-crop-yield-forecaster-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/Deep-Crop-Yield-Forecaster.git"
        },
        {
            name: "SignSense-LSTM",
            type: "RNN/LSTM",
            desc: "Real-time sign language translation system analyzing 30 consecutive frames of hand motion using MediaPipe 3D Landmarks and LSTM.",
            tech: ["Python", "TensorFlow/Keras", "OpenCV", "MediaPipe", "Streamlit"],
            stats: "Temporal sequence buffer, live confidence indicators",
            liveApp: "https://signsense-lstm-project.streamlit.app/",
            github: "https://github.com/mayank-goyal09/SignSense-LSTM"
        },
        {
            name: "AegisGNN",
            type: "GNN/GCN",
            desc: "Deep learning financial fraud detection system leveraging Graph Convolutional Networks (GCN) to scan transaction logs and identify high-risk networks.",
            tech: ["PyTorch Geometric", "Flask", "Vis.js", "Chart.js", "Python"],
            stats: "Heterogeneous transactions modeled as graphs, 2-layer GCNConv",
            github: "https://github.com/mayank-goyal09/financial-fraud-gnn"
        },
        {
            name: "CityPulse AI",
            type: "GNN/ST-GCN",
            desc: "Sophisticated real-time traffic forecasting system leveraging Spatio-Temporal Graph Neural Networks (ST-GCN) to predict city-wide congestion.",
            tech: ["PyTorch", "FastAPI", "Streamlit", "Python"],
            stats: "ST-GCN road graphs, spatial ripples + temporal convolutions",
            github: "https://github.com/mayank-goyal09/GraphTraffic-Net.git"
        },
        {
            name: "Emotion Pro Analytics",
            type: "Transformer",
            desc: "High-accuracy sentiment engine fine-tuning pre-trained DistilBERT on Google's GoEmotions dataset with operational safety gates.",
            tech: ["Python", "PyTorch", "Hugging Face", "Streamlit", "Plotly"],
            stats: "DistilBERT classifier, GoEmotions dataset, 60% confidence gate",
            github: "https://github.com/mayank-goyal09/nuance-flow"
        }
    ],

    // ===== FASTAPI PROJECTS =====
    fastapiProjects: [
        {
            name: "MovieFlix AI",
            desc: "Netflix-style movie recommendation engine powered by TF-IDF Natural Language Processing, serving real-time personalized picks from 45K+ movies.",
            tech: ["FastAPI", "TF-IDF", "TMDB API", "Streamlit", "Python"],
            stats: "45K+ movies, TF-IDF NLP model, real-time cosine similarity search",
            liveApp: "https://movieflix-rec.streamlit.app",
            github: "https://github.com/mayank-goyal09/movieflix-rec"
        },
        {
            name: "CureLoop MLOps",
            desc: "Automated disease prediction system transforming static notebooks into a production-ready API with full CI/CD MLOps pipeline and continuous training.",
            tech: ["FastAPI", "Scikit-learn", "Docker", "Pytest", "HF Spaces"],
            stats: "GitHub Actions CI/CD, Dockerized deployment on HF Spaces, continual training trigger",
            liveApp: "https://mayankg09-cureloop-mlops.hf.space/docs",
            github: "https://github.com/mayank-goyal09/CureLoop-MLOps"
        },
        {
            name: "RedGlyph AI",
            desc: "AI-powered code reviewer using Google Gemini 2.5 Flash via LangGraph. Quality scores, severity-based issues, fix suggestions & session email reports.",
            tech: ["FastAPI", "Gemini", "LangGraph", "Docker"],
            stats: "Gemini 2.5 Flash, LangGraph multi-agent flow, Dockerized CI/CD",
            liveApp: "https://mayankg09-redglyph.hf.space/app",
            github: "https://github.com/mayank-goyal09/RedGlyph"
        },
        {
            name: "DocIntel RAG",
            desc: "Private RAG system bridging static local documentation with Mistral-7B/Llama-3 LLMs. Uses FAISS-powered vector DB for zero-leak, secure local data querying.",
            tech: ["FastAPI", "FAISS", "LangChain", "Mistral-7B"],
            stats: "Private RAG, FAISS Vector DB, Mistral/Llama local processing",
            liveApp: "https://mayankg09-docintel.hf.space/",
            github: "https://github.com/mayank-goyal09/DocIntel"
        },
        {
            name: "CityPulse AI",
            desc: "Sophisticated real-time traffic forecasting system leveraging Spatio-Temporal Graph Neural Networks (ST-GCN) to predict city-wide congestion ripples.",
            tech: ["FastAPI", "PyTorch", "ST-GCN", "Python"],
            stats: "ST-GCN road graphs, spatial ripples + temporal convolutions",
            liveApp: "https://mayankg09-gnn-traffic-forcaster.hf.space/",
            github: "https://github.com/mayank-goyal09/GraphTraffic-Net"
        },
        {
            name: "LoreWeaver AI",
            desc: "Multimodal AI story generator synthesizing rich prose instantly. Decouples local computations using Qwen-72B & Gemini-3.0 cloud fallbacks for low-compute real-time scripts and Edge Neural vocal acting.",
            tech: ["Gradio", "Gemini", "Edge TTS", "Pydub"],
            stats: "Qwen-72B & Gemini fallbacks, Edge TTS vocal acting",
            liveApp: "https://mayankg09-voice-story-engine.hf.space/",
            github: "https://github.com/mayank-goyal09/ScriptToSpeech-AI"
        },
        {
            name: "ArchitectAI",
            desc: "Advanced image-to-image virtual staging app using Hugging Face's serverless backend and Qwen-Image-Edit-2511. Automatically refurnishes empty spaces with smart scaling.",
            tech: ["Gradio", "Pydantic", "HF Inference Client"],
            stats: "Image-to-image virtual staging, Qwen-Image-Edit-2511 model",
            liveApp: "https://mayankg09-architectai-virtual-staging.hf.space/",
            github: "https://github.com/mayank-goyal09/ArchitectAI-Virtual-Staging"
        },
        {
            name: "AegisGNN",
            desc: "Deep learning financial fraud detection system leveraging Graph Convolutional Networks (GCN) to scan transaction logs and identify high-risk networks.",
            tech: ["Flask", "PyTorch Geometric", "Vis.js", "Chart.js"],
            stats: "Heterogeneous transactions modeled as graphs, 2-layer GCNConv",
            liveApp: "https://mayankg09-aegis-gnn-fraud.hf.space/",
            github: "https://github.com/mayank-goyal09/financial-fraud-gnn"
        }
    ],

    // ===== GENERATIVE AI PROJECTS =====
    generativeAiProjects: [
        {
            name: "DocIntel — Private RAG Base",
            desc: "Private-First RAG system bridging static local documentation with Mistral-7B/Llama-3 LLMs. Uses FAISS-powered vector DB for zero-leak, secure local data querying.",
            tech: ["HTML/CSS/JS", "Python", "FAISS", "Groq API"],
            stats: "Private RAG, FAISS Vector DB, Mistral/Llama local processing",
            github: "https://github.com/mayank-goyal09/DocIntel.git"
        },
        {
            name: "LegalGuard AI — Risk Analyzer",
            desc: "NDA risk analyzer integrating 150+ regex patterns across 12 legal categories with Google Flan-T5 AI summarization. Red-team tested.",
            tech: ["Python", "Streamlit", "HuggingFace", "Flan-T5", "Regex Engine"],
            stats: "Dual-engine (regex + Flan-T5), red-team tested",
            github: "https://github.com/mayank-goyal09/LegalGuard-AI"
        },
        {
            name: "AutoDoc-Generator",
            desc: "High-impact developer tool that programmatically identifies, summarizes, and injects docstrings into your Python code using CodeGPT/CodeT5 AI models and AST parsing.",
            tech: ["Python", "AST Parsing", "GitHub Actions", "AI Transformers"],
            stats: "AST parser, CodeT5 docstring generator, CI/CD automated flow",
            github: "https://github.com/mayank-goyal09/Autodoc-generator"
        },
        {
            name: "LoreWeaver-AI — Voice Story Engine",
            desc: "Multimodal AI story generator synthesizing rich prose instantly. Decouples local computations using Qwen-72B & Gemini-3.0 cloud fallbacks for low-compute real-time scripts and Edge Neural vocal acting.",
            tech: ["Python", "Gemini 3.0", "Edge TTS", "Gradio", "Pydub"],
            stats: "Qwen-72B & Gemini 3.0 cloud fallbacks, Edge TTS vocal acting",
            github: "https://github.com/mayank-goyal09/ScriptToSpeech-AI.git"
        },
        {
            name: "ArchitectAI — Virtual Staging",
            desc: "Advanced image-to-image virtual staging app using Hugging Face's serverless backend and Qwen-Image-Edit-2511. Automatically refurnishes empty spaces with smart scaling.",
            tech: ["Python", "Gradio", "Pydantic", "HF Inference Client"],
            stats: "Image-to-image virtual staging, Qwen-Image-Edit-2511 model",
            github: "https://github.com/mayank-goyal09/ArchitectAI-Virtual-Staging"
        },
        {
            name: "Echoes of History — Historical Museum",
            desc: "Vintage roleplay museum summoning historical figures from FAISS vector stores. Enforces era-specific boundaries via Llama-3, memory windows, and a custom Streamlit parchment UI.",
            tech: ["Python", "LangChain", "FAISS", "ChatGroq", "Streamlit"],
            stats: "Roleplay historical chat, FAISS semantic search, Llama-3 boundaries",
            github: "https://github.com/mayank-goyal09/echoes-of-history"
        },
        {
            name: "AI Discord Assistant",
            desc: "Multi-modal Discord bot — text chat, image generation, audio transcription & vision AI. Powered by Ollama with Mistral, Stable Diffusion & Faster-Whisper running 100% locally.",
            tech: ["Python", "FastAPI", "Ollama", "Stable Diffusion", "Whisper"],
            stats: "100% local processing, multi-modal features, stable diffusion image generation",
            github: "https://github.com/mayank-goyal09/ai-discord-assistant"
        },
        {
            name: "AI News Curator",
            desc: "Autonomous pipeline: RSS ingestion → LLM curation via Ollama → voice digest with TTS → formatted HTML email briefings. 5 categories, zero human input.",
            tech: ["Python", "Ollama", "RSS", "pyttsx3", "SMTP"],
            stats: "RSS feed auto-ingestion, Ollama content curation, email/TTS dispatch",
            github: "https://github.com/mayank-goyal09/news-curator"
        },
        {
            name: "RedGlyph — AI Code Reviewer",
            desc: "AI-powered code reviewer using Google Gemini 2.5 Flash via LangGraph. Quality scores, severity-based issues, fix suggestions & session email reports.",
            tech: ["Python", "FastAPI", "Gemini", "LangGraph", "Docker"],
            stats: "Gemini 2.5 Flash, LangGraph multi-agent flow, Dockerized CI/CD",
            github: "https://github.com/mayank-goyal09/RedGlyph"
        },
        {
            name: "PatternPunk-AI",
            desc: "Seamless fabric texture generator using Neural Circular Padding to eliminate seams, combined with Real-ESRGAN for 4K manufacturing-ready upscaling.",
            tech: ["Python", "Stable Diffusion", "Real-ESRGAN", "AI Graphics"],
            stats: "Neural Circular Padding (seamless), Real-ESRGAN 4K upscaling",
            github: "https://github.com/mayank-goyal09/fashion-pattern-ai-generator"
        }
    ],

    // ===== NLP PROJECTS =====
    nlpProjects: [
        {
            name: "Why Summarizer",
            desc: "An AI-driven engine that connects your Git history to Jira context, ensuring institutional knowledge never fades. The missing link between what your code does and why it was written.",
            tech: ["Python", "LangChain", "Git", "Jira"],
            stats: "Git-to-Jira traceability parser, developer documentation automation",
            github: "https://github.com/mayank-goyal09/Why-Summarizer.git"
        },
        {
            name: "Risk Intel Extension",
            desc: "Extracting risk indicators and threat intelligence in real-time from visited pages.",
            tech: ["JavaScript", "Chrome Extension", "NLP"],
            stats: "Real-time DOM analysis, threat intelligence parsing",
            github: "https://github.com/mayank-goyal09/risk-intel-extension"
        },
        {
            name: "Address ResolveR",
            desc: "High-speed CRF model resolving messy addresses under 10ms. Trained on 100K messy addresses to parse house numbers, streets, sectors, cities, and postcodes.",
            tech: ["Python", "CRFSuite", "NLP"],
            stats: "100K training address records, < 10ms inference speed",
            github: "https://github.com/mayank-goyal09/Logistics-Address-ResolveR"
        },
        {
            name: "Beep-for-Abuse",
            desc: "A low-latency audio processing engine utilizing a Rolling Audio Buffer paired with Faster-Whisper and a 1D-CNN classifier to detect and mask abusive language in real-time streams.",
            tech: ["Python", "Faster-Whisper", "1D-CNN", "PyTorch"],
            stats: "Rolling audio buffer, faster-whisper real-time stream masking",
            github: "https://github.com/mayank-goyal09/beep-for-abuse"
        },
        {
            name: "Screendit",
            desc: "Media analysis tool turning hours of subjective media coverage into seconds of objective data by automatically aligning identical facts and mapping news bias.",
            tech: ["Python", "Transformers", "Semantic Similarity"],
            stats: "Side-by-side semantic alignment, media bias/spin heatmap visualization",
            github: "https://github.com/mayank-goyal09/Screendit"
        },
        {
            name: "nuance-flow",
            desc: "A Deep Learning NLP pipeline that upgrades flat 'positive/negative' sentiment into 27 actionable emotion triggers, helping small businesses resolve critical customer complaints.",
            tech: ["Python", "Transformers", "DistilBERT", "PyTorch"],
            stats: "GoEmotions dataset fine-tuned, 27 granular emotion outputs",
            github: "https://github.com/mayank-goyal09/nuance-flow"
        }
    ],

    // ===== TIPS & ADVICE =====
    tips: [
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
    ]
};

// ===== CHATBOT CLASS =====
class CosmicAssistant {
    constructor() {
        this.isOpen = false;
        this.messagesContainer = null;
        this.inputField = null;
        this.currentPage = this.detectCurrentPage();
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

    init() {
        this.createChatbotUI();
        this.bindEvents();
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
                    <button data-action="dl-projects">🧠 Deep Learning</button>
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
            <!-- Floating Orb Button (Original Design) -->
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
                            <p>Ask me about Mayank's projects!</p>
                        </div>
                    </div>
                    <button class="chat-close-btn" id="chatCloseBtn" aria-label="Close">×</button>
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
        let welcomeText = `👋 **Hey there! I'm the Cosmic Assistant** for Mayank Goyal's portfolio.\n\n`;

        switch (this.currentPage) {
            case 'data-analytics':
                welcomeText += `📊 You're exploring the **Data Analytics** projects! I can tell you about any of the dashboards, SQL analyses, or visualization projects here.\n\nTry asking about "Marketing Dashboard" or "Olympic Analytics"!`;
                break;
            case 'machine-learning':
                welcomeText += `🤖 Welcome to the **Machine Learning Lab**! I know all about the supervised and unsupervised projects here.\n\nAsk me about "SmartHarvest", "Geo-Pulse", or any ML project!`;
                break;
            case 'python-projects':
                welcomeText += `🐍 You're in the **Python & OOP** section! These are enterprise-grade applications built with Python.\n\nAsk about the "YouTube Studio Automation" flagship project or any backend system!`;
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
                welcomeText += `I can help you explore:\n• 📊 **Data Analytics** - Dashboards & SQL analyses\n• 🤖 **Machine Learning** - 23+ ML projects\n• 🧠 **Deep Learning** - ANNs, CNNs, LSTMs, GNNs\n• 🐍 **Python/OOP** - Enterprise applications\n• ⚡ **FastAPI** - Async APIs & MLOps\n• 🎨 **Generative AI** - RAG bases & agents\n• 💬 **NLP** - Text/speech parsing & classification\n• 💼 **Experience & Skills**\n• 📧 **Contact Information**\n\nJust ask or use the quick buttons below!`;
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
            'tip': 'Give me a learning tip for data science'
        };

        const prompt = prompts[action] || 'Hello!';
        this.handleUserMessage(prompt);
    }

    generateResponse(input) {
        const t = input.toLowerCase();
        const k = portfolioKnowledge;

        // ===== GREETINGS =====
        if (this.matches(t, ['hello', 'hi', 'hey', 'greet', 'howdy', 'what\'s up'])) {
            return `👋 **Hey there!** I'm the Cosmic Assistant on Mayank Goyal's portfolio.\n\nI can help you explore my work across **65+ projects** in these areas:\n• 📊 **Data Analytics** (12 projects)\n• 🤖 **Machine Learning** (23 projects)  \n• 🧠 **Deep Learning** (14 projects)\n• 🐍 **Python/OOP** (8 projects)\n• ⚡ **FastAPI** (8 projects)\n• 🎨 **Generative AI** (10 projects)\n• 💬 **NLP** (6 projects)\n\nWhat would you like to explore?`;
        }

        // ===== ABOUT MAYANK =====
        if (this.matches(t, ['who is mayank', 'about mayank', 'tell me about mayank', 'who are you', 'mayank goyal'])) {
            return `👨‍💻 **About Mayank Goyal**\n\n${k.owner.about}\n\n**Current Focus:**\n• High-performance APIs & MLOps\n• Graph Neural Networks & Time-Series forecasting\n• Generative AI, RAG & Multi-Agent systems\n• Data Analytics & Enterprise Python Development\n\n🔗 **Links:**\n• GitHub: ${k.owner.github}\n• LinkedIn: ${k.owner.linkedin}`;
        }

        // ===== EXPERIENCE =====
        if (this.matches(t, ['experience', 'work', 'intern', 'job', 'spaceece', 'professional'])) {
            const exp = k.experience;
            return `💼 **Professional Experience**\n\n**${exp.role}** @ ${exp.company}\n📅 ${exp.duration}\n\n${exp.description}\n\n**Key Dashboards Developed:**\n${exp.projects.map(p => `• ${p}`).join('\n')}\n\nThis internship focused on building data-driven dashboards and was recognized for analytical excellence!`;
        }

        // ===== SKILLS =====
        if (this.matches(t, ['skill', 'tech', 'stack', 'what can', 'capabilities', 'expertise'])) {
            return `🛠️ **Mayank's Developer Workbench (Core Applied Skills)**\n\n🧠 **Local Intelligence & Language Models:**\n• *Applied Mechanics:* Local RAG engine deployment, custom Ollama/Mistral pipeline integration\n• *Core Toolkit:* PyTorch, TensorFlow, MediaPipe, Sequence Modeling (LSTM)\n\n📊 **Data Architecture & Automation:**\n• *Applied Mechanics:* Automated ingestion pipelines with fuzzy matching, Spatio-Temporal Graph Neural Networks, 1D-CNN signal processing\n• *Core Toolkit:* Python, Pandas, Scikit-learn, Supabase, Advanced SQL\n\n⚡ **Backends & Deployment Interfaces:**\n• *Applied Mechanics:* Asynchronous high-performance backends for inference, strict OOP & modular system design\n• *Core Toolkit:* FastAPI, Streamlit, Git Architecture\n\nWould you like to explore projects under any of these domains?`;
        }

        // ===== CONTACT =====
        if (this.matches(t, ['contact', 'reach', 'email', 'linkedin', 'github', 'hire', 'connect'])) {
            return `📬 **Contact Mayank**\n\n📧 **Email:** ${k.owner.email}\n\n🔗 **Social Links:**\n• [LinkedIn](${k.owner.linkedin})\n• [GitHub](${k.owner.github})\n• [Twitter/X](${k.owner.twitter})\n\nYou can also use the **Contact Form** on the main page. Mayank typically responds within 24 hours!`;
        }

        // ===== ALL PROJECTS OVERVIEW =====
        if (this.matches(t, ['all projects', 'all project', 'how many project', 'project count', 'portfolio overview', 'tell me about projects'])) {
            return `🚀 **Mayank's Complete Portfolio**\n\n📊 [Data Analytics](data-analytics-projects.html) (12 projects)\n🤖 [Machine Learning](machine-learning.html) (23 projects)  \n🧠 [Deep Learning](deep-learning.html) (14 projects)\n🐍 [Python/OOP](python-projects.html) (8 projects)\n⚡ [FastAPI Lab](fastapi.html) (8 projects)\n🎨 [Generative AI Lab](generative-ai.html) (10 projects)\n💬 [NLP Lab](nlp.html) (6 projects)\n\n**Featured Spotlight Projects:**\n• 📺 [YouTube Studio Automation](https://github.com/mayank-goyal09/YouTube-Studio)\n• 🧠 [DocIntel — Private RAG Base](https://github.com/mayank-goyal09/DocIntel.git)\n• ⚡ [MovieFlix AI — Movie Recommender](https://github.com/mayank-goyal09/movieflix-rec)\n• 🛡️ [AegisGNN — Financial Fraud Detection](https://github.com/mayank-goyal09/financial-fraud-gnn)\n\nWhich category interests you?`;
        }

        // ===== DATA ANALYTICS PROJECTS =====
        if (this.matches(t, ['data analyt', 'dashboard', 'visualization', 'power bi', 'excel', 'analytics project'])) {
            const projects = k.dataAnalyticsProjects.slice(0, 5);
            let response = `📊 **Data Analytics Projects** (12 total)\n\n`;
            projects.forEach(p => {
                response += `• **${p.name}**\n${p.desc.substring(0, 100)}...\n🛠️ ${p.tech.join(', ')}\n🔗 [GitHub Code](${p.github})\n\n`;
            });
            response += `Explore more on the [Data Analytics Projects page](data-analytics-projects.html)!`;
            return response;
        }

        // ===== MACHINE LEARNING PROJECTS =====
        if (this.matches(t, ['machine learning', 'ml project', 'supervised', 'unsupervised', 'scikit', 'sklearn'])) {
            let response = `🤖 **Machine Learning Projects** (23 total)\n\n**Supervised Learning:**\n`;
            const supervised = k.machineLearningProjects.filter(p => p.type.includes('Supervised')).slice(0, 3);
            supervised.forEach(p => {
                response += `• **${p.name}** - ${p.stats}\n  🔗 [GitHub Code](${p.github})\n`;
            });
            response += `\n**Unsupervised Learning:**\n`;
            const unsupervised = k.machineLearningProjects.filter(p => p.type.includes('Unsupervised')).slice(0, 2);
            unsupervised.forEach(p => {
                response += `• **${p.name}** - ${p.stats}\n  🔗 [GitHub Code](${p.github})\n`;
            });
            response += `\nExplore the full interactive grid on the [Machine Learning page](machine-learning.html)!`;
            return response;
        }

        // ===== DEEP LEARNING PROJECTS =====
        if (this.matches(t, ['deep learning', 'neural network', 'cnn', 'ann', 'lstm', 'rnn', 'gnn', 'gcn', 'transformer', 'tensorflow', 'keras'])) {
            let response = `🧠 **Deep Learning Projects** (14 total)\n\n`;
            k.deepLearningProjects.slice(0, 4).forEach(p => {
                response += `• **${p.name}** (${p.type})\n${p.desc.substring(0, 120)}...\n📊 ${p.stats}\n🔗 [GitHub Code](${p.github})\n\n`;
            });
            response += `Explore the full neural stack on the [Deep Learning page](deep-learning.html)!`;
            return response;
        }

        // ===== PYTHON/OOP PROJECTS =====
        if (this.matches(t, ['python project', 'oop', 'backend', 'sqlite', 'streamlit app'])) {
            let response = `🐍 **Python & OOP Projects** (8 total)\n\n`;
            const flagship = k.pythonProjects.find(p => p.flagship);
            if (flagship) {
                response += `⭐ **FLAGSHIP: ${flagship.name}**\n${flagship.desc}\n🔗 [Live Demo](${flagship.liveApp}) • [GitHub](${flagship.github})\n\n`;
            }
            response += `**Other Projects:**\n`;
            k.pythonProjects.filter(p => !p.flagship).slice(0, 3).forEach(p => {
                response += `• **${p.name}** - ${p.desc.substring(0, 80)}...\n  🔗 [GitHub](${p.github})\n`;
            });
            response += `\nSee all details on the [Python Projects page](python-projects.html)!`;
            return response;
        }

        // ===== FASTAPI PROJECTS =====
        if (this.matches(t, ['fastapi', 'fast api', 'mlops', 'async api'])) {
            let response = `⚡ **FastAPI Projects**\n\n`;
            k.fastapiProjects.forEach(p => {
                response += `**${p.name}**\n${p.desc}\n🛠️ Tech: ${p.tech.join(' • ')}\n📊 Stats: ${p.stats}\n🔗 [Live App](${p.liveApp}) • [GitHub](${p.github})\n\n`;
            });
            response += `Explore the live Evervault scanner visual on the [FastAPI Lab page](fastapi.html)!`;
            return response;
        }

        // ===== GENERATIVE AI PROJECTS =====
        if (this.matches(t, ['generative ai', 'genai', 'gen ai', 'rag', 'agent'])) {
            let response = `🎨 **Generative AI & LLM Projects** (10 total)\n\n`;
            k.generativeAiProjects.slice(0, 4).forEach(p => {
                response += `**${p.name}**\n${p.desc}\n🛠️ Tech: ${p.tech.join(' • ')}\n🔗 [GitHub Code](${p.github})\n\n`;
            });
            response += `Check out the interactive 3D presenter robot on the [Generative AI page](generative-ai.html)!`;
            return response;
        }

        // ===== NLP PROJECTS =====
        if (this.matches(t, ['nlp', 'natural language', 'text analysis', 'sentiment'])) {
            let response = `💬 **Natural Language Processing Projects** (6 total)\n\n`;
            k.nlpProjects.forEach(p => {
                response += `**${p.name}**\n${p.desc}\n🛠️ Tech: ${p.tech.join(' • ')}\n🔗 [GitHub Code](${p.github})\n\n`;
            });
            response += `See elegant animations for all NLP pipelines on the [NLP page](nlp.html)!`;
            return response;
        }

        // ===== SPECIFIC PROJECT SEARCHES =====
        // YouTube Studio
        if (this.matches(t, ['youtube', 'studio', 'youtube studio'])) {
            const p = k.pythonProjects.find(x => x.name.includes('YouTube'));
            return `📺 **${p.name}**\n\n${p.desc}\n\n**Tech Stack:** ${p.tech.join(' • ')}\n\n**Key Features:**\n${p.features.map(f => `• ${f}`).join('\n')}\n\n🔗 [Live Dashboard](${p.liveApp})\n💻 [GitHub Code](${p.github})`;
        }

        // SmartHarvest
        if (this.matches(t, ['smartharvest', 'crop', 'agriculture'])) {
            const p = k.machineLearningProjects.find(x => x.name.includes('SmartHarvest'));
            return `🌾 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n🔗 [Try It Live](${p.liveApp})\n💻 [GitHub](${p.github})`;
        }

        // Geo-Pulse
        if (this.matches(t, ['geo-pulse', 'geopulse', 'traffic', 'accident', 'dbscan'])) {
            const p = k.machineLearningProjects.find(x => x.name.includes('Geo-Pulse'));
            return `🌍 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n🔗 [Try It Live](${p.liveApp})\n💻 [GitHub](${p.github})`;
        }

        // ASL Recognizer
        if (this.matches(t, ['asl', 'sign language', 'digit recogn', 'hand gesture'])) {
            const p = k.deepLearningProjects.find(x => x.name.includes('ASL'));
            return `🤟 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n🔗 [Try It Live](${p.liveApp})\n💻 [GitHub](${p.github})`;
        }

        // WeatherLens
        if (this.matches(t, ['weather', 'forecast', 'lstm', 'temperature'])) {
            const p = k.deepLearningProjects.find(x => x.name.includes('Weather'));
            return `🌦️ **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n🔗 [Try It Live](${p.liveApp})\n💻 [GitHub](${p.github})`;
        }

        // DocIntel
        if (this.matches(t, ['docintel', 'private rag', 'vector db'])) {
            const p = k.generativeAiProjects.find(x => x.name.includes('DocIntel'));
            return `🧠 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // LegalGuard
        if (this.matches(t, ['legalguard', 'risk analyzer', 'nda'])) {
            const p = k.generativeAiProjects.find(x => x.name.includes('LegalGuard'));
            return `⚖️ **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // AutoDoc
        if (this.matches(t, ['autodoc', 'docstring', 'ast'])) {
            const p = k.generativeAiProjects.find(x => x.name.includes('AutoDoc'));
            return `🚀 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // LoreWeaver
        if (this.matches(t, ['loreweaver', 'voice story'])) {
            const p = k.generativeAiProjects.find(x => x.name.includes('LoreWeaver'));
            return `🎭 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // ArchitectAI
        if (this.matches(t, ['architectai', 'virtual staging'])) {
            const p = k.generativeAiProjects.find(x => x.name.includes('ArchitectAI'));
            return `🛋️ **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // Echoes of History
        if (this.matches(t, ['echoes of history', 'museum', 'parchment'])) {
            const p = k.generativeAiProjects.find(x => x.name.includes('Echoes'));
            return `🏛️ **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // MovieFlix AI
        if (this.matches(t, ['movieflix', 'movie recommender'])) {
            const p = k.fastapiProjects.find(x => x.name.includes('MovieFlix'));
            return `🎬 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n🔗 [Try It Live](${p.liveApp})\n💻 [GitHub Code](${p.github})`;
        }

        // CureLoop
        if (this.matches(t, ['cureloop', 'disease prediction api', 'mlops api'])) {
            const p = k.fastapiProjects.find(x => x.name.includes('CureLoop'));
            return `🩺 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n🔗 [Live docs](${p.liveApp})\n💻 [GitHub Code](${p.github})`;
        }

        // Why Summarizer
        if (this.matches(t, ['why summarizer', 'git', 'jira'])) {
            const p = k.nlpProjects.find(x => x.name.includes('Why'));
            return `📝 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // Address ResolveR
        if (this.matches(t, ['address resolver', 'address resolver'])) {
            const p = k.nlpProjects.find(x => x.name.includes('Address'));
            return `📮 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // Beep-for-Abuse
        if (this.matches(t, ['beep-for-abuse', 'toxic', 'audio buffer'])) {
            const p = k.nlpProjects.find(x => x.name.includes('Beep'));
            return `🔴 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // Screendit
        if (this.matches(t, ['screendit', 'spin', 'news bias'])) {
            const p = k.nlpProjects.find(x => x.name.includes('Screendit'));
            return `📰 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // nuance-flow
        if (this.matches(t, ['nuance-flow', 'nuance flow', 'emotion pro'])) {
            const p = k.nlpProjects.find(x => x.name.includes('nuance'));
            return `💬 **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // AegisGNN
        if (this.matches(t, ['aegisgnn', 'aegis gnn', 'fraud detection'])) {
            const p = k.deepLearningProjects.find(x => x.name.includes('Aegis'));
            return `🛡️ **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // CityPulse AI
        if (this.matches(t, ['citypulse', 'city pulse', 'traffic congestion'])) {
            const p = k.deepLearningProjects.find(x => x.name.includes('CityPulse'));
            return `🏙️ **${p.name}**\n\n${p.desc}\n\n**Stats:** ${p.stats}\n**Tech:** ${p.tech.join(' • ')}\n\n💻 [GitHub Code](${p.github})`;
        }

        // Heart Disease / Cardio
        if (this.matches(t, ['heart', 'cardio', 'disease prediction', 'health risk'])) {
            const projects = k.machineLearningProjects.filter(p =>
                p.name.toLowerCase().includes('cardio') ||
                p.desc.toLowerCase().includes('heart')
            );
            let response = `❤️ **Healthcare/Heart Disease Projects**\n\n`;
            projects.forEach(p => {
                response += `• **${p.name}**\n  ${p.desc.substring(0, 100)}...\n  🔗 [Live App](${p.liveApp})\n\n`;
            });
            return response;
        }

        // ===== LEARNING TIPS =====
        if (this.matches(t, ['tip', 'advice', 'learn', 'study', 'career advice', 'how to'])) {
            const randomTip = k.tips[Math.floor(Math.random() * k.tips.length)];
            return `💡 **Learning Tip from Mayank:**\n\n"${randomTip}"\n\nWant another tip? Just ask!`;
        }

        // ===== HELP =====
        if (this.matches(t, ['help', 'what can you do', 'how to use', 'commands'])) {
            return `🆘 **How I Can Help**\n\nI'm your guide to Mayank Goyal's portfolio! Try asking:\n\n**About Projects:**\n• "Show me FastAPI projects"\n• "Tell me about DocIntel"\n• "Show me ML projects"\n• "What NLP projects are there?"\n\n**About Mayank:**\n• "What are his skills?"\n• "Tell me about his experience"\n• "How can I contact him?"\n\n**Other:**\n• "Give me a learning tip"\n• "Show me all projects"\n\nOr just use the quick buttons below! 👇`;
        }

        // ===== THANKS =====
        if (this.matches(t, ['thank', 'thanks', 'awesome', 'great', 'helpful', 'perfect'])) {
            return `🙏 **You're welcome!** Happy to help you explore Mayank's portfolio.\n\nIs there anything else you'd like to know? Maybe:\n• Another project category?\n• Specific technologies used?\n• How to get in touch?`;
        }

        // ===== FALLBACK =====
        return `🤔 I'm not sure I understood that fully, but I'm here to help!\n\n**Try asking about:**\n• "Show me Generative AI projects"\n• "What are Mayank's skills?"\n• "Tell me about the CureLoop project"\n• "How can I contact Mayank?"\n\nOr use the quick action buttons below! 👇`;
    }

    matches(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
}

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    const assistant = new CosmicAssistant();
    assistant.init();
});
