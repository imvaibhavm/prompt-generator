// Express backend for Friday - Prompt Generator
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// LLM connector with plug-and-play support
const llmConnector = async (userText) => {
  // Use environment variables or config for LLM provider
  const llmUrl = process.env.LLM_URL || 'http://localhost:11434/api/generate';
  const llmModel = process.env.LLM_MODEL || 'llama3';
  const llmProvider = process.env.LLM_PROVIDER || 'ollama';

  let payload;
  if (llmProvider === 'ollama') {
    payload = {
      model: llmModel,
      prompt: `Rewrite this as a senior technical engineer prompt: ${userText}`,
      stream: false
    };
  } else if (llmProvider === 'chatgpt') {
    payload = {
      prompt: `Rewrite this as a senior technical engineer prompt: ${userText}`,
      // Add other ChatGPT-specific params here
    };
  } else {
    payload = { prompt: userText };
  }

  try {
    const response = await axios.post(llmUrl, payload);
    // Adjust response parsing based on provider
    if (llmProvider === 'ollama') {
      return response.data.response || 'No response from LLM.';
    } else if (llmProvider === 'chatgpt') {
      return response.data.choices?.[0]?.text || response.data.result || 'No response from LLM.';
    } else {
      return response.data.result || 'No response from LLM.';
    }
  } catch (err) {
    console.error('LLM API error:', err.message);
    return 'Error: Unable to connect to LLM.';
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
