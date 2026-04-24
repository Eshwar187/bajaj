import { useState, useEffect } from 'react';

export default function SummaryPanel({ result, loading }) {
  const [animatedValues, setAnimatedValues] = useState({});

  const summary = result?.summary;
  const invalidCount = result?.invalid_entries?.length || 0;
  const dupCount = result?.duplicate_edges?.length || 0;

  const stats = [
    {
      label: 'TOTAL TREES',
      value: summary ? String(summary.total_trees) : '—',
      icon: 'account_tree',
      color: 'text-tertiary-fixed-dim',
    },
    {
      label: 'TOTAL CYCLES',
      value: summary ? String(summary.total_cycles) : '—',
      icon: 'sync_problem',
      color: 'text-error',
      isError: summary ? summary.total_cycles > 0 : false,
    },
    {
      label: 'LARGEST ROOT',
      value: summary ? summary.largest_tree_root || '—' : '—',
      icon: 'share',
      color: 'text-neutral-400',
    },
    {
      label: 'DUPLICATE EDGES',
      value: summary ? String(dupCount) : '—',
      icon: 'content_copy',
      color: 'text-neutral-400',
    },
  ];

  // Stagger animation on new result
  const [visibleCards, setVisibleCards] = useState(new Set());
  useEffect(() => {
    if (!result) return;
    setVisibleCards(new Set());
    stats.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCards(prev => new Set([...prev, i]));
      }, i * 100);
    });
  }, [result]);

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col h-full animate-slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="p-4 border-b border-[#1F1F1F]">
        <h2 className="text-[18px] font-semibold text-white">Analysis Summary</h2>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-[72px] rounded bg-[#111] animate-pulse border border-[#1F1F1F]"></div>
            ))}
          </div>
        ) : (
          <>
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`p-4 rounded flex items-center justify-between transition-all duration-500 ${
                  result && visibleCards.has(i) ? 'opacity-100 translate-y-0' : result ? 'opacity-0 translate-y-3' : 'opacity-100'
                } ${
                  stat.isError ? 'bg-[#120000] border border-[#400000]' : 'bg-black border border-[#1F1F1F]'
                } hover:border-[#333] group`}
              >
                <div>
                  <div className={`text-[12px] font-medium uppercase tracking-wide ${stat.isError ? 'text-error' : 'text-neutral-500'}`}>
                    {stat.label}
                  </div>
                  <div className={`text-[32px] font-semibold mt-1 transition-all duration-300 ${stat.isError ? 'text-error' : 'text-white'}`}>
                    {stat.value}
                  </div>
                </div>
                <span className={`material-symbols-outlined ${stat.color} group-hover:scale-110 transition-transform duration-300`}>{stat.icon}</span>
              </div>
            ))}

            {/* Invalid entries */}
            {result && result.invalid_entries && result.invalid_entries.length > 0 && (
              <div className="mt-2 border-t border-[#1F1F1F] pt-4 animate-fade-in">
                <div className="text-[12px] font-medium text-neutral-500 uppercase tracking-wide mb-2">
                  INVALID ENTRIES ({result.invalid_entries.length})
                </div>
                <div className="flex flex-col gap-1.5">
                  {result.invalid_entries.map((entry, i) => (
                    <div key={i} className="flex items-start gap-2 text-error text-[13px] bg-[#120000] p-2 border border-[#400000] rounded animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">error</span>
                      <span className="font-mono break-all">{entry || '(empty)'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicate edges */}
            {result && result.duplicate_edges && result.duplicate_edges.length > 0 && (
              <div className="border-t border-[#1F1F1F] pt-4 animate-fade-in">
                <div className="text-[12px] font-medium text-neutral-500 uppercase tracking-wide mb-2">
                  DUPLICATE EDGES ({result.duplicate_edges.length})
                </div>
                <div className="flex flex-col gap-1.5">
                  {result.duplicate_edges.map((edge, i) => (
                    <div key={i} className="flex items-center gap-2 text-yellow-400 text-[13px] bg-yellow-900/10 p-2 border border-yellow-900/30 rounded">
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      <span className="font-mono">{edge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cycle warnings */}
            {result && summary && summary.total_cycles > 0 && (
              <div className="border-t border-[#1F1F1F] pt-4 animate-fade-in">
                <div className="text-[12px] font-medium text-neutral-500 uppercase tracking-wide mb-2">CYCLE WARNINGS</div>
                {result.hierarchies.filter(h => h.has_cycle).map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-error text-sm bg-[#120000] p-2 border border-[#400000] rounded mb-1.5">
                    <span className="material-symbols-outlined text-[16px] mt-0.5">warning</span>
                    <span>Cycle detected — root node: <strong className="font-mono">{h.root}</strong></span>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!result && (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-600 gap-2">
                <span className="material-symbols-outlined text-[40px] animate-pulse-slow">monitoring</span>
                <span className="text-[13px]">Run analysis to see results</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}