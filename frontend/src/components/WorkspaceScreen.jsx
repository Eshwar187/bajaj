import { useState, useCallback } from 'react';
import InputPanel from './InputPanel';
import GraphPanel from './GraphPanel';
import SummaryPanel from './SummaryPanel';
import HierarchyPanel from './HierarchyPanel';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function WorkspaceScreen() {
  const [inputData, setInputData] = useState(`A->B
A->C
B->D
C->E
E->F
X->Y
Y->Z
Z->X
P->Q
Q->R
G->H
G->H
G->I
hello
1->2
A->`);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const lines = inputData
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0);

      const res = await fetch(`${API_URL}/bfhl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: lines }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [inputData]);

  // Build nodes & edges for the graph panel from the result
  const { graphNodes, graphEdges, cycleEdges } = buildGraphData(result);

  return (
    <main className="ml-64 pt-14 p-8 flex flex-col gap-6 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
          <InputPanel
            inputData={inputData}
            setInputData={setInputData}
            onRun={runAnalysis}
            loading={loading}
            error={error}
          />
        </div>
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-2">
          <GraphPanel nodes={graphNodes} edges={graphEdges} cycleEdges={cycleEdges} />
        </div>
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-2">
          <SummaryPanel result={result} loading={loading} />
        </div>
      </div>
      <div>
        <HierarchyPanel result={result} loading={loading} />
      </div>
    </main>
  );
}

/** Transforms API result into graph visualization data */
function buildGraphData(result) {
  if (!result || !result.hierarchies) {
    return { graphNodes: [], graphEdges: [], cycleEdges: [] };
  }

  const graphNodes = [];
  const graphEdges = [];
  const cycleEdges = [];
  let xOffset = 0;

  for (const hierarchy of result.hierarchies) {
    if (hierarchy.has_cycle) {
      // Render cycle nodes in a circle
      const cycleNodes = extractCycleNodes(hierarchy, result);
      const cx = xOffset + 50;
      cycleNodes.forEach((nodeId, i) => {
        const angle = (2 * Math.PI * i) / cycleNodes.length - Math.PI / 2;
        const r = 40;
        graphNodes.push({
          id: `${nodeId}-cycle`,
          label: nodeId,
          x: cx + r * Math.cos(angle),
          y: 200 + r * Math.sin(angle),
          isCycle: true,
        });
      });
      // Cycle edges
      for (let i = 0; i < cycleNodes.length; i++) {
        cycleEdges.push({
          from: `${cycleNodes[i]}-cycle`,
          to: `${cycleNodes[(i + 1) % cycleNodes.length]}-cycle`,
          isCycle: true,
        });
      }
      xOffset += 120;
    } else {
      // BFS layout for tree
      const tree = hierarchy.tree;
      const root = hierarchy.root;
      const positions = layoutTree(tree, root, xOffset);
      for (const [id, pos] of Object.entries(positions)) {
        graphNodes.push({ id, label: id, x: pos.x, y: pos.y, isRoot: id === root });
      }
      // Extract edges from tree
      addTreeEdges(tree, graphEdges);
      xOffset += Object.keys(positions).length * 60 + 40;
    }
  }

  // Normalize x positions into percentages
  const maxX = Math.max(...graphNodes.map(n => n.x), 1);
  const padding = 10;
  graphNodes.forEach(n => {
    n.x = padding + ((n.x / (maxX + 50)) * (100 - 2 * padding));
  });

  return { graphNodes, graphEdges, cycleEdges };
}

function extractCycleNodes(hierarchy) {
  // For cycle groups, the root is the lex-smallest; we know the group
  // but we don't have explicit node list — infer from root + context
  // Just return root for now; the backend doesn't provide cycle membership
  return [hierarchy.root];
}

function layoutTree(tree, root, xOffset, depth = 0, positions = {}, xCounter = { x: xOffset }) {
  if (!tree || !tree[root]) {
    positions[root] = { x: xCounter.x, y: depth * 90 + 40 };
    xCounter.x += 60;
    return positions;
  }

  const children = Object.keys(tree[root]);
  if (children.length === 0) {
    positions[root] = { x: xCounter.x, y: depth * 90 + 40 };
    xCounter.x += 60;
    return positions;
  }

  for (const child of children) {
    layoutTree(tree[root], child, xOffset, depth + 1, positions, xCounter);
  }

  // Root positioned at the center of its children
  const childXs = children.map(c => positions[c].x);
  positions[root] = { x: (Math.min(...childXs) + Math.max(...childXs)) / 2, y: depth * 90 + 40 };
  return positions;
}

function addTreeEdges(tree, edges) {
  for (const parent of Object.keys(tree)) {
    const children = tree[parent];
    for (const child of Object.keys(children)) {
      edges.push({ from: parent, to: child });
      addTreeEdges({ [child]: children[child] }, edges);
    }
  }
}