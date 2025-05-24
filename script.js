// script.js

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
    
    // 1. Scroll navbar background change (optimized with debounce)
    const navbar = document.querySelector('.navbar');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled', 'shadow');
        } else {
            navbar.classList.remove('scrolled', 'shadow');
        }

        // Update scroll progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.scroll-progress-bar').style.width = scrolled + '%';
    }
    
    // Add scroll progress bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(scrollProgress);
    
    // Debounce scroll event for better performance
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(handleScroll, 50);
    }, false);

    // Initialize on load
    handleScroll();

    // 2. Interactive cards effect
    document.querySelectorAll('.interactive-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 3. Ripple effect for buttons
    document.querySelectorAll('.ripple').forEach(button => {
        button.addEventListener('click', e => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const circle = document.createElement('div');
            circle.classList.add('ripple-effect');
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;
            
            button.appendChild(circle);
            setTimeout(() => circle.remove(), 1000);
        });
    });

    // 4. Smooth scrolling for navbar links
    document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse).hide();
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page jump
                history.pushState(null, null, targetId);
            }
        });
    });

    // 5. Scroll-to-top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '&uarr;';
    scrollBtn.id = 'scrollTopBtn';
    scrollBtn.className = 'ripple';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    function toggleScrollButton() {
        scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    }
    
    window.addEventListener('scroll', toggleScrollButton);
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Initialize scroll button
    toggleScrollButton();

    // 6. Page loader animation
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', function() {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
            }, 600);
        });
    }

    // 7. Add floating animation to specific elements
    document.querySelectorAll('.service-card .icon-wrapper').forEach(icon => {
        icon.classList.add('float-animation');
    });

    // 8. Add interactive card effect to all cards
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('interactive-card');
    });

    // 9. Add hover effect to buttons
    document.querySelectorAll('.btn-warning, .btn-outline-warning').forEach(btn => {
        btn.classList.add('btn-hover-effect', 'ripple');
    });

    // 10. Add testimonial card effect
    document.querySelectorAll('.testimonials .card').forEach(card => {
        card.classList.add('testimonial-card');
    });

    // 11. Accessibility improvements
    document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
        el.classList.add('focus-visible');
    });

    // Video Intersection Observer and Controls
    const videoContainer = document.querySelector('.video-container');
    const video = videoContainer?.querySelector('video');
    const videoOverlay = videoContainer?.querySelector('.video-overlay');
    const playPauseBtn = videoContainer?.querySelector('.play-pause-btn');
    const muteBtn = videoContainer?.querySelector('.mute-btn');
    const fullscreenBtn = videoContainer?.querySelector('.fullscreen-btn');
    
    if (video && videoContainer && videoOverlay && playPauseBtn && muteBtn && fullscreenBtn) {
        // Ensure video is muted initially for autoplay to work
        video.muted = true;
        videoContainer.classList.remove('is-unmuted');

        // Create Intersection Observer with higher threshold for better visibility detection
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.7  // Increased threshold for better visibility
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Attempt to play the video
                    const playPromise = video.play();
                    
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                videoContainer.classList.add('is-playing');
                                videoContainer.classList.remove('is-paused');
                            })
                            .catch(error => {
                                console.log("Autoplay was prevented:", error);
                            });
                    }
                } else {
                    video.pause();
                    videoContainer.classList.remove('is-playing');
                    videoContainer.classList.add('is-paused');
                }
            });
        }, options);

        observer.observe(videoContainer);

        // Handle play/pause
        playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.paused) {
                video.play();
                videoContainer.classList.add('is-playing');
                videoContainer.classList.remove('is-paused');
            } else {
                video.pause();
                videoContainer.classList.remove('is-playing');
                videoContainer.classList.add('is-paused');
            }
        });

        // Handle mute/unmute
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (video.muted) {
                video.muted = false;
                videoContainer.classList.add('is-unmuted');
            } else {
                video.muted = true;
                videoContainer.classList.remove('is-unmuted');
            }
        });

        // Handle fullscreen
        fullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!document.fullscreenElement) {
                if (videoContainer.requestFullscreen) {
                    videoContainer.requestFullscreen();
                } else if (videoContainer.webkitRequestFullscreen) {
                    videoContainer.webkitRequestFullscreen();
                } else if (videoContainer.msRequestFullscreen) {
                    videoContainer.msRequestFullscreen();
                }
                videoContainer.classList.add('is-fullscreen');
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                videoContainer.classList.remove('is-fullscreen');
            }
        });

        // Handle fullscreen change
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                videoContainer.classList.remove('is-fullscreen');
            }
        });

        // Update button icon based on video state
        video.addEventListener('play', () => {
            videoContainer.classList.add('is-playing');
            videoContainer.classList.remove('is-paused');
        });

        video.addEventListener('pause', () => {
            videoContainer.classList.remove('is-playing');
            videoContainer.classList.add('is-paused');
        });

        // Prevent video container click from triggering when clicking controls
        videoOverlay.addEventListener('click', (e) => {
            if (e.target === videoOverlay) {
                playPauseBtn.click();
            }
        });
    }
});
