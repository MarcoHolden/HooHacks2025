// src/components/DocumentAnalyzer.js
import React, { useState } from 'react';
import axios from 'axios';

function DocumentAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post('/analyze-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error analyzing document:', error);
      alert('Failed to analyze document.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleAnalyze}>Analyze Document</button>
      {analysis && <div>{analysis}</div>}
    </div>
  );
}

export default DocumentAnalyzer;