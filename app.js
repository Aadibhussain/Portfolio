// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const typingText = document.getElementById('typingText');
const contactForm = document.getElementById('contactForm');

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.init();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    init() {
        this.applyTheme();
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-icon');
            if (icon) {
                icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        try {
            localStorage.setItem('theme', this.currentTheme);
        } catch (e) {
            console.log('Theme preference could not be saved');
        }
        this.applyTheme();
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.sections = document.querySelectorAll('.section, #home');
        this.init();
    }

    init() {
        // Mobile navigation toggle
        if (navToggle) {
            navToggle.addEventListener('click', this.toggleMobileNav.bind(this));
        }
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    this.scrollToSection(href.substring(1));
                    this.closeMobileNav();
                }
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', this.handleOutsideClick.bind(this));

        // Active section highlighting on scroll
        window.addEventListener('scroll', this.highlightActiveSection.bind(this));
        
        // Initial highlight
        this.highlightActiveSection();
    }

    toggleMobileNav() {
        if (navMenu) {
            navMenu.classList.toggle('active');
        }
        if (navToggle) {
            navToggle.classList.toggle('active');
        }
    }

    closeMobileNav() {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (navToggle) {
            navToggle.classList.remove('active');
        }
    }

    handleOutsideClick(e) {
        if (!e.target.closest('.navbar') && navMenu) {
            this.closeMobileNav();
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navbarHeight = 80;
            const offsetTop = section.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    highlightActiveSection() {
        const scrollPos = window.scrollY + 100;

        this.sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos <= bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Typing Effect
class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            typeSpeed = 500;

            if (this.textIndex === this.texts.length) {
                this.textIndex = 0;
            }
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Scroll Reveal Animation
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        this.revealElements();
        window.addEventListener('scroll', () => this.revealElements());
    }

    revealElements() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
}

// Skills Animation
class SkillsAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.animateSkills());
    }

    animateSkills() {
        if (this.animated) return;

        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const rect = skillsSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight / 2) {
            this.skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress + '%';
                }, index * 200);
            });
            this.animated = true;
        }
    }
}

// Contact Form Handler
class ContactForm {
    constructor(form) {
        this.form = form;
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await this.simulateSubmission(data);
            
            this.showMessage('Thank you! Your message has been sent successfully.', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 2000);
        });
    }

    showMessage(text, type) {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const message = document.createElement('div');
        message.className = `form-message form-${type}`;
        message.textContent = text;
        
        this.form.appendChild(message);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Utility Functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const navbarHeight = 80;
        const offsetTop = contactSection.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function downloadResume() {
    // Create a link to download resume (replace with actual resume file)
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual resume file path
    link.download = 'Adib_Hussain_Resume.pdf';
    link.target = '_blank';
    
    // For demo purposes, show an alert
    alert('Resume download will be available soon. Please contact me directly for now.');
}

// Smooth Scrolling for older browsers
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = 80;
                const offsetTop = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Counter Animation
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat h3');
        this.animated = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.animateCounters());
    }

    animateCounters() {
        if (this.animated) return;

        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;

        const rect = aboutSection.getBoundingClientRect();
        
        if (rect.top < window.innerHeight / 2) {
            this.counters.forEach(counter => {
                this.animateValue(counter);
            });
            this.animated = true;
        }
    }

    animateValue(element) {
        const target = parseFloat(element.textContent);
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current.toFixed(1);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    }
}

// Performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    new ThemeManager();
    new NavigationManager();
    
    // Initialize typing effect
    if (typingText) {
        new TypingEffect(typingText, [
            'Data Analyst & AI Specialist',
            'Machine Learning Engineer',
            'Full-Stack Developer',
            'Blockchain Enthusiast'
        ]);
    }
    
    // Initialize animations
    new ScrollReveal();
    new SkillsAnimation();
    new CounterAnimation();
    
    // Initialize contact form
    if (contactForm) {
        new ContactForm(contactForm);
    }
    
    // Add reveal class to elements that should animate
    const animateElements = document.querySelectorAll('.section');
    animateElements.forEach(element => {
        element.classList.add('reveal');
    });
    
    // Smooth scrolling fallback
    smoothScroll();
    
    console.log('Portfolio initialized successfully!');
});

// Handle window resize
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (navToggle) {
            navToggle.classList.remove('active');
        }
    }
}, 250));