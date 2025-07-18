// Simple touch scroll implementation for mobile sliders
document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.projects-slider');
  
  sliders.forEach(slider => {
    const container = slider.querySelector('.projects-grid');
    if (!container) return;
    
    let startX, scrollLeft, isDown = false;
    
    container.addEventListener('touchstart', e => {
      isDown = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    }, { passive: true });
    
    container.addEventListener('touchend', () => {
      isDown = false;
    });
    
    container.addEventListener('touchmove', e => {
      if (!isDown) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    }, { passive: true });
  });
});
