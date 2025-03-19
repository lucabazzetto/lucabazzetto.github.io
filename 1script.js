// Smooth scrolling for navigation links with Bootstrap offset adjustment
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      window.scrollTo({
        top: target.offsetTop - document.querySelector('.navbar').offsetHeight,
        behavior: 'smooth'
      });
      
      // If on mobile, collapse the navbar after clicking
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navbarCollapse).toggle();
      }
    });
  });
  