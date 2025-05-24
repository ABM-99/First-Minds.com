  // Portfolio page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.project-filter button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
  
    if (filterButtons.length && portfolioItems.length) {
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Update active button
          filterButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          // Filter items
          const filterValue = this.dataset.filter;
          portfolioItems.forEach(item => {
            const matchesFilter = filterValue === 'all' || 
                                 item.dataset.category === filterValue;
            item.style.display = matchesFilter ? 'block' : 'none';
          });
          
          // Refresh animations
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        });
      });
    }
  
    // Lightbox configuration
    if (typeof lightbox !== 'undefined') {
      lightbox.option({
        resizeDuration: 200,
        wrapAround: true,
        albumLabel: 'Project %1 of %2'
      });
    }
  });