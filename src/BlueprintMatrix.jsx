import React, { useState, useEffect } from 'react';
import { Terminal, Code, Cpu, AlertTriangle } from 'lucide-react';

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
      timer1 = setTimeout(() => {
        setLoadingStep(2);
      }, 2000);
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
    setBlueprint(null);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/blueprint?github_username=${username.trim()}`);
      const data = await response.json();

      if (response.ok) {
        if (data && data.error) {
          setError(data.error);
        } else {
          setBlueprint(data);
        }
      } else {
        setError(data.detail || "FAILED TO RESOLVE TARGET BluePrint TELEMETRY.");
      }
    } catch (err) {
      setError(`NETWORK DISRUPTION DETECTED: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-black text-emerald-400 select-none font-mono">
      
      {/* Page Header */}
      <section className="max-w-6xl mx-auto px-2 pt-6 pb-2 w-full space-y-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-emerald-400 pb-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-emerald-400 flex items-center gap-2" style={{ textShadow: '0 0 6px rgba(52, 211, 153, 0.4)' }}>
              &gt; DIAGNOSTIC_BLUEPRINT.SYS
            </h2>
            <p className="text-xs text-emerald-650 mt-1">
              Extract user language vectors from GitHub and map technical gap metrics against top hiring startups.
            </p>
          </div>
          <div className="text-xs font-mono px-2.5 py-1 bg-black text-emerald-400 border border-emerald-400">
            ENGINE // RESILIENCE_V4
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
              placeholder="e.g. octocat"
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
            [ EXECUTE: RUN_DIAGNOSTIC ]
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
              {loadingStep === 1 && <div>&gt; ANALYZING GITHUB REPOSITORIES...</div>}
              {loadingStep === 2 && <div>&gt; CROSS-REFERENCING GLOBAL NODES...</div>}
            </div>
          </div>
        )}

        {/* Blueprint Matrix Output */}
        {!isAnalyzing && blueprint && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-xs font-bold text-emerald-650 tracking-wider">
              &gt; UPLINK COMPLETED. TELEMETRY DECODED. {blueprint.length} MATCH NODES ACTIVE.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {blueprint.map((item, index) => {
                const isHighMatch = item.match_percentage >= 80;
                const matchColorClass = isHighMatch ? 'text-emerald-400' : 'text-amber-500';
                const matchBorderClass = isHighMatch ? 'border-emerald-400' : 'border-amber-500/70';
                const matchShadow = isHighMatch ? '0 0 8px rgba(52, 211, 153, 0.4)' : '0 0 8px rgba(245, 158, 11, 0.3)';

                return (
                  <div
                    key={index}
                    className={`relative flex flex-col justify-between p-4 border bg-black transition-all ${matchBorderClass}`}
                  >
                    {/* Sharp 90-degree corner joints */}
                    <span className={`absolute top-0 left-0 -translate-x-[1px] -translate-y-[4px] font-bold bg-black leading-none z-10 ${matchColorClass}`}>+</span>
                    <span className={`absolute top-0 right-0 translate-x-[1px] -translate-y-[4px] font-bold bg-black leading-none z-10 ${matchColorClass}`}>+</span>
                    <span className={`absolute bottom-0 left-0 -translate-x-[1px] translate-y-[4px] font-bold bg-black leading-none z-10 ${matchColorClass}`}>+</span>
                    <span className={`absolute bottom-0 right-0 translate-x-[1px] translate-y-[4px] font-bold bg-black leading-none z-10 ${matchColorClass}`}>+</span>

                    <div className="space-y-4">
                      {/* Startup Name & Match score */}
                      <div className="flex justify-between items-start gap-2.5">
                        <h4 className="text-sm font-bold text-emerald-400 tracking-tight leading-tight">
                          {item.startup_name}
                        </h4>
                        <div className="text-right">
                          <div 
                            className={`text-lg font-bold ${matchColorClass}`} 
                            style={{ textShadow: matchShadow }}
                          >
                            {item.match_percentage}%
                          </div>
                          <span className="text-[8px] text-emerald-700 font-mono">MATCH_RATE</span>
                        </div>
                      </div>

                      {/* Matching skills vectors */}
                      <div className="text-xs font-mono">
                        <span className="text-emerald-500 font-bold block mb-1">[ MATCHED_VECTORS ]</span>
                        <div className="flex flex-wrap gap-1">
                          {item.matching_skills && item.matching_skills.length > 0 ? (
                            item.matching_skills.map((skill, idx) => (
                              <span key={idx} className="text-emerald-400 font-bold">[ {skill} ]</span>
                            ))
                          ) : (
                            <span className="text-emerald-700">[ NONE ]</span>
                          )}
                        </div>
                      </div>

                      {/* Infrastructure Depth Deep-Scan Metric */}
                      <div className="text-xs font-mono border border-emerald-500/30 p-2 bg-emerald-950/10">
                        <span className="text-emerald-300 font-bold block mb-1" style={{ textShadow: '0 0 8px rgba(0, 255, 0, 0.8)' }}>
                          &gt; INFRASTRUCTURE_DEPTH:
                        </span>
                        <span className="text-emerald-100 leading-normal" style={{ textShadow: '0 0 8px rgba(0, 255, 0, 0.8)' }}>
                          {item.infrastructure_depth ? item.infrastructure_depth : "[ BASIC_TELEMETRY_LOG ]"}
                        </span>
                      </div>

                      {/* Proof Nodes UI */}
                      <div className="text-xs font-mono">
                        <span className="text-emerald-600 font-bold block mb-1">&gt; PROOF_NODES:</span>
                        <div className="flex flex-wrap gap-1.5 min-h-[1.25rem]">
                          {item.proof_repos && item.proof_repos.length > 0 ? (
                            item.proof_repos.map((repo, idx) => (
                              <a
                                key={idx}
                                href={`https://github.com/${username.trim()}/${repo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 font-bold hover:underline cursor-pointer transition-all duration-100"
                                style={{
                                  textShadow: '0 0 4px rgba(52, 211, 153, 0.6)'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.color = '#34d399';
                                  e.target.style.textShadow = '0 0 8px rgba(52, 211, 153, 0.9)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = '';
                                  e.target.style.textShadow = '0 0 4px rgba(52, 211, 153, 0.6)';
                                }}
                              >
                                [{repo}]
                              </a>
                            ))
                          ) : (
                            <span className="text-emerald-800">[ NONE_DETECTED ]</span>
                          )}
                        </div>
                      </div>

                      {/* Missing skills vectors */}
                      <div className="text-xs font-mono">
                        <span className="text-amber-500 font-bold block mb-1">[ MISSING_VECTORS ]</span>
                        <div className="flex flex-wrap gap-1">
                          {item.missing_skills && item.missing_skills.length > 0 ? (
                            item.missing_skills.map((skill, idx) => (
                              <span key={idx} className="text-amber-500 font-bold">[ {skill} ]</span>
                            ))
                          ) : (
                            <span className="text-emerald-700">[ NONE ]</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Diagnostic log note */}
                    <div className="border-t border-emerald-400/30 pt-3 mt-4 text-[10px] font-mono text-emerald-600 leading-normal">
                      &gt; SYSTEM_NOTE: {item.diagnostic_log}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Initial Empty Placeholder State */}
        {!isAnalyzing && !blueprint && !error && (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-emerald-400 bg-black min-h-[300px] space-y-3">
            <Terminal className="w-8 h-8 text-emerald-400/70" />
            <div className="text-emerald-750 text-xs tracking-wider animate-pulse">
              [ SYSTEM STANDING BY // AWAITING PROFILE DIAGNOSTIC TRIGGER ]
            </div>
          </div>
        )}

      </section>

    </div>
  );
}
