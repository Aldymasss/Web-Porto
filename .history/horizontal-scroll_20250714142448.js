// Horizontal auto-scrolling functionality for Menu Project section
document.addEventListener('DOMContentLoaded', function() {
    // Set up auto-scrolling for the slider-menu    const sliderMenu = document.getElementById('slider-menu');
    if (!sliderMenu) return;
    
    const scrollContainer = sliderMenu.querySelector('#slider-container');
    if (!scrollContainer) return;
    
    let scrollDirection = -1; // -1 for right-to-left, 1 for left-to-right
    let scrollInterval = null;
    let isPaused = false;
    let scrollSpeed = 1.0; // Pixels per frame - reduced for smoother scrolling
    // Start auto-scrolling
    function startAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
        
        // Initialize to start from rightmost position (in RTL mode, this is 0)
        scrollContainer.scrollLeft = 0;
        
        scrollInterval = setInterval(() => {
            if (isPaused) return;
            
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            
            // Since we're using direction: rtl in CSS,
            // scrolling right-to-left is actually increasing scrollLeft value
            if (scrollDirection < 0) {
                // Scrolling right to left (content moving leftward)
                if (scrollContainer.scrollLeft >= maxScroll - 1) {
                    // Reached the end, reset to beginning with a slight delay
                    setTimeout(() => {
                        scrollContainer.style.scrollBehavior = 'auto';
                        scrollContainer.scrollLeft = 0;
                        setTimeout(() => {
                            scrollContainer.style.scrollBehavior = 'smooth';
                        }, 100);
                    }, 500);
                } else {
                    scrollContainer.scrollLeft += scrollSpeed;
                }
            } else {
                // Scrolling left to right (content moving rightward)
                if (scrollContainer.scrollLeft <= 0) {
                    // Reached the beginning, reset to end with a slight delay
                    setTimeout(() => {
                        scrollContainer.style.scrollBehavior = 'auto';
                        scrollContainer.scrollLeft = maxScroll;
                        setTimeout(() => {
                            scrollContainer.style.scrollBehavior = 'smooth';
                        }, 100);
                    }, 500);
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
