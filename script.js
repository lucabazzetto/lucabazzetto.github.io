// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      window.scrollTo({
        top: target.offsetTop - document.querySelector('.navbar').offsetHeight,
        behavior:'smooth'
      });
    });
   });
   
   // Initialize AOS (Animate on Scroll)
   AOS.init();
   