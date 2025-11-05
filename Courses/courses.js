/* Custom Tailwind Configuration (Consistent color system with homepage) */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#6D4C41', // Warm wood tone as primary color
                secondary: '#FFB74D', // Warm orange as accent color
                neutral: '#F5F5F5',
                beginner: '#4CAF50',   // Beginner course green
                intermediate: '#2196F3', // Intermediate course blue
                advanced: '#F44336',    // Advanced course red
                special: '#9C27B0'      // Special course purple
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        }
    }
};

// 1. Event Bus: Decouple Controller and View
const EventBus = {
    events: {},
    
    // Register event
    on: function(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    },
    
    // Trigger event
    emit: function(eventName, data) {
        const events = this.events[eventName];
        if (events) {
            events.forEach(callback => callback(data));
        }
    }
};

// 2. Model Layer: Pure data management, no DOM dependencies
const CourseModel = {
    // Original course data (pure JSON, decoupled from DOM)
    coursesData: [
        {
            id: 1,
            name: "Mat Pilates Fundamentals",
            level: "beginner",
            levelText: "Beginner",
            price: 180,
            duration: 60,
            maxPeople: 12,
            description: "Suitable for Pilates beginners. Learn basic Pilates movements and breathing techniques, build core foundation, improve posture, and enhance body awareness.",
            tags: ["Beginner-Friendly", "No Equipment", "Core Training"],
            img: "image3_1.png"
        },
        {
            id: 2,
            name: "Reformer Pilates Intermediate",
            level: "intermediate",
            levelText: "Intermediate",
            price: 280,
            duration: 75,
            maxPeople: 8,
            description: "Suitable for students with basic experience. Train with Reformer equipment to strengthen muscles through spring resistance, improve flexibility and balance.",
            tags: ["Reformer Equipment", "Medium Intensity", "Flexibility Training"],
            img: "image3_2.png"
        },
        {
            id: 3,
            name: "Advanced Pilates Shaping",
            level: "advanced",
            levelText: "Advanced",
            price: 320,
            duration: 90,
            maxPeople: 6,
            description: "Suitable for advanced students. High-intensity training combination integrating multiple Pilates equipment and methods for targeted shaping, improving physical function and athletic performance.",
            tags: ["High Intensity", "Multi-Equipment", "Shaping & Fat Loss"],
            img: "image3_3.png"
        },
        {
            id: 4,
            name: "Postnatal Pilates Recovery",
            level: "special",
            levelText: "Special",
            price: 220,
            duration: 60,
            maxPeople: 10,
            description: "Designed specifically for postpartum mothers. Gently restore pelvic floor muscle function, repair diastasis recti, improve postpartum posture, relieve back pain, safe and effective.",
            tags: ["Postpartum Recovery", "Gentle Training", "Pelvic Floor Repair"],
            img: "image3_4.png"
        },
        {
            id: 5,
            name: "Pilates Rehabilitation Therapy",
            level: "special",
            levelText: "Special",
            price: 380,
            duration: 75,
            maxPeople: 4,
            description: "Designed for neck, shoulder, waist and leg pain. Combining rehabilitation concepts, improve physical discomfort through scientific training, restore normal function, and prevent pain recurrence.",
            tags: ["Rehabilitation Therapy", "Pain Relief", "Function Restoration"],
            img: "image3_5.png"
        },
        {
            id: 6,
            name: "Personalized Pilates",
            level: "special",
            levelText: "Private Session",
            price: 580,
            duration: 90,
            maxPeople: 1,
            description: "One-on-one exclusive training. Customize training plan based on personal physical condition and goals. Coach provides full guidance to ensure precise and effective movements, quickly achieve training objectives.",
            tags: ["1-on-1 Guidance", "Personalized Plan", "Efficient Training"],
            img: "image3_6.png"
        }
    ],
    
    currentFilter: "all",
    searchTerm: "",
    
    // Filter courses: Return filtered pure data
    filterCourses: function(filter = this.currentFilter, searchTerm = this.searchTerm) {
        this.currentFilter = filter;
        this.searchTerm = searchTerm.toLowerCase();
        
        return this.coursesData.filter(course => {
            // Filter condition match
            const filterMatch = filter === "all" || course.level === filter;
            // Search keyword match
            const searchMatch = !this.searchTerm || course.name.toLowerCase().includes(this.searchTerm);
            
            return filterMatch && searchMatch;
        });
    },
    
    // Sort courses: Return sorted pure data
    sortCourses: function(courses, sortType) {
        const sortedCourses = [...courses];
        
        switch(sortType) {
            case "price-asc":
                sortedCourses.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sortedCourses.sort((a, b) => b.price - a.price);
                break;
            default:
                // Default sort by ID (original order)
                sortedCourses.sort((a, b) => a.id - b.id);
        }
        
        return sortedCourses;
    },
    
    // Get single course details
    getCourseById: function(courseId) {
        return this.coursesData.find(course => course.id === courseId);
    }
};

