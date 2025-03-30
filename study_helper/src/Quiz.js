import React, { useState } from "react";

// Quiz Component
const Quiz = () => {
  const [file, setFile] = useState(null); // Holds the file to upload
  const [quizData, setQuizData] = useState(null); // Holds the quiz, summary, and questions
  const [error, setError] = useState(null); // Holds any error messages

  // Handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Upload the file and retrieve the quiz data
  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setQuizData({
          summary: data.summary,
          quiz: data.quiz,
          multipleChoiceQuestions: data.multiple_choice_questions,
        });
        setError(null); // Clear any previous errors
      } else {
        setError(data.error || "Error uploading file.");
      }
    } catch (err) {
      setError("Error connecting to server.");
    }
  };

  return (
    <div>
      <h1>Upload a File to Generate a Quiz</h1>

      {/* File input */}
      <input type="file" onChange={handleFileChange} />

      {/* Upload button */}
      <button onClick={handleFileUpload}>Upload File</button>

      {/* Display error if any */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Display the quiz data */}
      {quizData && (
        <div>
          <h2>Summary</h2>
          <p>{quizData.summary}</p>

          <h2>Quiz</h2>
          <p>{quizData.quiz}</p>

          <h2>Multiple Choice Questions</h2>
          <div
            dangerouslySetInnerHTML={{
              __html: quizData.multipleChoiceQuestions,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Quiz;
