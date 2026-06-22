import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, AlertCircle, Cpu } from 'lucide-react';

// Timestamp formatting helper: converts unix time to [hh:mm:ss] format
function formatTimestamp(unixTimestamp) {
  const d = new Date(unixTimestamp * 1000);
  const hrs = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  const secs = String(d.getSeconds()).padStart(2, '0');
  return `[${hrs}:${mins}:${secs}]`;
}

export default function StartupNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");
  const [streamState, setStreamState] = useState("CONNECTING");

  const fetchHNNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      if (!topStoriesRes.ok) {
        throw new Error('Failed to fetch Hacker News top stories.');
      }
      const ids = await topStoriesRes.json();
      const top20Ids = ids.slice(0, 20);

      const detailedArticles = await Promise.all(
        top20Ids.map(async (id) => {
          try {
            const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            if (itemRes.ok) {
              return await itemRes.json();
            }
          } catch (e) {
            console.error(`Error fetching item ${id}:`, e);
          }
          return null;
        })
      );
      setArticles(detailedArticles.filter(item => item !== null));
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while fetching news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setStreamState("CONNECTING");

    let eventSource;
    try {
      eventSource = new EventSource('https://hacker-news.firebaseio.com/v0/topstories.json');
      
      eventSource.addEventListener('put', async (event) => {
        setStreamState("LIVE");
        setError(null);
        
        try {
          const payload = JSON.parse(event.data);
          const ids = payload.data;
          
          if (Array.isArray(ids)) {
            const top20Ids = ids.slice(0, 20);

            const detailedArticles = await Promise.all(
              top20Ids.map(async (id) => {
                try {
                  const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                  if (itemRes.ok) {
                    return await itemRes.json();
                  }
                } catch (e) {
                  console.error(`Error fetching item ${id}:`, e);
                }
                return null;
              })
            );

            setArticles(detailedArticles.filter(item => item !== null));
            setLoading(false);
          }
        } catch (e) {
          console.error("Error parsing SSE packet:", e);
          setError("Failed to parse real-time stream data.");
          setLoading(false);
        }
      });

      eventSource.onerror = (err) => {
        console.warn("EventSource encountered an connection error. Reconnecting...", err);
        setStreamState("RECONNECTING");
        setError("Real-time stream connection lost. Reconnecting...");
      };

    } catch (err) {
      console.error(err);
      setStreamState("ERROR");
      setError("Failed to establish Server-Sent Events stream.");
      setLoading(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // Startup priority keywords
  const priorityKeywords = useMemo(() => {
    return ["Launch HN:", "Ask HN: Who is hiring?", "Startup", "Funded", "Show HN:"];
  }, []);

  const hasStartupKeyword = (title) => {
    if (!title) return false;
    return priorityKeywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()));
  };

  // Filter and prioritize startup news
  const processedArticles = useMemo(() => {
    if (!articles || articles.length === 0) return [];

    const sorted = [...articles].sort((a, b) => {
      const aIsStartup = hasStartupKeyword(a.title);
      const bIsStartup = hasStartupKeyword(b.title);
      if (aIsStartup && !bIsStartup) return -1;
      if (!aIsStartup && bIsStartup) return 1;
      return 0;
    });

    if (selectedTag === "All") return sorted;
    if (selectedTag === "Startups & Showcases") {
      return sorted.filter(item => hasStartupKeyword(item.title));
    }
    if (selectedTag === "General Tech") {
      return sorted.filter(item => !hasStartupKeyword(item.title));
    }
    return sorted;
  }, [articles, selectedTag]);

  return (
    <div className="flex-1 flex flex-col relative w-full bg-black text-emerald-400 select-none">
      
      {/* Main Layout container - Dense Padding */}
      <main className="max-w-4xl mx-auto px-2 py-6 w-full space-y-6 relative z-10 font-mono">
        
        {/* Page Header */}
        <div className="border-b border-emerald-400 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-400 flex items-center gap-2 select-none">
              &gt; NEWS_FEED.LOG
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold bg-black text-emerald-400 border border-emerald-400 shadow-sm ml-2">
                [ STREAM_LIVE ]
              </span>
            </h2>
            <p className="text-xs text-emerald-650 max-w-lg leading-relaxed select-none">
              Zero-latency real-time news stream powered by Server-Sent Events (SSE). Prioritizing YC showcase threads and job feeds.
            </p>
          </div>
          
          {/* SSE Connection State Telemetry */}
          <div className="flex items-center gap-2 px-2.5 py-1 border border-emerald-400 bg-black text-[10px] select-none">
            <span>SSE_STATUS //</span>
            {streamState === "LIVE" ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                [ ACTIVE ]
              </span>
            ) : streamState === "CONNECTING" ? (
              <span className="text-amber-500 font-bold animate-pulse">[ CONNECTING ]</span>
            ) : streamState === "RECONNECTING" ? (
              <span className="text-orange-500 font-bold animate-pulse">[ RECONNECTING ]</span>
            ) : (
              <span className="text-red-500 font-bold">[ DISCONNECTED ]</span>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-1.5 select-none border-b border-emerald-400/40 pb-3 text-xs">
          <span className="text-emerald-650 mr-2">LOG_FILTER:</span>
          {["All", "Startups & Showcases", "General Tech"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 text-[10px] font-bold transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-emerald-400 text-black border border-emerald-400'
                  : 'bg-black text-emerald-400 border border-emerald-400/40 hover:bg-emerald-950/20 hover:border-emerald-400'
              }`}
            >
              [ {tag} ]
            </button>
          ))}
        </div>

        {/* Dynamic Display States */}
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-3 border border-emerald-400/40 bg-black animate-pulse space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 bg-emerald-950 rounded"></div>
                  <div className="h-3 w-16 bg-emerald-950 rounded"></div>
                </div>
                <div className="h-4 w-3/4 bg-emerald-900 rounded"></div>
              </div>
            ))}
          </div>
        ) : error && articles.length === 0 ? (
          /* Error Banner */
          <div className="flex items-center gap-3 p-4 border border-red-500 bg-black text-red-500 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold">[ ERROR: REAL-TIME STREAM PIPELINE FAULT ]</h4>
              <p className="text-[10px] mt-0.5">{error}</p>
            </div>
          </div>
        ) : processedArticles.length > 0 ? (
          /* Real-time article log list - Tightly packed */
          <div className="grid grid-cols-1 gap-2.5">
            {processedArticles.map((story) => {
              const isStartupItem = hasStartupKeyword(story.title);
              const articleUrl = story.url || `https://news.ycombinator.com/item?id=${story.id}`;

              return (
                <article
                  key={story.id}
                  className={`flex flex-col p-3.5 border bg-black hover:bg-emerald-950/10 transition-colors ${
                    isStartupItem
                      ? 'border-emerald-400 shadow-[0_0_10px_rgba(0,255,65,0.05)]'
                      : 'border-emerald-400/40'
                  }`}
                >
                  {/* Headline formatted as scroll log prefix: [hh:mm:ss] SYSTEM PUSH: Title */}
                  <div className="text-xs md:text-sm font-bold text-emerald-400 leading-snug mb-2 flex items-start gap-1 flex-wrap">
                    <span className="text-emerald-550 select-none font-mono">
                      {formatTimestamp(story.time)} SYSTEM PUSH //
                    </span>
                    <a href={articleUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {story.title}
                    </a>
                  </div>

                  {/* Telemetry metadata footer inside brackets */}
                  <div className="flex justify-between items-center pt-2.5 border-t border-emerald-400/20 select-none text-[9px] font-mono text-emerald-600">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>
                        [ PRIORITY: {isStartupItem ? "HIGH_STARTUP" : "STANDARD_TECH"} ]
                      </span>
                      <span>
                        [ SCORE: {story.score || 0} UPVOTES ]
                      </span>
                      <span>
                        [ SENDER: {story.by || 'Anonymous'} ]
                      </span>
                      <span>
                        [ CAT: {isStartupItem ? "STARTUP_RADAR" : "GENERAL_NET"} ]
                      </span>
                    </div>

                    <a
                      href={articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-black hover:bg-emerald-400 p-0.5 transition-colors"
                    >
                      [ READ_ARTICLE ]
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-emerald-400 bg-black min-h-[200px] space-y-2 select-none">
            <div className="text-emerald-600 font-mono text-xs">
              [ ERROR: NO STREAM LOGS RECORDED FOR FILTER SET ]
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
