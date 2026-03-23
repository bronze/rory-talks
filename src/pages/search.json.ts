import { getCollection } from 'astro:content';

export async function GET() {
  const [videos, transcripts, books] = await Promise.all([
    getCollection('videos'),
    getCollection('transcripts'),
    getCollection('books'),
  ]);

  const transcriptMap = new Map(transcripts.map(t => [t.data.id, t.body ?? '']));

  const videoEntries = videos.map(video => {
    const takeawaysMatch = video.body?.match(/## Key Takeaways\n\n((?:- .+\n?)+)/);
    const takeaways = takeawaysMatch
      ? takeawaysMatch[1].split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2).trim())
      : [];

    return {
      type: 'video' as const,
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

  const bookEntries = books.map(book => ({
    type: 'book' as const,
    slug: book.id.replace(/\.md$/, ''),
    title: book.data.title,
    author: book.data.author,
    year: book.data.year,
    description: book.data.description,
    rory_authored: book.data.rory_authored,
  }));

  return new Response(JSON.stringify({ videos: videoEntries, books: bookEntries }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
