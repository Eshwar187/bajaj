import { useState } from 'react';

const mockNodes = [
  { id: 'A', x: 50, y: 0, isRoot: true },
  { id: 'B', x: 25, y: 96, isRoot: false },
  { id: 'C', x: 75, y: 96, isRoot: false },
  { id: 'D', x: 25, y: 192, isRoot: false },
  { id: 'E', x: 75, y: 192, isRoot: false },
  { id: 'F', x: 50, y: 288, isRoot: false },
  { id: 'G', x: 90, y: 68, isCycle: true },
  { id: 'H', x: 90, y: 124, isCycle: true },
];

const mockEdges = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'C', to: 'E' },
  { from: 'D', to: 'F' },
  { from: 'E', to: 'F' },
];

const cycleEdges = [
  { from: 'G', to: 'H', isCycle: true },
  { from: 'H', to: 'G', isCycle: true },
];

export default function InputPanel({ inputData, setInputData }) {
  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col h-full">
      <div className="p-4 border-b border-[#1F1F1F]">
        <h2 className="text-[18px] font-semibold text-white">Input Data</h2>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-wide">NODE RELATIONSHIPS</label>
        <textarea
          className="w-full flex-1 bg-black border border-[#1F1F1F] rounded p-3 font-mono text-[13px] text-white focus:border-white focus:ring-0 resize-none min-h-[200px]"
          placeholder="A->B&#10;A->C&#10;B->D"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        <button className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-zinc-200 transition-colors">
          Run Analysis
        </button>
      </div>
    </div>
  );
}