// Search functionality for Paperplane Project Menu
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.nav-search');
    const searchInput = searchForm.querySelector('input[type="search"]');

    // Main search function - hides all non-matching items
    function searchAllMenus(keyword) {
        keyword = keyword.toLowerCase();
        const allCards = document.querySelectorAll('.project-card');
        const allSections = document.querySelectorAll('.projects-section');
        const allSliders = document.querySelectorAll('.projects-slider');
        let foundCount = 0;
        // Hide all cards, sliders, headings, sections
        allCards.forEach(card => card.style.display = 'none');
        allSliders.forEach(slider => slider.style.display = 'none');
        allSections.forEach(section => section.style.display = 'none');
        document.querySelectorAll('.projects-section h3').forEach(h => h.style.display = 'none');
        document.querySelectorAll('.projects-section h3 + p').forEach(p => p.style.display = 'none');
        // Remove highlight
        document.querySelectorAll('.search-highlight').forEach(el => { el.outerHTML = el.innerHTML; });
        // Show only matching cards and their containers
        allCards.forEach(card => {            const titleEl = card.querySelector('h3, h4');
            const title = titleEl?.textContent.toLowerCase() || '';
            
            // Only search in titles (h3, h4), not in descriptions or prices
            if (title.includes(keyword)) {
                card.style.display = '';
                foundCount++;
                if (titleEl) titleEl.innerHTML = highlightText(titleEl.innerHTML, keyword);
                // Show parent slider, section, heading
                const slider = card.closest('.projects-slider');
                if (slider) slider.style.display = '';
                const section = card.closest('.projects-section');
                if (section) section.style.display = '';
                // Show heading before slider
                if (slider) {
                    let heading = slider.previousElementSibling;
                    while (heading && heading.tagName !== 'H3') heading = heading.previousElementSibling;
                    if (heading) {
                        heading.style.display = '';
                        if (heading.nextElementSibling && (heading.nextElementSibling.tagName === 'P' || heading.nextElementSibling.classList.contains('description'))) {
                            heading.nextElementSibling.style.display = '';
                        }
                    }
                }
            }
        });
        return { foundCount };
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
            resultMsg.innerHTML = `<i class="fa fa-search" style="margin-right:8px;"></i>Menampilkan ${result.foundCount} menu untuk "<strong>${keyword}</strong>"`;
        } else {
            resultMsg.innerHTML = `<i class="fa fa-exclamation-circle" style="margin-right:8px;"></i>Tidak ada menu yang ditemukan untuk "<strong>${keyword}</strong>"<span style="display:block;font-size:0.9em;opacity:0.8;margin-top:5px;">Coba kata kunci lain atau periksa ejaan</span>`;
            resultMsg.classList.add('no-results');
            resetSearch();
            searchInput.classList.add('search-error');
            setTimeout(() => { searchInput.classList.remove('search-error'); }, 2000);
        }
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'search-close-btn';
        closeBtn.setAttribute('aria-label', 'Close search results');
        closeBtn.onclick = function() {
            resultMsg.style.opacity = '0';
            setTimeout(() => resultMsg.remove(), 500);
        };
        resultMsg.appendChild(closeBtn);
        // Place in center of viewport
        resultMsg.style.position = 'fixed';
        resultMsg.style.top = '50%';
        resultMsg.style.left = '50%';
        resultMsg.style.transform = 'translate(-50%, -50%)';
        resultMsg.style.zIndex = '9999';
        document.body.appendChild(resultMsg);
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
