import React, { useState } from 'react';
import './App.css';
import ironManHeart from './assets/ironman-heart.svg'; // Placeholder, add your SVG to assets

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      });
      const data = await res.json();
      setOutput(data.prompt || data.error);
    } catch {
      setOutput('Error connecting to backend.');
    }
    setLoading(false);
  };

  return (
    <div className="friday-bg">
      <div className="friday-container">
        <img src={ironManHeart} alt="Iron Man Heart" className="friday-logo" />
        <h1>Friday - Prompt Generator</h1>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your idea or question..."
          rows={4}
        />
        <button onClick={handleGenerate} disabled={loading || !input}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        {output && (
          <div className="friday-output">
            <pre>{output}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
