# tone.dad — workflow

This folder is the **source of truth for tone.dad** (live). Static HTML site. Deployed via Vercel CLI; code mirrored to GitHub for backup. **GitHub is not connected to Vercel for auto-deploy** — pushes do nothing until you run `vercel` or `vercel --prod` from the CLI.

**The live host is the apex, `https://tone.dad`.** `www.tone.dad` 308-redirects to it. Canonicals, `og:url`, the sitemap and `robots.txt` all use the apex — keep new pages consistent with that or you are telling Google a URL that redirects away.

## What this is

- One static HTML site. The homepage (`index.html`, ~114KB, inline CSS/SVG, no external JS — Google Fonts only) is a cinematic hub with **four "doors"**: Tonemedia, Tonehomes, tone.notes, Noblepost. Below the doors: a newsletter capture, a résumé credit band, a Selected Work grid, and in-page views (including a free video-coaching booking via cal.com).
- `tonehomes.html` — full Tonehomes page with the realtor lead form. Not a placeholder.
- `notes/` — `index.html` (the notes index), `001-blank-space.html`, `002-steph-was-right.html` (Western Ave).
- `subscribe.html`, `couples.html` — still served, still in the sitemap. `couples.html` has not been touched since 2026-05-13 and is stale. Retiring both into redirects is an open decision.
- `privacy.html`.
- Assets: `media/`, `videos/` (cached aggressively per `vercel.json`).
- Public extras: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `favicon.svg`.
- Vercel project: `justin1herreras-projects/tone-dad` (linked in `.vercel/project.json`).
- **Pre-link-tree editorial homepage preserved at git tag `v3-archive`** (commit `1f1b3c7`, a 251KB `index.html`). Run `git checkout v3-archive` to inspect.

There is also an old Astro/Keystatic v2 at `~/Documents/tone.dad`. **Ignore it.** It's not deployed and its content is stale.

## Git remotes — read this before pushing

There are **two GitHub repos**, and they are not the same lineage:

| Remote | Repo | What's there |
| --- | --- | --- |
| `archive` | `justin1herrera/tonedad-v3` | **The mirror for `main`.** `main`'s configured upstream. Same history — pushes fast-forward. |
| `origin` | `justin1herrera/tonedad-website` | A **different, unrelated history** on its `main`. Also holds the working branch `codex/tonehomes-live-backup-20260814`. |

`origin/main` shares **no common ancestor** with local `main` — `git merge-base` returns nothing. Never try to reconcile them with a force-push; the `v3-archive` tag must keep pointing at the pre-rebuild commit.

Push `main` to `archive` (its upstream, a clean fast-forward). The working branch on `origin` is a convenience mirror, not the canonical home.

Richer, more current versions of some pages live on other branches — `note-002-western` and `hub-doors-capture-sort` in particular. The entire notes section was restored from `note-002-western` on 2026-08-15. **Before assuming a page on `main` is current, check whether another branch has a newer one:**

```
git log -1 --format='%ci' <branch> -- <file>
```

## The three commands

Run from the project root (`~/Library/Mobile Documents/com~apple~CloudDocs/tonedad v3`).

| Goal | Command | URL |
| --- | --- | --- |
| Local preview while editing | `vercel dev` | http://localhost:3000 |
| Preview deploy on real Vercel infra | `vercel` | unique `*.vercel.app` URL printed to terminal |
| Promote to live tone.dad | `vercel --prod` | https://tone.dad |

`vercel dev` mirrors production (clean URLs, redirects, cache headers all honored from `vercel.json`). Always prefer it over `open index.html` or `python3 -m http.server` — those bypass routing and miss problems that show up live. `.claude/launch.json` runs `vercel dev` on port 3000, so the Claude Code preview pane matches production.

### Preview URLs are behind Vercel auth — do not verify against them

A `*.vercel.app` preview requires login. **Every path returns HTTP 200 with an HTML login page, including paths that do not exist.** Status-code checks against a preview URL will pass for missing files and prove nothing.

Verify assets on **localhost** (`vercel dev` serves real bytes) or on **tone.dad after shipping**. Check the content type, not just the status:

```
curl -sL -o /dev/null -w '%{http_code} %{content_type}\n' https://tone.dad/media/foo.jpg
```

`text/html` for something that should be an image means it's missing. In the browser, `document.images` filtered on `naturalWidth === 0` is the fastest whole-page check.

Previews are still worth deploying — they catch build and config failures. They just can't verify content.

