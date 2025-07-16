// Express backend for Friday - Prompt Generator
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// LLM connector with plug-and-play support
const llmConnector = async (userText) => {
  const llmUrl = process.env.LLM_URL || 'https://router.huggingface.co/fireworks-ai/inference/v1/chat/completions';
  const llmProvider = process.env.LLM_PROVIDER || 'huggingface';
  const hfToken = process.env.HF_TOKEN; // Hugging Face API token

  const payload = {
    messages: [
      {
        role: 'user',
        content: `Rewrite this as a senior technical engineer prompt: ${userText}`
      }
    ],
    model: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
    stream: false
  };

  const headers = hfToken
    ? { Authorization: `Bearer ${hfToken}` }
    : {};

  try {
    const response = await axios.post(llmUrl, payload, { headers });
    // Fireworks/HuggingFace returns { choices: [{ message: { content: ... } }] }
    if (response.data.choices && response.data.choices[0]?.message?.content) {
      return response.data.choices[0].message.content;
    } else {
      return JSON.stringify(response.data);
    }
  } catch (err) {
    console.error('LLM API error:', err.message);
    return 'Error: Unable to connect to Hugging Face LLM.';
  }
};

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { text } = req.body;
  console.log('Received request:', text); // Log incoming request
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  try {
    const prompt = await llmConnector(text);
    console.log('LLM response:', prompt); // Log LLM response
    res.json({ prompt });
  } catch (err) {
    console.error('Error in /api/generate:', err);
    res.status(500).json({ error: 'Failed to generate prompt' });
  }
});

app.get('/', (req, res) => {
  res.send('Friday - Prompt Generator backend is running.');
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
