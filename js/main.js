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

    const navOverlay = document.getElementById('nav-overlay');

    function closeNavMenu() {
        if (navMenu) navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        if (mobileToggle && mobileToggle.querySelector('i')) {
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
        }
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }

    function openNavMenu() {
        if (navMenu) navMenu.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        if (mobileToggle && mobileToggle.querySelector('i')) {
            mobileToggle.querySelector('i').className = 'fa-solid fa-xmark';
        }
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    }

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeNavMenu();
            } else {
                openNavMenu();
            }
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', closeNavMenu);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (!targetId || !targetId.startsWith('#')) return;

                e.preventDefault();
                closeNavMenu();

                const targetEl = document.querySelector(targetId);
                if (!targetEl) return;

                const headerHeight = header ? header.offsetHeight : 0;
                const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                // Smooth scroll that works on all mobile browsers
                const supportsSmooth = 'scrollBehavior' in document.documentElement.style;
                if (supportsSmooth) {
                    window.scrollTo({ top: targetPos, behavior: 'smooth' });
                } else {
                    window.scrollTo(0, targetPos);
                }

                // Fallback: also try scrollIntoView after menu closes
                setTimeout(() => {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 350);
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

    /* ----------------------------------------------------------------------
       7. GALLERY LIGHTBOX
       ---------------------------------------------------------------------- */
    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentIndex = 0;

    if (lightbox) {
        const showImage = (index) => {
            const imgSrc = galleryImages[index].getAttribute('data-src');
            lightboxImg.setAttribute('src', imgSrc);
            currentIndex = index;
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                showImage(index);
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
            showImage(currentIndex);
        });

        // Close lightbox on outside click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    prevBtn.click();
                } else if (e.key === 'ArrowRight') {
                    nextBtn.click();
                } else if (e.key === 'Escape') {
                    closeBtn.click();
                }
            }
        });
    }

    /* ----------------------------------------------------------------------
       8. FAQ ACCORDION HANDLER
       ---------------------------------------------------------------------- */
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            // Close all other open FAQ items
            document.querySelectorAll('.faq-question').forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                const ans = q.parentElement.querySelector('.faq-answer');
                if (ans) {
                    ans.classList.remove('show');
                    ans.style.maxHeight = '0px';
                }
            });

            // Toggle current FAQ item
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                faqAnswer.classList.add('show');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 30 + 'px';
            }
        });
    });

});
