/**
 * Template VIN NESIA - Main JavaScript
 * Optimized for performance and user experience
 */

'use strict';

// ==============================================
// Application State Management
// ==============================================

const App = {
    state: {
        isMenuOpen: false,
        currentModal: null,
        scrollPosition: 0,
        isLoading: false
    },
    
    init() {
        this.bindEvents();
        this.initializeComponents();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
    },
    
    bindEvents() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMReady();
        });
        
        // Window Load
        window.addEventListener('load', () => {
            this.onWindowLoad();
        });
        
        // Resize Handler
        window.addEventListener('resize', debounce(() => {
            this.onResize();
        }, 250));
        
        // Scroll Handler
        window.addEventListener('scroll', throttle(() => {
            this.onScroll();
        }, 16)); // 60fps
    },
    
    onDOMReady() {
        this.initModals();
        this.initNavigation();
        this.initForms();
        this.initAnimations();
        console.log('🚀 Template VIN NESIA initialized successfully');
    },
    
    onWindowLoad() {
        this.preloadImages();
        this.initLazyLoading();
    },
    
    onResize() {
        this.closeMenu();
    },
    
    onScroll() {
        this.updateScrollState();
        this.handleHeaderVisibility();
        this.updateAnimations();
    }
};

// ==============================================
// Navigation Management
// ==============================================

const Navigation = {
    init() {
        this.bindToggleEvents();
        this.bindLinkEvents();
    },
    
    bindToggleEvents() {
        const toggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggle && navLinks) {
            toggle.addEventListener('click', () => {
                this.toggleMenu();
            });
        }
    },
    
    bindLinkEvents() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                    this.closeMenu();
                }
            });
        });
    },
    
    toggleMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        App.state.isMenuOpen = !App.state.isMenuOpen;
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = App.state.isMenuOpen ? 'hidden' : '';
    },
    
    closeMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        App.state.isMenuOpen = false;
        toggle?.classList.remove('active');
        navLinks?.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    scrollToElement(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// ==============================================
// Modal Management
// ==============================================

const Modal = {
    modals: {},
    
    init() {
        this.cacheModals();
        this.bindEvents();
    },
    
    cacheModals() {
        this.modals = {
            order: document.getElementById('orderModal'),
            help: document.getElementById('helpModal'),
            privacy: document.getElementById('privacyModal'),
            terms: document.getElementById('termsModal')
        };
    },
    
    bindEvents() {
        // Close button events
        document.querySelectorAll('.modal-close, .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeAll();
            });
        });
        
        // Click outside to close
        window.addEventListener('click', (event) => {
            Object.values(this.modals).forEach(modal => {
                if (modal && event.target === modal) {
                    this.close(modal);
                }
            });
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
            }
        });
    },
    
    open(modalId) {
        const modal = this.modals[modalId];
        if (!modal) return;
        
        this.closeAll();
        App.state.currentModal = modalId;
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first input or button
        const firstFocusable = modal.querySelector('input, button, textarea, select');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
        
        Analytics.track('Modal Opened', { modal: modalId });
    },
    
    close(modal) {
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
        App.state.currentModal = null;
        document.body.style.overflow = '';
    },
    
    closeAll() {
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                this.close(modal);
            }
        });
    }
};

// ==============================================
// Form Management
// ==============================================

