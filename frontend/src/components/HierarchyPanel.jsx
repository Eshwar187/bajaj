import { useState, useEffect } from 'react';

export default function HierarchyPanel({ result, loading }) {
  const [expandedRoots, setExpandedRoots] = useState(new Set());

  useEffect(() => {
    if (result?.hierarchies) {
      // Auto-expand all on new result
      setExpandedRoots(new Set(result.hierarchies.map((_, i) => i)));
    }
  }, [result]);

  const toggleRoot = (idx) => {
    setExpandedRoots(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col">
        <div className="p-4 border-b border-[#1F1F1F]">
          <h2 className="text-[18px] font-semibold text-white">Hierarchy Breakdown</h2>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-16 rounded bg-[#111] animate-pulse border border-[#1F1F1F]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!result || !result.hierarchies) {
    return (
      <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col">
        <div className="p-4 border-b border-[#1F1F1F]">
          <h2 className="text-[18px] font-semibold text-white">Hierarchy Breakdown</h2>
        </div>
        <div className="p-6 flex flex-col items-center justify-center text-zinc-600 gap-2">
          <span className="material-symbols-outlined text-[40px] animate-pulse-slow">account_tree</span>
          <span className="text-[13px]">No hierarchies to display</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="p-4 border-b border-[#1F1F1F] flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-white">Hierarchy Breakdown</h2>
        <span className="text-[13px] text-zinc-500">{result.hierarchies.length} group{result.hierarchies.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {result.hierarchies.map((hierarchy, idx) => (
            <HierarchyCard
              key={idx}
              hierarchy={hierarchy}
              idx={idx}
              expanded={expandedRoots.has(idx)}
              onToggle={() => toggleRoot(idx)}
            />
          ))}
        </div>

        {/* JSON output */}
        <div className="mt-6 border-t border-[#1F1F1F] pt-4">
          <details className="group">
            <summary className="text-[12px] font-medium text-zinc-500 uppercase tracking-wide cursor-pointer hover:text-zinc-300 transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] group-open:rotate-90 transition-transform duration-200">chevron_right</span>
              RAW API RESPONSE
            </summary>
            <pre className="mt-3 bg-black border border-[#1F1F1F] rounded p-4 text-[12px] font-mono text-zinc-400 overflow-auto max-h-[400px] animate-fade-in">
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
    <div
      className={`rounded border transition-all duration-300 animate-scale-in ${
        isCycle
          ? 'bg-[#120000] border-[#400000] hover:border-[#600000]'
          : 'bg-black border-[#1F1F1F] hover:border-[#333]'
      }`}
      style={{ animationDelay: `${idx * 0.08}s` }}
    >
      {/* Header */}
      <button
        className="w-full p-3 flex items-center justify-between text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] ${
            isCycle
              ? 'bg-error/20 text-error border border-error/40'
              : 'bg-[#1a1a1a] text-white border border-[#333]'
          }`}>
            {hierarchy.root}
          </span>
          <div>
            <div className="text-[14px] font-semibold text-white">
              Root: {hierarchy.root}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {isCycle ? (
                <span className="text-[11px] text-error flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                  Cycle detected
                </span>
              ) : (
                <span className="text-[11px] text-zinc-500">
                  Depth: {hierarchy.depth}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`material-symbols-outlined text-zinc-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Expanded tree */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-3 pb-3 border-t border-[#1F1F1F]">
          {isCycle ? (
            <div className="mt-3 flex items-center gap-2 text-error text-[13px]">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              <span>Cyclic group — tree cannot be built</span>
            </div>
          ) : (
            <div className="mt-3 font-mono text-[12px]">
              {renderTreeNode(hierarchy.tree, 0)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderTreeNode(tree, depth) {
  if (!tree || typeof tree !== 'object') return null;
  const keys = Object.keys(tree);
  if (keys.length === 0) return null;

  return keys.map((key) => {
    const children = tree[key];
    const childKeys = Object.keys(children || {});
    const hasChildren = childKeys.length > 0;

    return (
      <div key={key} className="flex flex-col">
        <div
          className={`flex items-center gap-1.5 py-0.5 px-1.5 rounded text-[12px] transition-colors hover:bg-[#1a1a1a] ${
            depth === 0 ? 'text-white font-bold' : 'text-neutral-400'
          }`}
        >
          {hasChildren ? (
            <span className="material-symbols-outlined text-[14px] text-zinc-600">subdirectory_arrow_right</span>
          ) : (
            <span className="material-symbols-outlined text-[14px] text-zinc-700">horizontal_rule</span>
          )}
          <span>{key}</span>
        </div>
        {hasChildren && (
          <div className="pl-5 border-l border-[#222] ml-[9px]">
            {renderTreeNode(children, depth + 1)}
          </div>
        )}
      </div>
    );
  });
}