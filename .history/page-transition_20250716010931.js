/**
 * Page Transition Handler
 * Smooth page transitions for Paperplane Project website
 */

// Save the current page to session storage for back/forward navigation handling
if (window.history && window.history.pushState) {
  sessionStorage.setItem('lastPage', window.location.href);
}

document.addEventListener('DOMContentLoaded', function() {
  // Add transition overlay div to the body
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);
    // Create a logo element for the transition
  const logoContainer = document.createElement('div');
  logoContainer.className = 'transition-logo';
  logoContainer.innerHTML = '<img src="img/brand-name.png" alt="Paperplane Project Logo">';
  overlay.appendChild(logoContainer);
  
  // Add loaded class to body for initial page load animations
  setTimeout(() => {
    document.body.classList.add('loaded');
    
    // Check if this is the result of a page transition
    const isFromTransition = sessionStorage.getItem('isTransitioning');
    if (isFromTransition) {
      // Clear the transition flag
      sessionStorage.removeItem('isTransitioning');
    }
  }, 100);

  // Apply fade-content class to major page sections
  const fadeElements = document.querySelectorAll('section, .hero, .menu-section, .contact-section, .about-section');
  fadeElements.forEach(el => {
    el.classList.add('fade-content');
  });

  // Apply stagger-fade class to navigation items
  const navItems = document.querySelectorAll('nav ul li');
  navItems.forEach((item, index) => {
    item.classList.add('fade-content', 'stagger-fade');
    item.style.transitionDelay = `${0.1 * index}s`;
  });

  // Handle all internal links for smooth page transitions
  document.body.addEventListener('click', function(e) {
    // Find clicked link
    let target = e.target;
    while (target && target !== document && target.tagName !== 'A') {
      target = target.parentNode;
    }    // Check if it's a link and an internal link
    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href');
      
      // Check if this link has the no-transition class
      const noTransition = target.classList.contains('no-transition');
      
      // Only handle internal HTML links, ignore hash links and external links
      if (href && 
          href.endsWith('.html') && 
          !href.startsWith('http') &&
          !href.startsWith('#') &&
          !noTransition) {
        
        // Prevent default link behavior
        e.preventDefault();
        
        // Set transition flag in session storage
        sessionStorage.setItem('isTransitioning', 'true');
        
        // Store current scroll position for back navigation
        sessionStorage.setItem('scrollPosition', window.scrollY);
        
        // Start page transition out animation
        document.body.classList.add('transitioning');
        
        // Show the logo during transition
        setTimeout(() => {
          const logoImg = overlay.querySelector('img');
          if (logoImg) logoImg.style.opacity = '1';
        }, 300);
        
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
    // Coming back via browser navigation
    document.body.classList.remove('transition-out');
    setTimeout(() => {
      document.body.classList.add('loaded');
      document.body.classList.remove('transitioning');
    }, 100);
  }
  
  // For browsers that don't fully support event.persisted
  const previousPage = sessionStorage.getItem('lastPage');
  const currentPage = window.location.href;
  
  if (previousPage && previousPage !== currentPage) {
    // This is likely a back/forward navigation
    document.body.classList.remove('transitioning');
    document.body.classList.add('loaded');
  }
  
  // Update the last page
  sessionStorage.setItem('lastPage', currentPage);
});
