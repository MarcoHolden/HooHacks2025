// FileUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useFile } from './FileContext';

function FileUpload() {
  const navigate = useNavigate(); // Initialize the navigate hook
  const { setFile } = useFile(); 
  const [localFile, setLocalFile] = useState(null); // State to store the selected file

  // Handle file selection
  const handleFileChange = (e) => {
    setLocalFile(e.target.files[0]); // Set the selected file into state
  };

  // Handle form submission (e.g., upload file)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!localFile) {
      alert('Please select a file to upload!');
      return;
    }

    // You would normally upload the file here, using an API or similar.
    // For now, let's simulate the file upload with a timeout.
    console.log('Uploading file:', localFile.name);
    setFile(localFile);
    // Simulate file upload process with a timeout
    setTimeout(() => {
      alert('File uploaded successfully!');

      // After file upload, navigate to the /quiz route
      navigate('/recall');  // This redirects the user to the /quiz route
    }, 1000); // Simulate a 1-second delay
  };

  return (
    <div>
      <h1>File Upload</h1>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          onChange={handleFileChange}  // Handle file selection
        />
        <button type="submit">Upload File</button>
      </form>

      {localFile && <p>Selected File: {localFile.name}</p>} {/* Show selected file name */}
    </div>
  );
}

export default FileUpload;