// 3. View Layer: Pure UI rendering, receives Model data, no business logic
const CourseView = {
    // Initialize UI components
    init: function() {
        this.initScrollAnimations();
        this.initNavbarScroll();
        this.initMobileMenu();
        this.initBookingModal();
        this.bindEvents();
    },
    
    // Bind UI events (trigger Event Bus)
    bindEvents: function() {
        // Filter button click event
        document.querySelectorAll(".course-filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const filter = btn.dataset.filter;
                EventBus.emit("filter:change", { filter });
            });
        });
        
        // Search input event
        const searchInput = document.getElementById("course-search");
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value;
            EventBus.emit("search:change", { searchTerm });
        });
        
        // Sort dropdown change event
        const sortSelect = document.getElementById("sort-courses");
        sortSelect.addEventListener("change", () => {
            const sortType = sortSelect.value;
            EventBus.emit("sort:change", { sortType });
        });
        
        // Booking button click event (delegated to parent container)
        document.getElementById("courses-container").addEventListener("click", (e) => {
            const bookBtn = e.target.closest(".book-course-btn");
            if (bookBtn) {
                const courseId = parseInt(bookBtn.dataset.courseId);
                EventBus.emit("course:book", { courseId });
            }
        });
        
        // Modal close event
        document.getElementById("close-modal").addEventListener("click", () => {
            EventBus.emit("modal:close");
        });
        
        // Close modal when clicking outside
        document.getElementById("booking-modal").addEventListener("click", (e) => {
            if (e.target === document.getElementById("booking-modal")) {
                EventBus.emit("modal:close");
            }
        });
        
        // Booking form submit event
        document.getElementById("booking-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById("name").value,
                phone: document.getElementById("phone").value,
                date: document.getElementById("date").value,
                courseName: document.getElementById("modal-course-name").textContent
            };
            EventBus.emit("booking:submit", formData);
        });
    },
    
    // Render course list
    renderCourses: function(courses) {
        const container = document.getElementById("courses-container");
        container.innerHTML = ""; // Clear container
        
        // Generate course cards
        courses.forEach(course => {
            const card = document.createElement("div");
            card.className = "course-card bg-white rounded-lg overflow-hidden shadow-md card-hover";
            card.dataset.courseId = course.id;
            
            // Build tags HTML
            const tagsHtml = course.tags.map(tag => 
                `<span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">${tag}</span>`
            ).join("");
            
            // Course card content
            card.innerHTML = `
                <div class="relative">
                    <img src="${course.img}" alt="${course.name}" class="w-full h-56 object-cover transition-transform duration-700 hover:scale-105">
                    <div class="absolute top-4 left-4 bg-${course.level} text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${course.levelText}
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h3 class="text-xl font-semibold">${course.name}</h3>
                        <span class="text-primary font-bold">¥${course.price}/session</span>
                    </div>
                    <div class="flex items-center text-gray-500 text-sm mb-4">
                        <span class="flex items-center mr-4"><i class="fa fa-clock-o mr-2"></i> ${course.duration} mins</span>
                        <span class="flex items-center"><i class="fa fa-user mr-2"></i> Max ${course.maxPeople} people</span>
                    </div>
                    <p class="text-gray-600 mb-6">
                        ${course.description}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${tagsHtml}
                    </div>
                    <button class="book-course-btn w-full btn-primary py-3 rounded-md"
                            data-course-id="${course.id}">
                        Book Now
                    </button>
                </div>
            `;
            
            container.appendChild(card);
        });
        
        // Update course count
        document.getElementById("course-count").textContent = courses.length;
    },
    
    // Update filter button status
    updateFilterButtons: function(activeFilter) {
        document.querySelectorAll(".course-filter-btn").forEach(btn => {
            if (btn.dataset.filter === activeFilter) {
                btn.classList.add("active", "bg-primary", "text-white");
                btn.classList.remove("btn-secondary", "bg-gray-200", "text-gray-700");
            } else {
                btn.classList.remove("active", "bg-primary", "text-white");
                btn.classList.add("btn-secondary", "bg-gray-200", "text-gray-700");
            }
        });
    },
    
    // Show booking modal
    showBookingModal: function(course) {
        const modal = document.getElementById("booking-modal");
        document.getElementById("modal-course-name").textContent = course.name;
        document.getElementById("modal-course-price").textContent = `¥${course.price}/session`;
        
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    },
    
    // Hide booking modal
    hideBookingModal: function() {
        const modal = document.getElementById("booking-modal");
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
        document.getElementById("booking-form").reset();
    },
    
    // Initialize scroll animations
    initScrollAnimations: function() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll(".scroll-animate").forEach(el => {
            observer.observe(el);
        });
    },
    
    // Initialize navbar scroll effect
    initNavbarScroll: function() {
        const navbar = document.getElementById("navbar");
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                navbar.classList.add("py-2", "shadow-md");
                navbar.classList.remove("py-4", "shadow-sm");
            } else {
                navbar.classList.add("py-4", "shadow-sm");
                navbar.classList.remove("py-2", "shadow-md");
            }
        });
    },
    
    // Initialize mobile menu
    initMobileMenu: function() {
        const menuBtn = document.getElementById("mobile-menu-btn");
        const mobileMenu = document.getElementById("mobile-menu");
        const menuIcon = document.getElementById("menu-icon");
        
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            menuIcon.classList.toggle("rotate-90");
            
            if (!mobileMenu.classList.contains("hidden")) {
                mobileMenu.style.maxHeight = "0";
                setTimeout(() => {
                    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
                }, 10);
            } else {
                mobileMenu.style.maxHeight = "0";
            }
        });
    },
    
    // Initialize booking modal (only initialize structure, logic via Event Bus)
    initBookingModal: function() {
        // Modal structure defined in HTML, only initialize styles here
        const modal = document.getElementById("booking-modal");
        modal.style.zIndex = "50";
    },
    
    // Show booking success message
    showBookingSuccess: function(courseName) {
        alert(`Booking successful! You have successfully booked "${courseName}". We will contact you soon to confirm details.`);
    }
};

