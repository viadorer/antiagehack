// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Animated logo - split into letters and animate colors
function initAnimatedLogo() {
    const logos = document.querySelectorAll('.logo-text');
    
    logos.forEach(logo => {
        const text = logo.textContent;
        const isFooter = logo.closest('footer') !== null;
        logo.innerHTML = '';
        logo.dataset.isFooter = isFooter;
        
        // Split text into individual letters
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
            span.style.color = isFooter ? '#ffffff' : '#0a0a1a';
            logo.appendChild(span);
        }
    });
    
    // Start animation cycle
    animateLogoCycle();
}

function animateLogoCycle() {
    const navLogo = document.querySelector('.nav-logo .logo-text');
    const footerLogo = document.querySelector('.footer-logo .logo-text');
    
    // Colors for light background (nav) - no white
    const navColors = ['#0a0a1a', '#6366f1', '#00ff88', '#e11d48'];
    // Colors for dark background (footer) - no dark
    const footerColors = ['#ffffff', '#6366f1', '#00ff88', '#fbbf24'];
    
    let phase = 0; // 0: all white/black, 1: random colors, 2: all black/white, 3: random colors
    const phaseDuration = 3000; // 3 seconds per phase
    const letterChangeInterval = 150;
    
    function setAllLetters(logo, color) {
        const letters = logo.querySelectorAll('.letter');
        letters.forEach((letter, i) => {
            setTimeout(() => {
                letter.style.color = color;
            }, i * 50); // Wave effect
        });
    }
    
    function randomizeLetters(logo, colors) {
        const letters = logo.querySelectorAll('.letter');
        letters.forEach((letter, i) => {
            setTimeout(() => {
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                letter.style.color = randomColor;
            }, i * letterChangeInterval);
        });
    }
    
    function runPhase() {
        if (navLogo) {
            switch(phase) {
                case 0: // All to accent color
                    setAllLetters(navLogo, '#6366f1');
                    break;
                case 1: // Random colors
                    randomizeLetters(navLogo, navColors);
                    break;
                case 2: // All to dark
                    setAllLetters(navLogo, '#0a0a1a');
                    break;
                case 3: // Random colors again
                    randomizeLetters(navLogo, navColors);
                    break;
            }
        }
        
        if (footerLogo) {
            switch(phase) {
                case 0: // All to accent
                    setAllLetters(footerLogo, '#00ff88');
                    break;
                case 1: // Random colors
                    randomizeLetters(footerLogo, footerColors);
                    break;
                case 2: // All to white
                    setAllLetters(footerLogo, '#ffffff');
                    break;
                case 3: // Random colors again
                    randomizeLetters(footerLogo, footerColors);
                    break;
            }
        }
        
        phase = (phase + 1) % 4;
        setTimeout(runPhase, phaseDuration);
    }
    
    runPhase();
}

// Initialize animated logo on page load
document.addEventListener('DOMContentLoaded', initAnimatedLogo);

// Fade in animation on scroll
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeElements.forEach(el => observer.observe(el));

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Form submission
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        
        // Here you would integrate with your email service (Mailchimp, ConvertKit, etc.)
        console.log('Form submitted:', { name, email });
        
        // Show success message
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '✓ Odesláno!';
        button.style.background = 'var(--primary)';
        button.style.color = 'white';
        
        // Reset form
        this.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 3000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add stagger animation to pain cards
const painCards = document.querySelectorAll('.pain-card');
painCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Add stagger animation to hack cards
const hackCards = document.querySelectorAll('.hack-card');
hackCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Parallax effect for hero section (subtle)
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.scrollY;
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});
