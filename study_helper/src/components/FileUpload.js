import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ setFileProcessed }) => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response from backend:', response.data);

      if (response.data.summary) { // Changed to summary
        setSummary(response.data.summary); // changed to summary
        setFileProcessed(true);
      } else {
        setError('Failed to process the file');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Your File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Summarize'}
      </button>

      {summary && (
        <div>
          <h2>Gemini Summary:</h2>
          <p>{summary}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default FileUpload;