import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';

// Infinite scrolling 3D wireframe grid floor component
function InfiniteGrid() {
  const gridRef = useRef();

  useFrame((state) => {
    if (gridRef.current) {
      // Cell spacing = 2 units (size 120 / divisions 60).
      // Modulo 2 z-translation creates a seamless infinite scroll loop.
      const scrollSpeed = 3.2;
      gridRef.current.position.z = (state.clock.getElapsedTime() * scrollSpeed) % 2;
    }
  });

  return (
    <group ref={gridRef}>
      <gridHelper 
        args={[120, 60, '#00ff41', '#002b0c']} 
        position={[0, -4.5, 0]} 
      />
    </group>
  );
}

const BOOT_LOGS = [
  "[OK] INITIALIZING BOOT SEQUENCER COMPLETED.",
  "[OK] DETECTED R3F WEBGL DEVICE HARDWARE...",
  "[OK] LOADED COSMOS MATRIX COORDINATES (minDistance = 5.0)...",
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
    <div className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden bg-black w-full select-none">
      
      {/* 3D Tilted Wireframe Grid Floor with Horizon Fog */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 1.5, 9], fov: 60 }}>
          <color attach="background" args={['#000000']} />
          {/* Horizon black fog masks line edges */}
          <fog attach="fog" args={['#000000', 4, 18]} />
          
          <ambientLight intensity={0.5} />
          <InfiniteGrid />
        </Canvas>
      </div>

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
      `}</style>

    </div>
  );
}
