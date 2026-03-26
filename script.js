document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal 
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up').forEach(el => observer.observe(el));

    // Mobile Nav
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Auto-Carousel (6 seconds, pause on hover)
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const indicatorsContainer = document.getElementById('carouselIndicators');
    const carouselContainer = document.getElementById('carousel');
    
    let currentIndex = 0;
    let timer;

    // Create Indicators
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
            resetTimer();
        });
        indicatorsContainer.appendChild(dot);
    });

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        Array.from(indicatorsContainer.children).forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
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

    function startTimer() {
        // 6000ms = 6 seconds per user spec
        timer = setInterval(nextSlide, 6000);
    }

    function resetTimer() {
        clearInterval(timer);
        startTimer();
    }

    carouselContainer.addEventListener('mouseenter', () => clearInterval(timer));
    carouselContainer.addEventListener('mouseleave', startTimer);

    startTimer();
});
