/* ==========================================================================
   JAY CAR TRAVELS & SERVICES - INTERACTIVE JAVASCRIPT
   Includes Real Reviews System with LocalStorage Persistence
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. PRELOADER
       ---------------------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }
        }, 300);
    });
    // Fallback timer
    setTimeout(() => {
        if (preloader && preloader.style.opacity !== '0') {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
    }, 1000);

    /* ----------------------------------------------------------------------
       2. STICKY HEADER & MOBILE NAVIGATION
       ---------------------------------------------------------------------- */
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 350) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active Link Highlight
        let currentSection = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (mobileToggle.querySelector('i')) {
                    mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }

    /* ----------------------------------------------------------------------
       3. HERO SWIPER CAROUSEL
       ---------------------------------------------------------------------- */
    if (typeof Swiper !== 'undefined') {
        new Swiper('.heroSwiper', {
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            speed: 700,
            effect: 'slide',
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    /* ----------------------------------------------------------------------
       4. ANIMATED COUNTERS ON SCROLL
       ---------------------------------------------------------------------- */
    const counterNumbers = document.querySelectorAll('.counter-number');
    let countersStarted = false;

    function startCounters() {
        const counterSection = document.querySelector('.counter-section');
        if (!counterSection) return;

        const sectionTop = counterSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 80 && !countersStarted) {
            countersStarted = true;

            counterNumbers.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                const duration = 1800;
                const increment = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                }, 16);
            });
        }
    }

    window.addEventListener('scroll', startCounters);
    startCounters();

    /* ----------------------------------------------------------------------
       5. PHOTO GALLERY LIGHTBOX MODAL
       ---------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const overlayTitle = item.querySelector('.g-overlay h4')?.textContent || '';

            if (lightbox && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxCaption.innerHTML = `<strong>${overlayTitle}</strong>`;
                lightbox.classList.add('show');
            }
        });
    });

    if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('show');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('show');
            }
        });
    }

    /* ----------------------------------------------------------------------
       6. REAL CUSTOMER REVIEWS SYSTEM WITH LOCALSTORAGE
       ---------------------------------------------------------------------- */
    const defaultReviews = [
        {
            name: "Ravi",
            rating: 5,
            message: "Excellent Service. Very clean vehicle.",
            location: "Ongole",
            date: "Recent"
        },
        {
            name: "Kiran",
            rating: 5,
            message: "Best travel experience.",
            location: "Tirupati Tour",
            date: "Recent"
        },
        {
            name: "Sunitha",
            rating: 5,
            message: "Professional driver and affordable prices.",
            location: "Airport Transfer",
            date: "Recent"
        },
        {
            name: "Mahesh",
            rating: 5,
            message: "Highly recommended.",
            location: "Outstation Trip",
            date: "Recent"
        }
    ];

    // Load stored reviews or initialize with defaults
    function getStoredReviews() {
        const stored = localStorage.getItem('jay_car_reviews');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return defaultReviews;
            }
        } else {
            localStorage.setItem('jay_car_reviews', JSON.stringify(defaultReviews));
            return defaultReviews;
        }
    }

    function saveStoredReviews(reviews) {
        localStorage.setItem('jay_car_reviews', JSON.stringify(reviews));
    }

    const reviewsGrid = document.getElementById('reviews-grid');
    const avgRatingScore = document.getElementById('avg-rating-score');
    const avgRatingStars = document.getElementById('avg-rating-stars');
    const totalReviewsCount = document.getElementById('total-reviews-count');
    const openReviewFormBtn = document.getElementById('open-review-form-btn');
    const closeReviewFormBtn = document.getElementById('close-review-form-btn');
    const reviewFormBox = document.getElementById('review-form-box');
    const addReviewForm = document.getElementById('add-review-form');
    const starPicker = document.getElementById('star-picker');
    const reviewRatingVal = document.getElementById('review-rating-val');

    function renderReviews() {
        const reviews = getStoredReviews();
        if (!reviewsGrid) return;

        reviewsGrid.innerHTML = '';
        let totalRatingSum = 0;

        reviews.forEach(rev => {
            totalRatingSum += rev.rating;

            let starIcons = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rev.rating) {
                    starIcons += '<i class="fa-solid fa-star"></i>';
                } else {
                    starIcons += '<i class="fa-regular fa-star"></i>';
                }
            }

            const card = document.createElement('div');
            card.className = 'review-card clean-card';
            card.innerHTML = `
                <div>
                    <div class="stars">${starIcons}</div>
                    <p class="quote">"${rev.message}"</p>
                </div>
                <div class="review-client-info">
                    <div class="review-avatar">${rev.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <h4>${rev.name}</h4>
                        <span>${rev.location || 'Verified Traveler'}</span>
                    </div>
                </div>
            `;
            reviewsGrid.appendChild(card);
        });

        // Update Average Rating Header Summary
        const avg = reviews.length > 0 ? (totalRatingSum / reviews.length).toFixed(1) : '5.0';
        if (avgRatingScore) avgRatingScore.textContent = avg;
        if (totalReviewsCount) totalReviewsCount.textContent = `Based on ${reviews.length} review${reviews.length > 1 ? 's' : ''}`;

        if (avgRatingStars) {
            let avgStarsHtml = '';
            const numericAvg = parseFloat(avg);
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.round(numericAvg)) {
                    avgStarsHtml += '<i class="fa-solid fa-star"></i>';
                } else {
                    avgStarsHtml += '<i class="fa-regular fa-star"></i>';
                }
            }
            avgRatingStars.innerHTML = avgStarsHtml;
        }
    }

    renderReviews();

    // Toggle Review Form visibility
    if (openReviewFormBtn && reviewFormBox) {
        openReviewFormBtn.addEventListener('click', () => {
            reviewFormBox.style.display = reviewFormBox.style.display === 'none' ? 'block' : 'none';
            if (reviewFormBox.style.display === 'block') {
                reviewFormBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    if (closeReviewFormBtn && reviewFormBox) {
        closeReviewFormBtn.addEventListener('click', () => {
            reviewFormBox.style.display = 'none';
        });
    }

    // Interactive Star Rating Selection
    if (starPicker) {
        const stars = starPicker.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const selectedRating = parseInt(star.getAttribute('data-rating'), 10);
                reviewRatingVal.value = selectedRating;

                stars.forEach(s => {
                    const r = parseInt(s.getAttribute('data-rating'), 10);
                    if (r <= selectedRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
        // Pre-set 5 stars by default
        stars.forEach(s => s.classList.add('active'));
    }

    // Submit Review Form Handler
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('review-name').value.trim();
            const rating = parseInt(reviewRatingVal.value, 10) || 5;
            const message = document.getElementById('review-msg').value.trim();

            if (!name || !message) return;

            const newReview = {
                name: name,
                rating: rating,
                message: message,
                location: "Verified Traveler",
                date: "Just now"
            };

            const currentReviews = getStoredReviews();
            currentReviews.unshift(newReview); // Add new review at top
            saveStoredReviews(currentReviews);

            renderReviews();

            // Reset form
            addReviewForm.reset();
            reviewRatingVal.value = 5;
            if (starPicker) {
                starPicker.querySelectorAll('i').forEach(s => s.classList.add('active'));
            }
            reviewFormBox.style.display = 'none';

            alert('Thank you! Your review has been published successfully.');
        });
    }

    /* ----------------------------------------------------------------------
       7. QUICK WHATSAPP FORM HANDLER
       ---------------------------------------------------------------------- */
    const whatsappForm = document.getElementById('whatsapp-form');
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('cust-name').value.trim();
            const phone = document.getElementById('cust-phone').value.trim();
            const vehicle = document.getElementById('cust-vehicle').value;
            const date = document.getElementById('cust-date').value.trim() || 'As soon as possible';

            let msg = `Hello Jay Car Travels %26 Services,%0A%0A`;
            msg += `I would like to inquire about a booking:%0A`;
            msg += `*Name:* ${encodeURIComponent(name)}%0A`;
            msg += `*Phone:* ${encodeURIComponent(phone)}%0A`;
            msg += `*Vehicle/Service:* ${encodeURIComponent(vehicle)}%0A`;
            msg += `*Travel Date:* ${encodeURIComponent(date)}%0A%0A`;
            msg += `Please contact me with availability and details. Thank you!`;

            const whatsappUrl = `https://wa.me/919704192287?text=${msg}`;
            window.open(whatsappUrl, '_blank');
        });
    }

});
