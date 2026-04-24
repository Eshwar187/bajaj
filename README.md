<div align="center">
  <h1>🌌 Hierarchy Analyzer (BFHL)</h1>
  <p><strong>SRM Full Stack Engineering Challenge • Round 1 Submission</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Tests-92%2F92%20Passing-success" alt="Tests Passing" />
  </p>
</div>

---

## 📖 Overview

This repository contains a full-stack, production-ready solution for the structural analysis of directed graphs. It processes raw string inputs representing parent-child node relationships, resolves complex graph topologies (trees, diamonds, disconnected graphs, and cyclic groups), and visualizes the results through a premium, responsive user interface.

It fully complies with **100% of the SRM Engineering Challenge specifications**, including exact JSON schemas, lexicographical tiebreakers, multi-parent handling, and edge-case validation.

---

## ✨ Standout Features

### 🧠 Advanced Backend Processing (Node.js)
- **High-Performance Graph Engine:** Utilizes Adjacency Lists and Depth-First Search (DFS) for rapid cycle detection and tree traversal. Time complexity approaches $O(V + E)$ allowing sub-5ms responses for large node sets.
- **Strict Data Validation:** Automatically sanitizes whitespace, rejects invalid formats (`A->A`, `AB->C`, `hello`), and filters duplicate edges.
- **Complex Topology Handling:**
  - **Diamonds (Multi-parent):** First encountered parent edge claims the child. Subsequent parents are safely discarded.
  - **Pure Cycles:** Identifies unbroken cycles, sets `has_cycle: true`, leaves the tree empty `{}`, and correctly omits the depth key.
  - **Tiebreakers:** Evaluates tree depths and reliably breaks ties by selecting the lexicographically smallest root node.

### 🎨 Premium Frontend (React + Tailwind)
- **Interactive SVG Graph Visualization:** Automatically calculates node coordinates (using BFS tree layout algorithms) and draws SVG connecting edges. Features dynamic tooltips and animated path highlighting.
- **Cinematic UI/UX:** Built with glassmorphism principles, staggered CSS keyframe entrance animations, and pulse loading states.
- **Theme Engine:** Fully persistent Dark / Light mode toggle powered by custom CSS variable tokenization.
- **Real-Time Error Handling:** Contextual UI feedback for API unavailability, invalid JSON, or structural cyclic warnings.

---

## 🔒 Security & Reliability

The API has been hardened beyond the basic requirements to ensure enterprise-grade stability:
1. **`helmet` Integration**: Secures HTTP headers against XSS and MIME-sniffing.
2. **Rate Limiting (`express-rate-limit`)**: Protects the `/bfhl` endpoint from brute-force/DoS attacks.
3. **Automated Test Suite**: Includes a custom `test.js` runner that successfully executes **92 assertions across 20 distinct edge-case permutations** (including single edges, long chains, whitespace anomalies, and nested cycles).

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Start the Backend API
```bash
cd backend
npm install
npm run start
```
*The API will start on `http://localhost:3000`. Test it by visiting `http://localhost:3000/bfhl` in your browser.*

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be available at `http://localhost:5173`. It is pre-configured with a Vite proxy to prevent CORS issues during local development.*

---

## 📡 API Specification

**Endpoint:** `POST /bfhl`  
**Content-Type:** `application/json`

### Example Request
```json
{ 
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X"] 
}
```

### Example Response
```json
{
  "user_id": "eshwar_24042004",
  "email_id": "em5765@srmist.edu.in",
  "college_roll_number": "RA2211028010150",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "D": {} }, "C": {} } },
      "depth": 3
    },
    {
      "root": "X",
      "tree": {},
      "has_cycle": true
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 1,
    "largest_tree_root": "A"
  }
}
```

---

<div align="center">
  <i>Designed and engineered with precision by Eshwar.</i>
</div>
