#!/usr/bin/env python3
"""
Download auto-generated transcripts for all videos and save as markdown
in src/content/transcripts/{id}.md
"""

import json
import os
import re
import subprocess
import tempfile

VIDEOS_JSON = os.path.join(os.path.dirname(__file__), '..', 'videos.json')
TRANSCRIPTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'transcripts')


def parse_vtt(vtt_text: str) -> str:
    """Convert VTT subtitle file to clean plain text, deduplicating overlapping lines."""
    lines = vtt_text.split('\n')
    seen = []
    text_lines = []

    for line in lines:
        line = line.strip()
        # Skip headers, timestamps, and empty lines
        if not line or line == 'WEBVTT' or '-->' in line or line.isdigit() \
                or line.startswith('Kind:') or line.startswith('Language:'):
            continue
        # Strip VTT tags like <00:00:01.000><c> etc.
        line = re.sub(r'<[^>]+>', '', line)
        line = re.sub(r'&amp;', '&', line)
        line = re.sub(r'&lt;', '<', line)
        line = re.sub(r'&gt;', '>', line)
        line = line.strip()
        if not line:
            continue
        # Deduplicate consecutive repeated lines (auto-captions overlap)
        if line not in seen[-3:]:
            text_lines.append(line)
        seen.append(line)

    # Join into paragraphs — split on sentence-ending punctuation
    full_text = ' '.join(text_lines)
    # Insert newlines at sentence boundaries for readability
    full_text = re.sub(r'([.!?]) ([A-Z])', r'\1\n\n\2', full_text)
    return full_text.strip()


def fetch_transcript(video_id: str) -> str | None:
    """Download VTT transcript for a video, return cleaned text or None."""
    with tempfile.TemporaryDirectory() as tmpdir:
        result = subprocess.run(
            [
                'yt-dlp',
                '--skip-download',
                '--write-auto-subs',
                '--sub-langs', 'en',
                '--sub-format', 'vtt',
                '--output', os.path.join(tmpdir, '%(id)s.%(ext)s'),
                f'https://www.youtube.com/watch?v={video_id}',
            ],
            capture_output=True,
            text=True,
        )

        # Find the downloaded VTT file
        vtt_files = [f for f in os.listdir(tmpdir) if f.endswith('.vtt')]
        if not vtt_files:
            print(f'  ✗ No transcript available')
            return None

        vtt_path = os.path.join(tmpdir, vtt_files[0])
        with open(vtt_path, 'r', encoding='utf-8') as f:
            return parse_vtt(f.read())


def main():
    os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

    with open(VIDEOS_JSON) as f:
        videos = json.load(f)

    print(f'Fetching transcripts for {len(videos)} videos...\n')

    for video in videos:
        vid_id = video['id']
        title = video['title']
        out_path = os.path.join(TRANSCRIPTS_DIR, f'{vid_id}.md')

        if os.path.exists(out_path):
            print(f'  skip  {vid_id} (already exists)')
            continue

        print(f'  → {vid_id}  {title[:55]}')
        text = fetch_transcript(vid_id)

        if text:
            frontmatter = f'''---
id: "{vid_id}"
source: "auto"
language: "en"
---

{text}
'''
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(frontmatter)
            print(f'  ✓ saved ({len(text)} chars)')
        else:
            print(f'  ✗ skipped')

    existing = [f for f in os.listdir(TRANSCRIPTS_DIR) if f.endswith('.md')]
    print(f'\nDone. {len(existing)} transcripts in {TRANSCRIPTS_DIR}')


if __name__ == '__main__':
    main()
