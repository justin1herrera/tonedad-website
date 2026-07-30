# tone.dad — workflow

This folder is the **source of truth for www.tone.dad** (live). Static HTML site, deployed via Vercel CLI. **GitHub is not connected to Vercel for auto-deploy** — pushes do nothing until you run `vercel` or `vercel --prod` from the CLI.

**Two private GitHub repos** (reorganized 2026-07-21):
- `justin1herrera/tonedad-website` = remote **`origin`** — the **clean master**: a single commit containing *only* the files served on the live site (~100 files, ~90 MB, byte-for-byte matching tone.dad). This is the lightweight, browsable repo. A normal `git push` does **not** update it (bare `git push` is intentionally disabled) — refresh it with the export under **[Refreshing the clean master](#refreshing-the-clean-master)**.
- `justin1herrera/tonedad-v3` = remote **`archive`** — the **full-history archive**: all history, `snapshots/`, `ad-kit/`, `media/_originals/`, `media/tonedad-logo-refs/`, the retired draft pages, and the `v3-archive` tag. Back up ongoing work with `git push archive <branch>` (slow — the `.git` lives on iCloud).

## What this is

- One static HTML site. The homepage (`index.html`, ~114 KB, inline CSS/JS/SVG; no external JS beyond Google Fonts + Vercel analytics) is a "hub" with four doors — **Tonemedia, Tonehomes, Noblepost, Learn Video with Tone** — plus a top email capture, hover "peek" videos, and Notes teasers.
- Live sibling pages (all in `sitemap.xml`): `newsletter.html`, `subscribe.html`, `couples.html`. Also live but intentionally *not* indexed: `vault.html` (subscriber page linked from the published note, `noindex`) and `welcome-email.html` (web mirror of the welcome email, `noindex`, linked from the email's "view in browser").
- `notes/`: `notes/index.html` (the `/notes` index) and `notes/001-blank-space.html` (published). Note 002 is staged under `media/notes/002/` but unpublished — `vercel.json` 301-redirects `/notes/002-taylor-watched-my-cut` → `/notes/001-blank-space`.
- Serverless functions in `api/`: `subscribe.js` (Beehiiv subscribe + Resend lead-notify email) and `_welcome.js` (welcome-email template; the underscore keeps Vercel from routing it). **Secrets (`BEEHIIV_*`, `RESEND_API_KEY`, etc.) live in Vercel project settings, never in the repo.**
- Assets: `media/` (served images/video, cached immutable per `vercel.json`). `media/_originals/` + `media/tonedad-logo-refs/` are source masters — vercelignored + archive-only, not on the live site.
- Public extras: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `favicon.svg`.
- Vercel project: `justin1herreras-projects/tone-dad` (linked in `.vercel/project.json`).
- **Previous editorial multi-section homepage preserved at git tag `v3-archive`** (in the `archive` repo, tonedad-v3; the tag is also local). Run `git checkout v3-archive` to inspect or restore.

There is also an old Astro/Keystatic v2 at `~/Documents/tone.dad`. **Ignore it.** It's not deployed and its content is stale.

## The three commands

Run from the project root (`~/Library/Mobile Documents/com~apple~CloudDocs/tonedad v3`).

| Goal | Command | URL |
| --- | --- | --- |
| Local preview while editing | `vercel dev` | http://localhost:3000 |
| Preview deploy on real Vercel infra (before going live) | `vercel` | unique `*.vercel.app` URL printed to terminal |
| Promote to live www.tone.dad | `vercel --prod` | https://www.tone.dad |

`vercel dev` mirrors production (clean URLs, redirects, cache headers all honored from `vercel.json`). Always prefer it over `open index.html` or `python3 -m http.server` — those bypass routing and miss problems that show up live.

## Default editing flow

1. Run `vercel dev` in one terminal, leave it running.
2. Edit files in Claude Code. Reload the browser tab to see changes.
3. When the local version looks right, run `vercel` (no flag) → open the preview URL it prints → review on real Vercel.
4. If the preview URL looks right, **only then** run `vercel --prod` to ship.

Never run `vercel --prod` straight from a working tree you haven't reviewed at a preview URL first. The preview step is the entire safety net.

### Larger / riskier changes — branch + PR

For substantial edits (full page replacements, structural refactors), work on a feature branch and open a PR for code review and history. Caveats:

- The PR does **not** auto-generate a Vercel preview (no GitHub→Vercel integration). Generate the preview via `vercel` CLI from the branch and post the URL as a PR comment.
- Promoting to prod is still `vercel --prod` from the branch — **not** by merging the PR. Merge after shipping if you want history clean.

## Safety notes

The folder **is** under version control (two repos — see the intro). Layered safety nets, in order of authority:

1. **Git history** (primary). Every committed change is recoverable. Tag `v3-archive` marks the last commit of the pre-link-tree editorial site.
2. **Manual `cp` snapshots** (secondary, still useful). Before any non-trivial in-session edit, make a working-tree snapshot for instant rollback without a git checkout:
   ```
   cp index.html "snapshots/index-prev-$(date +%Y%m%d-%H%M).html"
   ```
   Snapshots live in `snapshots/` — vercelignored, gitignored in the clean master, but tracked in the `archive` repo (tonedad-v3). See existing files there.
3. **iCloud Drive** (passive). File version history through Finder → right-click → "Browse all versions".
4. **Full-folder zip backup**: `~/Library/Mobile Documents/com~apple~CloudDocs/tonedad-backups/`.

For Claude Code: when editing `index.html`, **read the surrounding ~50 lines before editing** — the file is dense, inlined, and wrong context can clobber adjacent CSS or JS. Single-section edits are safer than multi-section edits.

## Rollback

If a `vercel --prod` ships broken content:

- **From the rebuild itself (worst case — link tree breaks badly):**
  ```
  git checkout v3-archive -- index.html
  vercel --prod --yes
  ```
  This restores the pre-rebuild editorial homepage.
- **From any other regression:** identify the last good commit, then `git checkout <sha> -- <file>` and re-ship via `vercel --prod`. Or use the Vercel dashboard to promote a previous deployment as production.

## Inspecting what's deployed

- `npx vercel ls` — list recent deploys
- `npx vercel inspect <url>` — logs and metadata for a specific deploy
- `npx vercel domains ls` — confirm tone.dad alias

(The `vercel` binary is at `~/.hermes/node/bin/vercel`, not on `PATH` — run `export PATH="$HOME/.hermes/node/bin:$PATH"` first, or use the full path.)

## Refreshing the clean master

`origin` (tonedad-website) is a curated single-commit mirror — it is **not** updated by `git push`. To republish it after the live site changes, rebuild it off-iCloud (this avoids writing a large packfile into the fragile iCloud `.git`) and force-push. Keep the exclusion list below in sync if the set of draft pages / retired media changes:

```bash
SRC="$HOME/Library/Mobile Documents/com~apple~CloudDocs/tonedad v3"
DST="/private/tmp/tonedad-website-export"; LIST="/private/tmp/tonedad-allowlist.txt"
cd "$SRC"
{ git ls-files \
    | grep -vE '^(\.claude|ad-kit|snapshots|media/_originals|media/tonedad-logo-refs)/' \
    | grep -vxE '(brand-style\.md|higgs-ad-brief\.md|build\.html|tonehomes\.html|v2\.html|linktree\.html|_pstest\.html|cutting_room_re-edit\.html)' \
    | grep -vxE 'media/(blank-space-rage\.jpg|brady-tkachuk\.jpg|brand-dad\.mp4|brand-homes\.jpg|brand-homes\.mp4|brand-media\.jpg|brand-media\.mp4|credit-brady\.mp4|credit-katy\.mp4|credit-maybelline\.mp4|katy-perry\.jpg|maybelline-gigi\.jpg|tonehomes-craignicole\.mp4|tonehomes-driving\.mp4|tonemedia-main-logo-color-5-rgb-900px-w-72ppi\.png|veil-hero\.mp4)' ; \
  printf '%s\n' robots.txt media/peek-noblepost-card.jpg ; } | sort -u > "$LIST"
rm -rf "$DST" && mkdir -p "$DST" && rsync -a --files-from="$LIST" "$SRC/" "$DST/"
cd "$DST" && git init -q && git checkout -q -b main && git add -A \
  && git -c user.name="Justin Herrera" -c user.email="herrera.justin@gmail.com" commit -qm "tone.dad live site — clean snapshot" \
  && git remote add origin https://github.com/justin1herrera/tonedad-website.git \
  && git push --force origin main
```

Then confirm the master matches live: `git clone https://github.com/justin1herrera/tonedad-website /tmp/tw && du -sh /tmp/tw` (~90 MB, one commit).

## Things NOT to do

- Don't run `vercel --prod` without a preceding `vercel` preview review.
- Don't delete `.vercel/`, `.env.local`, the `snapshots/` folder, or anything in `tonedad-backups/`.
- Don't link this folder to a different Vercel project. The link to `tone-dad` is correct.
- Don't force-push or rewrite history on the **`archive`** repo (tonedad-v3) — the `v3-archive` tag must keep pointing at the pre-rebuild commit. (Force-pushing **`origin`** / the clean master *is* the intended refresh — see [Refreshing the clean master](#refreshing-the-clean-master).)
- Don't `git push origin <branch>` to back up work — `origin` is the clean master, and a normal push would try to force full history into it (bare `git push` is disabled for this reason). Back up with `git push archive <branch>`.
- Don't commit `media/_originals/`, `media/tonedad-logo-refs/`, `ad-kit/`, `snapshots/`, `node_modules/`, or the draft pages — they're now in `.gitignore`/`.vercelignore` and live only in the `archive` repo + on disk.
- Don't connect the GitHub repo to Vercel for auto-deploy without thinking it through — the current setup keeps every prod deploy intentional. Auto-deploy on every push could ship work-in-progress accidentally.
- Don't edit `index.html` and `subscribe.html` (or `couples.html`) in the same session without snapshotting first — they share inline patterns and you can lose track.
