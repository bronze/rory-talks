import { useState, useEffect, useRef } from 'react';

interface VideoEntry {
  type: 'video';
  id: string;
  title: string;
  channel: string;
  upload_date: string;
  duration_string: string;
  view_count: number;
  thumbnail: string;
  takeaways: string[];
  transcript: string;
}

interface BookEntry {
  type: 'book';
  slug: string;
  title: string;
  author: string;
  year: number;
  description: string;
  rory_authored: boolean;
}

interface SearchIndex {
  videos: VideoEntry[];
  books: BookEntry[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/25 text-foreground rounded-sm px-0.5 not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

type VideoResult = VideoEntry & { snippet?: string };
type AnyResult = VideoResult | BookEntry;

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLAnchorElement>(null);
  const listLengthRef = useRef(0);
  const quickLinksRef = useRef<{ href: string; external?: boolean }[]>([]);

  // Load index on first open
  useEffect(() => {
    if (open && !index) {
      fetch('/search.json')
        .then(r => r.json())
        .then(setIndex);
    }
  }, [open, index]);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Reset selection when query changes
  useEffect(() => { setSelectedIndex(0); }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Open on ⌘K / Ctrl+K, close on Escape, arrow + number navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(true); }
        return;
      }
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(listLengthRef.current - 1, i + 1)); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelectedIndex(i => Math.max(0, i - 1)); return; }
      if (e.key === 'Enter') { e.preventDefault(); selectedRef.current?.click(); return; }
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1) {
        e.preventDefault();
        const link = quickLinksRef.current[num - 1];
        if (link) {
          setOpen(false);
          if (link.external) { window.open(link.href, '_blank', 'noopener,noreferrer'); }
          else { window.location.href = link.href; }
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const quickLinks = [
    { href: '/',        label: 'All talks',       meta: index ? `${index.videos.length} talks` : '' },
    { href: '/topics',  label: 'Topics',           meta: 'Browse by theme' },
    { href: '/books',   label: 'Books',            meta: 'Reading list' },
    { href: `https://www.youtube.com/playlist?list=PLGxDladnEAZ1wNjUglLAnDR4nQDAhntKc`, label: 'YouTube playlist', meta: '↗', external: true },
  ];

  const results: AnyResult[] = (() => {
    if (!index || query.trim().length < 2) return [];
    const q = query.toLowerCase();

    type Scored = { result: AnyResult; score: number };
    const scored: Scored[] = [];

    for (const v of index.videos) {
      const inTitle = v.title.toLowerCase().includes(q);
      const inChannel = v.channel.toLowerCase().includes(q);
      const inTakeaways = v.takeaways.some(t => t.toLowerCase().includes(q));
      const transcriptLower = v.transcript.toLowerCase();
      const transcriptIdx = transcriptLower.indexOf(q);
      const inTranscript = transcriptIdx !== -1;

      if (!inTitle && !inChannel && !inTakeaways && !inTranscript) continue;

      const score = inTitle ? 3 : inChannel || inTakeaways ? 2 : 1;

      let snippet: string | undefined;
      if (!inTitle && !inTakeaways && inTranscript) {
        const start = Math.max(0, transcriptIdx - 60);
        const end = Math.min(v.transcript.length, transcriptIdx + query.length + 60);
        snippet = (start > 0 ? '…' : '') + v.transcript.slice(start, end).trim() + (end < v.transcript.length ? '…' : '');
      }

      scored.push({ result: { ...v, snippet }, score });
    }

    for (const b of index.books) {
      const inTitle = b.title.toLowerCase().includes(q);
      const inAuthor = b.author.toLowerCase().includes(q);
      const inDesc = b.description.toLowerCase().includes(q);

      if (!inTitle && !inAuthor && !inDesc) continue;

      const score = inTitle ? 3 : inAuthor ? 2 : 1;
      scored.push({ result: b, score });
    }

    return scored.sort((a, b) => b.score - a.score).map(s => s.result);
  })();

  listLengthRef.current = query.trim().length < 2 ? quickLinks.length : results.length;
  quickLinksRef.current = quickLinks;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search talks"
        className="ml-auto flex items-center gap-1.5 font-mono text-[0.72rem] text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border text-[0.6rem] text-muted-foreground/60 group-hover:border-foreground/20 transition-colors">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-xl rounded-sm border border-border bg-background shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search talks, books, takeaways..."
                className="w-full py-4 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={() => setOpen(false)}
                className="font-mono text-[0.65rem] text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
              >
                esc
              </button>
            </div>

            {/* Results */}
            {query.trim().length >= 2 && (
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-4 py-8 text-center font-mono text-[0.75rem] text-muted-foreground">
                    No results found
                  </p>
                ) : (
                  <ul>
                    {results.map((result, i) => {
                      const active = selectedIndex === i;
                      const cls = `flex items-start gap-3 px-4 py-3 transition-colors border-b border-border last:border-0 ${active ? 'bg-secondary' : 'hover:bg-secondary/60'}`;

                      if (result.type === 'book') {
                        return (
                          <li key={`book-${result.slug}`}>
                            <a
                              ref={active ? selectedRef : null}
                              href={`/books#${result.slug}`}
                              onClick={() => setOpen(false)}
                              className={cls}
                            >
                              <div className="w-16 h-9 shrink-0 mt-0.5 flex items-center justify-center rounded-sm border border-border bg-muted">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[0.88rem] text-foreground leading-snug mb-1 line-clamp-1">
                                  <Highlight text={result.title} query={query} />
                                </p>
                                <p className="font-mono text-[0.68rem] text-muted-foreground">
                                  <Highlight text={result.author} query={query} /> · {result.year}{result.rory_authored ? ' · by Rory' : ''}
                                </p>
                              </div>
                            </a>
                          </li>
                        );
                      }

                      // video result
                      const v = result as VideoResult;
                      return (
                        <li key={v.id}>
                          <a
                            ref={active ? selectedRef : null}
                            href={`/talks/${v.id}`}
                            onClick={() => setOpen(false)}
                            className={cls}
                          >
                            <img
                              src={v.thumbnail}
                              alt=""
                              className="w-16 h-9 object-cover rounded-sm shrink-0 mt-0.5"
                              onError={e => {
                                const img = e.currentTarget;
                                if (!img.src.includes('hqdefault')) {
                                  img.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
                                }
                              }}
                            />
                            <div className="min-w-0">
                              <p className="text-[0.88rem] text-foreground leading-snug mb-1 line-clamp-2">
                                {v.title}
                              </p>
                              <p className="font-mono text-[0.68rem] text-muted-foreground">
                                {v.channel} · {formatDate(v.upload_date)} · {v.duration_string}
                              </p>
                              {v.snippet && (
                                <p className="font-mono text-[0.68rem] text-muted-foreground mt-1 line-clamp-2 italic">
                                  <Highlight text={v.snippet} query={query} />
                                </p>
                              )}
                            </div>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* Quick nav when empty */}
            {query.trim().length < 2 && (
              <div>
                <p className="px-4 pt-4 pb-2 font-mono text-[0.62rem] tracking-widest uppercase text-muted-foreground/50">
                  Quick links
                </p>
                <ul className="pb-2">
                  {quickLinks.map(({ href, label, meta, external }, i) => {
                    const active = selectedIndex === i;
                    return (
                      <li key={href}>
                        <a
                          ref={active ? selectedRef : null}
                          href={href}
                          onClick={() => setOpen(false)}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          className={`flex items-center justify-between px-4 py-2.5 transition-colors ${active ? 'bg-secondary' : 'hover:bg-secondary/60'}`}
                        >
                          <span className="font-mono text-[0.8rem] text-foreground flex items-center gap-2">
                            <span className={`text-[0.6rem] w-4 text-center rounded border ${active ? 'border-primary text-primary' : 'border-border text-muted-foreground/50'}`}>{i + 1}</span>
                            {label}
                          </span>
                          <span className="font-mono text-[0.68rem] text-muted-foreground">{meta}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
