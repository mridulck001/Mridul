// ============================================
// ORBITING ICONS ANIMATION
// ============================================

function initOrbitingIcons() {
    const container = document.getElementById('rotatingIcons');
    if (!container) return;

    const iconPairs = [
        { path: 'assets/python.png',      label: 'Python'      },
        { path: 'assets/javascript.png',  label: 'JavaScript'  },
        { path: 'assets/flask.png',        label: 'Flask'       },
        { path: 'assets/html.png',         label: 'HTML5'       },
        { path: 'assets/css.png',          label: 'CSS3'        },
        { path: 'assets/dart.png',         label: 'Dart'        },
        { path: 'assets/flutter.png',      label: 'Flutter'     },
        { path: 'assets/illustrator.png',  label: 'Illustrator' }
    ];

    // Devicons path map for fallback (only icons that exist in devicons)
    const devIconsMap = {
        'python':      'python/python-original.svg',
        'javascript':  'javascript/javascript-original.svg',
        'flask':       'flask/flask-original.svg',
        'html5':       'html5/html5-original.svg',
        'css3':        'css3/css3-original.svg',
        'dart':        'dart/dart-original.svg',
        'flutter':     'flutter/flutter-original.svg'
        // 'illustrator' intentionally omitted — not in devicons
    };

    const orbitItems = [];

    iconPairs.forEach((icon, index) => {
        const iconEl = document.createElement('div');
        iconEl.className = 'orbiting-icon';

        const img = document.createElement('img');
        img.src   = icon.path;
        img.alt   = icon.label;
        img.title = icon.label;

        // FIX: Guard onerror with null-clear to prevent infinite retry loop.
        // Original code set this.src to another possibly-broken URL with no guard.
        img.onerror = function () {
            this.onerror = null; // prevent infinite loop
            const key = icon.label.toLowerCase();
            const devPath = devIconsMap[key];
            if (devPath) {
                this.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${devPath}`;
            } else {
                // SVG letter-avatar so slot is never blank
                const letter = icon.label.charAt(0).toUpperCase();
                this.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'><circle cx='17' cy='17' r='17' fill='%232563eb'/><text x='17' y='22' text-anchor='middle' font-size='15' font-family='sans-serif' fill='white'>${letter}</text></svg>`;
            }
        };

        iconEl.appendChild(img);
        container.appendChild(iconEl);

        orbitItems.push({
            element:   iconEl,
            baseAngle: (Math.PI * 2 * index) / iconPairs.length
        });
    });

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const xRadius = 180;
    const yRadius = 180;

    // FIX: zRadius was 0, making depth = (0+0)/(2*0) = 0/0 = NaN.
    // NaN spread to scale, opacity, zIndex → every icon turned invisible.
    // Setting zRadius = xRadius gives depth a clean 0→1 range.
    const zRadius = xRadius;

    const renderOrbit = (elapsedSeconds) => {
        const spin = elapsedSeconds * 0.8;

        orbitItems.forEach((item) => {
            const angle   = item.baseAngle + spin;
            const x       = Math.cos(angle) * xRadius;
            const y       = Math.sin(angle) * yRadius;
            const z       = Math.sin(angle) * zRadius;

            // depth is now safely in [0, 1]
            const depth   = (z + zRadius) / (2 * zRadius);
            const scale   = 0.72 + depth * 0.4;
            const opacity = 0.35 + depth * 0.65;

            // CSS already centres each icon via margin:-27px/-27px,
            // so plain translate(x, y) moves it correctly from that centre point.
            item.element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
            item.element.style.opacity   = opacity.toFixed(2);
            item.element.style.zIndex    = String(Math.round(depth * 1000));
            item.element.style.filter    = `brightness(${(0.82 + depth * 0.22).toFixed(3)}) saturate(${(0.9 + depth * 0.15).toFixed(3)})`;
        });
    };

    if (reduceMotion) {
        renderOrbit(0);
        return;
    }

    const start = performance.now();

    const animate = (now) => {
        renderOrbit((now - start) / 1000);
        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
}

// ============================================
// PROJECT DATA WITH CATEGORIES
// ============================================

const projects = [
    {
        id: 1,
        title: "Digital Gram Samadhan Portal",
        subtitle: "Multilingual Rural Grievance Platform",
        category: "web-dev",
        tech: ["Python", "Flask", "MongoDB", "Sarvam AI", "Twilio", "Docker"],
        description: "A comprehensive digital platform designed for rural communities to register and track grievances with multilingual support and voice-to-text functionality.",
        features: [
            "Multilingual interface for rural accessibility",
            "Voice-to-text complaint registration",
            "Role-based access control",
            "Real-time grievance tracking",
            "Mobile-responsive design"
        ],
        link: "https://mridulck001-dgsp.hf.space",
        linkText: "Live Demo"
    },
    {
        id: 2,
        title: "SMS Guard",
        subtitle: "Real-Time SMS Fraud Detection",
        category: "ml-ai",
        tech: ["Python", "XGBoost", "Scikit-learn", "Flutter", "Dart"],
        description: "Production-ready Android application with 100% on-device SMS fraud detection using advanced ML ensemble. Classifies threats into 6 specific fraud categories.",
        features: [
            "92.51% accuracy across 6 fraud types",
            "100% on-device detection (zero network calls)",
            "Real-time push notifications",
            "Live threat dashboard",
            "Custom semantic feature engineering"
        ],
        link: "https://github.com/mridulck001/SMS-Guard",
        linkText: "View Code"
    },
    {
        id: 3,
        title: "Orion",
        subtitle: "Agentic AI Voice Assistant",
        category: "ml-ai",
        tech: ["Python", "LAM", "Local LLMs", "STT/TTS", "API Integration"],
        description: "Advanced voice-activated AI assistant powered by Large Action Models. Enables real-time speech recognition and system-level automation.",
        features: [
            "Real-time speech recognition & TTS",
            "Voice-activated automation",
            "System-level integrations",
            "Conversational interactions",
            "Extensible architecture"
        ],
        link: "https://github.com/mridulck001/Orion",
        linkText: "Learn More"
    },
    {
        id: 4,
        title: "Teacher Training Dashboard",
        subtitle: "AI Lab Management & Analytics",
        category: "data-science",
        tech: ["Python", "Flask", "SQLite", "Chart.js", "Leaflet.js"],
        description: "Comprehensive dashboard for tracking teacher training programs across 23 districts with interactive visualizations and real-time attendance analytics.",
        features: [
            "Live statistics for trained teachers and districts",
            "Interactive Punjab map with district-level distribution",
            "Attendance and performance tracking for 333+ teachers",
            "Analytics charts for demographics",
            "Searchable data table with CSV export"
        ],
        link: "https://aimlnielitropar.github.io/jan26/",
        linkText: "Live Demo"
    },
    {
        id: 5,
        title: "Smart Entry Production",
        subtitle: "Face Recognition Access Control System",
        category: "computer-vision",
        tech: ["Python", "OpenCV", "Face Recognition", "Flask", "SQLite"],
        description: "Web-based attendance system with advanced face recognition. Recognizes multiple faces simultaneously and marks attendance in real-time.",
        features: [
            "Multi-face recognition capability",
            "Real-time IN/OUT tracking via camera",
            "Gate scanner terminal integration",
            "Manual visitor logging with ID proof capture",
            "Secure admin dashboard with auto-logout",
            "Day-wise CSV exports"
        ],
        link: "https://smart-entry-production-1.onrender.com/",
        linkText: "Live Demo"
    },
    {
        id: 6,
        title: "AI-Powered Proctored Examination Platform",
        subtitle: "Server-Side Proctoring System",
        category: "computer-vision",
        tech: ["Python", "Flask", "OpenCV", "MediaPipe", "Socket.IO"],
        description: "Innovative server-side AI proctoring system optimized for low-resource devices. Shifts heavy computation to backend for efficient fraud detection.",
        features: [
            "94% accuracy in detecting gaze deviation",
            "Impersonation detection system",
            "Optimized for low-resource devices",
            "Real-time violation alerts",
            "Comprehensive exam analytics"
        ],
        link: "https://github.com/mridulck001/proctored-exam-platform",
        linkText: "View Code"
    },
    {
        id: 7,
        title: "Multi-Crop Disease Detection",
        subtitle: "Agricultural ML Platform with Advisory",
        category: "ml-ai",
        tech: ["Python", "Flask", "TensorFlow", "EfficientNet", "ML"],
        description: "Scalable platform covering 8 regional crops with trained models achieving 80-90% accuracy. Features instant diagnoses and personalized agricultural advice.",
        features: [
            "Supports 8 different regional crops",
            "80-90% model accuracy",
            "Lightweight Flask interface",
            "Instant disease diagnosis",
            "Personalized farming advice",
            "Mobile-optimized design"
        ],
        link: "https://github.com/mridulck001/multi-crop-disease-detection",
        linkText: "View Code"
    },
    {
        id: 8,
        title: "Sales Forecasting for Retail Chain",
        subtitle: "Predictive Analytics & Dashboard",
        category: "data-science",
        tech: ["Python", "SQL", "Regression", "EDA", "Flask"],
        description: "End-to-end forecasting system with SQL data extraction, Python EDA for trend analysis, and interactive Flask dashboard for visualizing insights.",
        features: [
            "Comprehensive SQL data extraction",
            "Advanced Python EDA for trends",
            "Interactive sales visualization",
            "Model performance metrics",
            "Predictive forecasting dashboard",
            "Business insights generation"
        ],
        link: "https://github.com/mridulck001/retail-sales-forecasting",
        linkText: "View Code"
    },
    {
        id: 9,
        title: "Indian House Price Prediction",
        subtitle: "Machine Learning Price Estimation Model",
        category: "data-science",
        tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "Regression"],
        description: "Comprehensive ML model for predicting Indian house prices using advanced regression techniques and feature engineering.",
        features: [
            "Advanced feature engineering",
            "Multiple regression models",
            "Price prediction accuracy",
            "Market trend analysis",
            "Data preprocessing pipeline",
            "Model evaluation metrics"
        ],
        link: "https://github.com/mridulck001/Indian_House_Price_Prediction_Machine-Learning",
        linkText: "View Code"
    },
    {
        id: 10,
        title: "Automatic Face Grouping",
        subtitle: "AI-Powered Face Clustering & Organization",
        category: "computer-vision",
        tech: ["Python", "Flask", "OpenCV", "dlib", "face_recognition", "Scikit-learn", "DBSCAN"],
        description: "Flask-based web application that automatically detects, clusters, and organizes faces from photos and videos using unsupervised machine learning. No training data or manual labeling required.",
        features: [
            "Automatic face detection from images & videos",
            "DBSCAN-based unsupervised face clustering",
            "No training or manual labeling required",
            "Group photo and multi-person image handling",
            "Video frame extraction and face organization"
        ],
        link: "https://github.com/nielitropar/unsupervised-face-clustering",
        linkText: "View Code"
    }
];

