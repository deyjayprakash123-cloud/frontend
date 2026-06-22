import React, { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { ArrowRight, Cpu, Compass } from 'lucide-react';
import * as THREE from 'three';

// Highly performant floating zero-gravity geometric shards component
function AntigravityParticles({ count = 90 }) {
  const meshRef = useRef();

  // Initialize random positions, drift speeds, and rotations for each shard
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 32;
      // Start randomly distributed on Yaxis
      const y = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 16 - 6;

      // Drift upward speed (slow and graceful)
      const speedY = 0.006 + Math.random() * 0.015;

      // Small random rotation speed per axis
      const rotX = (Math.random() - 0.5) * 0.008;
      const rotY = (Math.random() - 0.5) * 0.008;
      const rotZ = (Math.random() - 0.5) * 0.008;

      // Random scale for shard sizing diversity
      const scale = 0.25 + Math.random() * 0.55;

      data.push({ x, y, z, speedY, rotX, rotY, rotZ, scale });
    }
    return data;
  }, [count]);

  // Object3D to temporary hold matrix transformations during iteration
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const elapsed = state.clock.getElapsedTime();

    particles.forEach((p, idx) => {
      // Float upward
      p.y += p.speedY;

      // If shard exits the top boundary, wrap it back to the bottom
      if (p.y > 13) {
        p.y = -13;
        p.x = (Math.random() - 0.5) * 32;
      }

      // Add a small sinus wave horizontal wiggle for floating fluidity
      const waveX = p.x + Math.sin(elapsed * 0.4 + idx) * 0.15;
      const waveZ = p.z + Math.cos(elapsed * 0.3 + idx) * 0.1;

      tempObject.position.set(waveX, p.y, waveZ);

      // Rotate shards slowly
      tempObject.rotation.x += p.rotX;
      tempObject.rotation.y += p.rotY;
      tempObject.rotation.z += p.rotZ;

      // Apply individual shard scale
      tempObject.scale.setScalar(p.scale);

      // Update transformation matrices
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(idx, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* Octahedrons give an aesthetic sharp crystal/shard outline */}
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color="#312e81"
        emissive="#1e1b4b"
        emissiveIntensity={0.25}
        roughness={0.08}
        metalness={0.92}
      />
    </instancedMesh>
  );
}

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden bg-black w-full select-none">
      
      {/* 3D Antigravity Canvas Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.25} />
          
          {/* Colored light streams for metallic reflections */}
          <pointLight position={[-15, 12, 8]} color="#4f46e5" intensity={3.5} />
          <pointLight position={[15, -12, 8]} color="#a855f7" intensity={3.5} />
          <pointLight position={[0, 15, -4]} color="#06b6d4" intensity={2.0} />
          
          {/* Ambient space dust */}
          <Stars radius={90} depth={40} count={1200} factor={3} saturation={0.3} fade speed={0.8} />

          <AntigravityParticles count={85} />
        </Canvas>
      </div>

      {/* Subtle background vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 pointer-events-none z-5"></div>
      
      {/* Glassmorphic Hero Overlay Content */}
      <div className="max-w-2xl px-6 py-12 md:py-16 mx-4 rounded-3xl border border-zinc-800/40 bg-zinc-950/45 backdrop-blur-xl text-center space-y-8 shadow-[0_0_50px_rgba(99,102,241,0.08)] pointer-events-auto relative z-10 hover:border-zinc-700/40 transition-all duration-500">
        
        {/* Core tech badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs font-semibold text-indigo-300 tracking-wide w-fit mx-auto shadow-inner">
          <Cpu className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
          ANTIGRAVITY DATA PIPELINE READY
        </div>

        {/* Hero Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Discover the{' '}
            <span className="block mt-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Next Generation
            </span>
            of Startups
          </h1>
          
          <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed font-light">
            An intelligence-driven index sourcing high-growth Y Combinator applicants, compiling codebase pulses, and synthesizing structural innovations using Gemini LLM layers.
          </p>
        </div>

        {/* CTA Link Button */}
        <div className="pt-2 flex justify-center">
          <Link
            to="/discover"
            className="group relative inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-550 active:bg-indigo-750 text-white font-bold text-sm md:text-base py-3.5 px-9 rounded-full shadow-lg shadow-indigo-650/20 hover:shadow-indigo-600/30 hover:scale-[1.03] transition-all duration-300 cursor-pointer border border-indigo-500/35"
          >
            Explore Startup Radar
            <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>

      {/* Decorative side HUD text details */}
      <div className="absolute bottom-6 left-6 pointer-events-none hidden md:block font-mono text-[9px] text-zinc-600 tracking-widest space-y-1 z-10">
        <div>CORE // SPACE_COGNITIVE_INTELLIGENCE</div>
        <div>SYS_STATUS // ACTIVE_ZERO_GRAVITY_DRIFT</div>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-none hidden md:block font-mono text-[9px] text-zinc-600 tracking-widest space-y-1 z-10 text-right">
        <div>BUILD // PLATFORM_VER_1.5.0</div>
        <div>FRAMEWORK // REACT_ROUTER_R3F</div>
      </div>

    </div>
  );
}
