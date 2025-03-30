import React, { useState } from 'react';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleFileUpload = async () => {
      if (!file) {
          setResponseMessage('Please select a file first!');
          return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
          const response = await fetch('http://127.0.0.1:5000/upload', {
              method: 'POST',
              body: formData,
          });
  
          if (!response.ok) {
              // Handle HTTP errors more gracefully
              let errorText = "File upload failed"; // Default error message
              try {
                  const errorData = await response.json(); // Try to parse JSON error response
                  if (errorData && errorData.error) {
                      errorText = errorData.error;
                  }
              } catch (jsonError) {
                  console.error("Failed to parse error response as JSON", jsonError);
                  // If parsing JSON fails, use default or response text
                  if (response.statusText) {
                      errorText = response.statusText; 
                  }
              }
              throw new Error(errorText); 
          }
  
          const data = await response.json();
  
          if (data && data.result && data.result.result) { // Safely access nested properties
              setResponseMessage(data.result.result);
          } else if (data && data.message) {
              setResponseMessage(data.message); // Or handle a success message
          }
           else {
              setResponseMessage(data.error || "Unknown success or error"); // Fallback
          }
            
        } catch (err) {
            console.log(file);
            console.error('Error uploading file:', err);
            setResponseMessage('Error uploading file!');
        }
    };

    return (
        <div>
            <h1>Upload a Document</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload File</button>
            <pre>{responseMessage}</pre>
        </div>
    );
}

export default FileUpload;