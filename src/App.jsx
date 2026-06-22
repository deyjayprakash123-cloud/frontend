import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import StartupDiscover from './StartupDiscover';
import StartupNews from './StartupNews';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black text-emerald-400 font-mono">
        
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
        <footer className="w-full max-w-6xl mx-auto px-4 py-8 border-t border-emerald-400/30 text-center text-xs text-emerald-600 flex flex-col md:flex-row justify-between items-center gap-4 bg-black select-none z-10 font-mono">
          <p>&copy; 2026 YC Discovery Engine Systems. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#">[ Privacy ]</a>
            <a href="#">[ Terms ]</a>
            <a href="#">[ API Docs ]</a>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}
