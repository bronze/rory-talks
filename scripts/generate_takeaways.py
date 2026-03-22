#!/usr/bin/env python3
"""
Read each transcript and use Claude to generate 4-6 key takeaway bullets,
writing them into the ## Key Takeaways section of src/content/videos/{id}.md.

Skips any video whose Key Takeaways section already has content.
Requires ANTHROPIC_API_KEY in the environment.
"""

import os
import re
import sys

import anthropic

VIDEOS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'videos')
TRANSCRIPTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'content', 'transcripts')

PLACEHOLDER = '<!-- Add key takeaways here -->'

SYSTEM_PROMPT = """\
You are helping build a curated archive of talks by Rory Sutherland, \
vice chairman of Ogilvy and author of Alchemy. \
Given a transcript of one of his talks, extract 4-6 key takeaways as concise bullet points. \
Each bullet should capture a distinct insight, argument, or idea from the talk. \
Write in plain English. No preamble, no headings — just the bullet list."""


def read_transcript(video_id: str) -> str | None:
    path = os.path.join(TRANSCRIPTS_DIR, f'{video_id}.md')
    if not os.path.exists(path):
        return None
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Strip frontmatter
    if content.startswith('---'):
        end = content.index('---', 3)
        content = content[end + 3:].strip()
    return content


def has_takeaways(video_content: str) -> bool:
    """Return True if Key Takeaways section already has non-placeholder content."""
    match = re.search(r'## Key Takeaways\n(.*?)(?=\n##|\Z)', video_content, re.DOTALL)
    if not match:
        return False
    body = match.group(1).strip()
    return bool(body) and body != PLACEHOLDER


def generate_takeaways(client: anthropic.Anthropic, title: str, transcript: str) -> str:
    message = client.messages.create(
        model='claude-opus-4-6',
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=[
            {
                'role': 'user',
                'content': f'Talk title: {title}\n\nTranscript:\n{transcript[:12000]}',
            }
        ],
    )
    return message.content[0].text.strip()


def inject_takeaways(video_content: str, takeaways: str) -> str:
    return video_content.replace(
        f'## Key Takeaways\n\n{PLACEHOLDER}',
        f'## Key Takeaways\n\n{takeaways}',
        1,
    )


def main():
    api_key = os.environ.get('ANTHROPIC_API_KEY')
    if not api_key:
        print('Error: ANTHROPIC_API_KEY not set')
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    video_files = sorted(f for f in os.listdir(VIDEOS_DIR) if f.endswith('.md'))
    print(f'Processing {len(video_files)} videos...\n')

    skipped = done = failed = 0

    for fname in video_files:
        video_path = os.path.join(VIDEOS_DIR, fname)
        video_id = fname[:-3]

        with open(video_path, 'r', encoding='utf-8') as f:
            video_content = f.read()

        # Extract title from frontmatter
        title_match = re.search(r'^title:\s*"(.+)"', video_content, re.MULTILINE)
        title = title_match.group(1) if title_match else video_id

        if has_takeaways(video_content):
            print(f'  skip  {video_id}  (already has takeaways)')
            skipped += 1
            continue

        transcript = read_transcript(video_id)
        if not transcript:
            print(f'  skip  {video_id}  (no transcript)')
            skipped += 1
            continue

        print(f'  → {video_id}  {title[:55]}')
        try:
            takeaways = generate_takeaways(client, title, transcript)
            new_content = inject_takeaways(video_content, takeaways)
            with open(video_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            bullet_count = takeaways.count('\n- ') + 1
            print(f'  ✓ {bullet_count} bullets')
            done += 1
        except Exception as e:
            print(f'  ✗ {e}')
            failed += 1

    print(f'\nDone. {done} generated, {skipped} skipped, {failed} failed.')


if __name__ == '__main__':
    main()
