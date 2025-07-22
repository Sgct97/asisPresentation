// Presentation State
let currentSlide = 1;
const totalSlides = 15; // Updated for new slides 5-9

// DOM Elements
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressFill = document.querySelector('.progress-fill');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializePresentation();
    setupEventListeners();
    setupKeyboardNavigation();
    animateSlideElements(currentSlide);
});

// Initialize Presentation
function initializePresentation() {
    // Hide all slides except the first
    slides.forEach((slide, index) => {
        if (index !== 0) {
            slide.classList.remove('active');
        }
    });
    
    updateProgressBar();
    updateNavigationButtons();
}

// Event Listeners
function setupEventListeners() {
    // Navigation buttons
    prevBtn.addEventListener('click', previousSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Quiz card interactions
    const quizCards = document.querySelectorAll('.quiz-card');
    quizCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('revealed');
        });
    });
    
    // Pyramid level hover effects
    const pyramidLevels = document.querySelectorAll('.pyramid-level');
    pyramidLevels.forEach(level => {
        level.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-50%) scale(1.05)';
        });
        level.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(-50%) scale(1)';
        });
    });
}

// Keyboard Navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                previousSlide();
                break;
            case 'ArrowRight':
            case ' ':
                nextSlide();
                break;
            case 'Escape':
                // Could add fullscreen toggle here
                break;
        }
    });
}

// Navigation Functions
function nextSlide() {
    if (currentSlide < totalSlides) {
        slides[currentSlide - 1].classList.remove('active');
        currentSlide++;
        slides[currentSlide - 1].classList.add('active');
        
        updateProgressBar();
        updateNavigationButtons();
        animateSlideElements(currentSlide);
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        slides[currentSlide - 1].classList.remove('active');
        currentSlide--;
        slides[currentSlide - 1].classList.add('active');
        
        updateProgressBar();
        updateNavigationButtons();
        animateSlideElements(currentSlide);
    }
}

// Update UI Elements
function updateProgressBar() {
    const progress = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;
}

function updateNavigationButtons() {
    prevBtn.style.opacity = currentSlide === 1 ? '0.3' : '1';
    prevBtn.style.pointerEvents = currentSlide === 1 ? 'none' : 'auto';
    
    nextBtn.style.opacity = currentSlide === totalSlides ? '0.3' : '1';
    nextBtn.style.pointerEvents = currentSlide === totalSlides ? 'none' : 'auto';
}

// Slide Animations
function animateSlideElements(slideNumber) {
    const activeSlide = slides[slideNumber - 1];
    const fadeUpElements = activeSlide.querySelectorAll('.fade-up');
    
    // Reset animations
    fadeUpElements.forEach(element => {
        element.classList.remove('animate');
    });
    
    // Trigger animations with delays
    setTimeout(() => {
        fadeUpElements.forEach(element => {
            const delay = element.getAttribute('data-delay') || 0;
            setTimeout(() => {
                element.classList.add('animate');
            }, delay * 1000);
        });
    }, 100);
    
    // Special animations for specific slides
    switch(slideNumber) {
        case 1:
            animateTitleSlide();
            break;
        case 2:
            animateStorySlide();
            break;
        case 3:
            animatePyramidSlide();
            break;
        case 4:
            animateQuizSlide();
            break;
        case 5:
            animateAutomationSlide();
            break;
    }
}

// Specific Slide Animations
function animateTitleSlide() {
    const brandWave = document.querySelector('.brand-wave');
    if (brandWave) {
        brandWave.style.animation = 'wave 20s ease-in-out infinite';
    }
}

function animateStorySlide() {
    const impactNumber = document.querySelector('.impact-number');
    if (impactNumber) {
        animateNumber(impactNumber, 0, 35, 'M', 1500);
    }
}

function animatePyramidSlide() {
    const pyramidLevels = document.querySelectorAll('.pyramid-level');
    pyramidLevels.forEach((level, index) => {
        setTimeout(() => {
            level.style.opacity = '0';
            level.style.transform = 'translateX(-50%) translateY(20px)';
            
            setTimeout(() => {
                level.style.transition = 'all 0.6s ease-out';
                level.style.opacity = '1';
                level.style.transform = 'translateX(-50%) translateY(0)';
            }, 100);
        }, index * 200);
    });
}

function animateQuizSlide() {
    const quizCards = document.querySelectorAll('.quiz-card');
    quizCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 150));
    });
}

function animateAutomationSlide() {
    const winStats = document.querySelectorAll('.win-stat');
    winStats.forEach((stat, index) => {
        const value = parseInt(stat.textContent);
        setTimeout(() => {
            animateNumber(stat, 0, value, '%', 1200);
        }, 300 + (index * 200));
    });
}



// Utility Functions
function animateNumber(element, start, end, suffix, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Touch Support for Mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }
}

// Fullscreen Support
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Add fullscreen toggle on double-click
document.addEventListener('dblclick', toggleFullscreen);

// Presenter Notes (for future implementation)
const presenterNotes = {
    1: "Welcome everyone to this important presentation on AI in Physical Security. Today we'll explore both the opportunities and threats that AI presents to our industry.",
    2: "This Hong Kong incident from February 2024 shows us that AI threats are not theoretical - they're happening now, with real financial impact.",
    3: "Understanding the AI hierarchy helps us grasp what's possible today versus what's still science fiction. Each layer builds on the previous one.",
    4: "Let's test our assumptions about AI. Click each card to reveal whether it's current reality or still science fiction.",
    5: "These are real wins happening in Tampa Bay right now. The Westshore District case study shows measurable ROI from AI implementation."
};



// Export for potential use in other modules
window.presentationControls = {
    nextSlide,
    previousSlide,
    goToSlide: (slideNumber) => {
        if (slideNumber >= 1 && slideNumber <= totalSlides) {
            slides[currentSlide - 1].classList.remove('active');
            currentSlide = slideNumber;
            slides[currentSlide - 1].classList.add('active');
            updateProgressBar();
            updateNavigationButtons();
            animateSlideElements(currentSlide);
        }
    },
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => totalSlides
}; 