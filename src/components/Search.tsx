import { useState, useEffect, useRef, useCallback } from 'react';

interface VideoEntry {
  id: string;
  title: string;
  channel: string;
  upload_date: string;
  duration_string: string;
  view_count: number;
  thumbnail: string;
  takeaways: string[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<VideoEntry[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const results = (() => {
    if (!index || query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return index.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.channel.toLowerCase().includes(q) ||
      v.takeaways.some(t => t.toLowerCase().includes(q))
    );
  })();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search talks"
        className="ml-auto flex items-center gap-1.5 font-mono text-[0.72rem] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Search
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
                placeholder="Search talks, takeaways..."
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
                    No talks found
                  </p>
                ) : (
                  <ul>
                    {results.map(v => (
                      <li key={v.id}>
                        <a
                          href={`/talks/${v.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-0"
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
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Hint when empty */}
            {query.trim().length < 2 && (
              <p className="px-4 py-5 font-mono text-[0.7rem] text-muted-foreground">
                {index ? `${index.length} talks indexed` : 'Loading…'}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
