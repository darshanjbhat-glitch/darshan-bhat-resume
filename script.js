document.addEventListener('DOMContentLoaded', () => {
    // --- NAVIGATION & DOM LOGIC ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll Reveal Logic
    const revealElements = document.querySelectorAll('.slide-up, .fade-in, .slide-in-right');
    const revealOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // Disable animations perfectly on PDF Print
    window.addEventListener('beforeprint', () => {
        revealElements.forEach(el => el.classList.add('visible'));
    });


    // --- CAROUSEL LOGIC ---
    const track = document.querySelector('.carousel-track');
    if (!track) return;
    
    const originalSlides = Array.from(track.children);
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const carouselContainer = document.querySelector('.impact-carousel');
    
    const slideCount = originalSlides.length;
    let currentIndex = 1;
    let timer;
    let isTransitioning = false;

    // Setup Dots
    originalSlides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            if (isTransitioning) return;
            currentIndex = i + 1;
            updateCarousel();
            resetTimer();
        });
        indicatorsContainer.appendChild(dot);
    });

    // Clone Infinite Loop Nodes
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[slideCount - 1].cloneNode(true);
    
    firstClone.id = 'first-clone';
    lastClone.id = 'last-clone';
    
    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);
    
    track.style.transition = 'none';
    track.style.transform = 'translateX(-100%)';

    function updateCarousel() {
        isTransitioning = true;
        track.style.transition = 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        
        let dotIndex = currentIndex - 1;
        if (currentIndex === 0) dotIndex = slideCount - 1;
        if (currentIndex === slideCount + 1) dotIndex = 0;

        Array.from(indicatorsContainer.children).forEach((dot, index) => {
            dot.classList.toggle('active', index === dotIndex);
        });
    }

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        
        const currentSlide = track.children[currentIndex];
        if (currentSlide.id === 'first-clone') {
            track.style.transition = 'none';
            currentIndex = 1;
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        }
        if (currentSlide.id === 'last-clone') {
            track.style.transition = 'none';
            currentIndex = slideCount;
            track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        }
    });

    function nextSlide() {
        if (isTransitioning) return;
        currentIndex++;
        updateCarousel();
    }

    function prevSlide() {
        if (isTransitioning) return;
        currentIndex--;
        updateCarousel();
    }

    document.getElementById('nextSlideBtn').addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    document.getElementById('prevSlideBtn').addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    carouselContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) { nextSlide(); resetTimer(); }
        if (touchEndX > touchStartX + 50) { prevSlide(); resetTimer(); }
    }, {passive: true});

    function startTimer() {
        timer = setInterval(nextSlide, 10000);
    }

    function resetTimer() {
        clearInterval(timer);
        startTimer();
    }

    carouselContainer.addEventListener('mouseenter', () => clearInterval(timer));
    carouselContainer.addEventListener('mouseleave', startTimer);

    startTimer();
});
