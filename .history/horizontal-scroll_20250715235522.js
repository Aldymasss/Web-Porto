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
    let scrollSpeed = 0.8; // Pixels per frame - reduced for smoother scrolling
    // Start auto-scrolling
    function startAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
        
        // Initialize to start from rightmost position (in RTL mode, this is 0)
        scrollContainer.scrollLeft = 0;
        
        scrollInterval = setInterval(() => {
            if (isPaused) return;
            
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
              // With direction: rtl in CSS, scrolling mechanics work differently
            if (scrollDirection < 0) {
                // Scrolling right to left (content moving leftward)
                if (scrollContainer.scrollLeft >= maxScroll - 1) {
                    // Reached the end, reset to beginning smoothly
                    // Create a transition effect by using requestAnimationFrame
                    const resetScroll = () => {
                        scrollContainer.style.scrollBehavior = 'auto';
                        scrollContainer.scrollLeft = 0;
                        setTimeout(() => {
                            scrollContainer.style.scrollBehavior = 'smooth';
                        }, 50);
                    };
                    
                    setTimeout(resetScroll, 1000);
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            } else {
                // Scrolling left to right (content moving rightward)
                if (scrollContainer.scrollLeft <= 0) {
                    // Reached the beginning, reset to end smoothly
                    const resetScroll = () => {
                        scrollContainer.style.scrollBehavior = 'auto';
                        scrollContainer.scrollLeft = maxScroll;
                        setTimeout(() => {
                            scrollContainer.style.scrollBehavior = 'smooth';
                        }, 50);
                    };
                    
                    setTimeout(resetScroll, 1000);
                } else {
                    scrollContainer.scrollLeft -= scrollSpeed;
                }
            }
        }, 16); // ~60fps
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
    });
      // Handle slider button clicks
    const prevBtn = sliderMenu.querySelector('.slider-btn.prev');
    const nextBtn = sliderMenu.querySelector('.slider-btn.next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            // Since we're using RTL, previous means increasing scroll position
            scrollContainer.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
            // Pause auto-scrolling briefly after button click
            isPaused = true;
            setTimeout(() => { isPaused = false; }, 2000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Since we're using RTL, next means decreasing scroll position
            scrollContainer.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
            // Pause auto-scrolling briefly after button click
            isPaused = true;
            setTimeout(() => { isPaused = false; }, 2000);
        });
    }
    
    // Start auto-scrolling after a short delay
    setTimeout(startAutoScroll, 1000);
});
