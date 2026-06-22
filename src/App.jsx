import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import StartupDiscover from './StartupDiscover';
import StartupNews from './StartupNews';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/20">
        
        {/* Global persistent Navbar */}
        <Navbar />

        {/* Dynamic Route Pages */}
        <div className="flex-1 flex flex-col relative">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/discover" element={<StartupDiscover />} />
            <Route path="/news" element={<StartupNews />} />
            {/* Fallback wildcard redirect to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global persistent Footer */}
        <footer className="w-full max-w-6xl mx-auto px-4 py-8 border-t border-zinc-900 text-center text-xs text-zinc-555 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-950 select-none z-10">
          <p>&copy; 2026 YC Discovery Engine Systems. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">API Docs</a>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}
