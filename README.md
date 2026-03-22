# Rory Sutherland — Talks Archive

A curated, file-based archive of Rory Sutherland talks, interviews, and lectures. Built to browse, read transcripts, and let Claude extract insights across the full body of work.

## Stack

- **Astro** — static site, file-based routing
- **Tailwind CSS + shadcn/ui** — styling and components
- **yt-dlp** — metadata and transcript fetching

## Structure

```
src/content/
  videos/          # one .md per talk — metadata, takeaways, notes, stories
  transcripts/     # one .md per talk — full auto-generated transcript

scripts/
  fetch-transcripts.py   # downloads transcripts for all videos via yt-dlp
```

Each video file (`src/content/videos/{id}.md`) has sections for **Key Takeaways**, **Stories & Examples**, and **Notes** — meant to be filled in manually or by Claude after reading the transcript.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Fetching Transcripts

```bash
python3 scripts/fetch-transcripts.py
```

Downloads auto-generated English subtitles for all 23 videos and saves them as markdown in `src/content/transcripts/`. Skips videos that already have a transcript. Re-running is safe.

## Adding a New Video

1. Add the video to the YouTube playlist
2. Re-run `scripts/fetch-transcripts.py` to get the transcript
3. Manually create `src/content/videos/{id}.md` with the frontmatter schema matching the existing files

## Working with Claude

With all transcripts in plain markdown, you can ask Claude things like:

- *"What stories does Rory tell in more than one talk?"*
- *"Summarise the key takeaways across all talks on behavioural economics"*
- *"Which talks mention the Eurostar / Concorde / marmalade sandwich?"*
- *"Extract all the named examples he uses and which talks they appear in"*
