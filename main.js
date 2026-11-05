// Dialogs (videos and photos): each link opens the dialog named in
// data-dialog-open; without JavaScript the link opens the file itself.
// A video only loads when its dialog opens
document.querySelectorAll('[data-dialog-open]').forEach(button => {
  const dialog = document.getElementById(button.dataset.dialogOpen);
  if (!dialog) return;
  button.addEventListener('click', event => {
    event.preventDefault();
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
    // Sections without a nav link (hero, Beyond work) clear the highlight
    navLinks.forEach(link => link.removeAttribute('aria-current'));
    const current = navLinks.get(entry.target.id);
    if (!current) return;
    current.setAttribute('aria-current', 'true');
    // On phones the nav scrolls sideways: centre the current link, clear of the edge fades
    const list = current.closest('.nav-links');
    if (list.scrollWidth > list.clientWidth) {
      const offset = current.getBoundingClientRect().left - list.getBoundingClientRect().left;
      list.scrollTo({ left: list.scrollLeft + offset - (list.clientWidth - current.offsetWidth) / 2 });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));

// Fade the edges of the scrolling nav where more links are hidden
const navList = document.querySelector('.nav-links');
const updateNavFade = () => {
  const scrollable = navList.scrollWidth > navList.clientWidth + 4;
  navList.classList.toggle('fade-left', scrollable && navList.scrollLeft > 4);
  navList.classList.toggle('fade-right', scrollable && navList.scrollLeft + navList.clientWidth < navList.scrollWidth - 4);
};
navList.addEventListener('scroll', updateNavFade, { passive: true });
addEventListener('resize', updateNavFade);
updateNavFade();

// Hide the small nav avatar while the hero portrait is visible (CSS applies it on phones only)
const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto) {
  new IntersectionObserver(([entry]) => {
    document.documentElement.classList.toggle('hero-in-view', entry.isIntersecting);
  }, { rootMargin: '-64px 0px 0px 0px' }).observe(heroPhoto);
}

// Phones: the secondary skills start collapsed behind "Full skill list"
const skillMore = document.querySelector('.skill-more');
const phone = matchMedia('(max-width: 40rem)');
if (skillMore) {
  skillMore.open = !phone.matches;
  phone.addEventListener('change', event => { skillMore.open = !event.matches; });
}

// Copy the email address, with a spoken and visible confirmation
document.querySelectorAll('[data-copy]').forEach(button => {
  if (!navigator.clipboard) return;
  button.hidden = false;
  const label = button.querySelector('span');
  const status = button.closest('.contact-body')?.querySelector('.copy-status');
  let timer;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      label.textContent = 'Copied';
      if (status) status.textContent = 'Email address copied to the clipboard.';
    } catch {
      label.textContent = 'Copy failed';
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      label.textContent = 'Copy email';
      if (status) status.textContent = '';
    }, 2500);
  });
});