const Forms = {
    init() {
        this.bindOrderForm();
        this.setupValidation();
        this.setupPhoneFormatting();
    },
    
    bindOrderForm() {
        const orderForm = document.getElementById('orderForm');
        if (!orderForm) return;
        
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleOrderSubmission(orderForm);
        });
    },
    
    setupValidation() {
        // Real-time validation
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    this.markFieldValid(field);
                }
            });
        });
    },
    
    setupPhoneFormatting() {
        const phoneField = document.getElementById('customerPhone');
        if (!phoneField) return;
        
        phoneField.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Auto format Indonesian phone numbers
            if (value.startsWith('0')) {
                value = '62' + value.substring(1);
            }
            if (!value.startsWith('62') && value.length > 0) {
                value = '62' + value;
            }
            
            e.target.value = value ? '+' + value : '';
        });
    },
    
    validateField(field) {
        const isValid = field.checkValidity() && field.value.trim() !== '';
        
        if (isValid) {
            this.markFieldValid(field);
        } else {
            this.markFieldInvalid(field);
        }
        
        return isValid;
    },
    
    markFieldValid(field) {
        field.style.borderColor = 'var(--accent-color)';
        field.classList.remove('invalid');
        field.classList.add('valid');
    },
    
    markFieldInvalid(field) {
        field.style.borderColor = '#EF4444';
        field.classList.remove('valid');
        field.classList.add('invalid');
    },
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    handleOrderSubmission(form) {
        if (!this.validateForm(form)) {
            this.showNotification('Mohon lengkapi semua field yang wajib diisi!', 'error');
            return;
        }
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Create WhatsApp message
        const whatsappMessage = this.createWhatsAppMessage(data);
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/6289535451177?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Close modal and reset form
        Modal.closeAll();
        form.reset();
        
        // Show success notification
        this.showNotification('Pesanan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
        
        // Track conversion
        Analytics.track('Order Submitted', {
            template: data.template,
            price: data.price,
            payment_method: data.payment
        });
    },
    
    createWhatsAppMessage(data) {
        return `🛒 *PESANAN TEMPLATE BARU*

📋 *Detail Pesanan:*
• Template: ${data.template}
• Harga: ${data.price}

👤 *Data Customer:*
• Nama: ${data.name}
• Email: ${data.email}
• WhatsApp: ${data.phone}
• Jenis Bisnis: ${data.business || 'Tidak disebutkan'}

💳 *Pembayaran:*
• Metode: ${data.payment}

📝 *Pesan:*
${data.message || 'Tidak ada pesan tambahan'}

---
Mohon kirimkan detail pembayaran untuk template ini. Terima kasih! 🙏`;
    },
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Bind close event
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    },
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
};

// ==============================================
// Animation Management
// ==============================================

const Animations = {
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    },
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.template-card, .feature-card, .about-section').forEach(el => {
            el.classList.add('animate-on-scroll');
            this.observer.observe(el);
        });
    },
    
    setupHoverEffects() {
        // Add magnetic effect to buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.addMagneticEffect(e.target);
            });
            
            btn.addEventListener('mouseleave', (e) => {
                this.removeMagneticEffect(e.target);
            });
        });
    },
    
    addMagneticEffect(element) {
        element.style.transform = 'scale(1.05)';
    },
    
    removeMagneticEffect(element) {
        element.style.transform = 'scale(1)';
    }
};

// ==============================================
// Header Scroll Management
// ==============================================

const HeaderScroll = {
    lastScrollTop: 0,
    
    init() {
        this.header = document.querySelector('.header');
        this.bindScrollEvents();
    },
    
    bindScrollEvents() {
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 16));
    },
    
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            // Scrolling down
            this.hideHeader();
        } else {
            // Scrolling up
            this.showHeader();
        }
        
        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    },
    
    hideHeader() {
        if (this.header) {
            this.header.style.transform = 'translateY(-100%)';
        }
    },
    
    showHeader() {
        if (this.header) {
            this.header.style.transform = 'translateY(0)';
        }
    }
};

// ==============================================
// Analytics & Tracking
// ==============================================

const Analytics = {
    track(event, properties = {}) {
        // Console logging for development
        console.log(`📊 Analytics: ${event}`, properties);
        
        // Google Analytics (replace with your GA4 measurement ID)
        if (typeof gtag !== 'undefined') {
            gtag('event', event, {
                event_category: properties.category || 'User Interaction',
                event_label: properties.label,
                value: properties.value
            });
        }
        
        // Facebook Pixel (if you use it)
        if (typeof fbq !== 'undefined') {
            fbq('track', event, properties);
        }
    },
    
    trackPageView(page) {
        this.track('page_view', { page });
    },
    
    trackTemplateView(templateName) {
        this.track('Template Viewed', { template: templateName });
    },
    
    trackOrderIntent(templateName, price) {
        this.track('Order Intent', { template: templateName, price });
    }
};

// ==============================================
// Global Functions (for HTML onclick events)
// ==============================================

function openOrderModal(templateName, price) {
    const templateNameField = document.getElementById('templateName');
    const templatePriceField = document.getElementById('templatePrice');
    
    if (templateNameField && templatePriceField) {
        templateNameField.value = templateName;
        templatePriceField.value = 'Rp ' + price.toLocaleString('id-ID');
    }
    
    Modal.open('order');
    Analytics.trackOrderIntent(templateName, price);
}

