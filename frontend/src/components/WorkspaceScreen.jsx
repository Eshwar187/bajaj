import { useState } from 'react';
import InputPanel from './InputPanel';
import GraphPanel from './GraphPanel';
import SummaryPanel from './SummaryPanel';
import HierarchyPanel from './HierarchyPanel';

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

export default function WorkspaceScreen() {
  const [inputData, setInputData] = useState(`A->B
A->C
B->D
C->E
D->F
E->F
G->H
H->G`);

  return (
    <main className="ml-64 pt-14 p-8 flex flex-col gap-6 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
          <InputPanel inputData={inputData} setInputData={setInputData} />
        </div>
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-2">
          <GraphPanel nodes={mockNodes} edges={mockEdges} cycleEdges={cycleEdges} />
        </div>
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
          <SummaryPanel />
        </div>
      </div>
      <div>
        <HierarchyPanel />
      </div>
    </main>
  );
}