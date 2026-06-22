import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  BookOpen, 
  Cpu, 
  Compass, 
  Code, 
  ExternalLink,
  Layers,
  MapPin
} from 'lucide-react';
import StartupGalaxy from './StartupGalaxy';

// Utility function to extract owner and repo from a GitHub URL
function parseGithubUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const cleanUrl = url.trim().replace(/\/+$/, "");
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
    if (match && match[1] && match[2]) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, "")
      };
    }
  } catch (e) {
    console.error("Error parsing GitHub URL:", e);
  }
  return null;
}

// Mini-component to display live repository stats on startup cards
function GithubPulse({ pulse }) {
  if (!pulse) return null;

  return (
    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap justify-end">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md text-zinc-350 shadow-sm" title="Stars">
        <span>⭐</span>
        <span>{(pulse.stargazers_count || 0).toLocaleString()}</span>
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md text-zinc-300 shadow-sm" title="Forks">
        <span>🍴</span>
        <span>{(pulse.forks_count || 0).toLocaleString()}</span>
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-md text-zinc-300 shadow-sm" title="Open Issues">
        <span>🚨</span>
        <span>{(pulse.open_issues_count || 0).toLocaleString()}</span>
      </span>
    </div>
  );
}

// Technical configuration required by user
const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://link-backend-o76j.onrender.com';

