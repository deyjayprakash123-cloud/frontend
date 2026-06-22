import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// Subcomponent to handle the automated cinematic camera fly-through
function CameraController({ controlsRef }) {
  const { camera } = useThree();
  const isUserInteracting = useRef(false);
  const lastInteractionTime = useRef(0);

  useEffect(() => {
    const handleInteractionStart = () => {
      isUserInteracting.current = true;
    };

    const handleInteractionEnd = () => {
      isUserInteracting.current = false;
      lastInteractionTime.current = Date.now();
    };

    // Attach listeners to OrbitControls
    const controls = controlsRef.current;
    if (controls) {
      controls.addEventListener('start', handleInteractionStart);
      controls.addEventListener('end', handleInteractionEnd);

      return () => {
        controls.removeEventListener('start', handleInteractionStart);
        controls.removeEventListener('end', handleInteractionEnd);
      };
    }
  }, [controlsRef]);

  useFrame((state) => {
    const now = Date.now();

    // Do not interfere if user is actively panning or zooming
    if (isUserInteracting.current) {
      return;
    }

    // Keep camera static for 5 seconds after manual mouse movement ends
    if (now - lastInteractionTime.current < 5000) {
      return;
    }

    const time = state.clock.getElapsedTime() * 0.03; // extremely slow cinematic drift

    // Calculate a slow circular orbital drift path
    const targetX = Math.sin(time) * 25;
    const targetZ = Math.cos(time) * 25;
    const targetY = Math.sin(time * 0.4) * 5 + 6;

    // Smoothly interpolate (lerp) camera position
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.008);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.008);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.008);

    // Smoothly pan OrbitControls target back to center of galaxy (0, 0, 0)
    if (controlsRef.current) {
      controlsRef.current.target.x = THREE.MathUtils.lerp(controlsRef.current.target.x, 0, 0.015);
      controlsRef.current.target.y = THREE.MathUtils.lerp(controlsRef.current.target.y, 0, 0.015);
      controlsRef.current.target.z = THREE.MathUtils.lerp(controlsRef.current.target.z, 0, 0.015);
      controlsRef.current.update();
    }
  });

  return null;
}

