// server.js
const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/', (_, res) => res.send('✅ Smll Me Chat API is running'));

// Quick check
app.get('/chat', (_, res) => res.json({ ok: true, msg: 'Use POST /chat with {message}' }));

// Real endpoint
app.post('/chat', async (req, res) => {
  try {
    const userMessage = String(req.body?.message || '').slice(0, 2000);

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a friendly aromatherapy assistant for Smll Me. Be helpful and safe.' },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await r.json();
    console.log('🔎 OpenAI API response:', JSON.stringify(data, null, 2));

    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.error?.message ??
      'Sorry, I had trouble.';
    res.json({ reply });
  } catch (err) {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

