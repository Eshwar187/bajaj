import { useState, useEffect, useRef } from 'react';

export default function GraphPanel({ nodes = [], edges = [], cycleEdges = [] }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
  useEffect(() => { setMounted(false); setTimeout(() => setMounted(true), 50); }, [nodes.length]);

  const hasData = nodes.length > 0;

  return (
    <div className="rounded flex flex-col h-[500px] animate-slide-up theme-transition"
      style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)', animationDelay: '0.1s' }}>
      <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--b1)' }}>
        <h2 className="text-[18px] font-semibold" style={{ color: 'var(--t0)' }}>Graph Visualization</h2>
        {hasData && (
          <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--t3)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--node-root-bg)', border: '1px solid var(--node-root-border)' }}></span>Root
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--node-bg)', border: '1px solid var(--node-border)' }}></span>Node
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: 'var(--node-bg)', borderColor: 'var(--err-text)' }}></span>Cycle
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--s0)' }}>
        {!hasData ? (
          <div className="flex flex-col items-center gap-3" style={{ color: 'var(--t4)' }}>
            <span className="material-symbols-outlined text-[48px] animate-pulse-slow">hub</span>
            <span className="text-[13px]">Run analysis to visualize the graph</span>
          </div>
        ) : (
          <div className="relative w-full h-full max-w-3xl mx-auto mt-4">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <marker id="arrowhead" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5"><polygon fill="var(--edge-color)" points="0 0, 10 3.5, 0 7" /></marker>
                <marker id="arrowhead-hover" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5"><polygon fill="var(--edge-hover)" points="0 0, 10 3.5, 0 7" /></marker>
                <marker id="arrowhead-error" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5"><polygon fill="var(--err-text)" points="0 0, 10 3.5, 0 7" /></marker>
              </defs>
              {edges.map((edge, i) => {
                const f = nodes.find(n => n.id === edge.from), t = nodes.find(n => n.id === edge.to);
                if (!f || !t) return null;
                const hl = hoveredNode === edge.from || hoveredNode === edge.to;
                return <line key={`e-${i}`} markerEnd={hl ? "url(#arrowhead-hover)" : "url(#arrowhead)"} stroke={hl ? 'var(--edge-hover)' : 'var(--edge-color)'} strokeWidth={hl ? 2 : 1.5} x1={`${f.x}%`} x2={`${t.x}%`} y1={f.y + 18} y2={t.y - 18} style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.5s ease ${i * 0.05}s, stroke 0.3s` }} />;
              })}
              {cycleEdges.map((edge, i) => {
                const f = nodes.find(n => n.id === edge.from), t = nodes.find(n => n.id === edge.to);
                if (!f || !t) return null;
                return <path key={`c-${i}`} d={`M ${f.x}% ${f.y} Q ${(f.x+t.x)/2+(i%2===0?-8:8)}% ${(f.y+t.y)/2-30} ${t.x}% ${t.y}`} fill="none" markerEnd="url(#arrowhead-error)" stroke="var(--err-text)" strokeWidth="1.5" strokeDasharray="4 3" className="animate-dash" style={{ opacity: mounted ? 1 : 0, transition: `opacity 0.5s ease ${(edges.length+i)*0.05}s` }} />;
              })}
            </svg>
            {nodes.map((node, i) => (
              <div key={node.id} className="absolute w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] z-10 cursor-pointer transition-all duration-300"
                style={{
                  left: `${node.x}%`, top: `${node.y}px`,
                  transform: `translate(-50%, 0) scale(${mounted ? (hoveredNode === node.id ? 1.25 : 1) : 0})`,
                  opacity: mounted ? 1 : 0,
                  transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.06}s`,
                  backgroundColor: node.isRoot ? 'var(--node-root-bg)' : 'var(--node-bg)',
                  color: node.isRoot ? 'var(--node-root-text)' : node.isCycle ? 'var(--err-text)' : 'var(--t0)',
                  border: node.isRoot ? '2px solid var(--node-root-border)' : node.isCycle ? '2px solid var(--err-text)' : '1px solid var(--node-border)',
                  boxShadow: node.isRoot ? '0 0 15px var(--node-root-glow)' : hoveredNode === node.id ? '0 0 25px var(--node-root-glow)' : 'none',
                }}
                onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}
              >{node.label || node.id}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}