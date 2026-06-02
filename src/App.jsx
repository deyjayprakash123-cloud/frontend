import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowDown, 
  Terminal, 
  Copy, 
  Check, 
  BookOpen, 
  Cpu, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  Layers,
  Globe,
  Compass,
  Code,
  RefreshCw,
  Briefcase,
  MapPin
} from 'lucide-react';

// Technical configuration required by user
const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://link-backend-o76j.onrender.com';

export default function App() {
  // Console Log state
  const [logs, setLogs] = useState([
    { text: '// Discovery Engine ready. Operational Console standing by.', type: 'info' },
  ]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [startups, setStartups] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [logoErrors, setLogoErrors] = useState({});

  // References
  const workspaceRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Smooth scroll to operational workspace
  const handleScrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    
    // Clear logs and push initiation logs
    setLogs([
      { text: '// Initializing YC Startup Discovery Pipeline...', type: 'info', time: new Date().toLocaleTimeString() }
    ]);

    // Simulated log timeline to make it feel extremely interactive
    const logSteps = [
      { text: 'Connecting to live Y Combinator Open Source Index...', delay: 600, type: 'info' },
      { text: 'Downloading database payload from yc-oss.github.io...', delay: 1400, type: 'info' },
      { text: 'Filtering list for Active startups (Status: "Active")...', delay: 2400, type: 'info' },
      { text: 'Sieving priority technology sectors: AI, Robotics, and Dev Tools...', delay: 3500, type: 'info' },
      { text: 'Selecting 5 dynamic candidates and running Gemini 3.1 Flash-Lite engine...', delay: 4800, type: 'success' }
    ];

    logSteps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, { text: step.text, type: step.type, time: new Date().toLocaleTimeString() }]);
      }, step.delay);
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/discover-startups`);
      const data = await response.json();

      setTimeout(() => {
        if (response.ok) {
          setStartups(data);
          setLogs((prev) => [
            ...prev,
            { text: `Successfully discovered and analyzed ${data.length} startups!`, type: 'success', time: new Date().toLocaleTimeString() },
            ...data.map(s => ({
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-indigo-500/[0.04] blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[800px] right-10 w-[400px] h-[400px] bg-purple-500/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 py-16 text-center border-b border-zinc-900/80">
        <div className="max-w-4xl mx-auto space-y-8 select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-lg text-xs font-semibold text-zinc-300 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            INTELLIGENT Y COMBINATOR DIRECTORY SEARCH
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent animate-gradient-shift">
              YC Discovery Engine
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            Sourcing active Y Combinator startups, prioritizing advanced technology sectors, and generating AI-powered engineering breakdowns.
          </p>

          <div className="pt-6">
            <button 
              onClick={handleScrollToWorkspace}
              className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-base py-3.5 px-8 rounded-full shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Enter Workspace
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. DOCUMENTATION & SYSTEM UTILITIES SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-20 w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
            System Architecture
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            A look under the hood of the integration layer connecting discovery pipelines with LLM analyzers.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card A */}
          <div className="glow-border relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:scale-[1.01] hover:border-zinc-700/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200">YC Directory Scraping</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                The engine polls the open-source Y Combinator index to find active companies instantly and securely.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600">ENDPOINT // PUBLIC_INDEX</div>
          </div>

          {/* Card B */}
          <div className="glow-border relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:scale-[1.01] hover:border-zinc-700/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200">Gemini 3.1 Flash-Lite Engine</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Leverages Google's most efficient, token-light multimodal model to generate clean 2-sentence technical innovations.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600">MODEL // GEMINI_3.1_FLASH_LITE</div>
          </div>

          {/* Card C */}
          <div className="glow-border relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:scale-[1.01] hover:border-zinc-700/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200">Intelligent Sieve Filtering</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Filters and partitions YC company entries dynamically to prioritize core categories like AI, Robotics, and Developer Tools.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600">FILTER // TECH_SECTORS</div>
          </div>

        </div>
      </section>

      {/* 3. OPERATIONAL WORKSPACE SECTION */}
      <section 
        ref={workspaceRef} 
        className="max-w-6xl mx-auto px-4 py-20 w-full space-y-10 scroll-mt-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
              Discovery Dashboard
            </h2>
            <p className="text-sm text-zinc-400">
              Query active YC companies and generate AI-powered technical breakdowns of their engineering innovations.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
            DISCOVERY_API // {BACKEND_URL}/api/discover-startups
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls & Console Logs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Control Panel */}
            <div className="flex flex-col p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-zinc-200">
                  Pipeline Controls
                </h3>
                <p className="text-xs text-zinc-400">
                  Trigger YC index scraping and Gemini synthesis.
                </p>
              </div>

              {/* Action trigger */}
              <button
                onClick={handleDiscoverStartups}
                disabled={isDiscovering}
                className={`w-full group inline-flex items-center justify-center gap-2.5 font-semibold py-3.5 px-5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  isDiscovering 
                    ? 'bg-indigo-800/40 text-indigo-300 border border-indigo-500/30 animate-pulse cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10 hover:scale-[1.01]'
                }`}
              >
                <Compass className={`w-4 h-4 ${isDiscovering ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
                <span>{isDiscovering ? 'Hunting Startups...' : '🔍 Hunt YC Startups'}</span>
              </button>
            </div>

            {/* Terminal Logs Panel */}
            <div className="flex flex-col p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  discovery_stream.log
                </span>
                <button 
                  onClick={handleClearLogs}
                  className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
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
            <div className="flex justify-between items-center px-1">
              <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Discovery Board
              </h3>
              {startups.length > 0 && (
                <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 animate-pulse">
                  5 Candidates Analyzed
                </span>
              )}
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
              /* Startup Cards list */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {startups.map((startup, index) => {
                  const hasLogo = startup.logo && !logoErrors[index];
                  return (
                    <div 
                      key={index} 
                      className="group relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700/80 transition-all duration-300 hover:scale-[1.01] shadow-xl backdrop-blur-md"
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
                              <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-indigo-500/70" />
                                {startup.contact_location}
                              </span>
                            </div>
                          </div>
                          
                          {/* Badges block */}
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 whitespace-nowrap">
                              {startup.batch}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap shadow-sm">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                              🔥 Hiring/Active
                            </span>
                          </div>
                        </div>
    
                        {/* AI Summary */}
                        <div className="relative rounded-xl border border-zinc-800/50 bg-black/35 p-4 font-sans text-sm text-zinc-300 leading-relaxed mb-4">
                          <div className="absolute top-4 left-4 text-indigo-500/30">
                            <Code className="w-4 h-4" />
                          </div>
                          <p className="pl-6 font-light">{startup.AI_summary}</p>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-zinc-900/40 mt-auto">
                        {startup.website ? (
                          <a 
                            href={startup.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-indigo-400 transition-colors font-medium hover:underline"
                          >
                            <span>🌐 Visit Main Website</span>
                          </a>
                        ) : (
                          <span className="text-xs text-zinc-600">No website</span>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopySummary(startup.AI_summary, index)}
                            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors py-2 px-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800"
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
                              className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 transition-all duration-200 py-2 px-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:scale-[1.02] border border-indigo-500/30"
                            >
                              <span>💼 Apply to Startup</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-zinc-500">Applications Closed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty state placeholder */
              <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/5 min-h-[300px] space-y-4">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
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

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-12 mt-auto border-t border-zinc-900 text-center text-xs text-zinc-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 YC Discovery Engine Systems. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">API Docs</a>
        </div>
      </footer>

    </div>
  );
}
