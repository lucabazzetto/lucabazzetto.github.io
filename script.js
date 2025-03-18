// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({ behavior:'smooth' });
    });
});

// Simple fade-in animation on scroll
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(entries => {
 entries.forEach(entry => {
   if (entry.isIntersecting) {
     entry.target.style.opacity = '1';
     entry.target.style.transform = 'translateY(0)';
   }
 });
}, { threshold:.1 });

sections.forEach(section => {
 section.style.opacity = '0';
 section.style.transform = 'translateY(20px)';
 section.style.transition = 'opacity .6s ease-out, transform .6s ease-out';
 observer.observe(section);
});