// ============================================
// RENDER PROJECTS WITH FILTERING
// ============================================

function renderProjects(filterCategory = 'all') {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';

    projects.forEach((project, index) => {
        if (filterCategory !== 'all' && project.category !== filterCategory) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-subtitle">${project.subtitle}</p>
                <div class="tech-tags">
                    ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
            </div>
            <div class="project-body">
                <p class="project-description">${project.description}</p>
                <div class="project-features">
                    <div class="features-title">Key Features:</div>
                    <ul class="feature-list">
                        ${project.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="project-footer">
                <a href="${project.link}" target="_blank" class="project-link">
                    ${project.linkText} →
                </a>
            </div>
        `;

        container.appendChild(card);

        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.1,
                scrollTrigger: { trigger: card, start: 'top 80%' }
            }
        );
    });
}

// ============================================
// PROJECT FILTERING
// ============================================

function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.getAttribute('data-filter'));
        });
    });
}

// ============================================
// THEME TOGGLE
// ============================================

function setupThemeToggle() {
    const toggleButton = document.getElementById('themeToggle');
    if (!toggleButton) return;

    const applyTheme = (theme) => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
        const isDark = theme === 'dark';
        toggleButton.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        toggleButton.setAttribute('aria-pressed', String(isDark));
    };

    const initialTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    applyTheme(initialTheme);

    toggleButton.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

function setupNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// SMOOTH SCROLL NAVIGATION
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initOrbitingIcons();
    renderProjects('all');
    setupProjectFilters();
    setupThemeToggle();
    setupNavbar();
    setupSmoothScroll();

    gsap.from('nav', {
        y: -100,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    });
});
