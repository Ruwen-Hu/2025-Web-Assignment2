/* Custom Tailwind Configuration */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#6D4C41', // Warm wood tone as primary color
                secondary: '#FFB74D', // Warm orange as accent color
                neutral: '#F5F5F5',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        }
    }
};

// Model Layer - Data Management
const AppModel = {
    trainers: document.querySelectorAll('.trainer-card'),
    testimonials: document.querySelectorAll('.testimonial-slide'),
    currentTestimonialIndex: 0,
            
    // Search trainers
    searchTrainers: function(query) {
        const resultsEl = document.getElementById('search-results');
        let count = 0;
        
        this.trainers.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const specialty = card.dataset.specialty.toLowerCase();
            const matches = name.includes(query) || specialty.includes(query);
                    
            card.style.display = matches ? 'block' : 'none';
            if (matches) count++;
        });
                
        // Display search results count
        if (query) {
            resultsEl.textContent = `Found ${count} matching trainers`;
            resultsEl.classList.remove('hidden');
        } else {
            resultsEl.classList.add('hidden');
        }
    },
            
    // Switch to next testimonial
    nextTestimonial: function() {
        this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
        this.showTestimonial(this.currentTestimonialIndex);
    },
            
    // Switch to previous testimonial
    prevTestimonial: function() {
        this.currentTestimonialIndex = (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.showTestimonial(this.currentTestimonialIndex);
    },
            
    // Show specific testimonial
    showTestimonial: function(index) {
        const testimonialWidth = this.testimonials[0].offsetWidth + 24; // Width + spacing
        const container = document.getElementById('testimonials-container');
        container.scrollTo({
            left: testimonialWidth * index,
            behavior: 'smooth'
        });
    }
};

// View Layer - UI Rendering
const AppView = {
    // Initialize hero section animation
    initHeroAnimation: function() {
        setTimeout(() => {
            document.getElementById('hero-title').classList.add('transition-custom', 'opacity-100', 'translate-y-0');
            document.getElementById('hero-desc').classList.add('transition-custom', 'opacity-100', 'translate-y-0');
            document.getElementById('hero-cta').classList.add('transition-custom', 'opacity-100', 'translate-y-0');
        }, 300);
    },
            
    // Initialize scroll animations
    initScrollAnimations: function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                }
            });
        }, { threshold: 0.1 });
                
        document.querySelectorAll('.scroll-animate').forEach(el => {
            el.classList.add('opacity-0', 'translate-y-8', 'transition-custom', 'duration-700');
            observer.observe(el);
        });
    },
            
    // Initialize navbar scroll effect
    initNavbarScroll: function() {
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('py-2', 'shadow-md');
                navbar.classList.remove('py-4', 'shadow-sm');
            } else {
                navbar.classList.add('py-4', 'shadow-sm');
                navbar.classList.remove('py-2', 'shadow-md');
            }
        });
    },
            
    // Initialize mobile menu
    initMobileMenu: function() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
                
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('rotate-90');
                    
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.style.maxHeight = '0';
                setTimeout(() => {
                    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
                }, 10);
            } else {
                mobileMenu.style.maxHeight = '0';
            }
        });
    }
};

// Controller Layer - Coordinate Model and View
const AppController = {
    init: function() {
        // Initialize view
        AppView.initHeroAnimation();
        AppView.initScrollAnimations();
        AppView.initNavbarScroll();
        AppView.initMobileMenu();
                
        // Bind search event
        document.getElementById('trainer-search').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            AppModel.searchTrainers(query);
        });
                
        // Bind testimonial carousel events
        document.getElementById('next-testimonial').addEventListener('click', () => {
            AppModel.nextTestimonial();
        });
                
        // Bind testimonial carousel events
        document.getElementById('prev-testimonial').addEventListener('click', () => {
            AppModel.prevTestimonial();
        });
                
        // Auto-rotate testimonials
        setInterval(() => {
            AppModel.nextTestimonial();
        }, 5000);
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    AppController.init();
});