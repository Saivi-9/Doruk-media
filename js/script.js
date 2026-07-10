// ============================================
// DORUK MEDIA - Main Script
// Works on local file:// and on web servers
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ---------- Detect if running on file:// protocol ----------
    const isFileProtocol = window.location.protocol === 'file:';

    // ---------- DOM Elements ----------
    const progressBar = document.getElementById('progressBar');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const themeToggle = document.getElementById('themeToggle');
    const langCurrent = document.getElementById('langCurrent');
    const langDropdown = document.getElementById('langDropdown');
    const langSwitcher = document.querySelector('.lang-switcher');
    const backToTop = document.getElementById('backToTop');
    const typewriterEl = document.getElementById('typewriter');
    const canvas = document.getElementById('particleCanvas');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const faqItems = document.querySelectorAll('.faq-item');
    const serviceCards = document.querySelectorAll('.service-card');
    const modalOverlay = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.modal-close');
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const reveals = document.querySelectorAll('.reveal');
    const toggleSwitch = document.querySelector('.toggle-switch');

    // ---------- Dark Mode ----------
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    });

    // ---------- Mobile Menu ----------
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // ---------- Scroll Progress ----------
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
        if (scrollTop > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // ---------- Language Switcher (Dropdown) ----------
    langCurrent.addEventListener('click', (e) => {
        e.stopPropagation();
        langSwitcher.classList.toggle('active');
    });
    document.addEventListener('click', () => {
        langSwitcher.classList.remove('active');
    });

    // Build correct path for language folders
    function getLanguagePath(lang) {
        if (isFileProtocol) {
            // On file://, use relative paths from current HTML file
            // All language HTMLs are in subfolders like tr/, en/, etc.
            // From tr/index.html, to reach en/index.html we use ../en/index.html
            return '../' + lang + '/index.html';
        } else {
            // On a web server, use clean folder URLs
            return '/' + lang + '/';
        }
    }

    langDropdown.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', (e) => {
            const lang = li.dataset.lang;
            const targetUrl = getLanguagePath(lang);
            window.location.href = targetUrl;
        });
    });

    // Set active language in the dropdown based on current page path
    const path = window.location.pathname;
    const currentLang = path.includes('/en/') || path.includes('/en/index.html') ? 'en' :
                        path.includes('/ru/') || path.includes('/ru/index.html') ? 'ru' :
                        path.includes('/ar/') || path.includes('/ar/index.html') ? 'ar' : 'tr';
    const activeLi = langDropdown.querySelector(`li[data-lang="${currentLang}"]`);
    if (activeLi) {
        activeLi.classList.add('active');
        document.getElementById('langName').textContent = activeLi.textContent.trim().split(' ')[1] || activeLi.textContent.trim();
    }

    // ---------- Typewriter Animation ----------
    const wordsTr = ['Sosyal Medya Ajansı', 'Sosyal Medya Yönetimi', 'Sosyal Medya Reklamı'];
    const htmlLang = document.documentElement.lang;
    let words;
    if (htmlLang === 'tr') words = wordsTr;
    else if (htmlLang === 'en') words = ['Social Media Agency', 'Social Media Management', 'Social Media Advertising'];
    else if (htmlLang === 'ru') words = ['Агентство соцмедиа', 'Управление соцмедиа', 'Реклама в соцмедиа'];
    else if (htmlLang === 'ar') words = ['وكالة تواصل اجتماعي', 'إدارة التواصل الاجتماعي', 'إعلانات التواصل الاجتماعي'];
    else words = wordsTr;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    function type() {
        const current = words[wordIndex];
        if (isDeleting) charIndex--;
        else charIndex++;
        typewriterEl.textContent = current.substring(0, charIndex);
        if (!isDeleting && charIndex === current.length) {
            setTimeout(() => { isDeleting = true; }, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        const speed = isDeleting ? 60 : 120;
        setTimeout(type, speed);
    }
    type();

    // ---------- Particle Canvas ----------
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        function resize() {
            width = window.innerWidth;
            height = canvas.parentElement.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        }
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.4 + 0.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(245,158,11,${this.opacity})`;
                ctx.fill();
            }
        }
        function initParticles() {
            resize();
            particles = [];
            const count = Math.min(60, Math.floor(width / 20));
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }
        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        window.addEventListener('resize', initParticles);
        initParticles();
        animateParticles();
    }

    // ---------- Scroll Reveal + Counter ----------
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const counters = entry.target.querySelectorAll('.stat-number[data-count]');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    let count = 0;
                    const increment = target / 50;
                    const timer = setInterval(() => {
                        count += increment;
                        if (count >= target) { count = target; clearInterval(timer); }
                        counter.textContent = Math.floor(count);
                    }, 30);
                });
            }
        });
    }, observerOptions);
    reveals.forEach(el => observer.observe(el));

    // ---------- Pricing Toggle ----------
    if (toggleSwitch) {
        toggleSwitch.addEventListener('click', () => {
            toggleSwitch.classList.toggle('yearly');
            const isYearly = toggleSwitch.classList.contains('yearly');
            document.querySelectorAll('.price.monthly').forEach(el => el.style.display = isYearly ? 'none' : 'inline');
            document.querySelectorAll('.price.yearly').forEach(el => el.style.display = isYearly ? 'inline' : 'none');
        });
        // Initialize monthly view
        document.querySelectorAll('.price.yearly').forEach(el => el.style.display = 'none');
    }

    // ---------- Portfolio Filter ----------
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            portfolioItems.forEach(item => {
                item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
            });
        });
    });

    // ---------- Testimonials Carousel ----------
    if (carouselTrack) {
        const cards = carouselTrack.children;
        let currentIndex = 0;
        let dots = [];
        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }
        function createDots() {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < cards.length; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot-indicator');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
            dots[0].classList.add('active');
        }
        createDots();
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 5000);
    }

    // ---------- FAQ Accordion ----------
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ---------- Service Modal ----------
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            modalTitle.textContent = title;
            modalDescription.textContent = description + ' Detaylı bilgi için iletişime geçin.';
            modalOverlay.classList.add('active');
        });
    });
    if (modalClose) {
        modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.remove('active');
        });
    }

    // ---------- Form Validation ----------
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            if (name && email) {
                document.getElementById('formSuccess').style.display = 'block';
                contactForm.reset();
                setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 4000);
            } else {
                alert('Lütfen gerekli alanları doldurun.');
            }
        });
    }
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value.trim();
            if (email) {
                alert('Bültene abone olduğunuz için teşekkürler!');
                newsletterForm.reset();
            }
        });
    }

    // ---------- Back to Top ----------
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- Smooth Scroll ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});