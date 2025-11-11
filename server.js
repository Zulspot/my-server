// server.js
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const app = express();
app.use(express.json());

// --- Chat endpoint ---
app.post('/chat', async (req, res) => {
  try {
    const userMessage = (req.body?.message || '').toString().slice(0, 2000);

    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        input: [
          { role: 'system', content: 'You are a friendly aromatherapy assistant for Smll Me.' },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await r.json();
    const reply =
      data.output_text ||
      data.choices?.[0]?.message?.content ||
      'Sorry, I had trouble responding.';
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Default route ---
app.get('/', (req, res) => {
  res.send('✅ Smll Me Chat API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
3~/ server.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Hello from Express server!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});


