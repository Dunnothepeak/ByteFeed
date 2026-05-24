/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect, useState, useRef } from "react";
import { Loader2, Hash, Sparkles, RefreshCw, Feather, ExternalLink, Heart, MessageCircle, Repeat2 } from "lucide-react";

interface Note {
  id: string;
  author: string;
  content: string;
  sourceUrl?: string;
}

export default function App() {
  const [feed, setFeed] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [interestInput, setInterestInput] = useState("Computer Engineering, AI, System Design");
  const [currentInterest, setCurrentInterest] = useState("Computer Engineering, AI, System Design");
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchFeed = async (interests: string, append = false) => {
    setLoading(true);
    try {
      const storedTheme = "Software Architecture";
      const query = encodeURIComponent(interests || storedTheme);
      const res = await fetch(`/api/feed?interests=${query}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data.feed) {
        if (append) {
          setFeed(prev => [...prev, ...data.feed]);
        } else {
          setFeed(data.feed);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(currentInterest);
  }, [currentInterest]);

  const handleUpdateInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestInput.trim()) return;
    setCurrentInterest(interestInput);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans selection:bg-[var(--color-primary)] selection:text-white flex justify-center">
      
      {/* Sidebar - Desktop */}
      <div className="hidden sm:flex flex-col w-64 border-r border-[var(--color-card-border)] h-screen sticky top-0 px-4 py-8">
        <div className="flex items-center gap-3 text-xl font-bold mb-8text-[var(--color-primary)] px-2">
          <Feather className="w-8 h-8 text-[#1da1f2]" />
          <span>ByteFeed</span>
        </div>
        
        <div className="mt-8">
          <h2 className="text-[var(--color-muted)] text-xs font-semibold uppercase tracking-wider mb-4 px-2">Your Focus</h2>
          <form onSubmit={handleUpdateInterest} className="px-2">
            <textarea
              className="w-full bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-xl p-3 text-sm focus:outline-none focus:border-[#1da1f2] transition-colors resize-none h-24 text-[var(--color-foreground)]"
              placeholder="E.g. Rust, Distributed Systems, ML algorithms..."
              value={interestInput}
              onChange={e => setInterestInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="mt-3 w-full bg-[#1da1f2] hover:bg-[#1a91da] text-white font-bold py-2 px-4 rounded-full transition-colors disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Tune Feed
            </button>
          </form>
        </div>
      </div>

      {/* Main Feed */}
      <main className="w-full max-w-2xl border-x border-[var(--color-card-border)] min-h-screen pb-20 sm:pb-0">
        
        {/* Mobile Header */}
        <div className="sm:hidden sticky top-0 bg-[var(--color-background)]/90 backdrop-blur-md z-10 border-b border-[var(--color-card-border)] px-4 py-3 flex justify-between items-center">
           <Feather className="w-6 h-6 text-[#1da1f2]" />
           <span className="font-bold">ByteFeed</span>
           <div className="w-6"></div> {/* spacer */}
        </div>

        {/* Mobile Interest Form */}
        <div className="sm:hidden p-4 border-b border-[var(--color-card-border)]">
          <form onSubmit={handleUpdateInterest} className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#1da1f2]"
              placeholder="What to learn?"
              value={interestInput}
              onChange={e => setInterestInput(e.target.value)}
            />
            <button disabled={loading} type="submit" className="bg-[#1da1f2] text-white p-2 rounded-full disabled:opacity-50">
              <Sparkles className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Feed Header */}
        <div className="hidden sm:flex border-b border-[var(--color-card-border)] px-4 py-4 sticky top-0 bg-[var(--color-background)]/90 backdrop-blur-md z-10 justify-between items-center cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <h1 className="text-xl font-bold">Latest Byte</h1>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-[#1da1f2]" />}
        </div>

        {/* Feed Content */}
        <div className="divide-y divide-[var(--color-card-border)]">
          {feed.length === 0 && !loading && (
            <div className="p-8 text-center text-[var(--color-muted)]">
              No notes found. Try changing your interests.
            </div>
          )}

          {feed.map((note) => (
            <article key={note.id} className="p-4 hover:bg-[var(--color-card)]/30 transition-colors cursor-pointer group">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1da1f2] to-[#8a2be2] flex items-center justify-center text-white font-bold text-lg">
                      {note.author.charAt(0).toUpperCase()}
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[var(--color-foreground)] truncate hover:underline">
                      {note.author}
                    </span>
                    <span className="text-[var(--color-muted)] text-sm">
                      · Wikipedia Summary
                    </span>
                  </div>
                  
                  <p className="text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">
                    {note.content}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between text-[var(--color-muted)] w-full max-w-md mt-2">
                    <button className="flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 group-hover:text-green-400 transition-colors">
                      <Repeat2 className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 group-hover:text-pink-400 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    {note.sourceUrl ? (
                      <a href={note.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#1da1f2] transition-colors" onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                       <div className="w-4"></div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
          
          {feed.length > 0 && (
            <div 
              ref={bottomRef} 
              className="p-6 flex justify-center border-t-0"
            >
              <button 
                onClick={() => fetchFeed(currentInterest, true)}
                disabled={loading}
                className="flex items-center gap-2 text-[#1da1f2] hover:bg-[#1da1f2]/10 px-4 py-2 rounded-full transition-colors font-medium cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Load More Bytes
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar (Trending/Wait) - Desktop Only */}
      <div className="hidden lg:block w-80 px-6 py-8 border-l border-[var(--color-card-border)] min-h-screen">
        <div className="bg-[var(--color-card)] rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Why ByteFeed?</h2>
          <p className="text-[var(--color-muted)] text-sm mb-4 leading-relaxed">
            Short attention span? No problem. We source concise summaries directly from Wikipedia to deliver complex topics in byte-sized, scrolling notes.
          </p>
          <div className="text-xs text-[var(--color-muted)]/70 pb-2 border-b border-[var(--color-card-border)] mb-4">
             Update your focus on the left to tune the algorithm.
          </div>
          
          <h3 className="font-bold text-md mb-3 flex flex-row items-center gap-2"><Hash className="w-4 h-4 text-[#1da1f2]"/> Trending Topics</h3>
          <ul className="space-y-3 text-sm">
             <li className="cursor-pointer hover:bg-white/5 p-2 rounded-md" onClick={() => {setInterestInput("WebAssembly, Rust"); fetchFeed("WebAssembly, Rust")}}>
               <div className="text-[var(--color-muted)] text-xs">Trending</div>
               <div className="font-bold">WebAssembly in Rust</div>
               <div className="text-[var(--color-muted)] text-xs mt-1">1,200 bytes</div>
             </li>
             <li className="cursor-pointer hover:bg-white/5 p-2 rounded-md" onClick={() => {setInterestInput("Transformer Architecture"); fetchFeed("Transformer Architecture")}}>
               <div className="text-[var(--color-muted)] text-xs">Trending</div>
               <div className="font-bold">Transformer Architecture</div>
               <div className="text-[var(--color-muted)] text-xs mt-1">3,405 bytes</div>
             </li>
             <li className="cursor-pointer hover:bg-white/5 p-2 rounded-md" onClick={() => {setInterestInput("Microservices vs Monolith"); fetchFeed("Microservices vs Monolith")}}>
               <div className="text-[var(--color-muted)] text-xs">Trending</div>
               <div className="font-bold">Microservices</div>
               <div className="text-[var(--color-muted)] text-xs mt-1">8,091 bytes</div>
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

