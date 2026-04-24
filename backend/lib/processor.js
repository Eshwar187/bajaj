/**
 * BFHL Hierarchy Processor
 *
 * Parses an array of edge-strings ("X->Y"), validates them,
 * detects duplicates, builds independent trees, detects cycles,
 * and computes depth + summary statistics.
 */

// ─── Identity (replace with your actual credentials) ────────
const USER_ID    = 'eshwar_24042004';
const EMAIL_ID   = 'em5765@srmist.edu.in';
const ROLL_NO    = 'RA2211028010150';

// ─── Regex: exactly  single-uppercase -> single-uppercase ───
const EDGE_RE = /^([A-Z])->([A-Z])$/;

/**
 * Main entry point — takes raw `data` array, returns the full response.
 */
function processData(data) {
  const invalidEntries  = [];
  const duplicateEdges  = [];
  const seenEdges       = new Set();
  const validEdges      = [];          // { from, to }

  // ── Step 1: validate, deduplicate ──────────────────────────
  for (const raw of data) {
    const entry = (typeof raw === 'string' ? raw : String(raw)).trim();

    const match = entry.match(EDGE_RE);
    if (!match) {
      invalidEntries.push(entry);
      continue;
    }

    const [, parent, child] = match;

    // Self-loop → invalid
    if (parent === child) {
      invalidEntries.push(entry);
      continue;
    }

    const key = `${parent}->${child}`;
    if (seenEdges.has(key)) {
      // Only record duplicate once
      if (!duplicateEdges.includes(key)) {
        duplicateEdges.push(key);
      }
      continue;
    }

    seenEdges.add(key);
    validEdges.push({ from: parent, to: child });
  }

  // ── Step 2: diamond / multi-parent handling ────────────────
  //    First parent edge wins; subsequent parent edges discarded.
  const childParentMap = new Map();   // child → parent (first encountered)
  const usedEdges = [];

  for (const edge of validEdges) {
    if (childParentMap.has(edge.to)) {
      // silently discard — child already has a parent
      continue;
    }
    childParentMap.set(edge.to, edge.from);
    usedEdges.push(edge);
  }

  // ── Step 3: build adjacency + collect all nodes ────────────
  const adj      = new Map();   // parent → [child, …]
  const allNodes = new Set();

  for (const edge of usedEdges) {
    allNodes.add(edge.from);
    allNodes.add(edge.to);
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    adj.get(edge.from).push(edge.to);
  }

  // ── Step 4: find connected components via undirected BFS ───
  const undirected = new Map();
  for (const edge of usedEdges) {
    if (!undirected.has(edge.from)) undirected.set(edge.from, []);
    if (!undirected.has(edge.to))   undirected.set(edge.to, []);
    undirected.get(edge.from).push(edge.to);
    undirected.get(edge.to).push(edge.from);
  }

  const visited    = new Set();
  const components = [];   // each: Set of node labels

  for (const node of allNodes) {
    if (visited.has(node)) continue;
    const component = new Set();
    const queue = [node];
    while (queue.length) {
      const cur = queue.shift();
      if (visited.has(cur)) continue;
      visited.add(cur);
      component.add(cur);
      for (const nb of (undirected.get(cur) || [])) {
        if (!visited.has(nb)) queue.push(nb);
      }
    }
    components.push(component);
  }

  // ── Step 5: for each component, detect cycle / build tree ──
  const hierarchies = [];

  for (const comp of components) {
    // Children in this component
    const childrenInComp = new Set();
    for (const edge of usedEdges) {
      if (comp.has(edge.from) && comp.has(edge.to)) {
        childrenInComp.add(edge.to);
      }
    }

    // Roots = nodes that never appear as a child
    const roots = [...comp].filter(n => !childrenInComp.has(n));

    // ── Cycle detection via DFS ──────────────────────────────
    const hasCycle = detectCycle(comp, adj);

    if (hasCycle) {
      // Pick lexicographically smallest node as root label
      const root = [...comp].sort()[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      // Should have exactly one root in an acyclic connected component
      const root = roots.sort()[0];
      const tree = buildTree(root, adj);
      const depth = computeDepth(tree);
      hierarchies.push({ root, tree, depth });
    }
  }

  // ── Step 6: summary ────────────────────────────────────────
  const validTrees = hierarchies.filter(h => !h.has_cycle);
  const totalTrees  = validTrees.length;
  const totalCycles = hierarchies.filter(h => h.has_cycle).length;

  let largestTreeRoot = '';
  let maxDepth = -1;
  for (const t of validTrees) {
    if (
      t.depth > maxDepth ||
      (t.depth === maxDepth && t.root < largestTreeRoot)
    ) {
      maxDepth = t.depth;
      largestTreeRoot = t.root;
    }
  }

  return {
    user_id:             USER_ID,
    email_id:            EMAIL_ID,
    college_roll_number: ROLL_NO,
    hierarchies,
    invalid_entries:     invalidEntries,
    duplicate_edges:     duplicateEdges,
    summary: {
      total_trees:       totalTrees,
      total_cycles:      totalCycles,
      largest_tree_root: largestTreeRoot,
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────

/**
 * DFS cycle detection within a component.
 */
function detectCycle(comp, adj) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  for (const node of comp) color.set(node, WHITE);

  function dfs(node) {
    color.set(node, GRAY);
    for (const child of (adj.get(node) || [])) {
      if (!comp.has(child)) continue;
      if (color.get(child) === GRAY)  return true;   // back-edge → cycle
      if (color.get(child) === WHITE && dfs(child)) return true;
    }
    color.set(node, BLACK);
    return false;
  }

  for (const node of comp) {
    if (color.get(node) === WHITE && dfs(node)) return true;
  }
  return false;
}

/**
 * Recursively build a nested tree object.
 */
function buildTree(root, adj) {
  const children = adj.get(root) || [];
  const subtree = {};
  for (const child of children) {
    Object.assign(subtree, buildTree(child, adj));
  }
  return { [root]: subtree };
}

/**
 * Compute depth = node-count on longest root-to-leaf path.
 */
function computeDepth(treeObj) {
  const keys = Object.keys(treeObj);
  if (keys.length === 0) return 0;

  const root = keys[0];
  const children = treeObj[root];
  const childKeys = Object.keys(children);

  if (childKeys.length === 0) return 1;

  let maxChildDepth = 0;
  for (const ck of childKeys) {
    const d = computeDepth({ [ck]: children[ck] });
    if (d > maxChildDepth) maxChildDepth = d;
  }
  return 1 + maxChildDepth;
}

module.exports = { processData };
