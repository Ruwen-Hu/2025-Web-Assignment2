/* JavaScript (Controller: Interaction Logic) */
// Model Layer - Data Management
const AppModel = {
    benefits: document.querySelectorAll('.benefit-card'),
    
    // Filter benefit cards
    filterBenefits: function(category) {
        this.benefits.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
};

// View Layer - UI Rendering
const AppView = {
    // Initialize scroll animations
    initScrollAnimations: function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.scroll-animate').forEach(el => {
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
    },
    
    // Update filter button status
    updateFilterButtons: function(activeBtn) {
        document.querySelectorAll('.benefit-filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-primary', 'text-white');
            btn.classList.add('bg-gray-200', 'text-gray-700');
        });
        
        activeBtn.classList.add('active', 'bg-primary', 'text-white');
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    }
};

// Controller Layer - Coordinate Model and View
const AppController = {
    init: function() {
        // Initialize view
        AppView.initScrollAnimations();
        AppView.initNavbarScroll();
        AppView.initMobileMenu();
        
        // Bind benefit filter events
        document.querySelectorAll('.benefit-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.filter;
                AppModel.filterBenefits(category);
                AppView.updateFilterButtons(btn);
            });
        });
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    AppController.init();
});