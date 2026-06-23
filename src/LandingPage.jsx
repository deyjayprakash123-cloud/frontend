import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BOOT_LOGS = [
  "[OK] INITIALIZING BOOT SEQUENCER COMPLETED.",
  "[OK] DETECTED RETRO STACK ENGINE COMPATIBILITY...",
  "[OK] LOADED COSMOS MATRIX COORDINATES...",
  "[OK] SYNCING ARCHIVES DEYJAYPRAKASH123-CLOUD/PROFILE...",
  "[OK] CONNECTED TO STREAM // HACKER_NEWS_SSE_FIREBASE",
  "[OK] UPLINK ONLINE // INTEL_LAYER_GEMINI_3.5",
  "[SYSTEM] ALL RADAR SYSTEMS STANDING BY."
];

const ASCII_ART = `
 _     _   _   _  _   _  ____ _   _    ___  _   _ _____ ____  _____   _    ____ _   _ 
| |   / \\ | | | | | \\ | |/ ___| | | |  / _ \\| | | |_   _|  _ \\| ____| / \\  / ___| | | |
| |  / _ \\| | | | |  \\| | |   | |_| | | | | | | | | | | | |_) |  _|  / _ \\| |   | |_| |
| |_/ ___ \\ |_| | | |\\  | |___|  _  | | |_| | |_| | | | |  _ <| |___/ ___ \\ |___|  _  |
|____/_/   \\_\\___/|_| \\_|\\____|_| |_|  \\___/\\___/  |_| |_| \\_\\_____/_/   \\_\\____|_| |_|
`;

export default function LandingPage() {
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  // Line-by-line typing sequence simulation
  useEffect(() => {
    if (currentLineIndex >= BOOT_LOGS.length) {
      setTypingComplete(true);
      return;
    }

    const targetLine = BOOT_LOGS[currentLineIndex];
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < targetLine.length) {
        setCurrentText((prev) => prev + targetLine.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        setVisibleLines((prev) => [...prev, targetLine]);
        setCurrentText("");
        setCurrentLineIndex((prev) => prev + 1);
      }
    }, 20); // speedy typing for console authenticity

    return () => clearInterval(interval);
  }, [currentLineIndex]);

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden bg-black w-full select-none font-mono">
      
      {/* 2D Scrolling Grid Background (Pure CSS - replaces 3D Canvas) */}
      <div 
        className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 255, 65, 0.1) 25%, rgba(0, 255, 65, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, 0.1) 75%, rgba(0, 255, 65, 0.1) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(0, 255, 65, 0.1) 25%, rgba(0, 255, 65, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, 0.1) 75%, rgba(0, 255, 65, 0.1) 76%, transparent 77%)',
          backgroundSize: '50px 50px',
          animation: 'scrollGrid 20s linear infinite',
        }}
      ></div>

      {/* Screen Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/90 pointer-events-none z-5"></div>
      
      {/* Brutalist Console Overlay Container */}
      <div className="w-full max-w-3xl px-6 py-10 mx-4 border border-emerald-400 bg-black pointer-events-auto relative z-10 space-y-6 flex flex-col items-center">
        
        {/* Large Retro ASCII Banner */}
        <pre className="text-[6px] sm:text-[8px] md:text-[9px] leading-tight text-emerald-400 font-bold overflow-x-auto whitespace-pre w-full text-center scrollbar-none select-none">
          {ASCII_ART}
        </pre>

        {/* Boot sequence logs terminal */}
        <div className="font-mono text-left space-y-1 w-full max-w-xl bg-black p-4 border border-emerald-400/40 h-48 overflow-y-auto">
          {visibleLines.map((line, idx) => (
            <div key={idx} className="text-emerald-400 text-xs leading-relaxed">
              {line}
            </div>
          ))}
          {!typingComplete && (
            <div className="text-emerald-400 text-xs leading-relaxed flex items-center">
              {currentText}
              <span className="w-2 h-4 bg-emerald-400 inline-block animate-[blink_0.8s_infinite] ml-1"></span>
            </div>
          )}
        </div>

        {/* Console CTA Button Prompt */}
        {typingComplete && (
          <div className="pt-2 w-full max-w-xl text-left">
            <Link
              to="/discover"
              className="group inline-flex items-center gap-1.5 bg-black text-emerald-400 border border-emerald-400 py-3.5 px-8 font-bold text-xs tracking-widest cursor-pointer select-none hover:bg-emerald-400 hover:text-black transition-none"
            >
              <span>&gt; ./initialize_radar.sh</span>
              <span className="animate-[blink_1.1s_infinite] font-black text-sm">_</span>
            </Link>
          </div>
        )}

      </div>

      {/* Retro telemetry indicators */}
      <div className="absolute bottom-6 left-6 pointer-events-none hidden md:block font-mono text-[9px] text-emerald-650 tracking-widest space-y-1 z-10">
        <div>CONSOLE // VT100_PHOSPHOR_GREEN</div>
        <div>SCAN_FREQ // 60HZ_CRT_OVERLAY</div>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-none hidden md:block font-mono text-[9px] text-emerald-650 tracking-widest space-y-1 z-10 text-right">
        <div>TERMINAL // INTEL_BOOT_COMPLETE</div>
        <div>UPLINK_BANDWIDTH // REAL_TIME_SSE</div>
      </div>

      {/* Blinking cursor custom styling helper */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes scrollGrid {
          0% { background-position: 0 0; }
          100% { background-position: 0 500px; }
        }
      `}</style>

    </div>
  );
}
