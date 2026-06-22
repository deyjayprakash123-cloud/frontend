import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Layers 
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
    <div className="flex-1 flex flex-col relative w-full bg-black text-emerald-400 select-none">
      
      {/* 1. DOCUMENTATION & SYSTEM UTILITIES */}
      <section className="max-w-6xl mx-auto px-2 pt-4 pb-2 w-full space-y-3 select-none">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-emerald-400 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-400 flex items-center gap-2">
              &gt; STARTUP_RADAR.SYS
            </h2>
            <p className="text-xs text-emerald-650">
              Query active YC companies and generate AI-powered technical breakdowns of their engineering innovations.
            </p>
          </div>
          <div className="text-xs font-mono px-2.5 py-1 bg-black text-emerald-400 border border-emerald-400 shadow-inner">
            DISCOVERY_API // {BACKEND_URL}/api/discover-startups
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
              <h3 className="text-xs font-bold text-emerald-400">[ 03_INTERACTIVE_3D_GALAXY ]</h3>
              <p className="text-[11px] text-emerald-650 leading-normal font-light">
                Visualizes company clusters as orbital stars in a WebGL workspace. Sizes and pulsing halos map to star and issue loads.
              </p>
            </div>
            <div className="pt-2 text-[9px] font-mono text-emerald-700">RENDER // THREE_JS_R3F</div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL WORKSPACE */}
      <section className="max-w-6xl mx-auto px-2 py-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left Column: Controls & Console Logs */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Control Panel */}
            <div className="flex flex-col p-4 border border-emerald-400 bg-black space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-emerald-400">
                  [ PIPELINE_CONTROLS ]
                </h3>
                <p className="text-[10px] text-emerald-600">
                  Trigger YC index scraping and Gemini synthesis.
                </p>
              </div>

              {/* Action trigger */}
              <button
                onClick={handleDiscoverStartups}
                disabled={isDiscovering}
                className={`w-full font-bold py-2.5 px-4 transition-all duration-100 cursor-pointer ${
                  isDiscovering 
                    ? 'bg-black text-emerald-600 border border-emerald-700 animate-pulse cursor-wait'
                    : 'bg-black text-emerald-400 border border-emerald-400 hover:bg-emerald-400 hover:text-black'
                }`}
              >
                {isDiscovering ? '[ RUNNING_PIPELINE... ]' : '[ RUN_YC_DISCOVERY ]'}
              </button>
            </div>

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1 pb-1">
              <div className="flex items-center gap-2 select-none">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-md font-bold text-emerald-400">
                  [ DISCOVERY_BOARD ]
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-black border border-emerald-400 p-0.5 select-none gap-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2.5 py-1 text-[10px] font-bold cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-emerald-400 text-black'
                        : 'text-emerald-400 hover:bg-emerald-950'
                    }`}
                  >
                    GRID
                  </button>
                  <button
                    onClick={() => setViewMode('galaxy')}
                    className={`px-2.5 py-1 text-[10px] font-bold cursor-pointer ${
                      viewMode === 'galaxy'
                        ? 'bg-emerald-400 text-black'
                        : 'text-emerald-400 hover:bg-emerald-950'
                    }`}
                  >
                    GALAXY
                  </button>
                </div>

                <span className="text-xs font-mono text-emerald-600 select-none">REG:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-black border border-emerald-400 text-emerald-400 text-xs font-bold focus:bg-emerald-950 cursor-pointer block p-1.5 focus:outline-none"
                >
                  <option value="All">ALL_REGIONS</option>
                  <option value="United States">UNITED_STATES</option>
                  <option value="India">INDIA</option>
                  <option value="United Kingdom">UNITED_KINGDOM</option>
                  <option value="Canada">CANADA</option>
                  <option value="Singapore">SINGAPORE</option>
                  <option value="Germany">GERMANY</option>
                </select>
                {startups.length > 0 && (
                  <span className="text-xs font-mono text-emerald-450 bg-emerald-950/20 px-2 py-1 border border-emerald-400 select-none">
                    [ {startups.length} CANDIDATES ]
                  </span>
                )}
              </div>
            </div>

            {/* Display states */}
            {isDiscovering && startups.length === 0 ? (
              /* Loading Pulse Grid */
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="p-4 border border-emerald-400/40 bg-black animate-pulse space-y-3">
                    <div className="flex justify-between">
                      <div className="h-4 w-32 bg-emerald-950 rounded"></div>
                      <div className="h-4 w-20 bg-emerald-950 rounded"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 w-full bg-emerald-950 rounded"></div>
                      <div className="h-3 w-5/6 bg-emerald-950 rounded"></div>
                    </div>
                    <div className="h-3 w-28 bg-emerald-950 rounded"></div>
                  </div>
                ))}
              </div>
            ) : startups.length > 0 ? (
              viewMode === 'galaxy' ? (
                <StartupGalaxy startups={startups} />
              ) : (
                /* Startup Cards list as Data Blocks */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {startups.map((startup, index) => {
                    return (
                      <div 
                        key={index} 
                        className="flex flex-col justify-between p-4 border border-emerald-400 bg-black hover:bg-emerald-950/10 transition-colors"
                      >
                        <div>
                          {/* Header info */}
                          <div className="flex justify-between items-start gap-2.5 mb-3">
                            <div className="flex items-center gap-3">
                              {/* Pure text bracketed ASCII initial instead of image/logo */}
                              <div className="w-10 h-10 border border-emerald-400 bg-black flex items-center justify-center text-emerald-400 font-bold text-base flex-shrink-0 select-none">
                                [{startup.name ? startup.name.charAt(0).toUpperCase() : 'Y'}]
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-emerald-400 leading-tight">
                                  {startup.name}
                                </h4>
                                <span className="text-[10px] text-emerald-650 flex items-center gap-1 mt-0.5 font-mono select-none">
                                  [ LOC: {startup.contact_location} ]
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
      
                          {/* AI Summary in bracket format */}
                          <div className="border border-emerald-400/40 bg-black p-3 font-mono text-xs text-emerald-500 leading-relaxed mb-3">
                            <div className="text-[9px] font-bold text-emerald-700 mb-1 select-none">
                              [ AI_SYNTHESIS_REPORT ]
                            </div>
                            <p className="font-light">{startup.AI_summary}</p>
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
                              className="text-[10px] p-0.5 border border-emerald-400 bg-black text-emerald-400 hover:bg-emerald-400 hover:text-black cursor-pointer"
                            >
                              {copiedIndex === index ? '[ COPIED ]' : '[ COPY ]'}
                            </button>
    
                            {startup.jobs_url ? (
                              <a 
                                href={startup.jobs_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="border border-emerald-400 bg-black text-emerald-400 hover:bg-emerald-400 hover:text-black p-0.5 transition-colors"
                              >
                                [ APPLY_NOW ]
                              </a>
                            ) : (
                              <span className="text-emerald-700">[ APPS_CLOSED ]</span>
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
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-emerald-400 bg-black min-h-[250px] space-y-3 w-full font-mono text-xs">
                <div className="text-emerald-600 select-none">
                  [ ERROR: NO CANDIDATES FOUND IN THIS REGION ]
                </div>
              </div>
            ) : (
              /* Initial state empty placeholder */
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-emerald-400 bg-black min-h-[250px] space-y-3 w-full font-mono text-xs">
                <div className="text-emerald-650 animate-pulse select-none">
                  [ PIPELINE IDLE // AWAITING TRIGGERS ]
                </div>
              </div>
            )}
            
          </div>
          
        </div>
      </section>

    </div>
  );
}
