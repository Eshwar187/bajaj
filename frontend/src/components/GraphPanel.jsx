import { useState, useEffect, useRef } from 'react';

export default function GraphPanel({ nodes = [], edges = [], cycleEdges = [] }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mounted, setMounted] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Re-trigger entrance animation when nodes change
  useEffect(() => {
    setMounted(false);
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, [nodes.length]);

  const hasData = nodes.length > 0;

  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col h-[500px] animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="p-4 border-b border-[#1F1F1F] flex justify-between items-center">
        <h2 className="text-[18px] font-semibold text-white">Graph Visualization</h2>
        <div className="flex gap-3 items-center">
          {hasData && (
            <div className="flex items-center gap-4 text-[11px] text-zinc-500 mr-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-container border border-white/30"></span>
                Root
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#121212] border border-[#404040]"></span>
                Node
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#121212] border-2 border-error"></span>
                Cycle
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {!hasData ? (
          <div className="flex flex-col items-center gap-3 text-zinc-600">
            <span className="material-symbols-outlined text-[48px] animate-pulse-slow">hub</span>
            <span className="text-[13px]">Run analysis to visualize the graph</span>
          </div>
        ) : (
          <div className="relative w-full h-full max-w-3xl mx-auto mt-4">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            ></div>

            <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <marker id="arrowhead" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5">
                  <polygon fill="#404040" points="0 0, 10 3.5, 0 7"></polygon>
                </marker>
                <marker id="arrowhead-hover" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5">
                  <polygon fill="#fff" points="0 0, 10 3.5, 0 7"></polygon>
                </marker>
                <marker id="arrowhead-error" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5">
                  <polygon fill="#ffb4ab" points="0 0, 10 3.5, 0 7"></polygon>
                </marker>
              </defs>

              {/* Regular edges */}
              {edges.map((edge, i) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const isHighlighted = hoveredNode === edge.from || hoveredNode === edge.to;
                return (
                  <line
                    key={`edge-${i}`}
                    markerEnd={isHighlighted ? "url(#arrowhead-hover)" : "url(#arrowhead)"}
                    stroke={isHighlighted ? '#fff' : '#404040'}
                    strokeWidth={isHighlighted ? 2 : 1.5}
                    x1={`${fromNode.x}%`}
                    x2={`${toNode.x}%`}
                    y1={fromNode.y + 18}
                    y2={toNode.y - 18}
                    className="transition-all duration-300"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transition: `opacity 0.5s ease ${i * 0.05}s, stroke 0.3s, stroke-width 0.3s`,
                    }}
                  />
                );
              })}

              {/* Cycle edges */}
              {cycleEdges.map((edge, i) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                const dx = toNode.x - fromNode.x;
                const dy = toNode.y - fromNode.y;
                const offset = i % 2 === 0 ? -8 : 8;
                return (
                  <path
                    key={`cycle-${i}`}
                    d={`M ${fromNode.x}% ${fromNode.y} Q ${midX + offset}% ${midY - 30} ${toNode.x}% ${toNode.y}`}
                    fill="none"
                    markerEnd="url(#arrowhead-error)"
                    stroke="#ffb4ab"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-dash"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transition: `opacity 0.5s ease ${(edges.length + i) * 0.05}s`,
                    }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => (
              <div
                key={node.id}
                className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] z-10 cursor-pointer transition-all duration-300 ${
                  node.isRoot
                    ? 'bg-primary-container text-black border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : node.isCycle
                    ? 'bg-[#121212] border-2 border-error text-error'
                    : 'bg-[#121212] border border-[#404040] text-white'
                } ${
                  hoveredNode === node.id
                    ? 'scale-125 shadow-[0_0_25px_rgba(255,255,255,0.3)] !border-white'
                    : ''
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}px`,
                  transform: `translate(-50%, 0) scale(${mounted ? 1 : 0})`,
                  opacity: mounted ? 1 : 0,
                  transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.06}s`,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                title={node.label || node.id}
              >
                {node.label || node.id}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}