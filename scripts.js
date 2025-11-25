document.documentElement.classList.add('loading');
document.body.classList.add('loading');

document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.documentElement.classList.remove('loading');
        }, 100);
    });
    
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
    initCounterAnimation();
    init3DCarousel();
});

function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                nav.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

function initStickyHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    if (!revealElements.length) return;
    
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm(form)) {
            showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        formMessage.style.display = 'none';
        
        try {
            const formData = new FormData(form);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('Thank you for your message! We will get back to you soon.', 'success');
                form.reset();
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('Sorry, something went wrong. Please try again or contact us directly.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
            }
        }
        
        return isValid;
    }
    
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    
    if (!counters.length) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
}

function init3DCarousel() {
    const carousel = document.getElementById('carousel');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    if (!carousel || !items.length) return;
    
    const totalItems = items.length;
    let currentIndex = 0;
    let autoRotateInterval;
    let isTransitioning = false;
    
    const getRadius = () => {
        const width = window.innerWidth;
        if (width < 400) return 420;
        if (width < 540) return 480;
        if (width < 768) return 550;
        if (width < 1024) return 600;
        return 650;
    };
    
    let radius = getRadius();
    const autoRotateDelay = 1200;
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            radius = getRadius();
            updateCarousel();
        }, 100);
    });
    
    items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'indicator-dot';
        dot.setAttribute('aria-label', `Go to company ${index + 1}`);
        dot.addEventListener('click', () => {
            if (!isTransitioning) {
                goToSlide(index);
                resetAutoRotate();
            }
        });
        indicatorsContainer.appendChild(dot);
    });
    
    const indicators = document.querySelectorAll('.indicator-dot');
    
    function updateCarousel() {
        items.forEach((item, index) => {
            const angle = ((360 / totalItems) * (index - currentIndex)) * (Math.PI / 180);
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius - radius;
            const rotateY = -((360 / totalItems) * (index - currentIndex));
            
            const normalizedZ = (z + radius) / (radius * 2);
            const opacity = Math.max(0.3, 0.35 + (normalizedZ * 0.65));
            const scale = 0.7 + (normalizedZ * 0.4);
            
            const depthMultiplier = 1.5;
            const translateZ = (normalizedZ - 0.5) * 150 * depthMultiplier;
            
            item.style.transform = `translateX(${x}px) translateZ(${z + translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.filter = 'none';
            item.style.zIndex = Math.floor(normalizedZ * 100);
            
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        indicators.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function goToSlide(index) {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = (index + totalItems) % totalItems;
        updateCarousel();
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    }
    
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    }
    
    function startAutoRotate() {
        autoRotateInterval = setInterval(nextSlide, autoRotateDelay);
    }
    
    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
    }
    
    function resetAutoRotate() {
        stopAutoRotate();
        startAutoRotate();
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoRotate();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoRotate();
        });
    }
    
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index !== currentIndex && !isTransitioning) {
                goToSlide(index);
                resetAutoRotate();
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoRotate();
            e.preventDefault();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoRotate();
            e.preventDefault();
        }
    });
    
    carousel.addEventListener('mouseenter', () => {
        stopAutoRotate();
        carousel.style.animationPlayState = 'paused';
    });
    carousel.addEventListener('mouseleave', () => {
        startAutoRotate();
        carousel.style.animationPlayState = 'running';
    });
    
    items.forEach(item => {
        item.addEventListener('mouseenter', () => {
            stopAutoRotate();
        });
        item.addEventListener('mouseleave', () => {
            startAutoRotate();
        });
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        stopAutoRotate();
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
        startAutoRotate();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);
        
        if (Math.abs(diffX) > swipeThreshold && diffY < swipeThreshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoRotate();
        } else {
            startAutoRotate();
        }
    });
    
    currentIndex = 0;
    updateCarousel();
    setTimeout(() => {
        startAutoRotate();
    }, 100);
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const rect = carousel.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (!isVisible && autoRotateInterval) {
                    stopAutoRotate();
                } else if (isVisible && !autoRotateInterval && !document.hidden) {
                    startAutoRotate();
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const nav = document.getElementById('nav');
        const navToggle = document.getElementById('navToggle');
        
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

console.log('%cAl-Ryan Enterprises', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cWebsite built with modern web standards', 'font-size: 12px; color: #64748b;');

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);
