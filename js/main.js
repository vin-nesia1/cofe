/**
 * VIN NESIA Portfolio - Main JavaScript File
 * Professional web developer portfolio functionality
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize all app functionality
 */
function initializeApp() {
    // Initialize components
    initSmoothScrolling();
    initMobileMenu();
    initScrollAnimations();
    initNavbarEffects();
    initPortfolioInteractions();
    initTypingEffect();
    initParallaxEffect();
    initFormEnhancements();
    initPerformanceOptimizations();
    
    // Set initial page state
    setInitialPageState();
    
    console.log('🚀 VIN NESIA Portfolio initialized successfully');
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without triggering scroll
                history.pushState(null, null, targetId);
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (!mobileMenuBtn || !navLinks) return;

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
        toggleMobileMenu();
    });

    // Close mobile menu when clicking on navigation links
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

/**
 * Toggle mobile menu state
 */
function toggleMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const icon = mobileMenuBtn.querySelector('i');
    
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    
    // Animate icon change
    icon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
        icon.style.transform = 'rotate(0deg)';
    }, 150);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const icon = mobileMenuBtn.querySelector('i');
    
    if (navLinks.classList.contains('active')) {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
        icon.className = 'fas fa-bars';
        document.body.style.overflow = 'auto';
    }
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate children with delay
                const children = entry.target.querySelectorAll('.portfolio-card, .service-card, .pricing-card, .contact-card, .testimonial-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(el => {
        fadeInObserver.observe(el);
    });

    // Initialize child elements for staggered animation
    const cards = document.querySelectorAll('.portfolio-card, .service-card, .pricing-card, .contact-card, .testimonial-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
    });
}

/**
 * Navbar effects on scroll
 */
function initNavbarEffects() {
    let ticking = false;
    
    function updateNavbar() {
        const nav = document.querySelector('nav');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            nav.style.background = 'rgba(15, 15, 35, 0.98)';
            nav.style.borderBottom = '1px solid rgba(102, 126, 234, 0.2)';
        } else {
            nav.style.background = 'rgba(15, 15, 35, 0.95)';
            nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

/**
 * Portfolio card interactions and analytics
 */
function initPortfolioInteractions() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const cardButtons = document.querySelectorAll('.card-btn');
    
    // Enhanced hover effects
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            
            // Add subtle glow effect
            this.style.boxShadow = '0 30px 80px rgba(102, 126, 234, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.1)';
        });
    });
    
    // Track portfolio interactions
    cardButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const projectCard = this.closest('.portfolio-card');
            const projectName = projectCard.querySelector('.card-title').textContent;
            const buttonType = this.classList.contains('card-btn-primary') ? 'live_demo' : 'details';
            
            // Analytics tracking (replace with your analytics service)
            trackPortfolioInteraction(projectName, buttonType);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            console.log(`Portfolio interaction: ${projectName} - ${buttonType}`);
        });
    });
}

/**
 * Track portfolio interactions (placeholder for analytics)
 */
function trackPortfolioInteraction(projectName, buttonType) {
    // Replace with your analytics implementation
    // Example: gtag('event', 'portfolio_click', {
    //     'project_name': projectName,
    //     'button_type': buttonType,
    //     'timestamp': new Date().toISOString()
    // });
    
    // For now, just log to console
    console.log('Analytics:', {
        event: 'portfolio_interaction',
        project: projectName,
        type: buttonType,
        timestamp: new Date().toISOString()
    });
}

/**
 * Typing effect for hero subtitle
 */
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid #667eea';
    
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            
            // Variable typing speed for more natural effect
            const delay = Math.random() * 100 + 50;
            setTimeout(typeWriter, delay);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                subtitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing effect after a delay
    setTimeout(typeWriter, 1500);
}

/**
 * Parallax effect for background (optimized)
 */
function initParallaxEffect() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const background = document.querySelector('.background-animation');
        
        if (background) {
            const rate = scrolled * -0.1; // Reduced intensity for better performance
            background.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    // Use passive listener for better performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Form enhancements and interactions
 */
function initFormEnhancements() {
    const contactLinks = document.querySelectorAll('.contact-link');
    const ctaButtons = document.querySelectorAll('.btn');
    
    // Enhanced button interactions
    [...contactLinks, ...ctaButtons].forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            createRippleEffect(this, e);
            
            // Track conversion events
            trackConversionEvent(this);
        });
        
        // Add subtle hover animations
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Create ripple effect on button click
 */
function createRippleEffect(button, event) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * Track conversion events
 */
function trackConversionEvent(element) {
    const isWhatsApp = element.href && element.href.includes('wa.me');
    const isEmail = element.href && element.href.includes('mailto:');
    const isInstagram = element.href && element.href.includes('instagram.com');
    const isPortfolio = element.href && element.href.includes('#portfolio');
    
    let eventType = 'unknown';
    if (isWhatsApp) eventType = 'whatsapp_click';
    else if (isEmail) eventType = 'email_click';
    else if (isInstagram) eventType = 'instagram_click';
    else if (isPortfolio) eventType = 'portfolio_view';
    
    console.log('Conversion event:', eventType);
    
    // Replace with your analytics implementation
    // Example: gtag('event', 'conversion', {
    //     'event_category': 'contact',
    //     'event_label': eventType,
    //     'value': 1
    // });
}

/**
 * Performance optimizations
 */
function initPerformanceOptimizations() {
    // Preload critical images
    const criticalImages = [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Lazy load images with intersection observer
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Handle resize logic here
            handleResize();
        }, 250);
    });
}

/**
 * Handle window resize
 */
function handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    
    // Update any size-dependent calculations
    console.log('Window resized:', window.innerWidth);
}

/**
 * Set initial page state
 */
function setInitialPageState() {
    // Fade in body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Show page after DOM is ready
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Add loaded class for any CSS animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
}

/**
 * Utility function to get element's position
 */
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}

/**
 * Utility function to check if element is in viewport
 */
function isElementInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top >= -rect.height * threshold &&
        rect.left >= -rect.width * threshold &&
        rect.bottom <= windowHeight + rect.height * threshold &&
        rect.right <= windowWidth + rect.width * threshold
    );
}

/**
 * Initialize CSS animations
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can send errors to your analytics service here
});

// Page visibility change handling
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

console.log('📱 VIN NESIA Portfolio - JavaScript loaded and ready!');
