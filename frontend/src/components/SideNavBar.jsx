import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function SideNavBar() {
  const navItems = [
    { id: 'workspace', path: '/', icon: 'grid_view', label: 'Workspace' },
    { id: 'history', path: '/history', icon: 'history', label: 'History' },
    { id: 'library', path: '/library', icon: 'inventory_2', label: 'Library' },
    { id: 'settings', path: '/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="bg-[#0A0A0A] fixed left-0 top-14 bottom-0 w-64 border-r border-[#1F1F1F] flex flex-col py-4 gap-2 overflow-y-auto hidden md:flex">
      <div className="px-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#353534] flex items-center justify-center border border-[#444748]">
            <span className="material-symbols-outlined text-zinc-400 text-sm">terminal</span>
          </div>
          <div>
            <div className="font-semibold text-white">Technical Core</div>
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider">v4.2.1-stable</div>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 transition-all rounded-l-md ${
                isActive
                  ? 'bg-[#121212] text-white border-l-2 border-white'
                  : 'text-zinc-500 hover:bg-[#121212] hover:text-white border-l-2 border-transparent'
              }`
            }
          >
            <span className="material-symbols-outlined text-sm">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}