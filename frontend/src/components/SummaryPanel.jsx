export default function SummaryPanel() {
  const stats = [
    { label: 'TOTAL TREES', value: '1', icon: 'account_tree', color: 'text-tertiary-fixed-dim' },
    { label: 'TOTAL CYCLES', value: '1', icon: 'sync_problem', color: 'text-error', isError: true },
    { label: 'LARGEST ROOT', value: 'A', icon: 'share', color: 'text-neutral-400' },
    { label: 'DUPLICATE EDGES', value: '0', icon: 'content_copy', color: 'text-neutral-400' },
  ];

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col h-full">
      <div className="p-4 border-b border-[#1F1F1F]">
        <h2 className="text-[18px] font-semibold text-white">Analysis Summary</h2>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-4 rounded flex items-center justify-between ${
              stat.isError ? 'bg-[#120000] border border-[#400000]' : 'bg-black border border-[#1F1F1F]'
            }`}
          >
            <div>
              <div className={`text-[12px] font-medium uppercase tracking-wide ${stat.isError ? 'text-error' : 'text-neutral-500'}`}>
                {stat.label}
              </div>
              <div className={`text-[32px] font-semibold mt-1 ${stat.isError ? 'text-error' : 'text-white'}`}>
                {stat.value}
              </div>
            </div>
            <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
          </div>
        ))}
        <div className="mt-4 border-t border-[#1F1F1F] pt-4">
          <div className="text-[12px] font-medium text-neutral-500 uppercase tracking-wide mb-2">VALIDATION ISSUES</div>
          <div className="flex items-start gap-2 text-error text-sm bg-[#120000] p-2 border border-[#400000] rounded">
            <span className="material-symbols-outlined text-[16px] mt-0.5">error</span>
            <span>Cycle detected involving nodes: G, H</span>
          </div>
        </div>
      </div>
    </div>
  );
}