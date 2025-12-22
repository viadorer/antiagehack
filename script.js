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
        logo.innerHTML = '';
        
        // Split text into individual letters
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
            span.style.color = '#0a0a1a'; // Start with dark
            logo.appendChild(span);
        }
    });
    
    // Animate letters
    animateLogoLetters();
}

function animateLogoLetters() {
    const letters = document.querySelectorAll('.logo-text .letter');
    const colors = ['#0a0a1a', '#ffffff', '#6366f1', '#00ff88']; // dark, white, indigo, neon green
    
    letters.forEach((letter, index) => {
        setInterval(() => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            letter.style.color = randomColor;
            letter.style.textShadow = randomColor === '#ffffff' ? '0 0 1px rgba(0,0,0,0.3)' : 'none';
        }, 800 + (index * 100)); // Staggered timing for wave effect
    });
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
