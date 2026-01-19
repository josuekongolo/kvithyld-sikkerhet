/**
 * KVITHYLD SIKKERHET - Main JavaScript
 * Elektriker med sikkerhetsfokus i Trondheim
 */

(function() {
    'use strict';

    // =====================================================
    // DOM ELEMENTS
    // =====================================================

    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // =====================================================
    // MOBILE NAVIGATION
    // =====================================================

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================================================
    // CONTACT FORM HANDLING
    // =====================================================

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Hide previous messages
            if (formSuccess) formSuccess.classList.remove('show');
            if (formError) formError.classList.remove('show');

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                serviceType: document.getElementById('serviceType').value,
                description: document.getElementById('description').value.trim(),
                wantVisit: document.getElementById('visit').checked
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.phone || !formData.serviceType || !formData.description) {
                showError('Vennligst fyll ut alle obligatoriske felt.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showError('Vennligst oppgi en gyldig e-postadresse.');
                return;
            }

            // Phone validation (basic Norwegian format)
            const phoneRegex = /^(\+47)?[\s]?[0-9]{8}$/;
            const cleanPhone = formData.phone.replace(/\s/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showError('Vennligst oppgi et gyldig telefonnummer.');
                return;
            }

            // Disable submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sender...';

            try {
                // For now, simulate form submission
                // In production, replace this with actual Resend API call
                await simulateFormSubmission(formData);

                // Show success message
                if (formSuccess) {
                    formSuccess.classList.add('show');
                }

                // Reset form
                contactForm.reset();

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);
                showError('Beklager, noe gikk galt. Vennligst prov igjen eller kontakt oss direkte.');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    function showError(message) {
        if (formError) {
            formError.innerHTML = '<strong>Feil:</strong> ' + message;
            formError.classList.add('show');
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Simulate form submission (replace with actual API call in production)
    function simulateFormSubmission(data) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                // Log form data for testing
                console.log('Form submitted:', data);
                // Simulate success
                resolve({ success: true });
            }, 1000);
        });
    }

    // =====================================================
    // RESEND API INTEGRATION (PRODUCTION)
    // =====================================================

    // Uncomment and configure this function for production use with Resend API
    /*
    async function sendFormWithResend(formData) {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_RESEND_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'nettside@kvithyldsikkerhet.no',
                to: 'post@kvithyldsikkerhet.no',
                subject: `Ny henvendelse fra ${formData.name} - ${formData.serviceType}`,
                html: `
                    <h2>Ny henvendelse fra nettsiden</h2>
                    <p><strong>Navn:</strong> ${formData.name}</p>
                    <p><strong>E-post:</strong> ${formData.email}</p>
                    <p><strong>Telefon:</strong> ${formData.phone}</p>
                    <p><strong>Adresse/Bydel:</strong> ${formData.address || 'Ikke oppgitt'}</p>
                    <p><strong>Type oppdrag:</strong> ${formData.serviceType}</p>
                    <p><strong>Onsker befaring:</strong> ${formData.wantVisit ? 'Ja' : 'Nei'}</p>
                    <h3>Beskrivelse:</h3>
                    <p>${formData.description}</p>
                `
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send email');
        }

        return response.json();
    }
    */

    // =====================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // =====================================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .value-card, .why-us__item, .pricing-table').forEach(function(el) {
        observer.observe(el);
    });

    // =====================================================
    // PHONE NUMBER CLICK-TO-CALL TRACKING
    // =====================================================

    document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
        link.addEventListener('click', function() {
            // Track phone clicks (integrate with analytics if needed)
            console.log('Phone click:', this.getAttribute('href'));
        });
    });

    // =====================================================
    // LAZY LOADING FOR IMAGES
    // =====================================================

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const lazyImageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    lazyImageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function(img) {
            lazyImageObserver.observe(img);
        });
    }

    // =====================================================
    // ACCESSIBILITY IMPROVEMENTS
    // =====================================================

    // Add keyboard navigation support for mobile menu
    if (navToggle) {
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Focus management for mobile menu
    if (navMenu) {
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }

            if (e.key === 'Escape') {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.focus();
            }
        });
    }

    // =====================================================
    // CONSOLE BRANDING
    // =====================================================

    console.log('%c KVITHYLD SIKKERHET ', 'background: #2C3E50; color: #E67E22; font-size: 24px; font-weight: bold; padding: 10px 20px;');
    console.log('%c Elektrisk sikkerhet i Trondheim ', 'color: #3498DB; font-size: 14px;');
    console.log('%c www.kvithyldsikkerhet.no ', 'color: #666; font-size: 12px;');

})();
