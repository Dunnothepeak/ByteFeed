/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState, useRef } from "react";
import { Loader2, Hash, Sparkles, RefreshCw, Feather, ExternalLink, Heart, MessageCircle, Repeat2, Tag, ArrowLeft, BookOpen } from "lucide-react";
import { CS_PRESETS } from "./presets";

const ADJECTIVES = ["Cyber", "Quantum", "Tech", "Nerd", "Byte", "Pixel", "Neon", "Void", "Hacker", "Data", "Cloud", "Crypto", "Pseudo", "Agile", "Dev", "Sys", "Net", "Macro", "Micro", "Hyper", "Super", "Giga", "Tera", "Peta", "Nano", "Logic", "Syntax", "Turbo", "Electro", "Binary", "Hex", "Neural", "Digital", "Static", "Dynamic"];
const NOUNS = ["Ninja", "Wizard", "Guru", "Coder", "Punk", "Junkie", "Bot", "Script", "Stack", "Node", "Flux", "Core", "Hex", "Bit", "Cache", "Bug", "Frame", "Wire", "Hash", "Key", "Proxy", "Server", "Client", "Daemon", "Thread", "Loop", "Array", "String", "Token", "Socket", "Ping", "Port", "Hub", "Switch", "Router"];

function generateUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 10000);
  return `@${adj}${noun}${num}`;
}

interface Note {
  id: string;
  username: string;
  subject: string;
  content: string;
  sourceUrl?: string;
  imageUrl?: string;
  pageId?: number;
}

