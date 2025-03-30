import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function FreeRecall() {
    const [recallContent, setRecallContent] = useState('');
    const navigate = useNavigate(); // Replace useHistory with useNavigate

    const handleRecallChange = (event) => {
        setRecallContent(event.target.value);
    };

    const handleSubmitRecall = () => {
        // Process recall content if needed (e.g., send it to the server for analysis)
        // After recall submission, redirect the user to the quiz page
        navigate('/quiz');  // Replaces history.push() from React Router v5
    };

    return (
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Free Recall Test</h1>
            <p>Please type everything you can recall from the notes you uploaded:</p>
            <textarea 
                value={recallContent} 
                onChange={handleRecallChange} 
                placeholder="Type your recall here..."
                style={{ width: '100%', height: '200px', padding: '10px', fontSize: '16px' }} 
            />
            <br />
            <button onClick={handleSubmitRecall} style={{ padding: '10px 20px', fontSize: '16px' }}>Submit Recall</button>
        </div>
    );
}

export default FreeRecall;
