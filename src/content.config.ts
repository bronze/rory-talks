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
    start_time: z.number().default(0),
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

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    year: z.number(),
    amazon_url: z.string().url().optional(),
    description: z.string(),
    mentioned_in: z.array(z.string()).default([]),
    rory_authored: z.boolean().default(false),
  }),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    appearances: z.array(z.object({
      video: z.string(),
      timecode: z.number(),
    })).default([]),
  }),
});

export const collections = { videos, transcripts, books, stories };
