import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videos' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    url: z.string().url(),
    channel: z.string(),
    channel_url: z.string().url(),
    upload_date: z.coerce.date(),
    duration: z.number(),
    duration_string: z.string(),
    view_count: z.number().default(0),
    thumbnail: z.string().url(),
    description: z.string().default(''),
    topics: z.array(z.string()).default([]),
  }),
});

const transcripts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/transcripts' }),
  schema: z.object({
    id: z.string(),
    source: z.enum(['auto', 'manual', 'whisper']).default('auto'),
    language: z.string().default('en'),
  }),
});

export const collections = { videos, transcripts };