function showDemo(type) {
    const demoMessages = {
        cafe: 'Demo Template Cafe akan segera tersedia! Template ini mencakup menu digital, sistem reservasi, dan galeri foto.',
        toko: 'Demo Template Toko Online akan segera tersedia! Template ini mencakup katalog produk, shopping cart, dan checkout.',
        restaurant: 'Demo Template Restaurant akan segera tersedia! Template ini mencakup menu interaktif, booking system, dan customer reviews.'
    };
    
    Forms.showNotification(demoMessages[type] || 'Demo akan segera tersedia!', 'info');
    Analytics.trackTemplateView(type);
}

function showHelpModal() {
    // Navigate to help page instead of modal
    window.location.href = 'pages/cara-pakai.html';
}

function showPrivacyModal() {
    window.location.href = 'pages/privacy.html';
}

function showTermsModal() {
    window.location.href = 'pages/terms.html';
}

// ==============================================
// Performance Utilities
// ==============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==============================================
// Image & Resource Management
// ==============================================

const ResourceManager = {
    init() {
        this.preloadCriticalImages();
        this.setupLazyLoading();
    },
    
    preloadCriticalImages() {
        const criticalImages = [
            'assets/logo.png',
            'assets/og-image.jpg',
            'assets/hero-bg.jpg'
            // Add more critical images here
        ];
        
        criticalImages.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    },
    
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
};

// ==============================================
// SEO & Performance Enhancements
// ==============================================

const SEOManager = {
    init() {
        this.updateMetaTags();
        this.setupStructuredData();
        this.trackUserBehavior();
    },
    
    updateMetaTags() {
        // Dynamic meta description based on page content
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && !metaDescription.content) {
            metaDescription.content = 'Template website premium HTML CSS JavaScript untuk bisnis Indonesia. Responsive, SEO optimized, loading cepat. Mulai dari Rp 150.000.';
        }
    },
    
    setupStructuredData() {
        // Add product structured data for templates
        const templates = [
            {
                name: 'Template Cafe Modern',
                price: 150000,
                description: 'Template premium untuk cafe dan kedai kopi',
                category: 'Web Template'
            },
            {
                name: 'Template Toko Online',
                price: 200000,
                description: 'E-commerce template lengkap dengan shopping cart',
                category: 'Web Template'
            },
            {
                name: 'Template Restaurant',
                price: 175000,
                description: 'Template elegant untuk restaurant dan kuliner',
                category: 'Web Template'
            }
        ];
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": templates.map((template, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": template.name,
                "description": template.description,
                "category": template.category,
                "offers": {
                    "@type": "Offer",
                    "price": template.price,
                    "priceCurrency": "IDR",
                    "availability": "https://schema.org/InStock"
                }
            }))
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    },
    
    trackUserBehavior() {
        // Track scroll depth
        const scrollDepths = [25, 50, 75, 100];
        let trackedDepths = [];
        
        window.addEventListener('scroll', throttle(() => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            scrollDepths.forEach(depth => {
                if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
                    trackedDepths.push(depth);
                    Analytics.track('Scroll Depth', { depth: `${depth}%` });
                }
            });
        }, 500));
        
        // Track time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            Analytics.track('Time on Page', { seconds: timeSpent });
        });
    }
};

// ==============================================
// Accessibility Enhancements
// ==============================================

const Accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
    },
    
    setupKeyboardNavigation() {
        // Tab navigation for modals
        document.addEventListener('keydown', (e) => {
            if (App.state.currentModal && e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
        
        // Enter key for buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    },
    
    setupFocusManagement() {
        // Focus management for modals
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.addEventListener('focusin', (e) => {
                if (!modal.contains(e.target)) {
                    const firstFocusable = modal.querySelector('input, button, textarea, select');
                    if (firstFocusable) {
                        firstFocusable.focus();
                    }
                }
            });
        }
    },
    
    setupAriaLabels() {
        // Add dynamic aria labels
        document.querySelectorAll('.template-card').forEach((card, index) => {
            const title = card.querySelector('.template-title')?.textContent;
            if (title) {
                card.setAttribute('aria-label', `Template: ${title}`);
            }
        });
    },
    
    trapFocus(e) {
        const modal = document.querySelector(`#${App.state.currentModal}Modal`);
        if (!modal) return;
        
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
};

// ==============================================
// Error Handling & Logging
// ==============================================

const ErrorHandler = {
    init() {
        this.setupGlobalErrorHandling();
        this.setupConsoleLogging();
    },
    
    setupGlobalErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.logError('JavaScript Error', e.error.message, e.filename, e.lineno);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.logError('Promise Rejection', e.reason);
        });
    },
    
    setupConsoleLogging() {
        // Beautiful console welcome message
        console.log(`
%c🚀 Template VIN NESIA %c
%c📧 Contact: admin@vinnesia.my.id
%c📱 WhatsApp: +62 895 3545 11777  
%c🌐 Website: https://template.vinnesia.my.id

%cBuilt with ❤️ by VIN NESIA Team
        `, 
        'color: #8B5CF6; font-size: 20px; font-weight: bold;',
        '',
        'color: #10B981; font-weight: bold;',
        'color: #F59E0B; font-weight: bold;',
        'color: #EC4899; font-weight: bold;',
        'color: #6B7280; font-style: italic;'
        );
    },
    
    logError(type, message, file = '', line = '') {
        const errorData = {
            type,
            message,
            file,
            line,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // You can send this to your error tracking service
        console.error('Error logged:', errorData);
    }
};

// ==============================================
// Performance Monitoring
// ==============================================

const Performance = {
    init() {
        this.measurePageLoad();
        this.setupWebVitals();
    },
    
    measurePageLoad() {
        window.addEventListener('load', () => {
            // Measure page load time
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            Analytics.track('Page Load Time', { milliseconds: loadTime });
            
            // Measure First Contentful Paint
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            Analytics.track('First Contentful Paint', { milliseconds: entry.startTime });
                        }
                    }
                });
                observer.observe({ entryTypes: ['paint'] });
            }
        });
    },
    
    setupWebVitals() {
        // Core Web Vitals monitoring
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                Analytics.track('Largest Contentful Paint', { milliseconds: lastEntry.startTime });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                Analytics.track('Cumulative Layout Shift', { value: clsValue });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
    }
};

// ==============================================
// Application Extensions
// ==============================================

// Extend App object with component initializers
Object.assign(App, {
    initializeComponents() {
        Navigation.init();
        Modal.init();
        Forms.init();
        Animations.init();
        HeaderScroll.init();
        Analytics.init();
        ResourceManager.init();
        SEOManager.init();
        Accessibility.init();
        ErrorHandler.init();
        Performance.init();
    },
    
    initModals() {
        Modal.init();
    },
    
    initNavigation() {
        Navigation.init();
    },
    
    initForms() {
        Forms.init();
    },
    
    initAnimations() {
        Animations.init();
    },
    
    setupAccessibility() {
        Accessibility.init();
    },
    
    setupPerformanceOptimizations() {
        // Optimize images
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
        
        // Optimize videos
        document.querySelectorAll('video').forEach(video => {
            video.setAttribute('preload', 'metadata');
        });
    },
    
    updateScrollState() {
        App.state.scrollPosition = window.pageYOffset;
    },
    
    handleHeaderVisibility() {
        HeaderScroll.handleScroll();
    },
    
    updateAnimations() {
        // Update any scroll-based animations here
    },
    
    preloadImages() {
        ResourceManager.preloadCriticalImages();
    },
    
    initLazyLoading() {
        ResourceManager.setupLazyLoading();
    }
});

// ==============================================
// PWA Support (Progressive Web App)
// ==============================================

const PWA = {
    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
    },
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then((registration) => {
                        console.log('SW registered: ', registration);
                    })
                    .catch((registrationError) => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    },
    
    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button (you can add this to your UI)
            const installBtn = document.getElementById('install-btn');
            if (installBtn) {
                installBtn.style.display = 'block';
                installBtn.addEventListener('click', () => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        Analytics.track('PWA Install', { result: choiceResult.outcome });
                        deferredPrompt = null;
                    });
                });
            }
        });
    }
};

// ==============================================
// Touch & Gesture Support
// ==============================================

