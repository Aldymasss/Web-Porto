// Horizontal auto-scrolling functionality for Menu Project section
document.addEventListener('DOMContentLoaded', function() {
    // Set up auto-scrolling for the slider-menu
    const sliderMenu = document.getElementById('slider-menu');
    if (!sliderMenu) return;
    
    const scrollContainer = sliderMenu.querySelector('#slider-container');
    if (!scrollContainer) return;
    
    let scrollDirection = -1; // -1 for right-to-left, 1 for left-to-right
    let scrollInterval = null;
    let isPaused = false;
    let scrollSpeed = 0.8; // Pixels per frame - reduced for smoother scrolling    // Start auto-scrolling
    function startAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
        
        // Initialize position
        // For RTL, we start at the left (which is actually the right side of the content in RTL)
        scrollContainer.scrollLeft = 0;
        
        // Get the RTL behavior of the browser that we detected earlier
        const rtlBehavior = scrollContainer.dataset.rtlBehavior || 'positive';
        
        // Add a visual indicator for auto-scrolling
        const indicator = document.createElement('div');
        indicator.className = 'auto-scroll-indicator';
        indicator.innerHTML = '<span>Auto-scrolling</span>';
        indicator.style.position = 'absolute';
        indicator.style.bottom = '10px';
        indicator.style.right = '10px';
        indicator.style.background = 'rgba(92, 105, 75, 0.7)';
        indicator.style.color = 'white';
        indicator.style.padding = '5px 10px';
        indicator.style.borderRadius = '4px';
        indicator.style.fontSize = '12px';
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity 0.5s';
        indicator.style.zIndex = '100';
        sliderMenu.appendChild(indicator);
        
        // Show indicator briefly
        setTimeout(() => {
            indicator.style.opacity = '1';
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    indicator.remove();
                }, 1000);
            }, 2000);
        }, 500);
        
        scrollInterval = setInterval(() => {
            if (isPaused) return;
            
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            
            // Handle scrolling based on detected browser behavior
            if (rtlBehavior === 'negative') {
                // Firefox-like behavior: scrollLeft goes negative in RTL mode
                if (scrollContainer.scrollLeft > -maxScroll) {
                    // Still has space to scroll left
                    scrollContainer.scrollLeft -= scrollSpeed;
                } else {
                    // Reached the end, wait a bit then reset
                    const resetScroll = () => {
                        scrollContainer.style.scrollBehavior = 'auto';
                        scrollContainer.scrollLeft = 0;
                        setTimeout(() => {
                            scrollContainer.style.scrollBehavior = 'smooth';
                        }, 50);
                    };
                    
                    setTimeout(resetScroll, 1500);
                }
            } else {
                // Chrome-like behavior: scrollLeft is positive in RTL mode
                if (scrollContainer.scrollLeft < maxScroll) {
                    // Still has space to scroll right
                    scrollContainer.scrollLeft += scrollSpeed;
                } else {
                    // Reached the end, wait a bit then reset
                    const resetScroll = () => {
                        scrollContainer.style.scrollBehavior = 'auto';
                        scrollContainer.scrollLeft = 0;
                        setTimeout(() => {
                            scrollContainer.style.scrollBehavior = 'smooth';
                        }, 50);
                    };
                    
                    setTimeout(resetScroll, 1500);
                }
            }
        }, 16); // ~60fps for smooth scrolling
    }
    
    // Pause scrolling when hovering
    scrollContainer.addEventListener('mouseenter', () => {
        isPaused = true;
    });
    
    scrollContainer.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    // Pause scrolling when touching (for mobile)
    scrollContainer.addEventListener('touchstart', () => {
        isPaused = true;
    });
    
    scrollContainer.addEventListener('touchend', () => {
        // Resume after a small delay to allow tapping items
        setTimeout(() => {
            isPaused = false;
        }, 1000);
    });    // Handle slider button clicks
    const prevBtn = sliderMenu.querySelector('.slider-btn.prev');
    const nextBtn = sliderMenu.querySelector('.slider-btn.next');
      if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            // Get the width of one card plus its margin
            const cardWidth = scrollContainer.querySelector('.project-card').offsetWidth + 16; // 16px for margin
            
            // Get the RTL behavior of the browser that we detected earlier
            const rtlBehavior = scrollContainer.dataset.rtlBehavior || 'positive';
            
            // Handle click based on browser RTL behavior
            if (rtlBehavior === 'negative') {
                // For Firefox-like browsers: use negative value to scroll previous
                scrollContainer.scrollBy({
                    left: -cardWidth,
                    behavior: 'smooth'
                });
            } else {
                // For Chrome-like browsers: use positive value to scroll previous
                scrollContainer.scrollBy({
                    left: cardWidth,
                    behavior: 'smooth'
                });
            }
            
            // Pause auto-scrolling briefly after button click
            isPaused = true;
            setTimeout(() => { isPaused = false; }, 2000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Get the width of one card plus its margin
            const cardWidth = scrollContainer.querySelector('.project-card').offsetWidth + 16; // 16px for margin
            
            // Scroll left (which visually goes right in RTL)            scrollContainer.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
            // Pause auto-scrolling briefly after button click
            isPaused = true;
            setTimeout(() => { isPaused = false; }, 2000);
        });
    }    // Function to check and fix browser inconsistencies with RTL scrolling
    function initializeRTLScrolling() {
        // Set initial position to rightmost (which is scrollLeft=0 in RTL mode)
        scrollContainer.scrollLeft = 0;
        
        // Add a class to help with CSS targeting if needed
        scrollContainer.classList.add('rtl-scroll-active');
        
        // Detect browser behavior for RTL scrolling
        // Chrome and Firefox have different implementations
        const detectRTLScrollBehavior = () => {
            scrollContainer.scrollLeft = 1;
            if (scrollContainer.scrollLeft === 1) {
                // Standard behavior: scrollLeft is positive in RTL
                return 'positive';
            } else {
                // Firefox/legacy behavior: scrollLeft is negative in RTL
                return 'negative';
            }
        };
        
        // Store the browser's RTL scrolling behavior for later use
        const rtlBehavior = detectRTLScrollBehavior();
        scrollContainer.dataset.rtlBehavior = rtlBehavior;
        
        // Reset scroll position
        scrollContainer.scrollLeft = 0;
        
        // Make cards appear sequentially with a staggered animation
        const cards = scrollContainer.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Staggered animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // Initialize RTL scrolling and then start auto-scrolling
    initializeRTLScrolling();
    setTimeout(startAutoScroll, 1500);
});
