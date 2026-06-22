import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-400 bg-black select-none font-mono">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2 font-bold tracking-tight text-emerald-400 hover:text-black hover:bg-emerald-400 p-1"
        >
          <span className="text-emerald-400 hover:text-black font-extrabold text-sm">
            [ YC_DISCOVERY_SYS ]
          </span>
          <span className="relative flex h-2.5 w-2.5 ml-0.5">
            <span className="animate-[blink_1.1s_infinite] w-2 h-3.5 bg-emerald-400 inline-block"></span>
          </span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3">
          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold tracking-wide transition-none cursor-pointer ${
                isActive 
                  ? 'bg-emerald-400 text-black border border-emerald-400 font-bold' 
                  : 'text-emerald-400 hover:text-black hover:bg-emerald-400 border border-emerald-400/40'
              }`
            }
          >
            [ HOME ]
          </NavLink>
          
          <NavLink 
            to="/discover" 
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold tracking-wide transition-none cursor-pointer ${
                isActive 
                  ? 'bg-emerald-400 text-black border border-emerald-400 font-bold' 
                  : 'text-emerald-400 hover:text-black hover:bg-emerald-400 border border-emerald-400/40'
              }`
            }
          >
            [ STARTUP_RADAR ]
          </NavLink>
          
          <NavLink 
            to="/news" 
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold tracking-wide transition-none cursor-pointer ${
                isActive 
                  ? 'bg-emerald-400 text-black border border-emerald-400 font-bold' 
                  : 'text-emerald-400 hover:text-black hover:bg-emerald-400 border border-emerald-400/40'
              }`
            }
          >
            [ NEWS_FEED ]
          </NavLink>
        </nav>

      </div>
    </header>
  );
}

