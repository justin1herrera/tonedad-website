# tone.dad v3 — workflow

This folder is the **source of truth for www.tone.dad** (live). Static HTML site. Deployed via Vercel CLI — **not git, not GitHub.**

## What this is

- One large `index.html` with all CSS/JS inlined (~244KB).
- Sibling pages: `subscribe.html`, `couples.html` (linked from index, separate routes).
- Assets: `media/`, `videos/`, `uploads/` (cached aggressively per `vercel.json`).
- Public extras: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `favicon.svg`.
- Vercel project: `justin1herreras-projects/tone-dad` (linked in `.vercel/project.json`).

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

## Safety notes (no git here)

This folder is **not under version control**. There is no `git revert`. Implications:

- Before any non-trivial edit (renaming sections, restructuring, deleting blocks), make a manual snapshot:
  ```
  cp index.html "index-prev-$(date +%Y%m%d-%H%M).html"
  ```
  Justin already does this — see `index-prev-may1.html` (May 1 snapshot). Keep doing it.
- iCloud Drive serves as a passive backup (file version history is recoverable through Finder → right-click → "Browse all versions").
- Periodic full-folder zip backup lives in `~/Library/Mobile Documents/com~apple~CloudDocs/tonedad-backups/`.
- For Claude Code: when editing `index.html`, **read the surrounding ~50 lines before editing** — the file is dense, inlined, and wrong context can clobber adjacent CSS or JS. Single-section edits are safer than multi-section edits.

## Inspecting what's deployed

- `npx vercel ls` — list recent deploys
- `npx vercel inspect <url>` — logs and metadata for a specific deploy
- `npx vercel domains ls` — confirm tone.dad alias

## Things NOT to do

- Don't run `vercel --prod` without a preceding `vercel` preview review.
- Don't delete `.vercel/`, `.env.local`, `index-prev-*.html` snapshots, or the `tonedad-backups/` zip.
- Don't link this folder to a different Vercel project. The link to `tone-dad` is correct.
- Don't edit `index.html` and `subscribe.html` (or `couples.html`) in the same session without snapshotting first — they share inline patterns and you can lose track.
