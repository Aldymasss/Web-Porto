// Search functionality for Paperplane Project Menu
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.nav-search');
    const searchInput = searchForm.querySelector('input[type="search"]');

    // Main search function - hides all non-matching items
    function searchAllMenus(keyword) {
        console.log("Searching for:", keyword);
        keyword = keyword.toLowerCase();
        
        // Get all the elements we need to work with
        const allCards = document.querySelectorAll('.project-card');
        const allSections = document.querySelectorAll('.projects-section');
        const allSliders = document.querySelectorAll('.projects-slider');
        
        let foundCount = 0;
        let visibleSections = new Set();
        
        // First remove any previous highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        // STEP 1: Hide everything first
        allCards.forEach(card => card.style.display = 'none');
        allSections.forEach(section => section.style.display = 'none');
        
        // Hide all headings and descriptions
        document.querySelectorAll('.projects-section h3').forEach(heading => {
            heading.style.display = 'none';
        });
        
        document.querySelectorAll('.projects-section h3 + p').forEach(desc => {
            desc.style.display = 'none';
        });
        
        // Hide all sliders
        allSliders.forEach(slider => {
            slider.style.display = 'none';
        });
        
        // STEP 2: Show matching cards and their containers
        allCards.forEach(card => {
            const titleEl = card.querySelector('h3, h4');
            const descEl = card.querySelector('p');
            const priceEl = card.querySelector('.btn');
            
            const title = titleEl?.textContent.toLowerCase() || '';
            const desc = descEl?.textContent.toLowerCase() || '';
            const price = priceEl?.textContent.toLowerCase() || '';
            
            // Check if this card matches the search
            if (title.includes(keyword) || desc.includes(keyword) || price.includes(keyword)) {
                card.style.display = ''; // Show this card
                foundCount++;
                
                // Highlight matching text
                if (titleEl && title.includes(keyword)) {
                    titleEl.innerHTML = highlightText(titleEl.innerHTML, keyword);
                }
                if (descEl && desc.includes(keyword)) {
                    descEl.innerHTML = highlightText(descEl.innerHTML, keyword);
                }
                if (priceEl && price.includes(keyword)) {
                    priceEl.innerHTML = highlightText(priceEl.innerHTML, keyword);
                }
                
                // Show the section containing this card
                const section = card.closest('.projects-section');
                if (section) {
                    section.style.display = '';
                    if (section.id) {
                        visibleSections.add(section.id);
                    }
                    
                    // Show the main section heading
                    const mainHeading = section.querySelector('h2');
                    if (mainHeading) {
                        mainHeading.style.display = '';
                    }
                }
                
                // Show the slider containing this card
                const slider = card.closest('.projects-slider');
                if (slider) {
                    slider.style.display = '';
                    
                    // Find and show the category heading for this slider
                    let heading = slider.previousElementSibling;
                    while (heading && heading.tagName !== 'H3') {
                        heading = heading.previousElementSibling;
                    }
                    
                    if (heading) {
                        heading.style.display = '';
                        
                        // Show description if it exists (usually a p tag after the h3)
                        if (heading.nextElementSibling && 
                            (heading.nextElementSibling.tagName === 'P' || 
                             heading.nextElementSibling.classList.contains('description'))) {
                            heading.nextElementSibling.style.display = '';
                        }
                    }
                    
                    // Make sure the grid containing this card is active
                    const grid = card.closest('.projects-grid');
                    if (grid) {
                        // Deactivate all grids in this slider
                        slider.querySelectorAll('.projects-grid').forEach(g => {
                            g.classList.remove('slide-active');
                        });
                        
                        // Activate only this grid
                        grid.classList.add('slide-active');
                    }
                }
            }
        });
        
        return {
            foundCount,
            foundSections: Array.from(visibleSections)
        };
    }

    // Helper function to highlight text matches
    function highlightText(text, keyword) {
        if (!keyword) return text;
        
        try {
            const textString = String(text);
            const keywordString = String(keyword);
            
            // Escape special regex chars
            const cleanKeyword = keywordString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(cleanKeyword, 'gi');
            return textString.replace(regex, match => `<span class="search-highlight">${match}</span>`);
        } catch (e) {
            console.error("Error highlighting text:", e);
            return text; // Return original text if there's an error
        }
    }

    // Function to reset search and show all items
    function resetSearch() {
        // Show all sections
        document.querySelectorAll('.projects-section').forEach(section => {
            section.style.display = '';
        });
        
        // Show all headings
        document.querySelectorAll('h2, h3').forEach(heading => {
            heading.style.display = '';
        });
        
        // Show all descriptions
        document.querySelectorAll('.menu-category p').forEach(desc => {
            desc.style.display = '';
        });
        
        // Show all cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.display = '';
        });
        
        // Show all sliders
        document.querySelectorAll('.projects-slider').forEach(slider => {
            slider.style.display = '';
        });
        
        // Reset slider active states
        document.querySelectorAll('.projects-slider').forEach(slider => {
            const slides = slider.querySelectorAll('.projects-grid');
            slides.forEach((slide, i) => {
                if (i === 0) {
                    slide.classList.add('slide-active');
                } else {
                    slide.classList.remove('slide-active');
                }
            });
        });
        
        // Remove any highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        // Remove search result message
        const existingMsg = document.querySelector('.search-result-message');
        if (existingMsg) existingMsg.remove();
    }

    // Function to show search results message
    function showSearchResult(keyword, result) {
        // Remove existing message
        const existingMsg = document.querySelector('.search-result-message');
        if (existingMsg) existingMsg.remove();
        
        if (keyword === '') return;
        
        // Create new message
        const resultMsg = document.createElement('div');
        resultMsg.className = 'search-result-message';
        
        if (result.foundCount > 0) {
            resultMsg.innerHTML = `
                <i class="fa fa-search" style="margin-right:8px;"></i>
                Menampilkan ${result.foundCount} menu untuk "<strong>${keyword}</strong>"
            `;
        } else {
            resultMsg.innerHTML = `
                <i class="fa fa-exclamation-circle" style="margin-right:8px;"></i>
                Tidak ada menu yang ditemukan untuk "<strong>${keyword}</strong>"
                <span style="display:block;font-size:0.9em;opacity:0.8;margin-top:5px;">
                    Coba kata kunci lain atau periksa ejaan
                </span>
            `;
            resultMsg.classList.add('no-results');
            
            // Show all sections again if no results
            resetSearch();
            
            // Highlight search input to indicate error
            searchInput.classList.add('search-error');
            setTimeout(() => {
                searchInput.classList.remove('search-error');
            }, 2000);
        }
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'search-close-btn';
        closeBtn.setAttribute('aria-label', 'Close search results');
        closeBtn.style.position = 'absolute';
        closeBtn.style.right = '10px';
        closeBtn.style.top = '10px';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = 'white';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = function() {
            resultMsg.style.opacity = '0';
            setTimeout(() => resultMsg.remove(), 500);
        };
        resultMsg.appendChild(closeBtn);
        resultMsg.style.position = 'relative';
        
        // Insert message after header
        const header = document.querySelector('header');
        if (header && header.parentNode) {
            header.parentNode.insertBefore(resultMsg, header.nextSibling);
            
            // Scroll to first result
            if (result.foundCount > 0) {
                setTimeout(() => {
                    const firstVisibleCard = document.querySelector('.project-card[style="display: ;"]');
                    if (firstVisibleCard) {
                        firstVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        }
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (resultMsg && resultMsg.parentNode) {
                resultMsg.style.opacity = '0';
                setTimeout(() => resultMsg.remove(), 500);
            }
        }, 8000);
    }

    // Handle form submission (search button click or Enter key)
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        
        if (keyword) {
            const result = searchAllMenus(keyword);
            showSearchResult(keyword, result);
            searchInput.focus(); // Keep focus in search box
        } else {
            resetSearch();
        }
    });
    
    // Handle real-time search with debouncing
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        const keyword = searchInput.value.trim();
        
        // Clear any pending timeout
        clearTimeout(searchTimeout);
        
        if (keyword === '') {
            resetSearch();
        } else if (keyword.length >= 2) {
            // Small delay to avoid too many searches while typing
            searchTimeout = setTimeout(() => {
                const result = searchAllMenus(keyword);
                showSearchResult(keyword, result);
            }, 300);
        }
    });
});
