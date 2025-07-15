/**
 * Page Transition Handler
 * Smooth page transitions for Paperplane Project website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Add transition overlay div to the body
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);
  
  // Add loaded class to body for initial page load animations
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  // Apply fade-content class to major page sections
  const fadeElements = document.querySelectorAll('section, .hero, .menu-section, .contact-section');
  fadeElements.forEach(el => {
    el.classList.add('fade-content');
  });

  // Apply stagger-fade class to navigation items
  const navItems = document.querySelectorAll('nav ul li');
  navItems.forEach(item => {
    item.classList.add('fade-content', 'stagger-fade');
  });

  // Handle all internal links for smooth page transitions
  document.body.addEventListener('click', function(e) {
    // Find clicked link
    let target = e.target;
    while (target && target !== document && target.tagName !== 'A') {
      target = target.parentNode;
    }

    // Check if it's a link and an internal link
    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href');
      
      // Only handle internal HTML links, ignore hash links and external links
      if (href && 
          href.endsWith('.html') && 
          !href.startsWith('http') &&
          !href.startsWith('#')) {
        
        // Prevent default link behavior
        e.preventDefault();
        
        // Start page transition out animation
        document.body.classList.add('transitioning');
        
        // After transition duration, navigate to new page
        setTimeout(() => {
          window.location.href = href;
        }, 600); // Match this with CSS transition duration
      }
    }
  });
});

// Handle page load transition in
window.addEventListener('pageshow', function(event) {
  // Check if it's a back/forward navigation
  if (event.persisted) {
    document.body.classList.remove('transition-out');
    setTimeout(() => {
      document.body.classList.add('loaded');
      document.body.classList.remove('transitioning');
    }, 100);
  }
});
