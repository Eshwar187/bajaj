import { useState } from 'react';

export default function TopNavBar() {
  return (
    <nav className="bg-black flex justify-between items-center w-full px-6 h-14 font-inter text-sm antialiased tracking-tight fixed top-0 left-0 right-0 z-50 border-b border-neutral-900">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold tracking-tighter text-white uppercase">Hierarchy Analyzer</span>
        <span className="text-neutral-500 text-[13px]">Analyze node relationships and detect structures</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-neutral-400 text-[13px]">API status: Online</span>
        </div>
        <div className="flex items-center gap-4 text-neutral-500">
          <button className="hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined text-lg">sensors</span>
          </button>
          <button className="hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined text-lg">notifications</span>
          </button>
          <button className="hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined text-lg">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
}