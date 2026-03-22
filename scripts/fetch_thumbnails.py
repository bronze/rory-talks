#!/usr/bin/env python3
"""
Download the best available thumbnail for each video and save as
src/assets/thumbnails/{id}.jpg.

YouTube returns a 200 gray placeholder for missing maxresdefault.jpg,
so we detect it by file size (placeholder is ~1334 bytes).
"""

import json
import os
import urllib.request

VIDEOS_JSON = os.path.join(os.path.dirname(__file__), '..', 'videos.json')
THUMBNAILS_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'thumbnails')

# Tried in order — first one with real content wins
SIZES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault']

# Gray placeholder YouTube returns for missing maxresdefault is ~1334 bytes
PLACEHOLDER_MAX_BYTES = 2_000


def fetch_thumbnail(video_id: str) -> bytes | None:
    for size in SIZES:
        url = f'https://i.ytimg.com/vi/{video_id}/{size}.jpg'
        try:
            with urllib.request.urlopen(url, timeout=10) as resp:
                data = resp.read()
                if len(data) > PLACEHOLDER_MAX_BYTES:
                    return data
        except Exception:
            continue
    return None


def main():
    os.makedirs(THUMBNAILS_DIR, exist_ok=True)

    with open(VIDEOS_JSON) as f:
        videos = json.load(f)

    print(f'Fetching thumbnails for {len(videos)} videos...\n')

    for video in videos:
        vid_id = video['id']
        out_path = os.path.join(THUMBNAILS_DIR, f'{vid_id}.jpg')

        if os.path.exists(out_path):
            print(f'  skip  {vid_id}')
            continue

        print(f'  → {vid_id}  {video["title"][:50]}')
        data = fetch_thumbnail(vid_id)

        if data:
            with open(out_path, 'wb') as f:
                f.write(data)
            print(f'  ✓ {len(data) // 1024}KB')
        else:
            print(f'  ✗ no thumbnail found')

    existing = [f for f in os.listdir(THUMBNAILS_DIR) if f.endswith('.jpg')]
    print(f'\nDone. {len(existing)} thumbnails in {THUMBNAILS_DIR}')


if __name__ == '__main__':
    main()
