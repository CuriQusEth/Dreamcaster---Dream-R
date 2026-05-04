import React from 'react';
import { GardenCanvas } from './components/GardenCanvas';
import { UIOverlay } from './components/UIOverlay';

export default function App() {
  return (
    <main 
      className="relative w-full h-screen overflow-hidden text-slate-100 font-sans select-none" 
      style={{ background: 'radial-gradient(circle at top right, #1a1a2e, #0D0B14 70%), radial-gradient(circle at bottom left, #2d1b33, #0D0B14 70%)' }}
    >
      {/* Floating Islands Background */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[80%] max-w-xl h-32 bg-[#2d1b33] rounded-[100%] blur-sm opacity-40 pointer-events-none z-0"></div>

      {/* Particle/Seed effects (Static BG decor) */}
      <div className="absolute top-40 right-10 w-2 h-2 bg-teal-200 rounded-full blur-[1px] shadow-[0_0_8px_white] pointer-events-none"></div>
      <div className="absolute top-20 left-20 w-1 h-1 bg-indigo-200 rounded-full blur-[1px] pointer-events-none"></div>
      <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full opacity-60 pointer-events-none"></div>
      
      {/* Game Components */}
      <GardenCanvas />
      <UIOverlay />
    </main>
  );
}

