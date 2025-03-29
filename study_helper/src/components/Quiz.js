import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './Question';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [questionPerformance, setQuestionPerformance] = useState({});
  const [questionOrder, setQuestionOrder] = useState([]);
  const [interactionData, setInteractionData] = useState([]);
  const [persona, setPersona] = useState(null);

  useEffect(() => {
    const fetchedQuestions = [
      { id: 1, text: 'What is the capital of France?', answer: 'paris'},
      { id: 2, text: 'What is 2 + 2?', answer: '4'},
      { id: 3, text: 'What is the powerhouse of the cell?', answer:'mitochondria'},
    ];
    setQuestions(fetchedQuestions);
    setQuestionOrder(fetchedQuestions.map((q) => q.id));
  }, []);

  const handleAnswer = (answer) => {
    const currentQuestion = questions.find(
        (q) => q.id === questionOrder[currentQuestionIndex]
    );
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.answer;

    setQuestionPerformance((prev) => ({
        ...prev,
        [currentQuestion.id]: {
            ...prev[currentQuestion.id],
            attempts: (prev[currentQuestion.id]?.attempts || 0) + 1,
            correct: isCorrect,
        },
    }));


    setAnswers([...answers, {questionId: currentQuestion.id, answer, isCorrect}]);
    setInteractionData([
        ...interactionData,
        {
            questionId: currentQuestion.id,
            answer: answer,
            isCorrect: isCorrect,
            timestamp: Date.now(),
        },
    ]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        generatePersona();
    }
  };

  const adjustQuestionOrder = () => {
    const incorrectQuestions = questionOrder.filter(
        (id) => questionPerformance[id]?.correct === false
    );
    const correctQuestions = questionOrder.filter(
        (id) => questionPerformance[id]?.correct !== false
    );
    setQuestionOrder([...incorrectQuestions, ...correctQuestions]);
    setCurrentQuestionIndex(0)
  };

  const generatePersona = async () => {
    try{
        const response = await axios.post('/generate-persona', {interactionData});
        setPersona(response.data.persona);
    } catch (error) {
        console.error('Error generating persona:', error);
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions.find(
    (q) => q.id === questionOrder[currentQuestionIndex]
  )

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
      {persona && <div>{persona}</div>}
    </div>
  );
}

export default Quiz;