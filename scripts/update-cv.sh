#!/bin/bash
# Build the CV from the Resume repo and publish it on the website.
#
#   ./scripts/update-cv.sh              build, copy, commit and push
#   ./scripts/update-cv.sh --dry-run    show what would change, touch nothing
#   ./scripts/update-cv.sh --no-push    commit locally, push yourself later
#   ./scripts/update-cv.sh --no-build   publish the existing _output PDF as is
#   ./scripts/update-cv.sh --commit-source  also commit/push the Resume repo
#
# Override the Resume repo location with:  RESUME_DIR=/path ./scripts/update-cv.sh

set -euo pipefail

RESUME_DIR="${RESUME_DIR:-/Users/luca/MyDrive/Work/Resume}"
SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BUILT_CV="$RESUME_DIR/_output/Luca_Bazzetto_EN.pdf"
PUBLISHED_CV="$SITE_DIR/Luca_Bazzetto_Resume.pdf"
SOURCE_LETTER="$RESUME_DIR/Recommendations/Luca_Bazzetto_Recommendation_Letter_L.pdf"
PUBLISHED_LETTER="$SITE_DIR/Luca_Bazzetto_Recommendation_Letter_L.pdf"

# TinyTeX is not on the PATH of non-interactive shells
for texbin in "$HOME/Library/TinyTeX-2026/bin/universal-darwin" "$HOME/Library/TinyTeX/bin/universal-darwin"; do
  [ -d "$texbin" ] && PATH="$texbin:$PATH"
done
export PATH

DRY_RUN=0; PUSH=1; BUILD=1; COMMIT_SOURCE=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --no-push) PUSH=0 ;;
    --no-build) BUILD=0 ;;
    --commit-source) COMMIT_SOURCE=1 ;;
    -h|--help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

say()  { printf '\033[0;34m%s\033[0m\n' "$*"; }
ok()   { printf '\033[0;32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[0;33m! %s\033[0m\n' "$*"; }
die()  { printf '\033[0;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[ -d "$RESUME_DIR" ] || die "Resume repo not found at $RESUME_DIR"

# 1. Build
if [ "$BUILD" -eq 1 ]; then
  command -v pdflatex >/dev/null || die "pdflatex not found (is TinyTeX installed?)"
  say "Building the English CV from $RESUME_DIR ..."
  ( cd "$RESUME_DIR" && make en >/dev/null ) || die "LaTeX build failed — run 'make en' in $RESUME_DIR to see the error"
  ok "Built $BUILT_CV"
else
  say "Skipping the build, using the existing PDF"
fi

# 2. Sanity checks, so a broken build never reaches the website
[ -f "$BUILT_CV" ] || die "No PDF at $BUILT_CV"
[ "$(head -c 4 "$BUILT_CV")" = "%PDF" ] || die "$BUILT_CV is not a valid PDF"
size=$(wc -c < "$BUILT_CV")
[ "$size" -gt 20000 ] || die "$BUILT_CV is suspiciously small (${size} bytes)"

if command -v pdftotext >/dev/null; then
  text=$(pdftotext "$BUILT_CV" - 2>/dev/null || true)
  grep -qi "Luca Bazzetto" <<<"$text" || die "The built PDF does not contain your name — check the build"
  grep -qi "lucabazzetto.github.io" <<<"$text" || warn "The CV does not link to lucabazzetto.github.io"
fi
ok "PDF checks passed ($(printf '%d' $((size / 1024))) KB)"

# 3. Compare with what is published
changed=0
if ! cmp -s "$BUILT_CV" "$PUBLISHED_CV"; then changed=1; say "CV differs from the published version"; fi

letter_changed=0
if [ -f "$SOURCE_LETTER" ] && ! cmp -s "$SOURCE_LETTER" "$PUBLISHED_LETTER"; then
  letter_changed=1
  warn "The recommendation letter differs from the published one and will be replaced"
fi

if [ "$changed" -eq 0 ] && [ "$letter_changed" -eq 0 ]; then
  ok "The website already has the latest CV, nothing to do"
  exit 0
fi

if [ "$DRY_RUN" -eq 1 ]; then
  say "Dry run: would copy"
  if [ "$changed" -eq 1 ]; then echo "  $BUILT_CV -> $PUBLISHED_CV"; fi
  if [ "$letter_changed" -eq 1 ]; then echo "  $SOURCE_LETTER -> $PUBLISHED_LETTER"; fi
  exit 0
fi

# 4. Publish
if [ "$changed" -eq 1 ]; then
  cp "$BUILT_CV" "$PUBLISHED_CV"
  ok "Copied the CV into the website"
fi
if [ "$letter_changed" -eq 1 ]; then
  cp "$SOURCE_LETTER" "$PUBLISHED_LETTER"
  ok "Copied the recommendation letter"
fi

# 5. Stamp the "CV updated" date shown next to the download button
month=$(LC_ALL=en_US.UTF-8 date "+%B %Y")
if grep -q "CV_UPDATED" "$SITE_DIR/index.html"; then
  sed -i '' -E "s|<!--CV_UPDATED-->[^<]*<!--/CV_UPDATED-->|<!--CV_UPDATED-->${month}<!--/CV_UPDATED-->|" "$SITE_DIR/index.html"
  # the line stays hidden until the first real sync fills in a date
  sed -i '' -E 's|<p class="cv-updated" hidden>|<p class="cv-updated">|' "$SITE_DIR/index.html"
  ok "Updated the date on the site to ${month}"
fi

# 6. Commit and push the website
cd "$SITE_DIR"
git add Luca_Bazzetto_Resume.pdf Luca_Bazzetto_Recommendation_Letter_L.pdf index.html
if git diff --cached --quiet; then
  ok "Nothing to commit"
else
  git commit -q -m "Update CV (${month})"
  ok "Committed to the website repo"
  if [ "$PUSH" -eq 1 ]; then
    git push -q origin HEAD
    ok "Pushed — live in a minute or two at https://lucabazzetto.github.io/"
  else
    warn "Not pushed (--no-push). Run 'git push' when you are ready."
  fi
fi

# 7. The LaTeX source lives in its own repo
cd "$RESUME_DIR"
if [ -n "$(git status --porcelain)" ]; then
  if [ "$COMMIT_SOURCE" -eq 1 ]; then
    git add -A
    git commit -q -m "Update CV content (${month})"
    ok "Committed the CV source"
    if [ "$PUSH" -eq 1 ]; then
      git push -q origin HEAD
      ok "Pushed the CV source"
    fi
  else
    warn "The Resume repo has uncommitted changes — commit them, or rerun with --commit-source"
  fi
fi
