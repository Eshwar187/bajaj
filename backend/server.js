const express = require('express');
const cors = require('cors');
const { processData } = require('./lib/processor');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── POST /bfhl ─────────────────────────────────────────────
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid request: "data" must be an array of strings.' });
    }

    const result = processData(data);
    return res.json(result);
  } catch (err) {
    console.error('Error processing /bfhl:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// ─── GET /bfhl (health check) ──────────────────────────────
app.get('/bfhl', (_req, res) => {
  res.json({ operation_code: 1 });
});

// ─── Start server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
