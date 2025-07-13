/* 
 * menu-responsive.js 
 * Additional JavaScript to ensure cards have consistent heights
 * based on their content
 */

document.addEventListener('DOMContentLoaded', function() {
  // Function to equalize card heights in each slider section
  function equalizeCardHeights() {
    // Find all slider sections
    const sliders = document.querySelectorAll('.projects-slider');
    
    sliders.forEach(slider => {
      // Get all cards in this slider
      const cards = slider.querySelectorAll('.project-card');
      
      if (cards.length === 0) return;
      
      // Reset heights first
      cards.forEach(card => {
        card.style.height = 'auto';
      });
      
      // Find the tallest card
      let maxHeight = 0;
      cards.forEach(card => {
        const cardHeight = card.offsetHeight;
        maxHeight = Math.max(maxHeight, cardHeight);
      });
      
      // Set all cards to the same height
      cards.forEach(card => {
        card.style.height = maxHeight + 'px';
      });
    });
  }
  
  // Run on page load
  equalizeCardHeights();
  
  // Run when window is resized
  window.addEventListener('resize', equalizeCardHeights);
  
  // Run after sliders change
  document.querySelectorAll('.slider-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Wait for slider transition to complete
      setTimeout(equalizeCardHeights, 500);
    });
  });
});
