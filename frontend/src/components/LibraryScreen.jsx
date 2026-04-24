import { useState } from 'react';

const filterChips = [
  { id: 'all', label: 'All Types' },
  { id: 'tree', label: 'Tree Structure' },
  { id: 'directed', label: 'Directed Graph' },
  { id: 'cycle', label: 'Cycle-Prone' },
  { id: 'bipartite', label: 'Bipartite' },
];

const templates = [
  {
    id: 1, name: 'Microservice Dep-Graph v2', description: 'auth-service-dependencies',
    type: 'Tree', typeStyle: 'teal', nodes: 142, date: 'Oct 24, 2023',
    svg: (
      <svg className="opacity-50 group-hover:opacity-100 transition-opacity" height="100%" viewBox="0 0 100 60" width="100%">
        <polyline fill="none" points="20,10 50,30 80,10" stroke="var(--teal)" strokeWidth="1" />
        <polyline fill="none" points="50,30 50,50" stroke="var(--teal)" strokeWidth="1" />
        <circle cx="20" cy="10" fill="var(--s1)" r="3" stroke="var(--teal)" strokeWidth="1.5" />
        <circle cx="80" cy="10" fill="var(--s1)" r="3" stroke="var(--teal)" strokeWidth="1.5" />
        <circle cx="50" cy="30" fill="var(--teal)" r="4" />
        <circle cx="50" cy="50" fill="var(--s1)" r="3" stroke="var(--teal)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 2, name: 'Legacy Monolith Map', description: 'core-app-v1-analysis',
    type: 'Cycle-Prone', typeStyle: 'default', nodes: 8402, date: 'Sep 12, 2023',
    svg: (
      <svg className="opacity-40 group-hover:opacity-100 transition-opacity" height="100%" viewBox="0 0 100 60" width="100%">
        <polyline fill="none" points="10,30 30,10 70,10 90,30 70,50 30,50 10,30" stroke="var(--t2)" strokeWidth="1" />
        <polyline fill="none" points="30,10 70,50" stroke="var(--t2)" strokeDasharray="2 2" strokeWidth="1" />
        <polyline fill="none" points="30,50 70,10" stroke="var(--t2)" strokeDasharray="2 2" strokeWidth="1" />
        {[{x:10,y:30},{x:30,y:10},{x:70,y:10},{x:90,y:30},{x:70,y:50},{x:30,y:50}].map((p,i) =>
          <circle key={i} cx={p.x} cy={p.y} fill="var(--s1)" r="3" stroke="var(--t2)" strokeWidth="1.5" />
        )}
      </svg>
    ),
  },
  {
    id: 3, name: 'Data Pipeline Flow', description: 'etl-nightly-batch-prod',
    type: 'Directed', typeStyle: 'default', nodes: 34, date: 'Oct 01, 2023',
    svg: (
      <svg className="opacity-50 group-hover:opacity-100 transition-opacity" height="100%" viewBox="0 0 100 60" width="100%">
        <polyline fill="none" points="20,30 40,30 60,15 80,15" stroke="var(--t2)" strokeWidth="1" />
        <polyline fill="none" points="40,30 60,45 80,45" stroke="var(--t2)" strokeWidth="1" />
        <circle cx="20" cy="30" fill="var(--s1)" r="3" stroke="var(--t2)" strokeWidth="1.5" />
        <circle cx="80" cy="15" fill="var(--s1)" r="3" stroke="var(--t2)" strokeWidth="1.5" />
        <circle cx="80" cy="45" fill="var(--s1)" r="3" stroke="var(--t2)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 4, name: 'Org Chart Hierarchy', description: 'internal-hr-export-q3',
    type: 'Tree', typeStyle: 'teal', nodes: 1205, date: 'Aug 15, 2023',
    svg: (
      <svg className="opacity-50 group-hover:opacity-100 transition-opacity" height="100%" viewBox="0 0 100 60" width="100%">
        <polyline fill="none" points="20,10 50,20 80,10" stroke="var(--teal)" strokeWidth="1" />
        <polyline fill="none" points="20,30 50,20 80,30" stroke="var(--teal)" strokeWidth="1" />
        <polyline fill="none" points="20,50 50,20 80,50" stroke="var(--teal)" strokeWidth="1" />
        <circle cx="50" cy="20" fill="var(--teal)" r="4" />
        {[{x:20,y:10},{x:80,y:10},{x:20,y:30},{x:80,y:30},{x:20,y:50},{x:80,y:50}].map((p,i) =>
          <circle key={i} cx={p.x} cy={p.y} fill="var(--s1)" r="2" stroke="var(--teal)" strokeWidth="1" />
        )}
      </svg>
    ),
  },
];

export default function LibraryScreen() {
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <main className="ml-64 pt-14 p-8 w-full overflow-y-auto h-[calc(100vh-3.5rem)]" style={{ backgroundColor: 'var(--s0)' }}>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--t0)' }}>Configuration Library</h2>
          <p className="text-[13px] max-w-xl" style={{ color: 'var(--t2)' }}>
            Manage and deploy saved structural analysis templates. Select a configuration to instantiate a new graph environment or edit existing parameters.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded" style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)' }}>
            {['grid', 'list'].map(m => (
              <button key={m} onClick={() => setViewMode(m)}
                className="px-3 py-1 text-[13px] flex items-center gap-2 rounded transition-colors"
                style={{ backgroundColor: viewMode === m ? 'var(--b1)' : 'transparent', color: viewMode === m ? 'var(--t0)' : 'var(--t3)' }}>
                <span className="material-symbols-outlined text-[16px]">{m === 'grid' ? 'grid_view' : 'list'}</span>
              </button>
            ))}
          </div>
          <button className="text-[13px] px-4 py-1.5 transition-colors flex items-center gap-2 rounded"
            style={{ border: '1px solid var(--b2)', color: 'var(--t0)', backgroundColor: 'transparent' }}>
            <span className="material-symbols-outlined text-[16px]">filter_list</span>Filter
          </button>
          <button className="text-[13px] font-medium px-4 py-1.5 transition-colors flex items-center gap-2 rounded"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
            <span className="material-symbols-outlined text-[16px]">add</span>New Template
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {filterChips.map((chip) => (
          <button key={chip.id} onClick={() => setActiveFilter(chip.id)}
            className="px-3 py-1 text-[13px] transition-colors rounded"
            style={{
              border: '1px solid var(--b1)',
              backgroundColor: activeFilter === chip.id ? 'var(--s1)' : 'transparent',
              color: activeFilter === chip.id ? 'var(--t0)' : 'var(--t2)',
            }}>
            {chip.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
        {templates.map((t) => (
          <div key={t.id} className="group cursor-pointer flex flex-col h-full rounded transition-colors"
            style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)' }}>
            <div className="h-32 relative overflow-hidden flex items-center justify-center p-4 rounded-t"
              style={{ backgroundColor: 'var(--s1-deep)', borderBottom: '1px solid var(--b1)' }}>
              {t.svg}
              <div className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 uppercase tracking-wider rounded"
                style={{
                  backgroundColor: t.typeStyle === 'teal' ? 'var(--teal-bg)' : 'var(--s4)',
                  border: `1px solid ${t.typeStyle === 'teal' ? 'var(--teal-border)' : 'var(--b5)'}`,
                  color: t.typeStyle === 'teal' ? 'var(--teal)' : 'var(--t0)',
                }}>
                {t.type}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-[14px] font-medium mb-1" style={{ color: 'var(--t0)' }}>{t.name}</h3>
                <p className="font-mono text-[12px] mb-4 truncate" style={{ color: 'var(--t3)' }}>{t.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid var(--b1)' }}>
                <div className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: 'var(--t2)' }}>
                  <span className="material-symbols-outlined text-[14px]">share</span>{t.nodes.toLocaleString()} Nodes
                </div>
                <div className="font-mono text-[11px]" style={{ color: 'var(--t3)' }}>{t.date}</div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-col items-center justify-center h-full min-h-[220px] group cursor-pointer rounded transition-colors"
          style={{ backgroundColor: 'var(--s1-deep)', border: '1px dashed var(--b2)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors"
            style={{ backgroundColor: 'var(--b1)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--t0)' }}>add</span>
          </div>
          <h3 className="text-[14px] font-medium" style={{ color: 'var(--t0)' }}>Create Blank Template</h3>
          <p className="text-[13px] mt-1" style={{ color: 'var(--t3)' }}>Start from scratch</p>
        </div>
      </div>
    </main>
  );
}