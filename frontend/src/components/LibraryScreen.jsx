import { useState } from 'react';

const filterChips = [
  { id: 'all', label: 'All Types', active: true },
  { id: 'tree', label: 'Tree Structure', active: false },
  { id: 'directed', label: 'Directed Graph', active: false },
  { id: 'cycle', label: 'Cycle-Prone', active: false },
  { id: 'bipartite', label: 'Bipartite', active: false },
];

const templates = [
  {
    id: 1,
    name: 'Microservice Dep-Graph v2',
    description: 'auth-service-dependencies',
    type: 'Tree',
    typeColor: 'bg-[#003731] border-[#007165] text-[#62fae3]',
    nodes: 142,
    date: 'Oct 24, 2023',
    svg: (
      <svg className="opacity-50 group-hover:opacity-100 transition-opacity" height="100%" viewBox="0 0 100 60" width="100%">
        <polyline fill="none" points="20,10 50,30 80,10" stroke="#3cddc7" strokeWidth="1" />
        <polyline fill="none" points="50,30 50,50" stroke="#3cddc7" strokeWidth="1" />
        <circle cx="20" cy="10" fill="#0A0A0A" r="3" stroke="#3cddc7" strokeWidth="1.5" />
        <circle cx="80" cy="10" fill="#0A0A0A" r="3" stroke="#3cddc7" strokeWidth="1.5" />
        <circle cx="50" cy="30" fill="#3cddc7" r="4" />
        <circle cx="50" cy="50" fill="#0A0A0A" r="3" stroke="#3cddc7" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Legacy Monolith Map',
    description: 'core-app-v1-analysis',
    type: 'Cycle-Prone',
    typeColor: 'bg-[#2a2a2a] border-[#444748] text-white',
    nodes: 8402,
    date: 'Sep 12, 2023',
    svg: (
      <svg className="opacity-40 group-hover:opacity-100 transition-opacity" height="100%" viewBox="0 0 100 60" width="100%">
        <polyline fill="none" points="10,30 30,10 70,10 90,30 70,50 30,50 10,30" stroke="#c4c7c8" strokeWidth="1" />
        <polyline fill="none" points="30,10 70,50" stroke="#c4c7c8" strokeDasharray="2 2" strokeWidth="1" />
        <polyline fill="none" points="30,50 70,10" stroke="#c4c7c8" strokeDasharray="2 2" strokeWidth="1" />
        <circle cx="10" cy="30" fill="#0A0A0A" r="3" stroke="#c4c7c8" strokeWidth="1.5" />
        <circle cx="30" cy="10" fill="#0A0A0A" r="3" stroke="#c4c7c8" strokeWidth="1.5" />
        <circle cx="70" cy="10" fill="#0A0A0A" r="3" stroke="#c4c7c8" strokeWidth="1.5" />
        <circle cx="90" cy="30" fill="#0A0A0A" r="3" stroke="#c4c7c8" strokeWidth="1.5" />
        <circle cx="70" cy="50" fill="#0A0A0A" r="3" stroke="#c4c7c8" strokeWidth="1.5" />
        <circle cx="30" cy="50" fill="#0A0A0A" r="3" stroke="#c4c7c8" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Data Pipeline Flow',
    description: 'etl-nightly-batch-prod',
    type: 'Directed',
    typeColor: 'bg-[#2a2a2a] border-[#444748] text-white',
    nodes: 34,
    date: 'Oct 01, 2023',
    svg: (
      <svg className="opacity-50 group-hover:opacity-100 transition-opacity" height="100%" viewBox="0 0 100 60" width="100%">
        <polyline fill="none" points="20,30 40,30 60,15 80,15" stroke="#bab8b7" strokeWidth="1" />
        <polyline fill="none" points="40,30 60,45 80,45" stroke="#bab8b7" strokeWidth="1" />
        <polygon fill="#bab8b7" points="40,30 36,27 36,33" />
        <polygon fill="#bab8b7" points="60,15 56,12 56,18" />
        <polygon fill="#bab8b7" points="60,45 56,42 56,48" />
        <circle cx="20" cy="30" fill="#0A0A0A" r="3" stroke="#bab8b7" strokeWidth="1.5" />
        <circle cx="80" cy="15" fill="#0A0A0A" r="3" stroke="#bab8b7" strokeWidth="1.5" />
        <circle cx="80" cy="45" fill="#0A0A0A" r="3" stroke="#bab8b7" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Org Chart Hierarchy',
    description: 'internal-hr-export-q3',
    type: 'Tree',
    typeColor: 'bg-[#003731] border-[#007165] text-[#62fae3]',
    nodes: 1205,
    date: 'Aug 15, 2023',
    svg: (
      <svg className="opacity-50 group-hover:opacity-100 transition-opacity" height="100%" viewBox="0 0 100 60" width="100%">
        <polyline fill="none" points="20,10 50,20 80,10" stroke="#3cddc7" strokeWidth="1" />
        <polyline fill="none" points="20,30 50,20 80,30" stroke="#3cddc7" strokeWidth="1" />
        <polyline fill="none" points="20,50 50,20 80,50" stroke="#3cddc7" strokeWidth="1" />
        <circle cx="50" cy="20" fill="#3cddc7" r="4" />
        <circle cx="20" cy="10" fill="#0A0A0A" r="2" stroke="#3cddc7" strokeWidth="1" />
        <circle cx="80" cy="10" fill="#0A0A0A" r="2" stroke="#3cddc7" strokeWidth="1" />
        <circle cx="20" cy="30" fill="#0A0A0A" r="2" stroke="#3cddc7" strokeWidth="1" />
        <circle cx="80" cy="30" fill="#0A0A0A" r="2" stroke="#3cddc7" strokeWidth="1" />
        <circle cx="20" cy="50" fill="#0A0A0A" r="2" stroke="#3cddc7" strokeWidth="1" />
        <circle cx="80" cy="50" fill="#0A0A0A" r="2" stroke="#3cddc7" strokeWidth="1" />
      </svg>
    ),
  },
];

const typeLabels = {
  Tree: 'Tree',
  'Cycle-Prone': 'Cycle-Prone',
  Directed: 'Directed',
};

export default function LibraryScreen() {
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <main className="ml-64 pt-14 p-8 w-full overflow-y-auto bg-background h-[calc(100vh-3.5rem)]">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-[18px] font-semibold text-white mb-2">Configuration Library</h2>
          <p className="text-[13px] text-zinc-400 max-w-xl">
            Manage and deploy saved structural analysis templates. Select a configuration to instantiate a new graph environment or edit existing parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#0A0A0A] border border-[#1F1F1F] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-[13px] flex items-center gap-2 ${
                viewMode === 'grid' ? 'bg-[#1F1F1F] text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-[13px] flex items-center gap-2 ${
                viewMode === 'list' ? 'bg-[#1F1F1F] text-white' : 'text-zinc-500 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">list</span>
            </button>
          </div>
          <button className="bg-transparent border border-[#262626] text-white text-[13px] px-4 py-1.5 hover:border-[#404040] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Filter
          </button>
          <button className="bg-white text-black text-[13px] font-medium px-4 py-1.5 hover:bg-zinc-200 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Template
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id)}
            className={`px-3 py-1 border text-[13px] transition-colors ${
              activeFilter === chip.id
                ? 'border-[#1F1F1F] bg-[#0A0A0A] text-white'
                : 'border-[#1F1F1F] text-zinc-400 hover:text-white hover:border-[#404040]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-[#0A0A0A] border border-[#1F1F1F] group hover:border-[#404040] transition-colors cursor-pointer flex flex-col h-full"
          >
            <div className="h-32 bg-[#050505] border-b border-[#1F1F1F] relative overflow-hidden flex items-center justify-center p-4">
              {template.svg}
              <div className={`absolute top-2 right-2 border text-[10px] px-1.5 py-0.5 uppercase tracking-wider ${template.typeColor}`}>
                {template.type}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-[14px] text-white font-medium mb-1">{template.name}</h3>
                <p className="font-mono text-[12px] text-zinc-500 mb-4 truncate">{template.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1F1F1F]">
                <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">share</span>
                  {template.nodes.toLocaleString()} Nodes
                </div>
                <div className="text-zinc-500 font-mono text-[11px]">{template.date}</div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-[#050505] border border-dashed border-[#262626] hover:border-[#404040] transition-colors cursor-pointer flex flex-col items-center justify-center h-full min-h-[220px] group">
          <div className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center mb-3 group-hover:bg-[#2a2a2a] transition-colors">
            <span className="material-symbols-outlined text-white">add</span>
          </div>
          <h3 className="text-[14px] text-white font-medium">Create Blank Template</h3>
          <p className="text-[13px] text-zinc-500 mt-1">Start from scratch</p>
        </div>
      </div>
    </main>
  );
}