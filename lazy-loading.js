// Lazy loading functionality for Paperplane Project Cafe
document.addEventListener('DOMContentLoaded', function() {
  // Identifikasi semua gambar yang perlu lazy load
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  // Buat Intersection Observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Ketika gambar terlihat di viewport
      if (entry.isIntersecting) {
        const img = entry.target;
        // Ganti src dengan data-src
        img.src = img.dataset.src;
        
        // Tambahkan class loaded ketika gambar selesai dimuat
        img.onload = () => {
          img.classList.add('loaded');
        };
        
        // Hentikan observasi pada gambar ini
        observer.unobserve(img);
      }
    });
  }, {
    // Root margin untuk memulai loading gambar sebelum masuk viewport
    rootMargin: '50px',
    threshold: 0.1
  });
  
  // Observasi semua gambar lazy
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
  
  // Fallback untuk browser yang tidak mendukung Intersection Observer
  if (!('IntersectionObserver' in window)) {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }
  
  // Lazy loading untuk menu carousel
  const loadMenuImages = (container) => {
    const visibleImages = container.querySelectorAll('img[data-src]');
    visibleImages.forEach(img => {
      // Load gambar yang terlihat
      if (img.dataset.src) {
        img.src = img.dataset.src;
        // Hapus data-src untuk mencegah loading ulang
        img.removeAttribute('data-src');
      }
    });
  };
  
  // Cari slider menu
  const menuSliders = document.querySelectorAll('.projects-slider');
  menuSliders.forEach(slider => {
    // Ketika tombol slider diklik, load gambar baru
    const prevBtn = slider.querySelector('.slider-btn.prev');
    const nextBtn = slider.querySelector('.slider-btn.next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        setTimeout(() => {
          loadMenuImages(slider);
        }, 300);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        setTimeout(() => {
          loadMenuImages(slider);
        }, 300);
      });
    }
  });
});
