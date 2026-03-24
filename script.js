document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up').forEach(el => {
        observer.observe(el);
    });

    // Carousel Logic
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    let currentIndex = 0;
    let slideWidth = slides[0].getBoundingClientRect().width;
    let gap = parseFloat(window.getComputedStyle(track).gap) || 24; // 1.5rem = 24px

    // Recalculate on resize
    window.addEventListener('resize', () => {
        if(slides.length > 0) {
            slideWidth = slides[0].getBoundingClientRect().width;
            gap = parseFloat(window.getComputedStyle(track).gap) || 24;
            updateCarousel();
        }
        createIndicators();
    });

    function getMaxIndex() {
        if (window.innerWidth <= 1024) {
            return slides.length - 1;
        }
        // At desktop we show 2 slides, so max index is length - 2
        return Math.max(0, slides.length - 2);
    }

    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        const count = getMaxIndex() + 1;
        
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            indicatorsContainer.appendChild(dot);
        }
    }

    createIndicators();

    function updateCarousel() {
        const maxIndex = getMaxIndex();
        
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        if (currentIndex < 0) currentIndex = 0;

        const moveAmount = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${moveAmount}px)`;

        // Update buttons
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        
        nextBtn.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';

        // Update indicators
        const dots = Array.from(indicatorsContainer.children);
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        prevTranslate = -moveAmount;
    }

    nextBtn.addEventListener('click', () => {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Drag to scroll functionality
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    // Mouse Events
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('mouseleave', dragEnd);
    track.addEventListener('mousemove', drag);

    // Touch Events
    track.addEventListener('touchstart', dragStart, {passive: true});
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('touchmove', drag, {passive: true});

    function dragStart(event) {
        if(event.type.includes('mouse')) {
            startPos = event.pageX;
        } else {
            startPos = event.touches[0].clientX;
        }
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        track.style.transition = 'none'; // remove transition while dragging
    }

    function drag(event) {
        if (isDragging) {
            const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function dragEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Threshold for snapping to next/prev slide
        if (movedBy < -50) {
            currentIndex += 1;
        } else if (movedBy > 50) {
            currentIndex -= 1;
        }
        
        updateCarousel();
    }

    function animation() {
        if(isDragging) {
            track.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }

    // Initialize layout
    updateCarousel();
});
