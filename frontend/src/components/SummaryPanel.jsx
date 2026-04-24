import { useState, useEffect } from 'react';

export default function SummaryPanel({ result, loading }) {
  const summary = result?.summary;
  const dupCount = result?.duplicate_edges?.length || 0;

  const stats = [
    { label: 'TOTAL TREES', value: summary ? String(summary.total_trees) : '—', icon: 'account_tree', isError: false },
    { label: 'TOTAL CYCLES', value: summary ? String(summary.total_cycles) : '—', icon: 'sync_problem', isError: summary ? summary.total_cycles > 0 : false },
    { label: 'LARGEST ROOT', value: summary ? summary.largest_tree_root || '—' : '—', icon: 'share', isError: false },
    { label: 'DUPLICATE EDGES', value: summary ? String(dupCount) : '—', icon: 'content_copy', isError: false },
  ];

  const [visibleCards, setVisibleCards] = useState(new Set());
  useEffect(() => {
    if (!result) return;
    setVisibleCards(new Set());
    stats.forEach((_, i) => {
      setTimeout(() => setVisibleCards(prev => new Set([...prev, i])), i * 100);
    });
  }, [result]);

  return (
    <div
      className="rounded flex flex-col h-full animate-slide-up theme-transition"
      style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)', animationDelay: '0.15s' }}
    >
      <div className="p-4" style={{ borderBottom: '1px solid var(--b1)' }}>
        <h2 className="text-[18px] font-semibold" style={{ color: 'var(--t0)' }}>Analysis Summary</h2>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-[72px] rounded animate-pulse" style={{ backgroundColor: 'var(--s2)', border: '1px solid var(--b1)' }}></div>
            ))}
          </div>
        ) : (
          <>
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`p-4 rounded flex items-center justify-between transition-all duration-500 group ${
                  result && visibleCards.has(i) ? 'opacity-100 translate-y-0' : result ? 'opacity-0 translate-y-3' : 'opacity-100'
                }`}
                style={{
                  backgroundColor: stat.isError ? 'var(--err-surface)' : 'var(--s0)',
                  border: `1px solid ${stat.isError ? 'var(--err-border)' : 'var(--b1)'}`,
                }}
              >
                <div>
                  <div className="text-[12px] font-medium uppercase tracking-wide" style={{ color: stat.isError ? 'var(--err-text)' : 'var(--t3)' }}>
                    {stat.label}
                  </div>
                  <div className="text-[32px] font-semibold mt-1" style={{ color: stat.isError ? 'var(--err-text)' : 'var(--t0)' }}>
                    {stat.value}
                  </div>
                </div>
                <span
                  className="material-symbols-outlined group-hover:scale-110 transition-transform duration-300"
                  style={{ color: stat.isError ? 'var(--err-text)' : 'var(--t2)' }}
                >
                  {stat.icon}
                </span>
              </div>
            ))}

            {/* Invalid entries */}
            {result?.invalid_entries?.length > 0 && (
              <div className="mt-2 pt-4 animate-fade-in" style={{ borderTop: '1px solid var(--b1)' }}>
                <div className="text-[12px] font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--t3)' }}>
                  INVALID ENTRIES ({result.invalid_entries.length})
                </div>
                <div className="flex flex-col gap-1.5">
                  {result.invalid_entries.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-[13px] p-2 rounded animate-slide-up"
                      style={{ color: 'var(--err-text)', backgroundColor: 'var(--err-surface)', border: '1px solid var(--err-border)', animationDelay: `${i * 0.05}s` }}
                    >
                      <span className="material-symbols-outlined text-[16px] mt-0.5 shrink-0">error</span>
                      <span className="font-mono break-all">{entry || '(empty)'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Duplicate edges */}
            {result?.duplicate_edges?.length > 0 && (
              <div className="pt-4 animate-fade-in" style={{ borderTop: '1px solid var(--b1)' }}>
                <div className="text-[12px] font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--t3)' }}>
                  DUPLICATE EDGES ({result.duplicate_edges.length})
                </div>
                <div className="flex flex-col gap-1.5">
                  {result.duplicate_edges.map((edge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[13px] p-2 rounded"
                      style={{ color: 'var(--warn-text)', backgroundColor: 'var(--warn-surface)', border: '1px solid var(--warn-border)' }}
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      <span className="font-mono">{edge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cycle warnings */}
            {result && summary && summary.total_cycles > 0 && (
              <div className="pt-4 animate-fade-in" style={{ borderTop: '1px solid var(--b1)' }}>
                <div className="text-[12px] font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--t3)' }}>CYCLE WARNINGS</div>
                {result.hierarchies.filter(h => h.has_cycle).map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm p-2 rounded mb-1.5"
                    style={{ color: 'var(--err-text)', backgroundColor: 'var(--err-surface)', border: '1px solid var(--err-border)' }}
                  >
                    <span className="material-symbols-outlined text-[16px] mt-0.5">warning</span>
                    <span>Cycle detected — root node: <strong className="font-mono">{h.root}</strong></span>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!result && (
              <div className="flex flex-col items-center justify-center py-8 gap-2" style={{ color: 'var(--t4)' }}>
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