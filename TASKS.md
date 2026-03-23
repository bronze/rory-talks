# Tasks

A running list of things to build, improve, or investigate.

## Backlog

- [x] **Cmd+K links** — search modal should surface direct links to Topics, Books, and other pages; full keyboard navigation with arrow keys, number keys 1–4, and Enter
- [ ] **Recurring stories** — cross-reference which talks mention the same stories/examples (Eurostar, marmalade sandwich, etc.) and surface them on talk pages and a dedicated page

## Done

- [x] Scaffold Astro site with Tailwind CSS + shadcn/ui
- [x] Seed `videos.json` from YouTube playlist via yt-dlp
- [x] Generate `src/content/videos/{id}.md` for all 23 talks
- [x] Write `scripts/fetch_transcripts.py` to download auto-generated subtitles
- [x] Download all 23 transcripts into `src/content/transcripts/`
- [x] Individual talk pages at `/talks/[id]`
- [x] Push to GitHub (`bronze/rory-talks`)
- [x] Vitest (11 tests) + pytest (7 tests) + Playwright e2e (7 tests)
- [x] Extract format utilities to `src/lib/format.ts`
- [x] Local thumbnails via `scripts/fetch_thumbnails.py` — Astro `<Image>` serves WebP with responsive srcset; fixes `dkLcwHmnPV4` gray placeholder issue
- [x] Persistent nav header with site wordmark and links
- [x] Transcript formatting — stripped `Kind: captions Language: en` artifact from all 23 files; `parse_vtt` updated to skip `Kind:`/`Language:` lines
- [x] Key takeaways — 4–6 bullets generated for all 23 talks via `scripts/generate_takeaways.py`; displayed as styled bullets on talk pages
- [x] Search — `⌘K` / `Ctrl+K` modal overlay in nav; searches titles, channels, takeaways, and full transcript text; highlights matched term in transcript snippets
- [x] Tags / topics — 7-concept taxonomy (reframing, alchemy, signalling, complexity, brand, risk, finance); filter bar on homepage with tooltips; topic pills on cards and talk pages; `/topics` index and `/topics/[slug]` static pages
- [x] YouTube playlist link in nav; all YouTube links include `&list=PLGxDladnEAZ1wNjUglLAnDR4nQDAhntKc`
- [x] Added 5 talks: `qMl4jWe8EiI`, `ycEQYNrVCek`, `Bc9jFbxrkMk`, `TcRqBSSBYpc`, `wgpkVsnz7wI` — now 28 talks total
- [x] Books — `/books` page with 17 books (Rory's own + recommended); cover art, descriptions, Amazon links, cross-referenced to talks; "Books mentioned" section on each talk page
