import { useState } from 'react';

export default function GraphPanel({ nodes = [], edges = [], cycleEdges = [] }) {
  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col h-[500px]">
      <div className="p-4 border-b border-[#1F1F1F] flex justify-between items-center">
        <h2 className="text-[18px] font-semibold text-white">Graph Visualization</h2>
        <div className="flex gap-2">
          <button className="text-zinc-400 hover:text-white">
            <span className="material-symbols-outlined text-lg">zoom_in</span>
          </button>
          <button className="text-zinc-400 hover:text-white">
            <span className="material-symbols-outlined text-lg">zoom_out</span>
          </button>
          <button className="text-zinc-400 hover:text-white">
            <span className="material-symbols-outlined text-lg">center_focus_strong</span>
          </button>
        </div>
      </div>
      <div className="p-4 flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full max-w-lg mx-auto mt-8">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <marker id="arrowhead" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5">
                <polygon fill="#404040" points="0 0, 10 3.5, 0 7"></polygon>
              </marker>
              <marker id="arrowhead-error" markerHeight="7" markerWidth="10" orient="auto" refX="9" refY="3.5">
                <polygon fill="#ffb4ab" points="0 0, 10 3.5, 0 7"></polygon>
              </marker>
            </defs>
            {edges.map((edge, i) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              return (
                <line
                  key={i}
                  markerEnd="url(#arrowhead)"
                  stroke="#404040"
                  strokeWidth="1.5"
                  x1={`${fromNode.x}%`}
                  x2={`${toNode.x}%`}
                  y1={fromNode.y + 20}
                  y2={toNode.y - 20}
                />
              );
            })}
            {cycleEdges.map((edge, i) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;
              return (
                <path
                  key={`cycle-${i}`}
                  d={`M ${fromNode.x}% ${fromNode.y - 20} Q ${fromNode.x < toNode.x ? fromNode.x - 10 : fromNode.x + 10}% ${(fromNode.y + toNode.y) / 2} ${toNode.x}% ${toNode.y + 20}`}
                  fill="none"
                  markerEnd="url(#arrowhead-error)"
                  stroke="#ffb4ab"
                  strokeWidth="1.5"
                />
              );
            })}
          </svg>
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 ${
                node.isRoot
                  ? 'bg-primary-container text-black border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                  : node.isCycle
                  ? 'bg-[#121212] border-2 border-error text-error'
                  : 'bg-[#121212] border border-[#404040] text-white'
              }`}
              style={{
                left: `${node.x}%`,
                top: `${node.y}px`,
                transform: 'translate(-50%, 0)',
              }}
            >
              {node.id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}