// Subcomponent for each individual startup node
function StartupNode({ startup, position, index }) {
  const [hovered, setHovered] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const sphereRef = useRef();
  const haloRef = useRef();

  // Retrieve values from data structure
  const stars = startup.github_pulse?.stargazers_count || 0;
  const issues = startup.github_pulse?.open_issues_count || 0;

  // 1. Calculate node size: Map stargazers_count to node radius (using logarithmic scale)
  const radius = useMemo(() => {
    if (stars <= 0) return 0.5;
    // Cap at log10(100k) = 5. Radius ranges from 0.5 to 2.25
    return 0.5 + Math.min(Math.log10(stars), 5) * 0.35;
  }, [stars]);

  // 2. Select node base color: green phosphor to simulate classic retro CRT terminals
  const nodeColor = '#00ff41';

  // 3. Map open_issues_count to pulse speed and color (Red = high open issues, Amber = med, Green = low)
  const pulseColor = useMemo(() => {
    if (issues > 50) return '#ff3b30'; // Red
    if (issues > 15) return '#ffb000'; // Amber
    return '#00ff41'; // Green
  }, [issues]);

  const pulseSpeed = useMemo(() => {
    // Scales speed from 1.2x to 5.2x depending on issues count
    return 1.2 + Math.min(issues, 80) * 0.05;
  }, [issues]);

  // Animate sphere rotation and the outer pulsing halo
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.006;
    }

    if (haloRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const t = elapsed * pulseSpeed;

      // Pulse size oscillations: expands from 1.15 to 1.75 times node radius
      const scaleVal = radius * (1.15 + Math.sin(t * 2.5) * 0.3);
      haloRef.current.scale.set(scaleVal, scaleVal, scaleVal);

      // Pulse opacity fades out near maximum scale expansion
      if (haloRef.current.material) {
        haloRef.current.material.opacity = 0.45 * (1 - (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.55);
      }
    }
  });

  return (
    <group position={position}>
      {/* 3D Sphere Planet Node */}
      <mesh
        ref={sphereRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={hovered ? 2.5 : 0.9}
          wireframe={true}
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* Glowing Pulsing Halo (Billboarded transparent ring) */}
      <Billboard follow={true}>
        <mesh ref={haloRef}>
          <ringGeometry args={[0, 1.2, 32]} />
          <meshBasicMaterial
            color={pulseColor}
            transparent={true}
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Billboard>

      {/* Retro-Futuristic Terminal On-Hover HTML Tooltip */}
      {hovered && (
        <Html
          distanceFactor={16} // dynamic scaling based on camera distance
          position={[0, radius + 1.2, 0]}
          center
          className="pointer-events-none select-none z-50 font-mono"
        >
          <div className="flex items-center gap-3 bg-black border border-emerald-400 px-4 py-3 min-w-[210px] text-emerald-400 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
            <div className="w-10 h-10 border border-emerald-400 bg-black flex items-center justify-center text-emerald-400 font-bold text-base flex-shrink-0 select-none">
              [{startup.name ? startup.name.charAt(0).toUpperCase() : 'Y'}]
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold truncate leading-tight">
                {startup.name}
              </h5>
              <p className="text-[9px] text-emerald-600 mt-0.5">
                [ BATCH: {startup.batch} ]
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[9px] text-emerald-400 bg-black py-0.5 px-1.5 border border-emerald-400/40 w-fit">
                <span>⭐ {stars.toLocaleString()}</span>
                <span>•</span>
                <span className={issues > 25 ? 'text-red-500 font-bold' : ''}>
                  🚨 {issues.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Main Startup Galaxy Component
export default function StartupGalaxy({ startups }) {
  const controlsRef = useRef();

  // Compute non-overlapping double-spiral galaxy coordinates
  const nodePositions = useMemo(() => {
    if (!startups || startups.length === 0) return [];
    
    const positions = [];
    const minDistance = 5.0; // Ensures nodes never overlap in 3D space
    const total = startups.length;

    for (let i = 0; i < total; i++) {
      let position = [0, 0, 0];
      let attempts = 0;
      let tooClose = true;

      while (tooClose && attempts < 150) {
        tooClose = false;
        // Map linearly from 0 to 1
        const t = total === 1 ? 0 : i / (total - 1);
        const arm = i % 2;
        
        // Compute spiral coordinates wrapping 3.5 times
        const theta = t * Math.PI * 3.5 + (arm * Math.PI);
        const r = 4 + t * 16; // spiral radial range

        // Jitter/Dispersion that thickens near the outer rim of the galaxy arms
        const spread = 0.8 + t * 1.8;
        const x = Math.cos(theta) * r + (Math.random() - 0.5) * spread;
        const z = Math.sin(theta) * r + (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * (1.2 + t * 2.5); // height variance

        position = [x, y, z];

        // Check distance to all previously positioned nodes
        for (const pos of positions) {
          const dx = position[0] - pos[0];
          const dy = position[1] - pos[1];
          const dz = position[2] - pos[2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < minDistance) {
            tooClose = true;
            break;
          }
        }
        attempts++;
      }
      positions.push(position);
    }
    return positions;
  }, [startups]);

  return (
    <div className="w-full h-[600px] overflow-hidden border border-emerald-400 bg-black relative font-mono">
      
      {/* HUD overlay labels */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none text-[10px] text-emerald-600 space-y-1">
        <div>SYSTEM // CINEMATIC_3D_GALAXY_GRAPH</div>
        <div>COORDINATES // GOLDEN_SPIRAL_DISPERSION</div>
        <div>TOTAL_NODES // {startups.length}</div>
      </div>
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-[9px] text-emerald-400 bg-black border border-emerald-400 px-3 py-1.5 flex gap-3">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-400"></span> [ ISSUES: LOW ]</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500"></span> [ ISSUES: MED ]</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 animate-pulse"></span> [ ISSUES: HIGH ]</span>
      </div>

      <Canvas
        camera={{ position: [0, 10, 22], fov: 60 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 15, 10]} intensity={1.5} />
        <directionalLight position={[-10, 10, -10]} intensity={0.8} />

        {/* Ambient starfield background */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

        {/* Cinematic grid helper simulating orbital planes */}
        <gridHelper args={[60, 30, '#00ff41', '#002206']} position={[0, -6, 0]} />

        {/* Node instances */}
        {startups.map((startup, idx) => (
          <StartupNode
            key={idx}
            startup={startup}
            position={nodePositions[idx] || [0, 0, 0]}
            index={idx}
          />
        ))}

        {/* Camera flight and user controls */}
        <CameraController controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.05}
          maxDistance={50}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
}
