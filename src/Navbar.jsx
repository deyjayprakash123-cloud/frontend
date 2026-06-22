import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, BookOpen, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900/60 bg-zinc-950/70 backdrop-blur-md select-none">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2 font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-zinc-100 to-zinc-350 bg-clip-text text-transparent font-extrabold text-base">
            YC Discovery
          </span>
          <span className="relative flex h-2 w-2 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-zinc-900 text-white border border-zinc-800 shadow-inner font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`
            }
          >
            <span>Home</span>
          </NavLink>
          
          <NavLink 
            to="/discover" 
            className={({ isActive }) => 
              `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-zinc-900 text-indigo-400 border border-zinc-800 shadow-[0_0_12px_rgba(99,102,241,0.1)] font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`
            }
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Startup Radar</span>
          </NavLink>
          
          <NavLink 
            to="/news" 
            className={({ isActive }) => 
              `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-zinc-900 text-purple-400 border border-zinc-800 shadow-[0_0_12px_rgba(168,85,247,0.1)] font-bold' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`
            }
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>News Feed</span>
          </NavLink>
        </nav>

      </div>
    </header>
  );
}
