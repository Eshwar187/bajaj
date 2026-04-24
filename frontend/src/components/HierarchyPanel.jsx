export default function HierarchyPanel() {
  const hierarchy = [
    {
      id: 'A',
      label: 'Node A (Root)',
      isRoot: true,
      children: [
        {
          id: 'B',
          label: 'Node B',
          children: [
            { id: 'D', label: 'Node D' },
          ],
        },
        {
          id: 'C',
          label: 'Node C',
          children: [
            { id: 'E', label: 'Node E' },
          ],
        },
        { id: 'F', label: 'Node F (Converged from D, E)', isConverged: true },
      ],
    },
  ];

  const cycleCluster = {
    id: 'cycle',
    label: 'Isolated Cluster (Cycle)',
    isError: true,
    children: [{ id: 'G', label: 'G ↔ H', isCycle: true }],
  };

  const renderNode = (node, isLast = false, isFirst = false) => {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="flex flex-col">
        <div
          className={`flex items-center gap-2 py-1 px-2 rounded transition-colors ${
            node.isError
              ? 'text-error'
              : node.isRoot
              ? 'text-white font-bold'
              : 'text-neutral-300 hover:bg-[#121212]'
          } ${node.isConverged ? 'text-neutral-500 italic' : ''}`}
        >
          {node.isError ? (
            <span className="material-symbols-outlined text-sm text-error">warning</span>
          ) : hasChildren ? (
            <span className="material-symbols-outlined text-sm text-neutral-500">expand_more</span>
          ) : (
            <span className="material-symbols-outlined text-sm text-neutral-600">horizontal_rule</span>
          )}
          {node.label}
        </div>
        {hasChildren && (
          <div
            className={`pl-6 border-l ml-[11px] flex flex-col gap-1 ${
              node.isError ? 'border-error/30' : 'border-[#1F1F1F]'
            }`}
          >
            {node.children.map((child, idx) =>
              renderNode(child, idx === node.children.length - 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col">
      <div className="p-4 border-b border-[#1F1F1F]">
        <h2 className="text-[18px] font-semibold text-white">Hierarchy Breakdown</h2>
      </div>
      <div className="p-4">
        <div className="font-mono text-[13px] text-neutral-300">
          {hierarchy.map((node) => renderNode(node))}
          <div className="mt-4">{renderNode(cycleCluster)}</div>
        </div>
      </div>
    </div>
  );
}