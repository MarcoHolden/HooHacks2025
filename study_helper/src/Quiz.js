// Quiz.js
import React, { useState, useEffect } from "react";
import { useFile } from './FileContext'; // Import the context

const Quiz = () => {
  const { file } = useFile(); // Access the file from context
  const [quizData, setQuizData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (file) {
      const handleFileUpload = async () => {
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
            setError(null);
          } else {
            setError(data.error || "Error uploading file.");
          }
        } catch (err) {
          setError("Error connecting to server.");
        }
      };

      handleFileUpload();
    }
  }, [file]); // Trigger upload when file changes

  return (
    <div>
      <h1>Quiz Results</h1>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {quizData ? (
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
      ) : (
        <p>Waiting for file upload...</p>
      )}
    </div>
  );
};

export default Quiz;
