import React from 'react'
import { useState } from 'react';
import Results from './Results';
import { useNavigate } from 'react-router-dom';

const QuestionAndAnswer = () => {
  const questions = [
    "How have you been feeling emotionally lately?",
    "Do you often find yourself feeling stressed or overwhelmed?",
    "How well are you sleeping these days?",
    "Are there any recent changes in your appetite or energy levels?",
    "How often do you feel anxious or on edge?",
    "Do you find it difficult to enjoy things you used to like?",
    "How supported do you feel by the people around you?",
    "Have you experienced frequent mood swings or emotional highs/lows?",
    "How do you usually cope with difficult situations or emotions?",
    "Have you had any thoughts of self-doubt, hopelessness, or sadness that linger?"
  ];
  

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  // const [showResults, setShowResults] = useState(false);
  const [predictionObtained, setPredictionObtained] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const navigate = useNavigate();


  const handleNext = () => {
    if (answers[currentQuestionIndex]) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert("Please enter an answer before proceeding.");
    }
  };

  const handleInputChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(newAnswers);
  };

  const sendTextToDjango = async (userText) => {
    try {
      const response = await fetch("http://localhost:8000/backend/text/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texts: answers }),
      });

      const result = await response.json();
      console.log("Response from Django:", result);
      setPredictions(result.predictions)
      // setShowResults(true);
      setPredictionObtained(true)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const routeToNextPage = () => {
      navigate('/real-time')
  }


  const handleFinish = () => {
    console.log("Quiz completed! Answers:", answers);
    alert("Quiz finished! Check the console for your answers.");
    sendTextToDjango()
    // You can handle form submission or further processing here.
  };

  return (
    <>
      {/* {!showResults ? ( */}
        <div className="flex flex-col items-center p-8 mt-40 mb-36 mx-auto max-w-3xl bg-gray-900 rounded-xl shadow-2xl border border-gray-700 text-white">
          <p className="mb-2 text-sm text-cyan-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <h1 className="text-2xl font-semibold mb-6 text-center">{questions[currentQuestionIndex]}</h1>
  
          <textarea
            rows="6"
            placeholder="Enter your answer"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none transition"
            value={answers[currentQuestionIndex] || ""}
            onChange={handleInputChange}
          />
  
          <div className="flex justify-center gap-6">
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-2 px-6 rounded-full transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      {/* ) : (
        <Results predictions={predictions} answers={answers} />
      )}
      */}
{predictionObtained && (
  <div className="flex justify-center mb-10">
    <button
      onClick={routeToNextPage}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition"
    >
      Proceed to Real-Time Test
    </button>
  </div>
)}
    </>
  );
  
}

export default QuestionAndAnswer