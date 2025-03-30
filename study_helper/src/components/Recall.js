import React, { useState } from 'react';
import axios from 'axios';

const Recall = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await axios.post('http://localhost:5000/recall', { text });
      setResult(response.data.result);
    } catch (err) {
      setError('Error processing text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Text Correction</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter your text here"
          rows="10"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p><strong>Corrected Text:</strong> {result}</p>}
    </div>
  );
};

export default Recall;