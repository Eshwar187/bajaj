import { useState } from 'react';

const mockHistory = [
  { id: 1, timestamp: '2023-10-27 14:30', nodes: 12, edges: 15, status: 'cycle', root: 'Node G' },
  { id: 2, timestamp: '2023-10-27 10:15', nodes: 45, edges: 44, status: 'valid', root: 'Node A' },
  { id: 3, timestamp: '2023-10-26 16:45', nodes: 8, edges: 7, status: 'disconnected', root: 'Node X' },
];

function StatusBadge({ status }) {
  const cfg = {
    cycle: { label: 'Cycle Detected', color: 'var(--err-text)', bg: 'var(--err-surface)', border: 'var(--err-border)' },
    valid: { label: 'Valid', color: 'var(--teal)', bg: 'var(--teal-bg)', border: 'var(--teal-border)' },
    disconnected: { label: 'Disconnected Graph', color: 'var(--t2)', bg: 'var(--s2)', border: 'var(--b2)' },
  }[status] || { label: status, color: 'var(--t2)', bg: 'var(--s2)', border: 'var(--b2)' };

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px]"
      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <span className="w-[4px] h-[4px] rounded-full" style={{ backgroundColor: cfg.color }}></span>
      {cfg.label}
    </span>
  );
}

export default function HistoryScreen() {
  return (
    <main className="ml-64 pt-14 h-screen overflow-y-auto p-8" style={{ backgroundColor: 'var(--s0)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col gap-1">
          <h1 className="text-[32px] font-semibold tracking-tight" style={{ color: 'var(--t0)' }}>Analysis History</h1>
          <p className="text-[14px]" style={{ color: 'var(--t2)' }}>View and manage your previous structural analysis runs.</p>
        </header>

        <div className="flex items-center justify-between mb-6 p-2 rounded" style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)' }}>
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px]" style={{ color: 'var(--t3)' }}>search</span>
              <input className="w-full text-[13px] rounded py-1.5 pl-8 pr-3 focus:outline-none transition-colors"
                style={{ backgroundColor: 'var(--s1-deep)', border: '1px solid var(--b1)', color: 'var(--t0)' }}
                placeholder="Search by node name..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] rounded transition-all"
              style={{ border: '1px solid var(--b2)', color: 'var(--t0)', backgroundColor: 'transparent' }}>
              <span className="material-symbols-outlined text-[16px]">filter_list</span>Status: All
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-[13px] rounded transition-all"
              style={{ border: '1px solid var(--b2)', color: 'var(--t0)', backgroundColor: 'transparent' }}>
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>Date Range
            </button>
          </div>
        </div>

        <div className="rounded overflow-hidden" style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)' }}>
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead style={{ backgroundColor: 'var(--s1-deep)', borderBottom: '1px solid var(--b1)' }}>
              <tr>
                {['Timestamp', 'Topology (N/E)', 'Status', 'Primary Root', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-3 text-[12px] font-medium uppercase tracking-wider ${i === 4 ? 'text-right' : ''}`} style={{ color: 'var(--t2)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[13px]" style={{ color: 'var(--t0)' }}>
              {mockHistory.map((item) => (
                <tr key={item.id} className="group transition-colors" style={{ borderBottom: '1px solid var(--b1)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--s2)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td className="px-4 py-3 font-mono text-[13px]" style={{ color: 'var(--t2)' }}>{item.timestamp}</td>
                  <td className="px-4 py-3">
                    <span style={{ color: 'var(--t0)' }}>{item.nodes}</span>
                    <span style={{ color: 'var(--t4)' }}> / </span>
                    <span style={{ color: 'var(--t0)' }}>{item.edges}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 font-mono text-[13px]">{item.root}</td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-2 py-1 text-xs font-medium rounded transition-colors" style={{ color: 'var(--t2)' }}>View</button>
                    <button className="px-2 py-1 text-xs font-medium rounded transition-colors" style={{ color: 'var(--err-text)' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 flex items-center justify-between text-[13px]" style={{ backgroundColor: 'var(--s1-deep)', borderTop: '1px solid var(--b1)', color: 'var(--t3)' }}>
            <span>Showing 1 to 3 of 3 entries</span>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded transition-colors disabled:opacity-50" disabled><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
              <button className="p-1 rounded transition-colors disabled:opacity-50" disabled><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}