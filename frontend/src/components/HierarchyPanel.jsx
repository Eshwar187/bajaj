import { useState, useEffect } from 'react';

export default function HierarchyPanel({ result, loading }) {
  const [expandedRoots, setExpandedRoots] = useState(new Set());

  useEffect(() => {
    if (result?.hierarchies) setExpandedRoots(new Set(result.hierarchies.map((_, i) => i)));
  }, [result]);

  const toggleRoot = (idx) => {
    setExpandedRoots(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  };

  if (loading) {
    return (
      <div className="rounded flex flex-col theme-transition" style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)' }}>
        <div className="p-4" style={{ borderBottom: '1px solid var(--b1)' }}>
          <h2 className="text-[18px] font-semibold" style={{ color: 'var(--t0)' }}>Hierarchy Breakdown</h2>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {[0, 1, 2].map(i => <div key={i} className="h-16 rounded animate-pulse" style={{ backgroundColor: 'var(--s2)', border: '1px solid var(--b1)' }}></div>)}
        </div>
      </div>
    );
  }

  if (!result?.hierarchies) {
    return (
      <div className="rounded flex flex-col theme-transition" style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)' }}>
        <div className="p-4" style={{ borderBottom: '1px solid var(--b1)' }}>
          <h2 className="text-[18px] font-semibold" style={{ color: 'var(--t0)' }}>Hierarchy Breakdown</h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center gap-2" style={{ color: 'var(--t4)' }}>
          <span className="material-symbols-outlined text-[40px] animate-pulse-slow">account_tree</span>
          <span className="text-[13px]">No hierarchies to display</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded flex flex-col animate-slide-up theme-transition" style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)', animationDelay: '0.2s' }}>
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--b1)' }}>
        <h2 className="text-[18px] font-semibold" style={{ color: 'var(--t0)' }}>Hierarchy Breakdown</h2>
        <span className="text-[13px]" style={{ color: 'var(--t3)' }}>{result.hierarchies.length} group{result.hierarchies.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {result.hierarchies.map((h, idx) => (
            <HierarchyCard key={idx} hierarchy={h} idx={idx} expanded={expandedRoots.has(idx)} onToggle={() => toggleRoot(idx)} />
          ))}
        </div>
        <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--b1)' }}>
          <details className="group">
            <summary className="text-[12px] font-medium uppercase tracking-wide cursor-pointer transition-colors flex items-center gap-1" style={{ color: 'var(--t3)' }}>
              <span className="material-symbols-outlined text-[16px] group-open:rotate-90 transition-transform duration-200">chevron_right</span>
              RAW API RESPONSE
            </summary>
            <pre className="mt-3 rounded p-4 text-[12px] font-mono overflow-auto max-h-[400px] animate-fade-in" style={{ backgroundColor: 'var(--s0)', border: '1px solid var(--b1)', color: 'var(--t2)' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

function HierarchyCard({ hierarchy, idx, expanded, onToggle }) {
  const isCycle = hierarchy.has_cycle;
  return (
    <div className="rounded transition-all duration-300 animate-scale-in"
      style={{ backgroundColor: isCycle ? 'var(--err-surface)' : 'var(--s0)', border: `1px solid ${isCycle ? 'var(--err-border)' : 'var(--b1)'}`, animationDelay: `${idx * 0.08}s` }}>
      <button className="w-full p-3 flex items-center justify-between text-left" onClick={onToggle}>
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px]"
            style={{ backgroundColor: isCycle ? 'rgba(var(--err-text), 0.2)' : 'var(--s3)', color: isCycle ? 'var(--err-text)' : 'var(--t0)', border: `1px solid ${isCycle ? 'var(--err-border)' : 'var(--b3)'}` }}>
            {hierarchy.root}
          </span>
          <div>
            <div className="text-[14px] font-semibold" style={{ color: 'var(--t0)' }}>Root: {hierarchy.root}</div>
            <div className="flex items-center gap-2 mt-0.5">
              {isCycle ? (
                <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--err-text)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--err-text)' }}></span>Cycle detected
                </span>
              ) : (
                <span className="text-[11px]" style={{ color: 'var(--t3)' }}>Depth: {hierarchy.depth}</span>
              )}
            </div>
          </div>
        </div>
        <span className={`material-symbols-outlined transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} style={{ color: 'var(--t3)' }}>expand_more</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3 pb-3" style={{ borderTop: '1px solid var(--b1)' }}>
          {isCycle ? (
            <div className="mt-3 flex items-center gap-2 text-[13px]" style={{ color: 'var(--err-text)' }}>
              <span className="material-symbols-outlined text-[16px]">warning</span>Cyclic group — tree cannot be built
            </div>
          ) : (
            <div className="mt-3 font-mono text-[12px]">{renderTreeNode(hierarchy.tree, 0)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderTreeNode(tree, depth) {
  if (!tree || typeof tree !== 'object') return null;
  return Object.keys(tree).map((key) => {
    const children = tree[key];
    const hasChildren = Object.keys(children || {}).length > 0;
    return (
      <div key={key} className="flex flex-col">
        <div className="flex items-center gap-1.5 py-0.5 px-1.5 rounded text-[12px] transition-colors"
          style={{ color: depth === 0 ? 'var(--t0)' : 'var(--t2)', fontWeight: depth === 0 ? 700 : 400 }}>
          <span className="material-symbols-outlined text-[14px]" style={{ color: 'var(--t4)' }}>
            {hasChildren ? 'subdirectory_arrow_right' : 'horizontal_rule'}
          </span>
          <span>{key}</span>
        </div>
        {hasChildren && <div className="pl-5 ml-[9px]" style={{ borderLeft: '1px solid var(--b2)' }}>{renderTreeNode(children, depth + 1)}</div>}
      </div>
    );
  });
}