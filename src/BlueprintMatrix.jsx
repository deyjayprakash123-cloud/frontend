import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, AlertTriangle } from 'lucide-react';

const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://link-backend-o76j.onrender.com';

export default function BlueprintMatrix() {
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [blueprint, setBlueprint] = useState(null);
  const [error, setError] = useState(null);

  // Simulated typing sequence for loading state
  useEffect(() => {
    let timer1, timer2;
    if (isAnalyzing) {
      setLoadingStep(1);
      timer1 = setTimeout(() => setLoadingStep(2), 2000);
      timer2 = setTimeout(() => setLoadingStep(3), 4500);
    } else {
      setLoadingStep(0);
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isAnalyzing]);

  const handleRunDiagnostic = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setError("GITHUB ALIAS VALUE INVALID. ENTER A VALID USERNAME.");
      return;
    }

    setIsAnalyzing(true);
    setBlueprint([]);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/blueprint?github_username=${username.trim()}`);
      const data = await response.json();

      if (response.ok) {
        if (data && data.error) {
          setError(data.error);
        } else {
          setBlueprint(data.blueprint || []);
        }
      } else {
        setError(data.detail || "FAILED TO RESOLVE TARGET BLUEPRINT TELEMETRY.");
      }
    } catch (err) {
      setError(`NETWORK DISRUPTION DETECTED: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleShareToX = () => {
    const shareUrl = window.location.href;
    const text = `Just mapped my GitHub stack against live open-source opportunities from top YC startups using the Global Radar OSS Backdoor Engine. Find your entry point: ${shareUrl}`;
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterIntentUrl, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-black text-emerald-400 select-none font-mono">

      {/* Page Header */}
      <section className="max-w-6xl mx-auto px-2 pt-6 pb-2 w-full space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-emerald-400 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-400 flex items-center gap-2" style={{ textShadow: '0 0 6px rgba(52, 211, 153, 0.4)' }}>
              &gt; OSS_BACKDOOR_ENGINE.SYS
            </h2>
            <p className="text-xs text-emerald-650 mt-1">
              Scan your GitHub stack. Surface live "good first issue" entry points from real YC startups.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareToX}
              className="px-3 py-1.5 border border-emerald-400 text-[10px] font-bold text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all duration-100 cursor-pointer"
            >
              [ SHARE_TO_X ]
            </button>
            <div className="text-xs font-mono px-2.5 py-1 bg-black text-emerald-400 border border-emerald-400">
              ENGINE // OSS_BACKDOOR_V5
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="max-w-6xl mx-auto px-2 py-4 w-full flex-1 space-y-6">

        {/* Terminal Input Block */}
        <div className="border border-emerald-400 p-4 bg-black flex flex-wrap items-center justify-between gap-4 relative">
          {/* Sharp 90-degree corner joints */}
          <span className="absolute top-0 left-0 -translate-x-[1px] -translate-y-[4px] text-emerald-400 font-bold bg-black leading-none z-10">+</span>
          <span className="absolute top-0 right-0 translate-x-[1px] -translate-y-[4px] text-emerald-400 font-bold bg-black leading-none z-10">+</span>
          <span className="absolute bottom-0 left-0 -translate-x-[1px] translate-y-[4px] text-emerald-400 font-bold bg-black leading-none z-10">+</span>
          <span className="absolute bottom-0 right-0 translate-x-[1px] translate-y-[4px] text-emerald-400 font-bold bg-black leading-none z-10">+</span>

          <form onSubmit={handleRunDiagnostic} className="flex items-center gap-1.5 flex-1">
            <span className="text-xs md:text-sm font-bold text-emerald-400">&gt; ENTER GITHUB ALIAS: [</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. torvalds"
              disabled={isAnalyzing}
              className="bg-transparent border-none outline-none text-emerald-400 font-bold font-mono text-xs md:text-sm w-36 md:w-48 placeholder-emerald-900 focus:text-emerald-300"
            />
            <span className="text-xs md:text-sm font-bold text-emerald-400">]</span>
          </form>

          <button
            onClick={handleRunDiagnostic}
            disabled={isAnalyzing}
            className={`px-5 py-2.5 border text-xs font-bold tracking-wider transition-all duration-100 cursor-pointer ${
              isAnalyzing
                ? 'bg-black text-emerald-600 border-emerald-700 animate-pulse cursor-wait'
                : 'bg-black text-emerald-400 border-emerald-400 hover:bg-emerald-400 hover:text-black'
            }`}
          >
            [ EXECUTE: SCAN_OSS_BACKDOOR ]
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="border border-red-500 p-4 bg-black text-red-500 text-xs flex items-center gap-2 select-none relative animate-pulse font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>&gt; FATAL_ERROR: [{error}]</span>
          </div>
        )}

        {/* Diagnostic Loading States */}
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-emerald-400 bg-black min-h-[300px] space-y-4">
            <Cpu className="w-8 h-8 text-emerald-400 animate-spin" />
            <div className="text-emerald-400 text-sm font-bold animate-pulse space-y-1.5">
              {loadingStep === 1 && <div>&gt; SCANNING GITHUB REPOSITORIES...</div>}
              {loadingStep === 2 && <div>&gt; RESOLVING STARTUP ORG NODES...</div>}
              {loadingStep === 3 && <div>&gt; QUERYING LIVE OSS ISSUES...</div>}
            </div>
          </div>
        )}

        {/* Blueprint Matrix Output */}
        {!isAnalyzing && blueprint && blueprint.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-xs font-bold text-emerald-650 tracking-wider">
              &gt; UPLINK COMPLETED. {blueprint.length} LIVE CONTRIBUTION NODES IDENTIFIED.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blueprint.map((item, index) => {
                const hasIssues = item.live_issues && item.live_issues.length > 0;

                return (
                  <div
                    key={index}
                    className="relative flex flex-col p-4 border bg-black transition-all border-emerald-400"
                  >
                    {/* Sharp 90-degree corner joints */}
                    <span className="absolute top-0 left-0 -translate-x-[1px] -translate-y-[4px] font-bold bg-black leading-none z-10 text-emerald-400">+</span>
                    <span className="absolute top-0 right-0 translate-x-[1px] -translate-y-[4px] font-bold bg-black leading-none z-10 text-emerald-400">+</span>
                    <span className="absolute bottom-0 left-0 -translate-x-[1px] translate-y-[4px] font-bold bg-black leading-none z-10 text-emerald-400">+</span>
                    <span className="absolute bottom-0 right-0 translate-x-[1px] translate-y-[4px] font-bold bg-black leading-none z-10 text-emerald-400">+</span>

                    <div className="space-y-4 flex-1">
                      {/* Startup Name */}
                      <div className="border-b border-emerald-500/30 pb-2">
                        <h4 className="text-sm font-bold text-emerald-400 tracking-tight leading-tight" style={{ textShadow: '0 0 6px rgba(52, 211, 153, 0.4)' }}>
                          &gt; TARGET: {item.startup_name}
                        </h4>
                      </div>

                      {/* Startup Description */}
                      {item.startup_description && (
                        <p className="text-[11px] text-emerald-500/80 leading-normal line-clamp-3 italic">
                          {item.startup_description}
                        </p>
                      )}

                      {/* OPEN_SOURCE_BACKDOOR: LIVE_CONTRIBUTION_GATE */}
                      <div className="text-xs font-mono border border-dashed border-emerald-500/60 p-3 bg-black/60 space-y-2.5">
                        <span
                          className="text-emerald-400 font-bold block"
                          style={{ textShadow: '0 0 4px rgba(52, 211, 153, 0.6)' }}
                        >
                          [ OPEN_SOURCE_BACKDOOR: LIVE_CONTRIBUTION_GATE ]
                        </span>

                        <div className="space-y-2">
                          {hasIssues ? (
                            item.live_issues.map((issue, idx) => (
                              <div key={idx} className="text-[11px] flex flex-col gap-0.5">
                                <div className="flex items-start gap-1">
                                  <span className="text-emerald-600 shrink-0">&gt; LIVE_ISSUE:</span>
                                  <a
                                    href={issue.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-300 font-bold hover:text-emerald-100 hover:underline cursor-pointer leading-tight"
                                    style={{ textShadow: '0 0 4px rgba(52, 211, 153, 0.5)' }}
                                  >
                                    {issue.title}
                                  </a>
                                </div>
                                {issue.repo_name && (
                                  <span className="text-emerald-700 text-[10px] pl-4">
                                    REPO: {issue.repo_name}
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-[11px] text-amber-500/80 flex items-start gap-1">
                              <span>&gt; NO_ACTIVE_ISSUES_FOUND:</span>
                              <a
                                href={`https://github.com/search?q=label%3A%22good+first+issue%22&state=open&type=Issues`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-400 font-bold hover:underline cursor-pointer"
                              >
                                [BROWSE_ALL_GOOD_FIRST_ISSUES]
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Action Plan Directive */}
                        {item.action_plan && (
                          <div className="text-[11px] leading-relaxed border-t border-emerald-500/20 pt-2">
                            <span className="text-emerald-600 font-bold block mb-0.5">&gt; DIRECTIVE_ACTION_PLAN:</span>
                            <span className="text-emerald-100 font-bold" style={{ textShadow: '0 0 6px rgba(52, 211, 153, 0.4)' }}>
                              {item.action_plan}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Initial Empty Placeholder State */}
        {!isAnalyzing && (!blueprint || blueprint.length === 0) && !error && (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-emerald-400 bg-black min-h-[300px] space-y-3">
            <Terminal className="w-8 h-8 text-emerald-400/70" />
            <div className="text-emerald-750 text-xs tracking-wider animate-pulse">
              [ SYSTEM STANDING BY // AWAITING GITHUB PROFILE SCAN ]
            </div>
            <div className="text-[10px] text-emerald-800 tracking-wide max-w-sm leading-relaxed">
              Enter your GitHub username to scan your stack and surface live "good first issue" entry points at top YC startups.
            </div>
          </div>
        )}

      </section>

    </div>
  );
}
