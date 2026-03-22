import { getCollection } from 'astro:content';

export async function GET() {
  const [videos, transcripts] = await Promise.all([
    getCollection('videos'),
    getCollection('transcripts'),
  ]);

  const transcriptMap = new Map(transcripts.map(t => [t.data.id, t.body ?? '']));

  const index = videos.map(video => {
    const takeawaysMatch = video.body?.match(/## Key Takeaways\n\n((?:- .+\n?)+)/);
    const takeaways = takeawaysMatch
      ? takeawaysMatch[1].split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2).trim())
      : [];

    return {
      id: video.data.id,
      title: video.data.title,
      channel: video.data.channel,
      upload_date: video.data.upload_date.toISOString(),
      duration_string: video.data.duration_string,
      view_count: video.data.view_count,
      thumbnail: video.data.thumbnail,
      takeaways,
      transcript: transcriptMap.get(video.data.id) ?? '',
    };
  });

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
