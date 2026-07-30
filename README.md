# tone.dad

Personal site for Justin Herrera. Static HTML — no build step.

## Deploy

```bash
vercel
```

That's it. `vercel.json` handles caching for media; `index.html` is the entry.

## Local preview

```bash
npx serve .
```

Or open `index.html` directly in a browser (most things work; some video-blob fetches need a server).

## Structure

- `index.html` — the whole site
- `media/` — photos
- `videos/` — door-I clip
