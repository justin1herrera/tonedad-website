# tone.dad — workflow

This folder is the **source of truth for www.tone.dad** (live). Static HTML site. Deployed via Vercel CLI; code mirrored to GitHub (`justin1herrera/tonedad-v3`, private) for backup. **GitHub is not connected to Vercel for auto-deploy** — pushes do nothing until you run `vercel` or `vercel --prod` from the CLI.

## What this is

- One static HTML site. As of 2026-05-14 the homepage is a single-page cinematic link tree (~48KB `index.html`, inline CSS/SVG, base64 portrait, no external JS — Google Fonts only). 6 link rows: Newsletter, YouTube, Noblepost, Tone Media, Tone Homes (placeholder, `href="#tonehomes"`, "coming soon"), Instagram.
- Sibling pages: `subscribe.html`, `couples.html` (kept from the previous editorial homepage; linked from old design only, may be reconsidered).
- `notes/` archive (kept intact across the rebuild — single note at `notes/001-blank-space.html`).
- Assets: `media/`, `videos/`, `uploads/` (cached aggressively per `vercel.json`).
- Public extras: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `favicon.svg`.
- Vercel project: `justin1herreras-projects/tone-dad` (linked in `.vercel/project.json`).
- **Previous editorial multi-section homepage preserved at git tag `v3-archive` on `main`.** Run `git checkout v3-archive` to inspect or restore.

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

The folder **is** under version control as of 2026-05-14 (pushed to `justin1herrera/tonedad-v3`). Layered safety nets, in order of authority:

1. **Git history** (primary). Every committed change is recoverable. Tag `v3-archive` marks the last commit of the pre-link-tree editorial site.
2. **Manual `cp` snapshots** (secondary, still useful). Before any non-trivial in-session edit, make a working-tree snapshot for instant rollback without a git checkout:
   ```
   cp index.html "index-prev-$(date +%Y%m%d-%H%M).html"
   ```
   See existing `index-prev-*.html` files.
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

## Things NOT to do

- Don't run `vercel --prod` without a preceding `vercel` preview review.
- Don't delete `.vercel/`, `.env.local`, `index-prev-*.html` snapshots, or the `tonedad-backups/` zip.
- Don't link this folder to a different Vercel project. The link to `tone-dad` is correct.
- Don't force-push to `main` on GitHub — the `v3-archive` tag must remain pointing at the pre-rebuild commit.
- Don't connect the GitHub repo to Vercel for auto-deploy without thinking it through — the current setup keeps every prod deploy intentional. Auto-deploy on every push could ship work-in-progress accidentally.
- Don't edit `index.html` and `subscribe.html` (or `couples.html`) in the same session without snapshotting first — they share inline patterns and you can lose track.
