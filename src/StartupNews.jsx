import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Calendar, ExternalLink, ThumbsUp, RefreshCw, AlertCircle } from 'lucide-react';

// Relative time formatting helper
function timeAgo(unixTimestamp) {
  const seconds = Math.floor(Date.now() / 1000 - unixTimestamp);
  if (seconds < 0) return "just now";
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
    }
  }
  return "just now";
}

export default function StartupNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState("All");

  const fetchHNNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch top story IDs
      const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      if (!topStoriesRes.ok) {
        throw new Error('Failed to fetch Hacker News top stories.');
      }
      const ids = await topStoriesRes.json();
      
      // 2. Take top 20 IDs
      const top20Ids = ids.slice(0, 20);

      // 3. Fetch details for each ID in parallel
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

      // Filter out null responses
      setArticles(detailedArticles.filter(item => item !== null));
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while fetching news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHNNews();
  }, []);

  // Startup priority keywords
  const priorityKeywords = useMemo(() => {
    return ["Launch HN:", "Ask HN: Who is hiring?", "Startup", "Funded", "Show HN:"];
  }, []);

  // Helper to check if an article title contains priority keywords
  const hasStartupKeyword = (title) => {
    if (!title) return false;
    return priorityKeywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()));
  };

  // 4. Filter and Prioritize Articles
  const processedArticles = useMemo(() => {
    if (!articles || articles.length === 0) return [];

    // Sort: startup keywords first, then normal stories (maintaining relative HN index placement)
    const sorted = [...articles].sort((a, b) => {
      const aIsStartup = hasStartupKeyword(a.title);
      const bIsStartup = hasStartupKeyword(b.title);
      if (aIsStartup && !bIsStartup) return -1;
      if (!aIsStartup && bIsStartup) return 1;
      return 0;
    });

    // Tag based filtering
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
    <div className="flex-1 flex flex-col relative w-full bg-zinc-950 text-zinc-100 selection:bg-indigo-500/20">
      
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-purple-500/[0.03] blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[600px] left-10 w-[400px] h-[400px] bg-indigo-500/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Layout container */}
      <main className="max-w-4xl mx-auto px-4 py-12 w-full space-y-10 relative z-10">
        
        {/* Page Header */}
        <div className="border-b border-zinc-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2 select-none">
              <BookOpen className="w-6 h-6 text-purple-400" />
              News Feed
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg leading-relaxed select-none">
              Live updates pulled directly from the Hacker News pipeline, prioritizing startup showcases, launches, and developer jobs.
            </p>
          </div>
          
          <button
            onClick={fetchHNNews}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer disabled:opacity-50 select-none shadow-inner"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Feed
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 select-none border-b border-zinc-900/60 pb-5">
          <span className="text-xs font-mono text-zinc-500 mr-2">Feed Filter:</span>
          {["All", "Startups & Showcases", "General Tech"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-purple-650 text-white shadow-md shadow-purple-600/20 border border-purple-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-850 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Dynamic Display States */}
        {loading ? (
          /* High Fidelity Loading Skeleton */
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="p-6 rounded-2xl border border-zinc-850 bg-zinc-900/10 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-zinc-850 rounded"></div>
                  <div className="h-4 w-16 bg-zinc-850 rounded"></div>
                </div>
                <div className="h-6 w-3/4 bg-zinc-800 rounded"></div>
                <div className="h-4 w-1/2 bg-zinc-850 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State Banner */
          <div className="flex items-center gap-3 p-5 border border-red-500/20 bg-red-500/5 rounded-2xl text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-bold">Failed to load news</h4>
              <p className="text-xs text-red-500/80 mt-0.5">{error}</p>
            </div>
            <button 
              onClick={fetchHNNews} 
              className="px-3 py-1.5 text-xs font-mono rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-300 transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : processedArticles.length > 0 ? (
          /* Articles feed list */
          <div className="grid grid-cols-1 gap-6">
            {processedArticles.map((story, idx) => {
              const isStartupItem = hasStartupKeyword(story.title);
              const articleUrl = story.url || `https://news.ycombinator.com/item?id=${story.id}`;

              return (
                <article
                  key={story.id}
                  className={`group flex flex-col p-6 rounded-2xl border bg-zinc-900/10 hover:bg-zinc-900/25 transition-all duration-300 shadow-xl ${
                    isStartupItem
                      ? 'border-indigo-500/20 hover:border-indigo-500/40 shadow-indigo-950/10'
                      : 'border-zinc-900 hover:border-zinc-800 shadow-zinc-950/15'
                  }`}
                >
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 select-none">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      isStartupItem
                        ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25'
                        : 'text-zinc-400 bg-zinc-900/80 border-zinc-800'
                    }`}>
                      {isStartupItem ? "⚡ Startup Priority" : "Tech Story"}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-550 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-550" />
                      {timeAgo(story.time)}
                    </span>
                  </div>

                  {/* Title & Link */}
                  <h3 className="text-base md:text-lg font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors leading-snug mb-3">
                    <a href={articleUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {story.title}
                    </a>
                  </h3>

                  {/* Footer details */}
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-900/40 select-none text-[10px] font-mono">
                    <div className="flex items-center gap-3.5 text-zinc-500">
                      <span className="flex items-center gap-1 text-zinc-400">
                        <ThumbsUp className="w-3 h-3 text-indigo-450" />
                        {story.score || 0} Upvotes
                      </span>
                      <span>•</span>
                      <span>By: <span className="text-zinc-450">{story.by || 'Anonymous'}</span></span>
                    </div>

                    <a
                      href={articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-450 hover:text-white transition-colors"
                    >
                      <span>Read Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-850 rounded-2xl bg-zinc-900/5 min-h-[250px] space-y-3 select-none">
            <AlertCircle className="w-8 h-8 text-zinc-500" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-zinc-300">No stories matching active filter</h4>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-light">
                There are currently no matching items in the Hacker News feed. Try switching to "All".
              </p>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