## Default editing flow

1. Run `vercel dev`, leave it running.
2. Edit files. Reload to see changes.
3. Verify locally — content types for new assets, no broken images, forms actually submit.
4. Run `vercel` (no flag) to confirm the build succeeds.
5. **Only then** `vercel --prod`, and verify again against tone.dad.

Never run `vercel --prod` from a working tree you haven't reviewed locally first.

### Larger / riskier changes — branch + PR

For substantial edits (full page replacements, structural refactors), work on a feature branch and open a PR for history. Caveats:

- The PR does **not** auto-generate a Vercel preview (no GitHub→Vercel integration).
- Promoting to prod is still `vercel --prod` from the branch — **not** by merging the PR.

## What ships is what's in the folder

`.vercelignore` — not `.gitignore` — decides what gets uploaded. Anything not listed there is **publicly fetchable**, whether or not it's linked or tracked in git. Old `index-prev-*.html` snapshots and the `hero-*.html` design scratch were downloadable off the live site until 2026-08-15 for exactly this reason.

Put rollback snapshots in `snapshots/`, which is already ignored. `index-prev-*.html`, `*-prev-*.html`, `*.bak`, `hero-*.html` and `font-compare.html` are ignored too.

## Safety notes

Layered safety nets, in order of authority:

1. **Git history** (primary). Every committed change is recoverable.
2. **Manual snapshots** (secondary). Before any non-trivial in-session edit:
   ```
   cp index.html "snapshots/index-prev-$(date +%Y%m%d-%H%M).html"
   ```
   Note the `snapshots/` prefix — do not leave these in the deploy root.
3. **iCloud Drive** (passive). Finder → right-click → "Browse all versions".
4. **Full-folder zip backup**: `~/Library/Mobile Documents/com~apple~CloudDocs/tonedad-backups/`.

When editing `index.html`, **read the surrounding ~50 lines before editing** — the file is dense and inlined, and wrong context can clobber adjacent CSS or JS. Single-section edits are safer than multi-section edits.

### iCloud stale git locks

The repo lives in iCloud Drive, which occasionally leaves stale `.lock` files behind. Symptom: a branch shows `[gone]` or a fetch says `unable to update local ref`. It is not gone — check for the lock and remove it:

```
find .git -name '*.lock'
rm .git/refs/remotes/<remote>/<branch>.lock
git fetch <remote>
```

A stale `archive/main.lock` from 2026-07-21 hid the `archive` mirror for three weeks.

## Rollback

If a `vercel --prod` ships broken content:

- Identify the last good commit, `git checkout <sha> -- <file>`, re-ship with `vercel --prod`.
- Or promote a previous deployment as production from the Vercel dashboard — fastest option when the site is visibly broken.
- Worst case, restore the pre-rebuild editorial homepage:
  ```
  git checkout v3-archive -- index.html
  vercel --prod --yes
  ```

## Inspecting what's deployed

- `npx vercel ls` — list recent deploys
- `npx vercel inspect <url>` — logs and metadata for a specific deploy
- `npx vercel domains ls` — confirm the tone.dad alias

## Things NOT to do

- Don't run `vercel --prod` without reviewing locally first.
- Don't trust a preview URL's status codes to verify content — see above.
- Don't delete `.vercel/`, `.env.local`, the `snapshots/` folder, or the `tonedad-backups/` zip.
- Don't link this folder to a different Vercel project. The link to `tone-dad` is correct.
- Don't force-push `main` to either remote. `origin/main` is an unrelated history and `v3-archive` must stay put.
- Don't connect the GitHub repo to Vercel for auto-deploy without thinking it through — the current setup keeps every prod deploy intentional.
- Don't add a page without adding it to `sitemap.xml` with an apex URL and a matching canonical.
- Don't edit `index.html` and `subscribe.html` (or `couples.html`) in the same session without snapshotting first — they share inline patterns and you can lose track.

## Known open items (as of 2026-08-15)

- `/subscribe` and `/couples` still serve real pages; the `note-002-western` lineage retired both into redirects (`/subscribe` → Beehiiv, `/couples` → `/tonehomes`). Undecided.
- **No security headers.** `vercel.json` sets cache-control only. `note-002-western`'s copy adds HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.
- `notes/002-steph-was-right.html` references `media/notes/002-western/hero-poster.jpg`, which doesn't exist — harmless, it sits inside a commented-out `<video>` awaiting `hero-loop.mp4`.
