// Horizontal auto-scrolling functionality for Menu Project sections
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the recommendation slider
    initializeSlider('slider-recommendations', 'recommendations-container');
    
    // Initialize the regular menu slider
    initializeSlider('slider-menu', 'slider-container');
    
    // Function to initialize a slider with its container
    function initializeSlider(sliderId, containerId) {
        const sliderElement = document.getElementById(sliderId);
        if (!sliderElement) return;
        
        const scrollContainer = sliderElement.querySelector('#' + containerId);
        if (!scrollContainer) return;
        
        let isPaused = false;
        let scrollSpeed = 0.8; // Pixels per frame
        let scrollInterval = null;
        
        // Initialize position and detect browser behavior
        scrollContainer.scrollLeft = 0;
        
        // Detect browser behavior for RTL scrolling
        function detectRTLScrollBehavior() {
            scrollContainer.scrollLeft = 1;
            if (scrollContainer.scrollLeft === 1) {
                // Standard behavior: scrollLeft is positive in RTL
                return 'positive';
            } else {
                // Firefox/legacy behavior: scrollLeft is negative in RTL
                return 'negative';
            }
        }
        
        // Store the browser's RTL scrolling behavior
        const rtlBehavior = detectRTLScrollBehavior();
        scrollContainer.dataset.rtlBehavior = rtlBehavior;
        scrollContainer.scrollLeft = 0;
        
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
        sliderElement.appendChild(indicator);
        
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
        
        // Handle mouse events to pause scrolling
        scrollContainer.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // Handle touch events
        scrollContainer.addEventListener('touchstart', () => {
            isPaused = true;
        });
        
        scrollContainer.addEventListener('touchend', () => {
            setTimeout(() => {
                isPaused = false;
            }, 1000);
        });
        
        // Handle slider button clicks
        const prevBtn = sliderElement.querySelector('.slider-btn.prev');
        const nextBtn = sliderElement.querySelector('.slider-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                scrollContainer.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
                
                prevBtn.classList.add('btn-active');
                setTimeout(() => prevBtn.classList.remove('btn-active'), 300);
                
                isPaused = true;
                setTimeout(() => { isPaused = false; }, 2000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                scrollContainer.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
                
                nextBtn.classList.add('btn-active');
                setTimeout(() => nextBtn.classList.remove('btn-active'), 300);
                
                isPaused = true;
                setTimeout(() => { isPaused = false; }, 2000);
            });
        }
        
        // Staggered animation for cards
        const cards = scrollContainer.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        });
        
        // Start auto-scrolling
        scrollInterval = setInterval(() => {
            if (isPaused) return;
            
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            
            // Handle scrolling based on browser behavior
            if (rtlBehavior === 'negative') {
                // Firefox-like behavior
                if (scrollContainer.scrollLeft > -maxScroll) {
                    scrollContainer.scrollLeft -= scrollSpeed;
                } else {
                    scrollContainer.scrollLeft = 0;
                }
            } else {
                // Chrome-like behavior
                if (scrollContainer.scrollLeft < maxScroll) {
                    scrollContainer.scrollLeft += scrollSpeed;
                } else {
                    scrollContainer.scrollLeft = 0;
                }
            }
        }, 16);
    }
});