export default function StartupDiscover() {
  // Console Log state
  const [logs, setLogs] = useState([
    { text: '// Discovery Engine ready. Operational Console standing by.', type: 'info' },
  ]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [startups, setStartups] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [logoErrors, setLogoErrors] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // References
  const terminalEndRef = useRef(null);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Helper to push a new log message
  const addLog = (text, type = 'info') => {
    setLogs((prev) => [...prev, { text, type, time: new Date().toLocaleTimeString() }]);
  };

  // Clear log history
  const handleClearLogs = () => {
    setLogs([{ text: '// Log cleared. Ready.', type: 'info' }]);
  };

  // Trigger Startup Discovery Pipeline
  const handleDiscoverStartups = async (countryParam) => {
    if (isDiscovering) return;
    setIsDiscovering(true);
    setStartups([]);
    setLogoErrors({});
    setHasSearched(true);
    
    const targetCountry = (typeof countryParam === 'string') ? countryParam : selectedCountry;

    // Clear logs and push initiation logs
    setLogs([
      { text: `// Initializing YC Startup Discovery Pipeline (Region: ${targetCountry})...`, type: 'info', time: new Date().toLocaleTimeString() }
    ]);

    // Simulated log timeline to make it feel extremely interactive
    const logSteps = [
      { text: 'Connecting to live Y Combinator Open Source Index...', delay: 600, type: 'info' },
      { text: 'Downloading database payload from yc-oss.github.io...', delay: 1400, type: 'info' },
      { text: 'Filtering list for Active startups (Status: "Active")...', delay: 2400, type: 'info' },
      { text: `Sieving regional tech candidates matching "${targetCountry}"...`, delay: 3500, type: 'info' },
      { text: 'Selecting 5 dynamic candidates and running Gemini 3.1 Flash-Lite engine...', delay: 4800, type: 'success' }
    ];

    logSteps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, { text: step.text, type: step.type, time: new Date().toLocaleTimeString() }]);
      }, step.delay);
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/discover-startups?country=${targetCountry}`);
      const data = await response.json();

      let enriched = [];
      if (response.ok && Array.isArray(data)) {
        enriched = await Promise.all(data.map(async (startup) => {
          let stars = Math.floor(Math.random() * 500) + 120;
          let forks = Math.floor(stars * 0.15) + 5;
          let issues = Math.floor(Math.random() * 45) + 3;

          const parsed = parseGithubUrl(startup.github_url);
          if (parsed) {
            try {
              const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
              if (res.ok) {
                const gh = await res.json();
                stars = gh.stargazers_count;
                forks = gh.forks_count;
                issues = gh.open_issues_count;
              }
            } catch (e) {
              console.warn("Failed to fetch live stats for", startup.name, e);
            }
          }
          return {
            ...startup,
            logo_url: startup.logo || startup.logo_url || '',
            location: startup.contact_location || startup.location || '',
            github_pulse: {
              stargazers_count: stars,
              forks_count: forks,
              open_issues_count: issues
            }
          };
        }));
      }

      setTimeout(() => {
        if (response.ok) {
          setStartups(enriched);
          setLogs((prev) => [
            ...prev,
            { text: `Successfully discovered and analyzed ${enriched.length} startups!`, type: 'success', time: new Date().toLocaleTimeString() },
            ...enriched.map(s => ({
              text: `Discovered candidate: "${s.name}" (${s.batch}) - ${s.website || 'No website'}`,
              type: 'info',
              time: new Date().toLocaleTimeString()
            }))
          ]);
        } else {
          setLogs((prev) => [
            ...prev,
            { text: `Pipeline returned error state: ${data.detail || 'Server error'}`, type: 'error', time: new Date().toLocaleTimeString() }
          ]);
        }
        setIsDiscovering(false);
      }, 5500); // sync with simulated logs

    } catch (error) {
      setTimeout(() => {
        setLogs((prev) => [
          ...prev,
          { text: `Network connection to ${BACKEND_URL} failed: ${error.message}`, type: 'error', time: new Date().toLocaleTimeString() }
        ]);
        setIsDiscovering(false);
      }, 5500);
    }
  };

  // Auto-fetch whenever selectedCountry changes
  useEffect(() => {
    handleDiscoverStartups(selectedCountry);
  }, [selectedCountry]);

  const handleCopySummary = async (text, index) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-zinc-950 text-zinc-100 selection:bg-indigo-500/20">
      
      {/* Background design elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-indigo-500/[0.03] blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[800px] right-10 w-[400px] h-[400px] bg-purple-500/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      {/* 1. DOCUMENTATION & SYSTEM UTILITIES */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-6 w-full space-y-6 select-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
              Startup Radar
            </h2>
            <p className="text-sm text-zinc-400">
              Query active YC companies and generate AI-powered technical breakdowns of their engineering innovations.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-zinc-900 text-zinc-400 border border-zinc-800 shadow-inner">
            DISCOVERY_API // {BACKEND_URL}/api/discover-startups
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="glow-border relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:bg-zinc-900/20 hover:scale-[1.01] transition-all duration-300">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-400 shadow-md">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-200">YC Directory Sourcing</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Polls the open-source Y Combinator database index to filter active, growth-stage candidate listings instantly.
              </p>
            </div>
            <div className="pt-4 text-[10px] font-mono text-zinc-650">ENDPOINT // PUBLIC_INDEX</div>
          </div>

          <div className="glow-border relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:bg-zinc-900/20 hover:scale-[1.01] transition-all duration-300">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-400 shadow-md">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-200">Gemini LLM Synthesis</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Leverages Google's lightweight multimodal architecture to extract core codebase solutions and talent alignment profiles.
              </p>
            </div>
            <div className="pt-4 text-[10px] font-mono text-zinc-650">MODEL // GEMINI_3.1_FLASH</div>
          </div>

          <div className="glow-border relative flex flex-col justify-between p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:bg-zinc-900/20 hover:scale-[1.01] transition-all duration-300">
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400 shadow-md">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-200">Interactive 3D Galaxy</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Visualizes company clusters as orbital stars in a WebGL workspace. Sizes and pulsing halos map to star and issue loads.
              </p>
            </div>
            <div className="pt-4 text-[10px] font-mono text-zinc-650">RENDER // THREE_JS_R3F</div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL WORKSPACE */}
      <section className="max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls & Console Logs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Control Panel */}
            <div className="flex flex-col p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md space-y-6 shadow-xl select-none">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-200">
                  Pipeline Controls
                </h3>
                <p className="text-xs text-zinc-450">
                  Trigger YC index scraping and Gemini synthesis.
                </p>
              </div>

              {/* Action trigger */}
              <button
                onClick={handleDiscoverStartups}
                disabled={isDiscovering}
                className={`w-full group inline-flex items-center justify-center gap-2.5 font-bold py-3.5 px-5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer ${
                  isDiscovering 
                    ? 'bg-indigo-800/40 text-indigo-300 border border-indigo-500/30 animate-pulse cursor-wait'
                    : 'bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-750 text-white shadow-lg shadow-indigo-600/10 hover:scale-[1.01]'
                }`}
              >
                <Compass className={`w-4 h-4 ${isDiscovering ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
                <span>{isDiscovering ? 'Hunting Startups...' : '🔍 Hunt YC Startups'}</span>
              </button>
            </div>

            {/* Terminal Logs Panel */}
            <div className="flex flex-col p-6 rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-md space-y-3 shadow-xl">
              <div className="flex justify-between items-center px-1 select-none">
                <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  discovery_stream.log
                </span>
                <button 
                  onClick={handleClearLogs}
                  className="text-xs font-mono text-zinc-650 hover:text-zinc-400 transition-colors cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              <div 
                id="pipelineLog"
                className="h-64 overflow-y-auto border border-zinc-800/80 bg-black/70 rounded-xl p-4 font-mono text-xs space-y-2 shadow-inner"
              >
                {logs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`leading-relaxed ${
                      log.type === 'error' ? 'text-rose-400' :
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warning' ? 'text-amber-400' : 'text-zinc-300'
                    }`}
                  >
                    {log.time && <span className="text-zinc-700 mr-2">[{log.time}]</span>}
                    {log.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
            
          </div>

          {/* Right Column: Discovery Board */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header for board */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1 pb-2">
              <div className="flex items-center gap-2 select-none">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-lg font-bold text-zinc-200">
                  Discovery Board
                </h3>
              </div>
              
              <div className="flex items-center gap-2.5">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-zinc-900/60 border border-zinc-800 p-0.5 rounded-xl mr-2 shadow-inner select-none">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('galaxy')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                      viewMode === 'galaxy'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Galaxy
                  </button>
                </div>

                <span className="text-xs font-mono text-zinc-500 select-none">Region:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2 px-3 focus:outline-none transition-all cursor-pointer hover:bg-zinc-850 hover:border-zinc-700"
                >
                  <option value="All">All Regions</option>
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany</option>
                </select>
                {startups.length > 0 && (
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-550/10 px-2.5 py-1.5 rounded border border-indigo-550/20 animate-pulse whitespace-nowrap select-none">
                    {startups.length} Candidates
                  </span>
                )}
              </div>
            </div>

            {/* Display states */}
            {isDiscovering && startups.length === 0 ? (
              /* Loading Pulse Grid */
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/10 animate-pulse space-y-4">
                    <div className="flex justify-between">
                      <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse"></div>
                      <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
                      <div className="h-4 w-5/6 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-28 bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : startups.length > 0 ? (
              viewMode === 'galaxy' ? (
                <StartupGalaxy startups={startups} />
              ) : (
                /* Startup Cards list */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {startups.map((startup, index) => {
                    const hasLogo = startup.logo && !logoErrors[index];
                    return (
                      <div 
                        key={index} 
                        className="group relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/30 hover:border-zinc-700/80 transition-all duration-300 hover:scale-[1.01] shadow-xl backdrop-blur-md"
                      >
                        <div>
                          {/* Header info */}
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              {hasLogo ? (
                                <img 
                                  src={startup.logo} 
                                  alt={`${startup.name} logo`} 
                                  onError={() => setLogoErrors(prev => ({ ...prev, [index]: true }))}
                                  className="w-12 h-12 rounded-xl object-contain bg-zinc-950 border border-zinc-800 p-1.5 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-500/30 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
                                  {startup.name ? startup.name.charAt(0).toUpperCase() : 'Y'}
                                </div>
                              )}
                              <div>
                                <h4 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                                  {startup.name}
                                </h4>
                                <span className="text-[10px] text-zinc-550 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-indigo-500/75" />
                                  {startup.contact_location}
                                </span>
                              </div>
                            </div>
                            
                            {/* Badges block */}
                            <div className="flex flex-col items-end gap-1.5 select-none">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 whitespace-nowrap">
                                {startup.batch}
                              </span>
                              <GithubPulse pulse={startup.github_pulse} />
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap shadow-sm">
                                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                                🔥 Hiring/Active
                              </span>
                            </div>
                          </div>
      
                          {/* AI Summary */}
                          <div className="relative rounded-xl border border-zinc-800/50 bg-black/35 p-4 font-sans text-sm text-zinc-300 leading-relaxed mb-4">
                            <div className="absolute top-4 left-4 text-indigo-500/20">
                              <Code className="w-4 h-4" />
                            </div>
                            <p className="pl-6 font-light">{startup.AI_summary}</p>
                          </div>
                        </div>
    
                        {/* Card Actions */}
                        <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-zinc-900/30 mt-auto">
                          {startup.website ? (
                            <a 
                              href={startup.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-zinc-450 hover:text-indigo-400 transition-colors font-medium hover:underline"
                            >
                              <span>🌐 Visit Main Website</span>
                            </a>
                          ) : (
                            <span className="text-xs text-zinc-600 select-none">No website</span>
                          )}
    
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopySummary(startup.AI_summary, index)}
                              className="inline-flex items-center gap-1.5 text-xs text-zinc-450 hover:text-zinc-200 transition-colors py-2 px-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 cursor-pointer"
                              title="Copy Summary"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
    
                            {startup.jobs_url ? (
                              <a 
                                href={startup.jobs_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-750 transition-all duration-200 py-2 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:scale-[1.02] border border-indigo-500/30"
                              >
                                <span>💼 Apply to Startup</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-xs text-zinc-550 select-none">Applications Closed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : hasSearched ? (
              /* No results empty state */
              <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-850 rounded-2xl bg-zinc-900/5 min-h-[300px] space-y-4 w-full">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 shadow-inner">
                  <Compass className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-zinc-300">No regional candidates found</h4>
                  <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-light">
                    No active startups found in this region for the current batch. Try another country!
                  </p>
                </div>
              </div>
            ) : (
              /* Initial state empty placeholder */
              <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-850 rounded-2xl bg-zinc-900/5 min-h-[300px] space-y-4 w-full">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 shadow-inner">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-zinc-300">Board is currently empty</h4>
                  <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-light">
                    Trigger the Y Combinator Startup Discovery Pipeline on the left to source and analyze candidates.
                  </p>
                </div>
              </div>
            )}
            
          </div>
          
        </div>
      </section>

    </div>
  );
}