const TouchHandler = {
    init() {
        this.setupTouchEvents();
        this.setupSwipeGestures();
    },
    
    setupTouchEvents() {
        // Improve touch responsiveness
        document.addEventListener('touchstart', () => {}, { passive: true });
        
        // Add touch feedback to buttons
        document.querySelectorAll('.btn, .template-card').forEach(element => {
            element.addEventListener('touchstart', (e) => {
                element.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            element.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 100);
            }, { passive: true });
        });
    },
    
    setupSwipeGestures() {
        let startX, startY, startTime;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // Detect swipe gestures
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 300) {
                if (deltaX > 0) {
                    // Swipe right
                    this.handleSwipeRight();
                } else {
                    // Swipe left
                    this.handleSwipeLeft();
                }
            }
            
            startX = startY = null;
        }, { passive: true });
    },
    
    handleSwipeRight() {
        // Close modal or go back
        if (App.state.currentModal) {
            Modal.closeAll();
        }
    },
    
    handleSwipeLeft() {
        // Navigate forward or open menu
        if (!App.state.isMenuOpen && window.innerWidth <= 768) {
            Navigation.toggleMenu();
        }
    }
};

// ==============================================
// Cookie & Privacy Management
// ==============================================

const Privacy = {
    init() {
        this.checkCookieConsent();
        this.setupDataProtection();
    },
    
    checkCookieConsent() {
        // Simple cookie consent (expand as needed)
        const hasConsent = localStorage.getItem('cookie-consent');
        if (!hasConsent) {
            setTimeout(() => {
                this.showCookieConsent();
            }, 2000);
        }
    },
    
    showCookieConsent() {
        const consent = document.createElement('div');
        consent.className = 'cookie-consent';
        consent.innerHTML = `
            <div class="cookie-content">
                <p>Kami menggunakan cookie untuk meningkatkan pengalaman Anda di website kami.</p>
                <div class="cookie-actions">
                    <button class="btn btn-primary btn-sm" onclick="Privacy.acceptCookies()">Terima</button>
                    <button class="btn btn-secondary btn-sm" onclick="Privacy.declineCookies()">Tolak</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(consent);
    },
    
    acceptCookies() {
        localStorage.setItem('cookie-consent', 'accepted');
        this.removeCookieConsent();
        Analytics.track('Cookie Consent', { action: 'accepted' });
    },
    
    declineCookies() {
        localStorage.setItem('cookie-consent', 'declined');
        this.removeCookieConsent();
        Analytics.track('Cookie Consent', { action: 'declined' });
    },
    
    removeCookieConsent() {
        const consent = document.querySelector('.cookie-consent');
        if (consent) {
            consent.remove();
        }
    },
    
    setupDataProtection() {
        // Mask sensitive data in console
        if (process?.env?.NODE_ENV === 'production') {
            console.log = () => {};
            console.warn = () => {};
        }
    }
};

// ==============================================
// Initialize Application
// ==============================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
        PWA.init();
        TouchHandler.init();
        Privacy.init();
    });
} else {
    App.init();
    PWA.init();
    TouchHandler.init();
    Privacy.init();
}

// ==============================================
// Additional Utility Functions
// ==============================================

// Format currency for Indonesian Rupiah
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format phone number for display
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('62')) {
        return `+${cleaned}`;
    }
    return phone;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Get device type
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 576) return 'mobile';
    if (width < 992) return 'tablet';
    return 'desktop';
}

// Check if user is on mobile
function isMobile() {
    return getDeviceType() === 'mobile';
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        Forms.showNotification('Berhasil disalin ke clipboard!', 'success');
    } catch (err) {
        Forms.showNotification('Gagal menyalin ke clipboard', 'error');
    }
}

// Share API support
async function shareTemplate(templateName, templateUrl) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: `Template ${templateName} - VIN NESIA`,
                text: `Lihat template website premium: ${templateName}`,
                url: templateUrl
            });
            Analytics.track('Template Shared', { template: templateName, method: 'native' });
        } catch (err) {
            console.log('Share cancelled or failed');
        }
    } else {
        // Fallback to copying URL
        await copyToClipboard(templateUrl);
        Analytics.track('Template Shared', { template: templateName, method: 'clipboard' });
    }
}

// ==============================================
// Export for global access (if needed)
// ==============================================

window.TemplateApp = {
    App,
    Navigation,
    Modal,
    Forms,
    Analytics,
    openOrderModal,
    showDemo,
    showHelpModal,
    showPrivacyModal,
    showTermsModal
};

// ==============================================
// Development Helpers
// ==============================================

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Development mode helpers
    window.dev = {
        state: () => console.log('App State:', App.state),
        openModal: (id) => Modal.open(id),
        closeModals: () => Modal.closeAll(),
        trackEvent: (event, props) => Analytics.track(event, props),
        version: '1.0.0'
    };
    
    console.log('🔧 Development mode active. Use window.dev for debugging.');
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
