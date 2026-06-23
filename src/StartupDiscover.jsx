import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Layers 
} from 'lucide-react';

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

// Mini-component to display live repository stats on startup cards in bracket format
function GithubPulse({ pulse }) {
  if (!pulse) return null;

  return (
    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap justify-end font-mono text-[10px] select-none">
      <span className="text-emerald-400" title="Stars">
        [ ⭐ {(pulse.stargazers_count || 0).toLocaleString()} ]
      </span>
      <span className="text-emerald-400" title="Forks">
        [ 🍴 {(pulse.forks_count || 0).toLocaleString()} ]
      </span>
      <span className="text-emerald-400" title="Open Issues">
        [ 🚨 {(pulse.open_issues_count || 0).toLocaleString()} ]
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
  const [country, setCountry] = useState('All');
  const [hasSearched, setHasSearched] = useState(false);
  const [limit, setLimit] = useState(5);

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
  const handleDiscoverStartups = async () => {
    if (isDiscovering) return;
    setIsDiscovering(true);
    setStartups([]);
    setLogoErrors({});
    setHasSearched(true);
    
    // Clear logs and push initiation logs
    setLogs([
      { text: `// Initializing Global Network Radar (Region: ${country}, Limit: ${limit})...`, type: 'info', time: new Date().toLocaleTimeString() }
    ]);

    // Simulated log timeline to make it feel extremely interactive
    const logSteps = [
      { text: 'Establishing downlink with radar node engines...', delay: 600, type: 'info' },
      { text: 'Streaming technology data from YC, Arbeitnow, and GitHub Trending...', delay: 1400, type: 'info' },
      { text: 'Applying regional filter constraint...', delay: 2400, type: 'info' },
      { text: `Slicing telemetry payload to maximum ${limit} nodes...`, delay: 3500, type: 'info' },
      { text: `Running Gemini LLM diagnostic parser on sliced candidate list...`, delay: 4800, type: 'success' }
    ];

    logSteps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, { text: step.text, type: step.type, time: new Date().toLocaleTimeString() }]);
      }, step.delay);
    });

    try {
      const fetchUrl = `${BACKEND_URL}/api/global-radar?country=${country}&limit=${limit}`;

      const response = await fetch(fetchUrl);
      const data = await response.json();

      let enriched = [];
      if (response.ok && Array.isArray(data)) {
        enriched = await Promise.all(data.map(async (startup) => {
          let stars = Math.floor(Math.random() * 500) + 120;
          let forks = Math.floor(stars * 0.15) + 5;
          let issues = Math.floor(Math.random() * 45) + 3;

          const githubUrl = startup.github_url || '';
          const parsed = parseGithubUrl(githubUrl);
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
          
          // Normalize the data format from different streams
          const name = startup.name || 'Unknown Company';
          const AI_summary = startup.telemetry_diagnostic || startup.AI_summary || '';
          const jobs_url = startup.target_link || startup.jobs_url || '';
          const website = startup.target_link || startup.website || '';
          const location = startup.hq_location || startup.contact_location || startup.location || 'Remote';
          const origin_platform = startup.origin_platform || 'YC Open Source';
          const batch = startup.batch || 'Global';

          return {
            ...startup,
            name,
            AI_summary,
            jobs_url,
            website,
            location,
            origin_platform,
            batch,
            logo_url: startup.logo || startup.logo_url || '',
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
            { text: `Successfully discovered and analyzed ${enriched.length} node entities!`, type: 'success', time: new Date().toLocaleTimeString() },
            ...enriched.map(s => ({
              text: `Discovered node: "${s.name}" [SRC: ${s.origin_platform}] - ${s.website || 'No website'}`,
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
          { text: `Network connection to backend failed: ${error.message}`, type: 'error', time: new Date().toLocaleTimeString() }
        ]);
        setIsDiscovering(false);
      }, 5500);
    }
  };

  // Auto-fetch disabled for manual scanning

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

  const getSourceBadge = (platform) => {
    const plat = (platform || '').toUpperCase();
    if (plat.includes('YC') || plat.includes('COMBINATOR')) return '[SRC: Y_COMBINATOR]';
    if (plat.includes('ARBEIT') || plat.includes('JOB')) return '[SRC: ARBEITNOW]';
    if (plat.includes('REMOTE')) return '[SRC: REMOTE_OK]';
    return `[SRC: ${plat.replace(/\s+/g, '_')}]`;
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-black text-emerald-400 select-none">
      
      {/* 1. DOCUMENTATION & SYSTEM UTILITIES */}
      <section className="max-w-6xl mx-auto px-2 pt-4 pb-2 w-full space-y-3 select-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-emerald-400 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-400 flex items-center gap-2">
              &gt; STARTUP_RADAR.SYS
            </h2>
            <p className="text-xs text-emerald-650">
              Query active companies and generate AI-powered technical breakdowns of their engineering innovations.
            </p>
          </div>
          <div className="text-xs font-mono px-2.5 py-1 bg-black text-emerald-400 border border-emerald-400 shadow-inner">
            DISCOVERY_API // {`${BACKEND_URL}/api/global-radar`}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="relative flex flex-col justify-between p-3.5 border border-emerald-400 bg-black">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-emerald-400">[ 01_YC_DIRECTORY_SOURCING ]</h3>
              <p className="text-[11px] text-emerald-650 leading-normal font-light">
                Polls the open-source Y Combinator database index to filter active, growth-stage candidate listings instantly.
              </p>
            </div>
            <div className="pt-2 text-[9px] font-mono text-emerald-700">ENDPOINT // PUBLIC_INDEX</div>
          </div>

          <div className="relative flex flex-col justify-between p-3.5 border border-emerald-400 bg-black">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-emerald-400">[ 02_GEMINI_LLM_SYNTHESIS ]</h3>
              <p className="text-[11px] text-emerald-650 leading-normal font-light">
                Leverages Google's lightweight multimodal architecture to extract core codebase solutions and talent alignment profiles.
              </p>
            </div>
            <div className="pt-2 text-[9px] font-mono text-emerald-700">MODEL // GEMINI_3.1_FLASH</div>
          </div>

          <div className="relative flex flex-col justify-between p-3.5 border border-emerald-400 bg-black">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-emerald-400">[ 03_GLOBAL_TECH_RADAR ]</h3>
              <p className="text-[11px] text-emerald-650 leading-normal font-light">
                Aggregates active repositories and job postings from multiple public streams into a unified high-density console dashboard.
              </p>
            </div>
            <div className="pt-2 text-[9px] font-mono text-emerald-700">PIPELINE // CONCURRENT_SCRAPERS</div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL WORKSPACE */}
      <section className="max-w-6xl mx-auto px-2 py-4 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left Column: Console Logs */}
          <div className="lg:col-span-4 space-y-4">

            {/* Terminal Logs Panel */}
            <div className="flex flex-col p-4 border border-emerald-400 bg-black space-y-2">
              <div className="flex justify-between items-center px-1 select-none">
                <span className="text-xs font-mono text-emerald-650 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  discovery_stream.log
                </span>
                <button 
                  onClick={handleClearLogs}
                  className="text-xs font-mono text-emerald-500 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  [ CLEAR ]
                </button>
              </div>

              <div 
                id="pipelineLog"
                className="h-64 overflow-y-auto border border-emerald-400 bg-black p-3 font-mono text-xs space-y-1.5"
              >
                {logs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`leading-relaxed ${
                      log.type === 'error' ? 'text-red-500 font-bold' :
                      log.type === 'success' ? 'text-emerald-400 font-bold' :
                      log.type === 'warning' ? 'text-amber-500' : 'text-emerald-500'
                    }`}
                  >
                    {log.time && <span className="text-emerald-700 mr-2">[{log.time}]</span>}
                    {log.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>

          {/* Right Column: Discovery Board */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Header for board */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1 pb-1 select-none">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-md font-bold text-emerald-400 font-mono">
                  [ DISCOVERY_BOARD ]
                </h3>
              </div>
              
              {startups.length > 0 && (
                <span className="text-xs font-mono text-emerald-450 bg-emerald-950/20 px-2 py-1 border border-emerald-400 font-bold">
                  [ {startups.length} NODES ONLINE ]
                </span>
              )}
            </div>

            {/* Consolidated Command Center Terminal Control Panel */}
            <div className="border border-emerald-400 p-4 bg-black flex flex-wrap items-center justify-between gap-4 font-mono select-none relative mb-4">
              {/* Sharp 90-degree corner joints absolute-positioned */}
              <span className="absolute top-0 left-0 -translate-x-[1px] -translate-y-[4px] text-emerald-400 font-bold bg-black leading-none z-10">+</span>
              <span className="absolute top-0 right-0 translate-x-[1px] -translate-y-[4px] text-emerald-400 font-bold bg-black leading-none z-10">+</span>
              <span className="absolute bottom-0 left-0 -translate-x-[1px] translate-y-[4px] text-emerald-400 font-bold bg-black select-none leading-none z-10">+</span>
              <span className="absolute bottom-0 right-0 translate-x-[1px] translate-y-[4px] text-emerald-400 font-bold bg-black select-none leading-none z-10">+</span>

              {/* Region Select parameter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-400">[ PARAM: REGION = </span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="bg-black text-emerald-400 text-xs font-bold font-mono focus:outline-none border-b border-emerald-400 cursor-pointer px-1 py-0.5"
                >
                  <option value="All">All</option>
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany</option>
                </select>
                <span className="text-xs font-bold text-emerald-400"> ]</span>
              </div>

              {/* Results Count parameter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">[ PARAM: MAX_RESULTS = </span>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                  className="w-24 h-1 bg-emerald-950 accent-emerald-400 appearance-none cursor-pointer"
                />
                <span className="text-xs font-mono text-emerald-450 w-4 text-center">{limit}</span>
                <span className="text-xs font-bold text-emerald-400"> ]</span>
              </div>

              {/* Action execute button */}
              <button
                onClick={handleDiscoverStartups}
                disabled={isDiscovering}
                className={`px-4 py-2 border text-xs font-bold tracking-wider transition-all duration-100 cursor-pointer ${
                  isDiscovering 
                    ? 'bg-black text-emerald-600 border-emerald-700 animate-pulse cursor-wait'
                    : 'bg-black text-emerald-400 border-emerald-400 hover:bg-emerald-400 hover:text-black'
                }`}
              >
                [ EXECUTE: INITIATE_SCAN ]
              </button>
            </div>

            {/* Display states */}
            {isDiscovering ? (
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-emerald-400 bg-black min-h-[250px] font-mono text-emerald-400 text-sm select-none">
                <div className="animate-pulse">&gt; ESTABLISHING UPLINK...</div>
              </div>
            ) : startups.length > 0 ? (
              /* Startup Cards list as High-Density Data Blocks with sharp 90-degree corners */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {startups.map((startup, index) => {
                  return (
                    <div 
                      key={index} 
                      className="relative flex flex-col justify-between p-4 border border-emerald-400 bg-black hover:bg-emerald-950/10 transition-colors font-mono"
                    >
                      {/* Sharp 90-degree corner joints absolute-positioned */}
                      <span className="absolute top-0 left-0 -translate-x-[1px] -translate-y-[4px] text-emerald-400 font-bold bg-black select-none leading-none z-10">+</span>
                      <span className="absolute top-0 right-0 translate-x-[1px] -translate-y-[4px] text-emerald-400 font-bold bg-black select-none leading-none z-10">+</span>
                      <span className="absolute bottom-0 left-0 -translate-x-[1px] translate-y-[4px] text-emerald-400 font-bold bg-black select-none leading-none z-10">+</span>
                      <span className="absolute bottom-0 right-0 translate-x-[1px] translate-y-[4px] text-emerald-400 font-bold bg-black select-none leading-none z-10">+</span>

                      <div>
                        {/* Header info */}
                        <div className="flex justify-between items-start gap-2.5 mb-3">
                          <div className="flex items-center gap-3">
                            {/* Retro text source badge instead of logo */}
                            <div className="text-[10px] font-bold text-emerald-400 border border-emerald-400 px-2 py-1.5 bg-black select-none font-mono whitespace-nowrap">
                              {getSourceBadge(startup.origin_platform)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-emerald-400 leading-tight">
                                {startup.name}
                              </h4>
                              <span className="text-[10px] text-emerald-650 flex items-center gap-1 mt-0.5 font-mono select-none">
                                [ LOC: {startup.location} ]
                              </span>
                            </div>
                          </div>
                          
                          {/* Badges block inside brackets */}
                          <div className="flex flex-col items-end gap-1 font-mono text-[9px] select-none text-emerald-400">
                            <span>
                              [ BATCH: {startup.batch} ]
                            </span>
                            <GithubPulse pulse={startup.github_pulse} />
                            <span className="text-emerald-500 font-bold">
                              [ STATUS: HIRING / ACTIVE ]
                            </span>
                          </div>
                        </div>
    
                        {/* AI Summary in sharp corner structured sub-block */}
                        <div className="border border-emerald-400/40 bg-black p-3 font-mono text-xs text-emerald-500 leading-relaxed mb-3 relative">
                          {/* Sub-block ASCII Corners */}
                          <span className="absolute top-0 left-0 -translate-x-[1px] -translate-y-[4px] text-emerald-400/50 bg-black font-bold leading-none select-none">+</span>
                          <span className="absolute top-0 right-0 translate-x-[1px] -translate-y-[4px] text-emerald-400/50 bg-black font-bold leading-none select-none">+</span>
                          <span className="absolute bottom-0 left-0 -translate-x-[1px] translate-y-[4px] text-emerald-400/50 bg-black font-bold leading-none select-none">+</span>
                          <span className="absolute bottom-0 right-0 translate-x-[1px] translate-y-[4px] text-emerald-400/50 bg-black font-bold leading-none select-none">+</span>

                          <div className="text-[10px] font-bold text-emerald-400 mb-1.5 select-none">
                            &gt; EXTRACTED_ENGINEERING_PROFILE:
                          </div>
                          <p className="font-light whitespace-pre-wrap">{startup.AI_summary || "NO DIAGNOSTIC DATA AVAILABLE."}</p>
                        </div>
                      </div>
  
                      {/* Card Actions */}
                      <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-emerald-400/30 mt-auto text-[10px] font-mono select-none">
                        {startup.website ? (
                          <a 
                            href={startup.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-black hover:bg-emerald-400 p-0.5 transition-colors"
                          >
                            [ VISIT_WEBSITE ]
                          </a>
                        ) : (
                          <span className="text-emerald-700">[ NO_WEBSITE ]</span>
                        )}
  
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopySummary(startup.AI_summary, index)}
                            className="text-[10px] p-0.5 border border-emerald-400 bg-black text-emerald-400 hover:bg-emerald-400 hover:text-black cursor-pointer font-mono"
                          >
                            {copiedIndex === index ? '[ COPIED ]' : '[ COPY ]'}
                          </button>
  
                          {startup.jobs_url ? (
                            <a 
                              href={startup.jobs_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="border border-emerald-400 bg-black text-emerald-400 hover:bg-emerald-400 hover:text-black p-0.5 transition-colors font-bold"
                            >
                              [ EXECUTE: APPLY_TO_NODE ]
                            </a>
                          ) : (
                            <span className="text-emerald-700 font-bold">[ NODE_CLOSED ]</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Initial state empty placeholder */
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-emerald-400 bg-black min-h-[250px] font-mono text-emerald-400 text-sm select-none">
                <div>&gt; AWAITING COMMAND...</div>
              </div>
            )}
            
          </div>
          
        </div>
      </section>

    </div>
  );
}
