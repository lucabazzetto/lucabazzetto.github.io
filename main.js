// Dialogs (videos and photos): each button opens the dialog named in
// data-dialog-open; a video only loads when its dialog opens
document.querySelectorAll('[data-dialog-open]').forEach(button => {
  const dialog = document.getElementById(button.dataset.dialogOpen);
  if (!dialog) return;
  button.addEventListener('click', () => {
    const video = dialog.querySelector('video');
    // The poster is set here too, so it isn't downloaded with the page
    if (video && !video.poster && video.dataset.poster) video.poster = video.dataset.poster;
    dialog.showModal();
    video?.play().catch(() => {});
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
    const current = navLinks.get(entry.target.id);
    if (!current) return;
    current.setAttribute('aria-current', 'true');
    // On phones the nav scrolls sideways: keep the current link in view
    const list = current.parentElement.parentElement;
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: current.offsetLeft - list.clientWidth / 2 + current.offsetWidth / 2 });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));

// Fade the right edge of the scrolling nav until its end is reached
const navList = document.querySelector('.nav-links');
const updateNavFade = () => navList.classList.toggle(
  'at-end', navList.scrollLeft + navList.clientWidth >= navList.scrollWidth - 4
);
navList.addEventListener('scroll', updateNavFade, { passive: true });
addEventListener('resize', updateNavFade);
updateNavFade();
