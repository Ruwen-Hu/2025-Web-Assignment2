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
    
    // Helper Functions
    function parseHTMLDate(dateStr) {
        const months = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3,
            'May': 4, 'June': 5, 'July': 6, 'August': 7,
            'September': 8, 'October': 9, 'November': 10, 'December': 11
        };
        
        const parts = dateStr.split(' ');
        const month = months[parts[0]];
        const day = parseInt(parts[1].replace(',', ''));
        const year = parseInt(parts[2]);
        
        return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    
    function formatDateForDisplay(date) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} (${weekdays[date.getDay()]})`;
    }
    
    function formatDateForComparison(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }
    
    // Load Course Data from DOM 
    const courseElements = document.querySelectorAll('.course-item');
    let courses = Array.from(courseElements).map(el => {
        return new Course({
            type: el.dataset.type,
            name: el.dataset.course,
            coach: el.dataset.coach,
            time: el.dataset.time,
            date: parseHTMLDate(el.dataset.date), 
            remaining: parseInt(el.dataset.remaining) || 0
        });
    });
    
    // Mobile Menu Toggle 
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        menuIcon.classList.toggle('fa-times');
        
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.style.display = 'block';
            setTimeout(() => {
                mobileMenu.style.transform = 'translateY(0)';
            }, 10);
        } else {
            mobileMenu.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                mobileMenu.style.display = 'none';
            }, 300);
        }
    });
    
    // Navbar Scroll Effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            navbar.classList.add("py-2", "shadow-md");
            navbar.classList.remove("py-4", "shadow-sm");
        } else {
            navbar.classList.add("py-4", "shadow-sm");
            navbar.classList.remove("py-2", "shadow-md");
        }
    });
    
    // View Toggle 
    weekViewBtn.addEventListener('click', () => {
        currentView = 'week';
        weekView.style.display = 'block';
        dayView.style.display = 'none';
        
        weekViewBtn.classList.remove('btn-secondary');
        weekViewBtn.classList.add('btn-primary', 'active');
        dayViewBtn.classList.remove('btn-primary', 'active');
        dayViewBtn.classList.add('btn-secondary');
    });
    
    dayViewBtn.addEventListener('click', () => {
        currentView = 'day';
        weekView.style.display = 'none';
        dayView.style.display = 'block';
        dayView.classList.add('active');
         
        dayViewBtn.classList.remove('btn-secondary');
        dayViewBtn.classList.add('btn-primary', 'active');
        weekViewBtn.classList.remove('btn-primary', 'active');
        weekViewBtn.classList.add('btn-secondary');
        
        renderDayView();
    });
    
   
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
        renderDayView();
    });
    
    nextDayBtn.addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        renderDayView();
    });
    
    // Update Date Display 
    function updateDateDisplay() {
        const startDate = new Date(currentDate);
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 6);
        
        currentDateRange.textContent = `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`;
        dayViewDate.textContent = formatDateForDisplay(currentDate);
    }
    
    // Render Day View Courses 
    function renderDayView() {
        const targetDate = formatDateForComparison(currentDate);
        const dayCourses = courses.filter(course => course.date === targetDate);
        
        dayViewDate.textContent = formatDateForDisplay(currentDate);
        
        dayViewCourses.innerHTML = '';
        
        if (dayCourses.length === 0) {
            dayViewCourses.innerHTML = '<div class="text-center py-8 text-gray-500">No classes scheduled for this day</div>';
            return;
        }
        
        dayCourses.sort((a, b) => a.time.localeCompare(b.time));
        
        dayCourses.forEach(course => {
            const courseEl = document.createElement('div');
            
            let borderColor, bgColor, typeClass;
            switch(course.type) {
                case 'mat':
                    borderColor = 'border-l-green-500';
                    bgColor = 'bg-green-50';
                    typeClass = 'Beginner Class';
                    break;
                case 'reformer':
                    borderColor = course.name.includes('Intermediate') ? 'border-l-blue-600' : 'border-l-blue-500';
                    bgColor = 'bg-blue-50';
                    typeClass = course.name.includes('Intermediate') ? 'Intermediate Class' : 'Beginner Class';
                    break;
                case 'postnatal':
                    borderColor = 'border-l-purple-500';
                    bgColor = 'bg-purple-50';
                    typeClass = 'Postnatal Recovery';
                    break;
                case 'rehab':
                    borderColor = 'border-l-red-500';
                    bgColor = 'bg-red-50';
                    typeClass = 'Rehabilitation';
                    break;
                case 'private':
                    borderColor = 'border-l-yellow-500';
                    bgColor = 'bg-yellow-50';
                    typeClass = 'Private Session';
                    break;
            }
            
            courseEl.className = `border-l-4 ${borderColor} ${bgColor} pl-6 py-4 hover:bg-gray-50 rounded transition-colors fade-in`;
            courseEl.dataset.type = course.type;
            
            courseEl.innerHTML = `
                <div class="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-gray-800">${course.name}</h3>
                        <p class="text-gray-600 mt-1">Instructor: ${course.coach}</p>
                        <div class="flex flex-wrap gap-2 mt-3">
                            <span class="text-xs bg-white text-gray-700 px-3 py-1 rounded border">${typeClass}</span>
                            <span class="text-xs bg-white text-gray-700 px-3 py-1 rounded border">60 Minutes</span>
                            <span class="text-xs bg-white text-gray-700 px-3 py-1 rounded border">Spots Left: ${course.remaining}</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div class="text-lg font-medium text-gray-700 mb-3">${course.time}</div>
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
        
        attachBookButtonEvents();
    }
    
    // Course Filter Function 
    function filterCourses() {
        const selectedType = courseTypeFilter.value;
        const searchTerm = courseSearch.value.toLowerCase().trim();
        
        if (currentView === 'week') {

            const courseItems = document.querySelectorAll('#week-view .course-item');
            
            courseItems.forEach(item => {
                const type = item.dataset.type;
                const courseName = item.dataset.course.toLowerCase();
                const coachName = item.dataset.coach.toLowerCase();
                
                const typeMatch = selectedType === 'all' || type === selectedType;
                const searchMatch = !searchTerm || courseName.includes(searchTerm) || coachName.includes(searchTerm);
                
                if (typeMatch && searchMatch) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        } else {

            renderDayView();
        }
    }
    
    // Filter Event Listeners
    courseTypeFilter.addEventListener('change', filterCourses);
    courseSearch.addEventListener('input', filterCourses);
    
    // Open Booking Modal 
    function attachBookButtonEvents() {
        const bookButtons = document.querySelectorAll('.book-course-btn:not([disabled])');
        
        bookButtons.forEach(button => {
            
            button.replaceWith(button.cloneNode(true));
        });
        
       
        document.querySelectorAll('.book-course-btn:not([disabled])').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const course = button.dataset.course;
                const time = button.dataset.time;
                const date = button.dataset.date;
                const coach = button.dataset.coach;
                
                document.getElementById('booking-course').value = course;
                document.getElementById('booking-time').value = time;
                document.getElementById('booking-date').value = date;
                document.getElementById('booking-coach').value = coach;
                
                document.getElementById('booking-preview').innerHTML = 
                    `<strong>Course:</strong> ${course}<br>
                     <strong>Time:</strong> ${time}<br>
                     <strong>Date:</strong> ${date}<br>
                     <strong>Instructor:</strong> ${coach}`;
                
                bookingModal.classList.add('active');
                document.body.style.overflow = 'hidden';
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
    
    // Course Item Click Event (Week View) -
    document.querySelectorAll('#week-view .course-item').forEach(item => {
        item.addEventListener('click', () => {
            const remaining = parseInt(item.dataset.remaining);
            if (remaining <= 0) return;
            
            const course = {
                name: item.dataset.course,
                time: item.dataset.time,
                date: parseHTMLDate(item.dataset.date),
                coach: item.dataset.coach
            };
            
            document.getElementById('booking-course').value = course.name;
            document.getElementById('booking-time').value = course.time;
            document.getElementById('booking-date').value = course.date;
            document.getElementById('booking-coach').value = course.coach;
            
            document.getElementById('booking-preview').innerHTML = 
                `<strong>Course:</strong> ${course.name}<br>
                 <strong>Time:</strong> ${course.time}<br>
                 <strong>Date:</strong> ${item.dataset.date}<br>
                 <strong>Instructor:</strong> ${course.coach}`;
            
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Handle Booking Form Submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('booking-name').value,
            phone: document.getElementById('booking-phone').value,
            email: document.getElementById('booking-email').value,
            notes: document.getElementById('booking-notes').value
        };
        
        const courseName = document.getElementById('booking-course').value;
        const courseTime = document.getElementById('booking-time').value;
        const courseDate = document.getElementById('booking-date').value;
        
        const course = courses.find(c => 
            c.name === courseName && 
            c.time === courseTime && 
            c.date === courseDate
        );
        
        if (course && course.book()) {
          
            const booking = new Booking(course, formData);
            
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            updateRemainingDisplay(course);
            
            successMessage.textContent = 
                `You have successfully booked ${course.name}!\nDate: ${course.date} ${course.time}\nA confirmation SMS will be sent to your phone.`;
            
            bookingModal.classList.remove('active');
            successModal.classList.add('active');
            
            bookingForm.reset();
        } else {
            alert('Booking failed. This course is fully booked.');
        }
    });
    
    // Update Remaining Spots Display 
    function updateRemainingDisplay(course) {
        document.querySelectorAll(`.course-item[data-course="${course.name}"]`).forEach(el => {
            const elTime = el.dataset.time;
            const elDate = parseHTMLDate(el.dataset.date);
            
            if (elTime === course.time && elDate === course.date) {
                el.dataset.remaining = course.remaining;
                const remainingSpan = el.querySelector('.course-remaining');
                if (remainingSpan) {
                    remainingSpan.textContent = `Spots left: ${course.remaining}`;
                }
                
                if (course.remaining <= 0) {
                    el.classList.add('opacity-70');
                    el.style.cursor = 'not-allowed';
                }
            }
        });
        
        if (currentView === 'day') {
            const currentDay = formatDateForComparison(currentDate);
            if (course.date === currentDay) {
                renderDayView();
            }
        }
    }
    
    // Initialization 
    function init() {
        updateDateDisplay();
        attachBookButtonEvents();
        
        weekViewBtn.classList.add('btn-primary', 'active');
        dayViewBtn.classList.add('btn-secondary');
        weekView.style.display = 'block';
        dayView.style.display = 'none';
    }
    
    init();
});