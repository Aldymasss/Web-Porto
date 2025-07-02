console.log('javascript ready...')

//! responsive navigation bar 
function showMobileNav() {
    var navbar = document.getElementById("navbar");
    if (navbar.className === "navibar") {
        navbar.className += " responsive";
    } else {
        navbar.className = "navibar";
    }
}

//! Button function checking
function showNotification(params) {
	alert(params.toString())
	return
}

//! Project slider logic
let currentSlide = 0;
function slideProjects(direction) {
    const grid = document.querySelector('.projects-grid');
    const cards = document.querySelectorAll('.project-card');
    const maxSlide = cards.length - 1;
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide > maxSlide - 1) currentSlide = maxSlide - 1;
    const cardWidth = cards[0].offsetWidth + 32; // card + margin
    grid.style.transform = `translateX(${-currentSlide * cardWidth}px)`;
}

window.addEventListener('resize', () => {
    // Reset slider position on resize
    slideProjects(0);
});