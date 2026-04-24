import { useState } from 'react';

const mockHistory = [
  {
    id: 1,
    timestamp: '2023-10-27 14:30',
    nodes: 12,
    edges: 15,
    status: 'cycle',
    root: 'Node G',
  },
  {
    id: 2,
    timestamp: '2023-10-27 10:15',
    nodes: 45,
    edges: 44,
    status: 'valid',
    root: 'Node A',
  },
  {
    id: 3,
    timestamp: '2023-10-26 16:45',
    nodes: 8,
    edges: 7,
    status: 'disconnected',
    root: 'Node X',
  },
];

function StatusBadge({ status }) {
  const statusConfig = {
    cycle: {
      label: 'Cycle Detected',
      className: 'bg-error/10 text-error border-error/30',
      dotClassName: 'bg-error',
    },
    valid: {
      label: 'Valid',
      className: 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim border-tertiary-fixed-dim/30',
      dotClassName: 'bg-tertiary-fixed-dim',
    },
    disconnected: {
      label: 'Disconnected Graph',
      className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
      dotClassName: 'bg-zinc-400',
    },
  };

  const config = statusConfig[status] || statusConfig.disconnected;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${config.className}`}>
      <span className={`w-[4px] h-[4px] rounded-full ${config.dotClassName}`}></span>
      {config.label}
    </span>
  );
}

export default function HistoryScreen() {
  return (
    <main className="ml-64 pt-14 h-screen overflow-y-auto bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex flex-col gap-1">
          <h1 className="text-[32px] font-semibold text-white tracking-tight">Analysis History</h1>
          <p className="text-[14px] text-zinc-400">View and manage your previous structural analysis runs.</p>
        </header>

        <div className="flex items-center justify-between mb-6 bg-[#0A0A0A] border border-[#1F1F1F] p-2 rounded">
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500 text-[16px]">search</span>
              <input
                className="w-full bg-[#050505] border border-[#1F1F1F] text-white text-[13px] rounded py-1.5 pl-8 pr-3 focus:outline-none focus:border-white focus:ring-0 transition-colors placeholder:text-zinc-600"
                placeholder="Search by node name..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#262626] bg-transparent text-white text-[13px] rounded hover:border-[#404040] hover:bg-[#121212] transition-all">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              Status: All
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#262626] bg-transparent text-white text-[13px] rounded hover:border-[#404040] hover:bg-[#121212] transition-all">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              Date Range
            </button>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded overflow-hidden">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-[#050505] border-b border-[#1F1F1F]">
              <tr>
                <th className="px-4 py-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wider w-48">Timestamp</th>
                <th className="px-4 py-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Topology (N/E)</th>
                <th className="px-4 py-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Primary Root</th>
                <th className="px-4 py-3 text-[12px] font-medium text-zinc-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-white">
              {mockHistory.map((item) => (
                <tr key={item.id} className="border-b border-[#1F1F1F] hover:bg-[#121212] transition-colors group">
                  <td className="px-4 py-3 font-mono text-[13px] text-zinc-400">{item.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className="text-white">{item.nodes}</span>
                    <span className="text-zinc-600"> / </span>
                    <span className="text-white">{item.edges}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px]">{item.root}</td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-2 py-1 text-zinc-400 hover:text-white transition-colors text-xs font-medium rounded hover:bg-[#353534]">View</button>
                    <button className="px-2 py-1 text-zinc-400 hover:text-error transition-colors text-xs font-medium rounded hover:bg-error/10">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-[#050505] border-t border-[#1F1F1F] flex items-center justify-between text-zinc-500 text-[13px]">
            <span>Showing 1 to 3 of 3 entries</span>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:text-white hover:bg-[#121212] transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="p-1 rounded hover:text-white hover:bg-[#121212] transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}