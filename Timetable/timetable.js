
        // Course Data Model
class Course {
    constructor(data) {
        this.type = data.type;
        this.name = data.name;
        this.coach = data.coach;
        this.time = data.time;
        this.date = data.date;
        this.remaining = parseInt(data.remaining);
    }
    
    // Book the course
    book() {
        if (this.remaining > 0) {
            this.remaining--;
            return true;
        }
        return false;
    }
}

// Booking Data Model
class Booking {
    constructor(course, formData) {
        this.id = Date.now();
        this.course = course.name;
        this.date = course.date;
        this.time = course.time;
        this.coach = course.coach;
        this.name = formData.name;
        this.phone = formData.phone;
        this.email = formData.email;
        this.notes = formData.notes;
        this.timestamp = new Date().toLocaleString();
    }
}

// Main Controller
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar');
    const weekViewBtn = document.getElementById('week-view-btn');
    const dayViewBtn = document.getElementById('day-view-btn');
    const weekView = document.getElementById('week-view');
    const dayView = document.getElementById('day-view');
    const courseTypeFilter = document.getElementById('course-type-filter');
    const courseSearch = document.getElementById('course-search');
    const prevWeekBtn = document.getElementById('prev-week');
    const nextWeekBtn = document.getElementById('next-week');
    const currentDateRange = document.getElementById('current-date-range');
    const prevDayBtn = document.getElementById('prev-day');
    const nextDayBtn = document.getElementById('next-day');
    const dayViewDate = document.getElementById('day-view-date');
    const dayViewCourses = document.getElementById('day-view-courses');
    const bookingModal = document.getElementById('booking-modal');
    const closeModal = document.getElementById('close-modal');
    const bookingForm = document.getElementById('booking-form');
    const successModal = document.getElementById('success-modal');
    const closeSuccess = document.getElementById('close-success');
    const successMessage = document.getElementById('success-message');
    
    // Current Date Settings
    let currentDate = new Date(2024, 5, 10); // June 10, 2024
    let currentView = 'week';
    
    // Load Course Data from DOM
    const courseElements = document.querySelectorAll('.course-item');
    let courses = Array.from(courseElements).map(el => {
        return new Course({
            type: el.dataset.type,
            name: el.dataset.course,
            coach: el.dataset.coach,
            time: el.dataset.time,
            date: el.dataset.date,
            remaining: el.dataset.remaining
        });
    });
    
    // Mobile Menu Toggle (Unified interaction with courses page)
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuIcon.classList.toggle('rotate-90');
        
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.style.maxHeight = "0";
            setTimeout(() => {
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + "px";
            }, 10);
        } else {
            mobileMenu.style.maxHeight = "0";
        }
    });
    
    // Navbar Scroll Effect (Unified with courses page)
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            navbar.classList.add("py-2", "shadow-md");
            navbar.classList.remove("py-4", "shadow-sm");
        } else {
            navbar.classList.add("py-4", "shadow-sm");
            navbar.classList.remove("py-2", "shadow-md");
        }
    });
    
    // View Toggle (Optimized button styles with unified btn-primary/btn-secondary)
    weekViewBtn.addEventListener('click', () => {
        currentView = 'week';
        weekView.classList.remove('hidden');
        dayView.classList.add('hidden');
        weekViewBtn.classList.add('active', 'btn-primary', 'text-white');
        weekViewBtn.classList.remove('btn-secondary', 'bg-gray-200', 'text-gray-700');
        dayViewBtn.classList.add('btn-secondary', 'bg-gray-200', 'text-gray-700');
        dayViewBtn.classList.remove('btn-primary', 'text-white');
    });
    
    dayViewBtn.addEventListener('click', () => {
        currentView = 'day';
        weekView.classList.add('hidden');
        dayView.classList.remove('hidden');
        dayViewBtn.classList.add('active', 'btn-primary', 'text-white');
        dayViewBtn.classList.remove('btn-secondary', 'bg-gray-200', 'text-gray-700');
        weekViewBtn.classList.add('btn-secondary', 'bg-gray-200', 'text-gray-700');
        weekViewBtn.classList.remove('btn-primary', 'text-white');
        renderDayView();
    });
    
    // Date Navigation
    prevWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 7);
        updateDateDisplay();
    });
    
    nextWeekBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 7);
        updateDateDisplay();
    });
    
    prevDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        dayViewDate.textContent = formatDate(currentDate);
        renderDayView();
    });
    
    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        dayViewDate.textContent = formatDate(currentDate);
        renderDayView();
    });
    
    // Update Date Display
    function updateDateDisplay() {
        const startDate = new Date(currentDate);
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 6);
        
        currentDateRange.textContent = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')} - ${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
        dayViewDate.textContent = formatDate(currentDate);
    }
    
    // Format Date Display
    function formatDate(date) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} (${weekdays[date.getDay()]})`;
    }
    
    // Render Day View Courses
    function renderDayView() {
        const targetDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
        const dayCourses = courses.filter(course => course.date === targetDate);
        
        // Clear existing content
        dayViewCourses.innerHTML = '';
        
        if (dayCourses.length === 0) {
            dayViewCourses.innerHTML = '<div class="text-center py-8 text-gray-500">No classes scheduled for this day</div>';
            return;
        }
        
        // Sort by time
        dayCourses.sort((a, b) => {
            return a.time.localeCompare(b.time);
        });
        
        // Create course elements
        dayCourses.forEach(course => {
            const courseEl = document.createElement('div');
            
            // Set styles based on course type
            let borderColor, typeClass;
            switch(course.type) {
                case 'mat':
                    borderColor = 'border-green-500';
                    typeClass = 'Beginner Class';
                    break;
                case 'reformer':
                    borderColor = course.name.includes('Intermediate') ? 'border-blue-600' : 'border-blue-500';
                    typeClass = course.name.includes('Intermediate') ? 'Intermediate Class' : 'Beginner Class';
                    break;
                case 'postnatal':
                    borderColor = 'border-purple-500';
                    typeClass = 'Postnatal Recovery';
                    break;
                case 'rehab':
                    borderColor = 'border-red-500';
                    typeClass = 'Rehabilitation';
                    break;
                case 'private':
                    borderColor = 'border-yellow-500';
                    typeClass = 'Private Session';
                    break;
            }
            
            courseEl.className = `border-l-4 ${borderColor} pl-6 py-2 hover:bg-gray-50 rounded transition-colors fade-in`;
            courseEl.dataset.type = course.type;
            
            courseEl.innerHTML = `
                <div class="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
                    <div>
                        <h3 class="text-xl font-semibold">${course.name}</h3>
                        <p class="text-gray-600">Instructor: ${course.coach}</p>
                        <div class="flex flex-wrap gap-2 mt-2">
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">${typeClass}</span>
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">60 Minutes</span>
                            <span class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Spots Left: ${course.remaining}</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div class="text-lg font-medium mb-3">${course.time}</div>
                        <button class="book-course-btn btn-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md transition-colors ${course.remaining <= 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                                data-course="${course.name}" 
                                data-time="${course.time}" 
                                data-date="${course.date}"
                                data-coach="${course.coach}"
                                ${course.remaining <= 0 ? 'disabled' : ''}>
                            ${course.remaining <= 0 ? 'Fully Booked' : 'Book Now'}
                        </button>
                    </div>
                </div>
            `;
            
            dayViewCourses.appendChild(courseEl);
        });
        
        // Attach event listeners to newly created booking buttons
        attachBookButtonEvents();
    }
    
    // Course Filter Function
    function filterCourses() {
        const selectedType = courseTypeFilter.value;
        const searchTerm = courseSearch.value.toLowerCase().trim();
        const courseItems = document.querySelectorAll('.course-item, #day-view .border-l-4');
        
        courseItems.forEach(item => {
            const type = item.dataset.type;
            const courseName = (item.dataset.course || item.querySelector('h3')?.textContent || '').toLowerCase();
            const coachName = (item.dataset.coach || item.querySelector('.text-gray-600')?.textContent?.replace('Instructor: ', '') || '').toLowerCase();
            
            const typeMatch = selectedType === 'all' || type === selectedType;
            const searchMatch = !searchTerm || courseName.includes(searchTerm) || coachName.includes(searchTerm);
            
            if (typeMatch && searchMatch) {
                item.style.display = '';
                if (currentView === 'day') item.classList.add('fade-in');
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Filter Event Listeners
    courseTypeFilter.addEventListener('change', filterCourses);
    courseSearch.addEventListener('input', filterCourses);
    
    // Open Booking Modal
    function attachBookButtonEvents() {
        const bookButtons = document.querySelectorAll('.book-course-btn:not([disabled])');
        
        bookButtons.forEach(button => {
            button.addEventListener('click', () => {
                const course = button.dataset.course;
                const time = button.dataset.time;
                const date = button.dataset.date;
                const coach = button.dataset.coach;
                
                // Populate form data
                document.getElementById('booking-course').value = course;
                document.getElementById('booking-time').value = time;
                document.getElementById('booking-date').value = date;
                document.getElementById('booking-coach').value = coach;
                
                // Display course preview
                document.getElementById('booking-preview').innerHTML = 
                    `Course: ${course} | Time: ${date} ${time} | Instructor: ${coach}`;
                
                // Show modal (using unified active class)
                bookingModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });
    }
    
    // Close Booking Modal
    closeModal.addEventListener('click', () => {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close Success Modal
    closeSuccess.addEventListener('click', () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close Modal When Clicking Outside
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Course Item Click Event (Week View)
    document.querySelectorAll('.course-item').forEach(item => {
        item.addEventListener('click', () => {
            // Check if there are remaining spots
            const remaining = parseInt(item.dataset.remaining);
            if (remaining <= 0) return;
            
            // Simulate booking button click effect
            const virtualButton = {
                dataset: {
                    course: item.dataset.course,
                    time: item.dataset.time,
                    date: item.dataset.date,
                    coach: item.dataset.coach
                }
            };
            
            // Populate form data
            document.getElementById('booking-course').value = virtualButton.dataset.course;
            document.getElementById('booking-time').value = virtualButton.dataset.time;
            document.getElementById('booking-date').value = virtualButton.dataset.date;
            document.getElementById('booking-coach').value = virtualButton.dataset.coach;
            
            // Display course preview
            document.getElementById('booking-preview').innerHTML = 
                `Course: ${virtualButton.dataset.course} | Time: ${virtualButton.dataset.date} ${virtualButton.dataset.time} | Instructor: ${virtualButton.dataset.coach}`;
            
            // Show modal
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Handle Booking Form Submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('booking-name').value,
            phone: document.getElementById('booking-phone').value,
            email: document.getElementById('booking-email').value,
            notes: document.getElementById('booking-notes').value
        };
        
        // Get course information
        const courseName = document.getElementById('booking-course').value;
        const courseTime = document.getElementById('booking-time').value;
        const courseDate = document.getElementById('booking-date').value;
        
        // Find the corresponding course
        const course = courses.find(c => 
            c.name === courseName && 
            c.time === courseTime && 
            c.date === courseDate
        );
        
        if (course && course.book()) {
            // Create booking record
            const booking = new Booking(course, formData);
            
            // Save to local storage
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Update remaining spots display
            updateRemainingDisplay(course);
            
            // Display success message
            successMessage.textContent = 
                `You have successfully booked ${course.name}!\nDate: ${course.date} ${course.time}\nA confirmation SMS will be sent to your phone.`;
            
            // Close booking modal and show success modal
            bookingModal.classList.remove('active');
            successModal.classList.add('active');
            
            // Reset form
            bookingForm.reset();
        } else {
            alert('Booking failed. This course is fully booked.');
        }
    });
    
    // Update Remaining Spots Display
    function updateRemainingDisplay(course) {
        // Update week view
        document.querySelectorAll(`.course-item[data-course="${course.name}"][data-time="${course.time}"][data-date="${course.date}"]`).forEach(el => {
            el.dataset.remaining = course.remaining;
            el.querySelector('.course-remaining').textContent = `Spots left: ${course.remaining}`;
            
            // Add visual indication if fully booked
            if (course.remaining <= 0) {
                el.classList.add('opacity-70');
                el.classList.remove('cursor-pointer', 'hover:shadow-md');
            }
        });
        
        // Re-render if current view is day view and course date matches
        if (currentView === 'day' && dayViewDate.textContent.includes(course.date)) {
            renderDayView();
        }
    }
    
    // Initialization
    updateDateDisplay();
    attachBookButtonEvents();
});