// 4. Controller Layer: Coordinate Model and View, communicate via Event Bus
const CourseController = {
    init: function() {
        // Initialize View
        CourseView.init();
        
        // Initial render of all courses
        const allCourses = CourseModel.filterCourses();
        CourseView.renderCourses(allCourses);
        
        // Listen to Event Bus
        this.bindEvents();
    },
    
    // Bind Event Bus events
    bindEvents: function() {
        // Filter condition change
        EventBus.on("filter:change", ({ filter }) => {
            const searchTerm = CourseModel.searchTerm;
            // Model processes data
            const filteredCourses = CourseModel.filterCourses(filter, searchTerm);
            const sortedCourses = CourseModel.sortCourses(filteredCourses, document.getElementById("sort-courses").value);
            // View renders result
            CourseView.renderCourses(sortedCourses);
            CourseView.updateFilterButtons(filter);
        });
        
        // Search keyword change
        EventBus.on("search:change", ({ searchTerm }) => {
            const filter = CourseModel.currentFilter;
            // Model processes data
            const filteredCourses = CourseModel.filterCourses(filter, searchTerm);
            const sortedCourses = CourseModel.sortCourses(filteredCourses, document.getElementById("sort-courses").value);
            // View renders result
            CourseView.renderCourses(sortedCourses);
        });
        
        // Sort type change
        EventBus.on("sort:change", ({ sortType }) => {
            const filter = CourseModel.currentFilter;
            const searchTerm = CourseModel.searchTerm;
            // Model processes data
            const filteredCourses = CourseModel.filterCourses(filter, searchTerm);
            const sortedCourses = CourseModel.sortCourses(filteredCourses, sortType);
            // View renders result
            CourseView.renderCourses(sortedCourses);
        });
        
        // Course booking click
        EventBus.on("course:book", ({ courseId }) => {
            // Model gets course details
            const course = CourseModel.getCourseById(courseId);
            if (course) {
                // View shows modal
                CourseView.showBookingModal(course);
            }
        });
        
        // Close modal
        EventBus.on("modal:close", () => {
            CourseView.hideBookingModal();
        });
        
        // Submit booking form
        EventBus.on("booking:submit", (formData) => {
            // API request logic can be added here (e.g., send booking data to server)
            console.log("Booking submission data:", formData);
            
            // View shows success message and closes modal
            CourseView.showBookingSuccess(formData.courseName);
            CourseView.hideBookingModal();
        });
    }
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    CourseController.init();
});