# lucabazzetto.github.io

Luca's personal website and online CV, served by GitHub Pages from `main`.
A push to `main` goes live at https://lucabazzetto.github.io/ in a minute or two.

Luca talks to Claude in Italian. The site content, code comments and commit messages are in English.

## Audience and tone

The site is written for recruiters and hiring managers. Keep it scannable,
concrete and quantified (for example "30 reports migrated, 500 users").
Do not name internal company tools or anything confidential: describe the work
and the business functions it served instead.

## Structure

Plain static site with no build step, framework or package manager.

- `index.html`: the whole page. Sections in order: hero (`#top`), stats/highlights,
  `#about`, `#experience`, `#projects`, `#skills`, `#education`, `#beyond`, `#contact`.
  Icons are inline SVG `<symbol>`s at the top of the body, used with `<use href="#i-…">`.
  It also holds Open Graph tags and JSON-LD structured data: keep them in sync with
  the visible content (role, location, description).
- `styles.css`: hand-written CSS. Material/Google-inspired look with tonal colours,
  chips, a timeline and hero shapes, in light and dark themes.
- `main.js`: the snowboard video dialog (the video loads only when opened) and
  highlighting of the nav link for the section in view.
- `privacy.html`: privacy notice. Update it if analytics or any third-party service changes.
- `fonts/`: self-hosted Google Sans Flex (woff2 plus the OFL licence). Do not load fonts from Google.
- `img/`: favicon, apple-touch-icon, `profile-480.jpg`.
- `media/`: compressed `snowboard.mp4` and its poster. `*-original.*` files are gitignored.
- `Luca_Bazzetto_Resume.pdf`, `Luca_Bazzetto_Recommendation_Letter_L.pdf`: published by
  `scripts/update-cv.sh`, never edited by hand.

Do not reintroduce Bootstrap, AOS, Font Awesome or other libraries. Removing them
was a deliberate choice in September 2026.

## Analytics

GoatCounter (cookieless) at https://lucabazzetto.goatcounter.com, loaded at the end
of `index.html`. Links and buttons worth tracking carry `data-goatcounter-click="…"`
(for example `download-cv`, `ext-linkedin`, `email`). Give new external links and
downloads a name in the same style.

## The CV lives in another repo

The CV is LaTeX in `/Users/luca/MyDrive/Work/Resume` (its own git repo).

- Content: `_src/content_en/` and `_src/content_it/`.
- City, phone and work mode: `_src/config/variant_*.tex`.
- `make en` builds `_output/Luca_Bazzetto_EN.pdf` (Zagreb variant). That is the one published here.

To publish it, run `./scripts/update-cv.sh` from this repo. It builds the CV, checks
the PDF, copies the CV and the recommendation letter here, updates the
`<!--CV_UPDATED-->…<!--/CV_UPDATED-->` date in `index.html`, commits
"Update CV (Month Year)" and pushes. Useful flags: `--dry-run`, `--no-push`,
`--no-build`, `--commit-source` (also commits the Resume repo).

**Keep the site and the CV consistent.** When a change touches facts that appear in
both (role, dates, location, work mode, figures, projects, skills, education),
update both, then run the script. Current facts: based in Zagreb, Croatia; Data
Engineer at Electrolux Professional Group, hybrid (Pordenone, IT); MSc in Data
Science at Milano-Bicocca, graduated October 2026 with 110/110 cum laude. Thesis:
*A Property-Graph Recommender System for Industrial Product Substitution*, with
Electrolux. Thesis details live in `/Users/luca/MyDrive/Magistrale/Thesis` (read
its CLAUDE.md: the data there is confidential).

## Working here

- Check changes in a browser, at phone width as well (no horizontal scroll) and in both themes.
- Commit only when Luca asks. Pushing publishes the site, so confirm before pushing.
