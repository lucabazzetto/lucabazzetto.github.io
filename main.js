// Dialogs (videos and photos): each button opens the dialog named in
// data-dialog-open; a video only loads when its dialog opens
document.querySelectorAll('[data-dialog-open]').forEach(button => {
  const dialog = document.getElementById(button.dataset.dialogOpen);
  if (!dialog) return;
  button.addEventListener('click', () => {
    dialog.showModal();
    dialog.querySelector('video')?.play().catch(() => {});
  });
});

document.querySelectorAll('.video-dialog, .photo-dialog').forEach(dialog => {
  // Close when clicking the backdrop, pause any video when closed
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.querySelector('video')?.pause());
});

// Highlight the nav link of the section currently in view
const navLinks = new Map(
  [...document.querySelectorAll('.nav-links a')].map(link => [link.hash.slice(1), link])
);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.removeAttribute('aria-current'));
    navLinks.get(entry.target.id)?.setAttribute('aria-current', 'true');
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
