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
        
        // Simpan style asli elemen untuk dipulihkan nanti
        const originalStyles = new Map();
        
        // Simpan style untuk judul
        document.querySelectorAll('.projects-section h2, .projects-section h3, h3[style*="text-align:center"], h2[style*="text-align:center"]').forEach(heading => {
            originalStyles.set(heading, {
                display: heading.style.display,
                textAlign: heading.style.textAlign,
                hasInlineStyle: heading.hasAttribute('style') && heading.getAttribute('style').includes('text-align')
            });
        });
        
        // Simpan style untuk deskripsi
        document.querySelectorAll('.projects-section p, .menu-category p, p[style*="text-align:center"]').forEach(desc => {
            originalStyles.set(desc, {
                display: desc.style.display,
                textAlign: desc.style.textAlign,
                hasInlineStyle: desc.hasAttribute('style') && desc.getAttribute('style').includes('text-align')
            });
        });
        
        // Hide all cards, sliders, headings, sections
        allCards.forEach(card => card.style.display = 'none');
        allSliders.forEach(slider => slider.style.display = 'none');
        allSections.forEach(section => section.style.display = 'none');
        document.querySelectorAll('.projects-section h3').forEach(h => h.style.display = 'none');
        document.querySelectorAll('.projects-section h3 + p, .description, .menu-category p').forEach(p => p.style.display = 'none');
        // Remove highlight
        document.querySelectorAll('.search-highlight').forEach(el => { el.outerHTML = el.innerHTML; });
        // Show only matching cards and their containers
        allCards.forEach(card => {
            const titleEl = card.querySelector('h3, h4');
            const descEl = card.querySelector('p');
            const priceEl = card.querySelector('.btn');            const title = titleEl?.textContent.toLowerCase() || '';
            const price = priceEl?.textContent.toLowerCase() || '';
            // Only search in titles and prices, not descriptions
            if (title.includes(keyword) || price.includes(keyword)) {
                card.style.display = '';
                foundCount++;                if (titleEl && title.includes(keyword)) titleEl.innerHTML = highlightText(titleEl.innerHTML, keyword);
                // Only highlight matches in title and price, not descriptions
                if (priceEl && price.includes(keyword)) priceEl.innerHTML = highlightText(priceEl.innerHTML, keyword);
                // Show parent slider, section, heading
                const slider = card.closest('.projects-slider');
                if (slider) slider.style.display = '';
                const section = card.closest('.projects-section');
                if (section) section.style.display = '';
                // Show heading before slider and ensure correct styling
                if (slider) {
                    let heading = slider.previousElementSibling;
                    while (heading && heading.tagName !== 'H3') heading = heading.previousElementSibling;
                    if (heading) {
                        heading.style.display = '';
                        heading.style.textAlign = ''; // Reset to default alignment
                        
                        // Show description paragraph if it exists
                        if (heading.nextElementSibling) {
                            const nextEl = heading.nextElementSibling;
                            if (nextEl.tagName === 'P' || nextEl.classList.contains('description')) {
                                nextEl.style.display = '';
                            }
                        }
                        
                        // Find all related descriptions
                        const sectionParent = heading.closest('.projects-section');
                        if (sectionParent) {
                            const relatedDescs = sectionParent.querySelectorAll('p.description, .menu-category p');
                            relatedDescs.forEach(desc => desc.style.display = '');
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
        
        // Show all headings and ensure correct alignment
        document.querySelectorAll('h2, h3').forEach(heading => {
            heading.style.display = '';
            // Jangan ubah textAlign jika ada inline style
            if (!heading.hasAttribute('style') || !heading.getAttribute('style').includes('text-align')) {
                heading.style.textAlign = ''; 
            }
        });
        
        // Tampilkan kembali judul dengan style khusus
        document.querySelectorAll('h3[style*="text-align:center"], h2[style*="text-align:center"]').forEach(heading => {
            heading.style.display = '';
            heading.style.textAlign = 'center';
        });
        
        // Show all descriptions - be more thorough with selectors
        document.querySelectorAll('.menu-category p, .projects-section p, h3 + p, .description, p[style*="text-align:center"]').forEach(desc => {
            desc.style.display = '';
            // Jangan ubah textAlign jika ada inline style
            if (desc.hasAttribute('style') && desc.getAttribute('style').includes('text-align:center')) {
                desc.style.textAlign = 'center';
            }
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
        
        // Memastikan judul dengan style inline tetap dipertahankan
        document.querySelectorAll('h3[style*="text-align:center"], h2[style*="text-align:center"]').forEach(heading => {
            if (heading.style.display !== 'none') {
                heading.style.textAlign = 'center';
            }
        });
        
        // Memastikan deskripsi dengan style inline tetap dipertahankan
        document.querySelectorAll('p[style*="text-align:center"]').forEach(desc => {
            if (desc.style.display !== 'none') {
                desc.style.textAlign = 'center';
            }
        });
        // Create new message
        const resultMsg = document.createElement('div');
        resultMsg.className = 'search-result-message';
        if (result.foundCount > 0) {
            resultMsg.innerHTML = `<div class="search-icon"><i class="fa fa-check-circle"></i></div><div class="search-message">Menampilkan ${result.foundCount} menu untuk "<strong>${keyword}</strong>"</div>`;
        } else {
            resultMsg.innerHTML = `<div class="search-icon"><i class="fa fa-exclamation-circle"></i></div><div class="search-message">Tidak ada menu yang ditemukan untuk "<strong>${keyword}</strong>"<span class="search-tip">Coba kata kunci lain atau periksa ejaan</span></div>`;
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
            
            // Reset search when closing results
            resetSearch();
            searchInput.value = '';
        };
        resultMsg.appendChild(closeBtn);
        // Place at top of viewport
        // Let CSS handle the styling
        document.body.appendChild(resultMsg);

        // Auto-hide after 5 seconds (reduced from 8 seconds)
        setTimeout(() => {
            if (resultMsg && resultMsg.parentNode) {
                resultMsg.style.opacity = '0';
                resultMsg.style.transform = 'translateY(-20px)';
                resultMsg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                setTimeout(() => resultMsg.remove(), 300);
            }
        }, 5000);
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
