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
            //This is where things stop working
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage(`Processed Data: ${JSON.stringify(data.result)}`);
            } else {
                setResponseMessage(`Error: ${data.error}`);
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
            <div>{responseMessage}</div>
        </div>
    );
}

export default FileUpload;

