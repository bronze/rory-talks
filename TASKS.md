# Tasks

A running list of things to build, improve, or investigate.

## Up Next

- [ ] **Testing / TDD** — ~~Vitest + pytest set up, format utilities extracted and tested~~ consider adding Playwright for e2e

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
- [x] Write `scripts/fetch-transcripts.py` to download auto-generated subtitles
- [x] Download all 23 transcripts into `src/content/transcripts/`
- [x] Individual talk pages at `/talks/[id]`
- [x] Push to GitHub (`bronze/rory-talks`)
