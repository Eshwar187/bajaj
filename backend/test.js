/**
 * Comprehensive test suite for POST /bfhl
 * Covers every edge case from the SRM spec.
 * Run: node test.js
 */

const BASE = 'http://localhost:3000';
let passed = 0, failed = 0;

async function post(data) {
  const res = await fetch(`${BASE}/bfhl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  return res.json();
}

function assert(condition, msg) {
  if (condition) { passed++; console.log(`  ✅ ${msg}`); }
  else { failed++; console.error(`  ❌ FAIL: ${msg}`); }
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ═══════════════════════════════════════════════════════════════
// TEST 1: Full spec example
// ═══════════════════════════════════════════════════════════════
async function testSpecExample() {
  console.log('\n━━━ TEST 1: Full spec example ━━━');
  const r = await post([
    "A->B", "A->C", "B->D", "C->E", "E->F",
    "X->Y", "Y->Z", "Z->X",
    "P->Q", "Q->R",
    "G->H", "G->H", "G->I",
    "hello", "1->2", "A->"
  ]);

  assert(r.user_id === 'eshwar_24042004', `user_id = "${r.user_id}"`);
  assert(r.email_id === 'em5765@srmist.edu.in', `email_id present`);
  assert(r.college_roll_number === 'RA2211028010150', `roll number present`);

  // Hierarchies
  assert(r.hierarchies.length === 4, `4 hierarchies (got ${r.hierarchies.length})`);

  const hA = r.hierarchies.find(h => h.root === 'A');
  assert(hA && hA.depth === 4, `Tree A depth=4 (got ${hA?.depth})`);
  assert(hA && !hA.has_cycle, `Tree A has no cycle`);
  assert(hA && deepEqual(hA.tree, { A: { B: { D: {} }, C: { E: { F: {} } } } }), `Tree A structure correct`);

  const hX = r.hierarchies.find(h => h.root === 'X');
  assert(hX && hX.has_cycle === true, `X is cyclic`);
  assert(hX && deepEqual(hX.tree, {}), `X tree is empty {}`);
  assert(hX && hX.depth === undefined, `X has no depth field`);

  const hP = r.hierarchies.find(h => h.root === 'P');
  assert(hP && hP.depth === 3, `Tree P depth=3`);
  assert(hP && deepEqual(hP.tree, { P: { Q: { R: {} } } }), `Tree P structure correct`);

  const hG = r.hierarchies.find(h => h.root === 'G');
  assert(hG && hG.depth === 2, `Tree G depth=2`);
  assert(hG && deepEqual(hG.tree, { G: { H: {}, I: {} } }), `Tree G structure correct`);

  // Invalid entries
  assert(deepEqual(r.invalid_entries, ['hello', '1->2', 'A->']), `invalid_entries correct`);

  // Duplicate edges
  assert(deepEqual(r.duplicate_edges, ['G->H']), `duplicate_edges = ["G->H"]`);

  // Summary
  assert(r.summary.total_trees === 3, `total_trees=3`);
  assert(r.summary.total_cycles === 1, `total_cycles=1`);
  assert(r.summary.largest_tree_root === 'A', `largest_tree_root=A`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 2: Invalid entries (all types from the spec)
// ═══════════════════════════════════════════════════════════════
async function testInvalidEntries() {
  console.log('\n━━━ TEST 2: Invalid entry types ━━━');
  const r = await post([
    "hello",       // Not a node format
    "1->2",        // Not uppercase letters
    "AB->C",       // Multi-character parent
    "A-B",         // Wrong separator
    "A->",         // Missing child node
    "A->A",        // Self-loop
    "",            // Empty string
    " A->B ",      // Whitespace — should be VALID after trim
  ]);

  // "hello", "1->2", "AB->C", "A-B", "A->", "A->A", "" should be invalid
  assert(r.invalid_entries.length === 7, `7 invalid entries (got ${r.invalid_entries.length})`);
  assert(r.invalid_entries.includes('hello'), `"hello" is invalid`);
  assert(r.invalid_entries.includes('1->2'), `"1->2" is invalid`);
  assert(r.invalid_entries.includes('AB->C'), `"AB->C" is invalid`);
  assert(r.invalid_entries.includes('A-B'), `"A-B" is invalid`);
  assert(r.invalid_entries.includes('A->'), `"A->" is invalid`);
  assert(r.invalid_entries.includes('A->A'), `"A->A" is invalid (self-loop)`);
  assert(r.invalid_entries.includes(''), `"" is invalid (empty string)`);

  // " A->B " should be VALID after trimming
  assert(r.hierarchies.length === 1, `1 valid hierarchy from " A->B " (got ${r.hierarchies.length})`);
  assert(r.hierarchies[0].root === 'A', `Root is A from trimmed " A->B "`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 3: Duplicate edges — only recorded once
// ═══════════════════════════════════════════════════════════════
async function testDuplicateEdges() {
  console.log('\n━━━ TEST 3: Duplicate edges ━━━');
  const r = await post(["A->B", "A->B", "A->B"]);

  assert(deepEqual(r.duplicate_edges, ['A->B']), `duplicate_edges=["A->B"] (appears once, not twice)`);
  assert(r.hierarchies.length === 1, `Still 1 hierarchy`);
  assert(r.hierarchies[0].depth === 2, `depth=2`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 4: Diamond / multi-parent — first parent wins
// ═══════════════════════════════════════════════════════════════
async function testDiamondMultiParent() {
  console.log('\n━━━ TEST 4: Diamond / multi-parent ━━━');
  const r = await post(["A->D", "B->D", "A->B"]);

  // A->D first, so D is child of A. B->D is discarded (D already has parent).
  // A->B makes B child of A. So tree: A -> {B: {}, D: {}}
  assert(r.hierarchies.length === 1, `1 hierarchy`);
  const h = r.hierarchies[0];
  assert(h.root === 'A', `root=A`);
  // D should be child of A (first parent edge), not B
  assert(h.tree.A && h.tree.A.D !== undefined, `D is child of A (first parent wins)`);
  assert(h.tree.A && h.tree.A.B !== undefined, `B is also child of A`);
  // D should NOT be under B
  assert(!h.tree.A?.B?.D, `D is NOT under B (multi-parent discarded)`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 5: Pure cycle — all nodes are children
// ═══════════════════════════════════════════════════════════════
async function testPureCycle() {
  console.log('\n━━━ TEST 5: Pure cycle ━━━');
  const r = await post(["X->Y", "Y->Z", "Z->X"]);

  assert(r.hierarchies.length === 1, `1 hierarchy`);
  const h = r.hierarchies[0];
  assert(h.has_cycle === true, `has_cycle=true`);
  assert(deepEqual(h.tree, {}), `tree={}`);
  assert(h.depth === undefined, `no depth field`);
  assert(h.root === 'X', `root=X (lex smallest)`);
  assert(r.summary.total_trees === 0, `total_trees=0`);
  assert(r.summary.total_cycles === 1, `total_cycles=1`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 6: Single edge
// ═══════════════════════════════════════════════════════════════
async function testSingleEdge() {
  console.log('\n━━━ TEST 6: Single edge ━━━');
  const r = await post(["A->B"]);

  assert(r.hierarchies.length === 1, `1 hierarchy`);
  assert(r.hierarchies[0].root === 'A', `root=A`);
  assert(r.hierarchies[0].depth === 2, `depth=2 (A->B = 2 nodes)`);
  assert(deepEqual(r.hierarchies[0].tree, { A: { B: {} } }), `tree correct`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 7: Multiple independent trees
// ═══════════════════════════════════════════════════════════════
async function testMultipleTrees() {
  console.log('\n━━━ TEST 7: Multiple independent trees ━━━');
  const r = await post(["A->B", "A->C", "D->E", "D->F", "F->G"]);

  assert(r.hierarchies.length === 2, `2 hierarchies`);
  const hA = r.hierarchies.find(h => h.root === 'A');
  const hD = r.hierarchies.find(h => h.root === 'D');
  assert(hA && hA.depth === 2, `Tree A depth=2`);
  assert(hD && hD.depth === 3, `Tree D depth=3`);
  assert(r.summary.largest_tree_root === 'D', `largest_tree_root=D`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 8: Depth tiebreaker — lex smallest root wins
// ═══════════════════════════════════════════════════════════════
async function testDepthTiebreaker() {
  console.log('\n━━━ TEST 8: Depth tiebreaker ━━━');
  // Two trees, both depth 2
  const r = await post(["B->C", "A->D"]);

  assert(r.hierarchies.length === 2, `2 hierarchies`);
  assert(r.summary.largest_tree_root === 'A', `tiebreaker: A < B (got "${r.summary.largest_tree_root}")`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 9: Empty data array
// ═══════════════════════════════════════════════════════════════
async function testEmptyData() {
  console.log('\n━━━ TEST 9: Empty data array ━━━');
  const r = await post([]);

  assert(r.hierarchies.length === 0, `no hierarchies`);
  assert(r.invalid_entries.length === 0, `no invalid entries`);
  assert(r.duplicate_edges.length === 0, `no duplicate edges`);
  assert(r.summary.total_trees === 0, `total_trees=0`);
  assert(r.summary.total_cycles === 0, `total_cycles=0`);
  assert(r.summary.largest_tree_root === '', `largest_tree_root="" (empty)`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 10: All invalid inputs
// ═══════════════════════════════════════════════════════════════
async function testAllInvalid() {
  console.log('\n━━━ TEST 10: All invalid inputs ━━━');
  const r = await post(["hello", "world", "123", "a->b", "->A", ""]);

  assert(r.hierarchies.length === 0, `no hierarchies`);
  assert(r.invalid_entries.length === 6, `6 invalid entries`);
  assert(r.summary.total_trees === 0, `total_trees=0`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 11: Long chain — depth test
// ═══════════════════════════════════════════════════════════════
async function testLongChain() {
  console.log('\n━━━ TEST 11: Long chain depth ━━━');
  const r = await post(["A->B", "B->C", "C->D", "D->E", "E->F"]);

  assert(r.hierarchies.length === 1, `1 hierarchy`);
  assert(r.hierarchies[0].depth === 6, `depth=6 (A-B-C-D-E-F)`);
  assert(r.hierarchies[0].root === 'A', `root=A`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 12: Cycle with tail — should detect cycle
// ═══════════════════════════════════════════════════════════════
async function testCycleWithTail() {
  console.log('\n━━━ TEST 12: Multi-parent prevents cycle ━━━');
  const r = await post(["A->B", "B->C", "C->B"]);

  // C->B is DISCARDED because B already has parent A (multi-parent rule).
  // Remaining edges: A->B, B->C — a valid chain, depth=3.
  const h = r.hierarchies[0];
  assert(h.has_cycle !== true, `NOT cyclic (C->B discarded by multi-parent rule)`);
  assert(h.depth === 3, `depth=3 (A->B->C chain)`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 13: GET /bfhl health check
// ═══════════════════════════════════════════════════════════════
async function testGetEndpoint() {
  console.log('\n━━━ TEST 13: GET /bfhl health check ━━━');
  const res = await fetch(`${BASE}/bfhl`);
  const r = await res.json();
  assert(r.operation_code === 1, `operation_code=1`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 14: Invalid request body
// ═══════════════════════════════════════════════════════════════
async function testInvalidBody() {
  console.log('\n━━━ TEST 14: Invalid request body ━━━');

  // No data field
  let res = await fetch(`${BASE}/bfhl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ foo: 'bar' }),
  });
  assert(res.status === 400, `Missing "data" → 400 (got ${res.status})`);

  // data is not an array
  res = await fetch(`${BASE}/bfhl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: 'not an array' }),
  });
  assert(res.status === 400, `data=string → 400 (got ${res.status})`);

  // Invalid JSON
  res = await fetch(`${BASE}/bfhl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not json at all',
  });
  assert(res.status === 400, `Invalid JSON → 400 (got ${res.status})`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 15: Lowercase letters — should be invalid
// ═══════════════════════════════════════════════════════════════
async function testLowercaseInvalid() {
  console.log('\n━━━ TEST 15: Lowercase letters ━━━');
  const r = await post(["a->b", "a->B", "A->b"]);
  assert(r.invalid_entries.length === 3, `All 3 lowercase variants are invalid`);
  assert(r.hierarchies.length === 0, `No hierarchies`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 16: Identity fields always present
// ═══════════════════════════════════════════════════════════════
async function testIdentityFields() {
  console.log('\n━━━ TEST 16: Identity fields always present ━━━');
  const r = await post(["A->B"]);
  assert(typeof r.user_id === 'string' && r.user_id.length > 0, `user_id is non-empty string`);
  assert(typeof r.email_id === 'string' && r.email_id.length > 0, `email_id is non-empty string`);
  assert(typeof r.college_roll_number === 'string' && r.college_roll_number.length > 0, `college_roll_number is non-empty string`);
  assert(r.user_id.includes('_'), `user_id contains underscore (format: name_ddmmyyyy)`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 17: has_cycle should NOT be present in valid trees
// ═══════════════════════════════════════════════════════════════
async function testNoCycleFalse() {
  console.log('\n━━━ TEST 17: has_cycle not present for valid trees ━━━');
  const r = await post(["A->B", "B->C"]);
  const h = r.hierarchies[0];
  assert(!('has_cycle' in h), `has_cycle key NOT present in valid tree (should be omitted, not false)`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 18: Response schema completeness
// ═══════════════════════════════════════════════════════════════
async function testResponseSchema() {
  console.log('\n━━━ TEST 18: Response schema completeness ━━━');
  const r = await post(["A->B"]);
  assert('user_id' in r, `has user_id`);
  assert('email_id' in r, `has email_id`);
  assert('college_roll_number' in r, `has college_roll_number`);
  assert('hierarchies' in r && Array.isArray(r.hierarchies), `has hierarchies array`);
  assert('invalid_entries' in r && Array.isArray(r.invalid_entries), `has invalid_entries array`);
  assert('duplicate_edges' in r && Array.isArray(r.duplicate_edges), `has duplicate_edges array`);
  assert('summary' in r && typeof r.summary === 'object', `has summary object`);
  assert('total_trees' in r.summary, `summary has total_trees`);
  assert('total_cycles' in r.summary, `summary has total_cycles`);
  assert('largest_tree_root' in r.summary, `summary has largest_tree_root`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 19: Whitespace handling
// ═══════════════════════════════════════════════════════════════
async function testWhitespace() {
  console.log('\n━━━ TEST 19: Whitespace handling ━━━');
  const r = await post(["  A->B  ", "  C->D  "]);
  assert(r.hierarchies.length === 2, `2 hierarchies from trimmed whitespace entries`);
  assert(r.invalid_entries.length === 0, `No invalid entries — whitespace trimmed`);
}

// ═══════════════════════════════════════════════════════════════
// TEST 20: Two-node cycle
// ═══════════════════════════════════════════════════════════════
async function testTwoNodeCycle() {
  console.log('\n━━━ TEST 20: Two-node cycle ━━━');
  const r = await post(["A->B", "B->A"]);

  // A->B is valid, B->A: B already has parent A, so B->A is discarded (multi-parent).
  // Wait — A is the parent of B. Then B->A: A would become child of B,
  // but A is already not a child of anyone in the first edge.
  // Let me re-read the spec: "Diamond / multi-parent case: if a node has more than one parent"
  // In B->A, A is the child. A has no previous parent. So B->A is kept.
  // Now we have edges: A->B and B->A, forming a cycle.
  const h = r.hierarchies[0];
  assert(h.has_cycle === true, `A↔B is a cycle`);
}

// ═══════════════════════════════════════════════════════════════
// RUN ALL
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log('🔬 Running comprehensive BFHL test suite...\n');

  await testSpecExample();
  await testInvalidEntries();
  await testDuplicateEdges();
  await testDiamondMultiParent();
  await testPureCycle();
  await testSingleEdge();
  await testMultipleTrees();
  await testDepthTiebreaker();
  await testEmptyData();
  await testAllInvalid();
  await testLongChain();
  await testCycleWithTail();
  await testGetEndpoint();
  await testInvalidBody();
  await testLowercaseInvalid();
  await testIdentityFields();
  await testNoCycleFalse();
  await testResponseSchema();
  await testWhitespace();
  await testTwoNodeCycle();

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
  console.log(`${'═'.repeat(50)}`);

  if (failed > 0) {
    console.log('\n⚠️  FIX THE FAILURES ABOVE BEFORE SUBMITTING!\n');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL TESTS PASSED — READY TO SUBMIT!\n');
    process.exit(0);
  }
}

main().catch(e => { console.error('Test runner error:', e); process.exit(1); });
