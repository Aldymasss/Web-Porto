// Smooth scroll functionality for Menu Project sections
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sliders with smooth scrolling
    const allSliders = document.querySelectorAll('.projects-slider');
    
    allSliders.forEach(slider => {
        const containerId = slider.querySelector('.projects-grid').id;
        if (containerId) {
            initializeSlider(slider.id, containerId);
        } else {
            initializeSlider(slider.id);
        }
    });
    
    // Function to initialize a slider with smooth animations
    function initializeSlider(sliderId, containerId = null) {
        const sliderElement = document.getElementById(sliderId) || document.querySelector('.projects-slider');
        if (!sliderElement) return;
        
        const scrollContainer = containerId 
            ? sliderElement.querySelector('#' + containerId) 
            : sliderElement.querySelector('.projects-grid');
            
        if (!scrollContainer) return;
        
        // Add intersection observer for lazy loading animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class when slider comes into view
                    scrollContainer.classList.add('animate-in');
                    observer.unobserve(entry.target);
                    
                    // Auto scroll to show there's more content
                    setTimeout(() => {
                        if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
                            scrollContainer.scrollBy({
                                left: 100,
                                behavior: 'smooth'
                            });
                            
                            // Scroll back after a delay
                            setTimeout(() => {
                                scrollContainer.scrollBy({
                                    left: -100,
                                    behavior: 'smooth'
                                });
                            }, 1000);
                        }
                    }, 1500);
                }
            });
        }, { threshold: 0.2 });
        
        // Observe the scroll container
        observer.observe(scrollContainer);
        
        // Add touch feedback
        scrollContainer.addEventListener('scroll', () => {
            // Update visual indication based on scroll position
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            const scrolled = scrollContainer.scrollLeft / maxScroll;
            
            // You could add a progress indicator here if desired
            
            // Change the appearance of cards based on position
            const cards = scrollContainer.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                const cardRect = card.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                
                // Center card in view
                if (cardRect.left > containerRect.left - 50 && 
                    cardRect.right < containerRect.right + 50) {
                    card.classList.add('in-view');
                } else {
                    card.classList.remove('in-view');
                }
            });
        });
    }
});
