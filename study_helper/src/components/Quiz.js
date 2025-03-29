import React, { useState, useEffect } from 'react';
import Question from './Question';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Replace with your API call or data fetching logic
    const fetchedQuestions = [
      { id: 1, text: 'What is the capital of France?' },
      { id: 2, text: 'What is 2 + 2?' },
      { id: 3, text: 'What is the powerhouse of the cell?' },
    ];
    setQuestions(fetchedQuestions);
  }, []);

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished, show results or next steps
      console.log('Quiz finished!');
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {currentQuestionIndex < questions.length ? (
        <Question
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      ) : (
        <div>Quiz completed!</div>
      )}
    </div>
  );
}

export default Quiz;