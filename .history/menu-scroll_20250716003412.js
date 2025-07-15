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
        
        // Handle slider button clicks
        const prevBtn = sliderElement.querySelector('.slider-btn.prev');
        const nextBtn = sliderElement.querySelector('.slider-btn.next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                scrollContainer.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                scrollContainer.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
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
    }
});