function FullArticleView({ note, onClose }: { note: Note, onClose: () => void }) {
  const [fullContent, setFullContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFullArticle = async () => {
      setLoading(true);
      if (!note.pageId) {
        setFullContent(note.content);
        setLoading(false);
        return;
      }
      try {
         const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&pageids=${note.pageId}&explaintext=1&format=json&origin=*`;
         const res = await fetch(url);
         const data = await res.json();
         const extract = data.query.pages[note.pageId]?.extract;
         setFullContent(extract || note.content);
      } catch (e) {
         console.error(e);
         setFullContent(note.content + "\n\n(Failed to load full article)");
      } finally {
         setLoading(false);
      }
    };
    fetchFullArticle();
  }, [note]);

  return (
    <div className="w-full bg-[var(--color-background)] min-h-screen">
      <div className="sticky top-0 bg-[var(--color-background)]/90 backdrop-blur-md z-10 border-b border-[var(--color-card-border)] px-4 py-3 flex items-center gap-4">
         <button onClick={onClose} className="p-2 hover:bg-[var(--color-card)] rounded-full transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <span className="font-bold text-xl truncate">Article</span>
      </div>
      <div className="p-6">
         <div className="flex items-center gap-3 mb-6">
            <div className="flex-shrink-0">
               <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${note.username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`} alt={note.username} className="w-12 h-12 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card)]" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="font-bold truncate">{note.username}</div>
               <div className="text-[var(--color-muted)] text-sm">
                 Wikipedia Article · {note.subject}
               </div>
            </div>
         </div>
         
         <h1 className="text-3xl font-bold mb-6 tracking-tight">{note.subject}</h1>

         {note.imageUrl && (
           <div className="mb-8 rounded-2xl overflow-hidden border border-[var(--color-card-border)] bg-black/5">
              <img src={note.imageUrl} alt={note.subject} className="w-full max-h-[500px] object-contain" />
           </div>
         )}

         {loading ? (
           <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#1da1f2]" /></div>
         ) : (
           <div className="text-[16px] leading-8 whitespace-pre-wrap text-[var(--color-foreground)]/90">
             {fullContent}
           </div>
         )}
         
         {!loading && note.sourceUrl && (
            <div className="mt-10 border-t border-[var(--color-card-border)] pt-6 flex justify-center">
               <a href={note.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#1da1f2] hover:underline font-medium">
                 <ExternalLink className="w-4 h-4" />
                 View original on Wikipedia
               </a>
            </div>
         )}
      </div>
    </div>
  );
}

function NoteCard({ note, onOpenArticle }: { note: Note; onOpenArticle: (note: Note) => void } & React.Attributes) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 220;
  const shouldClip = note.content.length > maxLength;
  const displayText = expanded ? note.content : (shouldClip ? note.content.slice(0, maxLength) + '...' : note.content);

  return (
    <article className="p-4 hover:bg-[var(--color-card)]/30 transition-colors group">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
           <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${note.username}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`} alt={note.username} className="w-10 h-10 rounded-full bg-[var(--color-card)] border border-[var(--color-card-border)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--color-foreground)] truncate hover:underline cursor-pointer">
                {note.username}
              </span>
              <span className="text-[var(--color-muted)] text-sm">
                · Wikipedia Summary
              </span>
            </div>
            <span className="text-[var(--color-primary)] text-sm font-semibold tracking-tight">
              Topic: {note.subject}
            </span>
          </div>
          
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {displayText}
            {shouldClip && !expanded && (
              <button onClick={() => setExpanded(true)} className="text-[#1da1f2] hover:underline ml-1 font-medium">
                Read more
              </button>
            )}
            {shouldClip && expanded && (
              <button onClick={() => setExpanded(false)} className="text-[#1da1f2] hover:underline ml-1 font-medium">
                Show less
              </button>
            )}
          </p>

          {note.imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-[var(--color-card-border)] bg-black/5">
              <img src={note.imageUrl} alt={note.subject} className="w-full max-h-96 object-contain" loading="lazy" />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-10 text-[var(--color-muted)] w-full max-w-sm">
              <button className="flex items-center gap-2 hover:text-[#1da1f2] transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <Repeat2 className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 hover:text-pink-400 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            
            {note.pageId ? (
              <button onClick={() => onOpenArticle(note)} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1da1f2] bg-[#1da1f2]/10 hover:bg-[#1da1f2]/20 px-3 py-1.5 rounded-full transition-colors w-fit whitespace-nowrap hidden group-hover:inline-flex cursor-pointer">
                <BookOpen className="w-3.5 h-3.5" />
                Read Deep Dive
              </button>
            ) : note.sourceUrl && (
              <a href={note.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1da1f2] bg-[#1da1f2]/10 hover:bg-[#1da1f2]/20 px-3 py-1.5 rounded-full transition-colors w-fit whitespace-nowrap hidden group-hover:inline-flex">
                <ExternalLink className="w-3.5 h-3.5" />
                Article Link
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [feed, setFeed] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [interestInput, setInterestInput] = useState("Computer Engineering, AI, System Design");
  const [currentInterest, setCurrentInterest] = useState("Computer Engineering, AI, System Design");
  const [pageOffset, setPageOffset] = useState(0);
  const [suggestedPresets, setSuggestedPresets] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shuffled = [...CS_PRESETS].sort(() => 0.5 - Math.random());
    setSuggestedPresets(shuffled.slice(0, 15));
  }, []);

  const fetchFeed = async (interests: string, append = false) => {
    if (loading) return;
    setLoading(true);
    
    const currentOffset = append ? pageOffset + 5 : 0;
    if (!append) setPageOffset(0);
    else setPageOffset(currentOffset);

    try {
      const interestsStr = (interests || "Computer science").trim();
      const terms = interestsStr.split(',').map(t => t.trim()).filter(Boolean);
      
      const searchQueries = terms.length > 0 ? terms.slice(0, 3) : ["Computer science"];
      
      let allNotes: Note[] = [];

      for (const query of searchQueries) {
        const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&gsroffset=${currentOffset}&prop=extracts|pageimages&exintro=1&explaintext=1&exsentences=3&piprop=original&format=json&origin=*`;
        
        try {
          const wpRes = await fetch(url);
          if (!wpRes.ok) continue;
          
          const wpData = await wpRes.json();
          if (wpData.query && wpData.query.pages) {
            const pages = Object.values(wpData.query.pages) as any[];
            for (const page of pages) {
              if (page.extract && page.extract.trim().length > 0 && !page.title.startsWith("List of") && !page.title.includes("disambiguation") && !page.title.includes("Index of")) {
                
                let originalImage: string | undefined;
                if (page.original && page.original.source) {
                  originalImage = page.original.source;
                }

                allNotes.push({
                  id: `wiki-${page.pageid}-${Math.random().toString(36).substring(7)}`,
                  username: generateUsername(),
                  subject: page.title,
                  content: page.extract.trim(),
                  sourceUrl: `https://en.wikipedia.org/?curid=${page.pageid}`,
                  imageUrl: originalImage,
                  pageId: page.pageid
                });
              }
            }
          }
        } catch (e) {
          console.error("Fetch area error", e);
        }
      }

      if (allNotes.length === 0) {
        // If we found nothing and it's an append, just ignore
        if (append) return;
        
        allNotes.push({
          id: "wiki-fallback-1",
          username: generateUsername(),
          subject: "Knowledge Base",
          content: `We couldn't find specific Wikipedia articles for "${interestsStr}". Try searching for broader terms like "Software Engineering" or "Data Structures".`,
        });
      }

      const shuffled = allNotes.sort(() => 0.5 - Math.random());
      const feedData = shuffled.slice(0, 10);

      if (append) {
        setFeed(prev => {
          // Filter out duplicates by ID or subject
          const existingSubjects = new Set(prev.map(p => p.subject));
          const newUnique = feedData.filter(n => !existingSubjects.has(n.subject));
          return [...prev, ...newUnique];
        });
      } else {
        setFeed(feedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(currentInterest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInterest]);

  // Infinite Scroll Listener
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && feed.length > 0 && !activeNote) {
          fetchFeed(currentInterest, true);
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, currentInterest, feed.length, activeNote]);

  const handleUpdateInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestInput.trim()) return;
    setActiveNote(null);
    setCurrentInterest(interestInput);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyPreset = (preset: string) => {
    setInterestInput(preset);
    setActiveNote(null);
    setCurrentInterest(preset);
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
          
          <div className="mt-8 px-2">
            <h2 className="text-[var(--color-muted)] text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1"><Tag className="w-3 h-3"/> Discover Topics</h2>
            <div className="flex flex-wrap gap-2">
              {suggestedPresets.map(preset => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className="bg-[var(--color-card)] border border-[var(--color-card-border)] hover:border-[#1da1f2] hover:text-[#1da1f2] text-xs px-3 py-1.5 rounded-full transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
            <button 
              onClick={() => {
                const shuffled = [...CS_PRESETS].sort(() => 0.5 - Math.random());
                setSuggestedPresets(shuffled.slice(0, 15));
              }}
              className="text-[#1da1f2] hover:underline text-xs font-medium mt-3 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3"/> Shuffle presets
            </button>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <main className="w-full max-w-2xl border-x border-[var(--color-card-border)] min-h-screen pb-20 sm:pb-0 bg-[var(--color-background)] z-0 relative">
        
        {activeNote ? (
          <FullArticleView note={activeNote} onClose={() => setActiveNote(null)} />
        ) : (
          <>
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
            <div className="hidden sm:flex border-b border-[var(--color-card-border)] px-4 py-4 sticky top-0 bg-[var(--color-background)]/90 backdrop-blur-md z-10 justify-between items-center cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <h1 className="text-xl font-bold">Latest Byte</h1>
              {loading && feed.length === 0 && <Loader2 className="w-5 h-5 animate-spin text-[#1da1f2]" />}
            </div>
    
            {/* Feed Content */}
            <div className="divide-y divide-[var(--color-card-border)]">
              {feed.length === 0 && !loading && (
                <div className="p-8 text-center text-[var(--color-muted)]">
                  No notes found. Try changing your interests.
                </div>
              )}
    
              {feed.map((note) => (
                <NoteCard key={note.id} note={note} onOpenArticle={setActiveNote} />
              ))}
              
              {feed.length > 0 && (
                <div 
                  ref={bottomRef} 
                  className="p-6 flex justify-center border-t border-[var(--color-card-border)] min-h-[100px]"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#1da1f2]" />
                  ) : (
                    <div className="text-[var(--color-muted)] text-sm">Scroll for more...</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Right Sidebar (Trending/Wait) - Desktop Only */}
      <div className="hidden lg:block w-80 px-6 py-8 border-l border-[var(--color-card-border)] min-h-screen">
        <div className="bg-[var(--color-card)] rounded-2xl p-4 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Why ByteFeed?</h2>
          <p className="text-[var(--color-muted)] text-sm mb-4 leading-relaxed">
            Short attention span? No problem. We source concise summaries directly from Wikipedia to deliver complex topics in byte-sized, scrolling notes.
          </p>
          <div className="text-xs text-[var(--color-muted)]/70 pb-2 border-b border-[var(--color-card-border)] mb-4">
             Update your focus on the left to tune your feed.
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

