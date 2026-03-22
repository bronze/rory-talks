# Tasks

A running list of things to build, improve, or investigate.

## Up Next

- [ ] **Transcript formatting** — strip `Kind: captions Language: en` junk from top of some transcripts (e.g. `45JAIkQI8AY.md`); audit all 23 for similar artifacts; improve `parse_vtt` if needed
- [ ] **Transcripts on talk pages** — fix `<transcriptContent />` rendering in `/talks/[id].astro` (Astro dynamic component syntax issue); display transcript below the video notes

## Backlog

- [ ] **Key takeaways** — use Claude to read transcripts and fill in the `## Key Takeaways` sections in each `src/content/videos/{id}.md`
- [ ] **Recurring stories** — identify stories and examples Rory tells across multiple talks (Eurostar, marmalade sandwich, etc.) and tag them
- [ ] **Search** — full-text search across titles, takeaways, and/or transcripts
- [ ] **Tags / topics** — group talks by theme (behavioural economics, marketing, psychology, etc.)
- [ ] **Transcript page improvements** — better typography, paragraph grouping, timestamps

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
