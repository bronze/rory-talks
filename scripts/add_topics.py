"""Add curated topic tags to each video's frontmatter."""
import re
from pathlib import Path

TOPICS = {
    "45JAIkQI8AY": ["marketing", "behavioural-economics"],
    "4VuYiEbGQ9Q": ["behavioural-economics", "psychology"],
    "5TvbJzJ4Vs0": ["business-strategy", "behavioural-economics"],
    "B8F2f7Yu42E": ["marketing", "behavioural-economics", "brand"],
    "DaYTvwe0Wo0": ["marketing", "psychology", "behavioural-economics"],
    "HbNIeLngS6Q": ["business-strategy", "marketing"],
    "Hz3RWxJck68": ["marketing", "brand"],
    "J6XgR6WsqV4": ["psychology", "behavioural-economics"],
    "PfQRHM6rL-M": ["marketing", "business-strategy"],
    "QBznUHAopxU": ["marketing"],
    "SG-iLV_NJL8": ["creativity", "behavioural-economics"],
    "UbJkENiAhyc": ["behavioural-economics", "business-strategy"],
    "UirCaM5kg9E": ["behavioural-economics", "marketing", "creativity"],
    "YErOtGMgTNg": ["marketing", "behavioural-economics"],
    "dkLcwHmnPV4": ["marketing", "behavioural-economics"],
    "hhQRH49Y54k": ["marketing", "psychology"],
    "iueVZJVEmEs": ["behavioural-economics", "psychology"],
    "kiMIEv2BaXs": ["brand", "marketing"],
    "lhlS-Wds02M": ["behavioural-economics", "creativity"],
    "qvpw4_O25eU": ["marketing", "psychology"],
    "sOcIh6sGNhw": ["marketing", "business-strategy"],
    "wqb0f4vmkis": ["psychology", "marketing"],
    "xXd-g3EL8ow": ["finance"],
}

videos_dir = Path(__file__).parent.parent / "src/content/videos"

for video_id, topics in TOPICS.items():
    path = videos_dir / f"{video_id}.md"
    if not path.exists():
        print(f"  missing: {path}")
        continue

    text = path.read_text()

    # Skip if already has topics
    if re.search(r'^topics:', text, re.MULTILINE):
        print(f"  skip (already has topics): {video_id}")
        continue

    # Insert before the closing --- of frontmatter
    topics_yaml = "topics:\n" + "".join(f"  - {t}\n" for t in topics)
    # Replace second occurrence of ---
    parts = text.split("---", 2)  # ['', frontmatter, body]
    parts[1] = parts[1].rstrip("\n") + "\n" + topics_yaml
    path.write_text("---".join(parts))
    print(f"  added {topics}: {video_id}")

print("Done.")
