# Tasks

A running list of things to build, improve, or investigate.

## Up Next

- [ ] **Recurring stories** — cross-reference which talks mention the same stories/examples (Eurostar, marmalade sandwich, etc.) and surface them on talk pages and/or a dedicated page

## Backlog

- [ ] **Tags / topics** — group talks by theme (behavioural economics, marketing, psychology, etc.)
- [ ] **Book Section** — books mentioned by him, with thumbnails and links to amazon

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
