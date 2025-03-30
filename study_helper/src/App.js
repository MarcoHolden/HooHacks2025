// import React, { useState } from 'react';

// function FileUpload() {
//     const [file, setFile] = useState(null);
//     const [responseMessage, setResponseMessage] = useState('');
//     const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState('');
//     const [quiz, setQuiz] = useState('');
//     const [summary, setSummary] = useState('');

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         setFile(selectedFile);
//     };

//     const handleFileUpload = async () => {
//       if (!file) {
//           setResponseMessage('Please select a file first!');
//           return;
//       }

//       const formData = new FormData();
//       formData.append("file", file);

//       try {
//           // Send the request
//           const response = await fetch('http://127.0.0.1:5000/upload', {
//               method: 'POST',
//               body: formData,
//           });

//           // Check if response is ok (status code 200)
//           if (response.ok) {
//               const data = await response.json(); // Parse the JSON response

//               // Log the full response data to the console for debugging
//               console.log("Full Response Data:", data);

//               // Log just the message to inspect it
//               console.log("Message:", data.message);

//               // Extract the correct values from the response
//               setResponseMessage(data.message);  // Display the 'message' part of the response

//               // Ensure you're passing the raw HTML string
//               setMultipleChoiceQuestions(data.multiple_choice_questions.multiple_choice_questions);
//               setQuiz(data.quiz);
//               setSummary(data.summary);
//           } else {
//               // Handle errors if response isn't ok (non-200 status)
//               const errorData = await response.json();
//               setResponseMessage(`Error: ${errorData.error}`);
//           }
//       } catch (err) {
//           console.error('Error uploading file:', err);
//           setResponseMessage('Error uploading file!');
//       }
//   };

//   return (
//       <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
//           <h1>Upload a Document</h1>
//           <input type="file" onChange={handleFileChange} />
//           <button onClick={handleFileUpload} style={{ padding: '10px 20px', fontSize: '16px' }}>Upload File</button>
          
//           <div style={{ marginTop: '20px' }}>
//               <h3 style={{ color: '#2c3e50' }}>Response Message:</h3>
//               <p style={{ fontSize: '18px', color: '#34495e' }}>{responseMessage}</p>
//           </div>

//           <div style={{ marginTop: '20px' }}>
//               <h3 style={{ color: '#2c3e50' }}>Multiple Choice Questions:</h3>
//               <div style={{ fontSize: '16px', color: '#2c3e50' }} dangerouslySetInnerHTML={{ __html: multipleChoiceQuestions }} />
//           </div>

//           <div style={{ marginTop: '20px' }}>
//               <h3 style={{ color: '#2c3e50' }}>Quiz:</h3>
//               <div style={{ fontSize: '16px', color: '#2c3e50' }} dangerouslySetInnerHTML={{ __html: quiz }} />
//           </div>

//           <div style={{ marginTop: '20px' }}>
//               <h3 style={{ color: '#2c3e50' }}>Summary:</h3>
//               <div style={{ fontSize: '16px', color: '#2c3e50' }} dangerouslySetInnerHTML={{ __html: summary }} />
//           </div>
//       </div>
//   );
// }

// export default FileUpload;
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import FileUpload from './FileUpload';
import FreeRecall from './FreeRecall'; // Changed to match correct file name
import Quiz from './Quiz';

// Create a component for the home page with a button
function HomePage() {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleGoToUpload = () => {
    navigate('/upload'); // Navigate to /upload route
  };

  return (
    <div>
      <h1>Welcome to the Study App</h1>
      <button onClick={handleGoToUpload}>Go to Upload</button> {/* Button to navigate */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/recall" element={<FreeRecall />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/" element={<HomePage />} /> {/* Home page with button */}
      </Routes>
    </Router>
  );
}

export default App;
