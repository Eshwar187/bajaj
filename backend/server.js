const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { processData } = require('./lib/processor');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Hardening
app.use(helmet()); // Set HTTP headers to secure the app
app.disable('x-powered-by'); // Hide Express signature

// Rate limiting: max 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/bfhl', apiLimiter);

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
