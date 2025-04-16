import React from 'react'
import { useState } from 'react';

const QuestionAndAnswer = () => {
  const questions = [
    "What is your name?",
    "How old are you?",
    "What is your favorite color?",
    "Where are you from?",
    "What is your hobby?",
    "What is your favorite food?",
    "What is your dream job?",
    "What is your favorite movie?",
    "What is your favorite book?",
    "What inspires you the most?",
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

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
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleFinish = () => {
    console.log("Quiz completed! Answers:", answers);
    alert("Quiz finished! Check the console for your answers.");
    sendTextToDjango()
    // You can handle form submission or further processing here.
  };

  return (
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

  );
}

export default QuestionAndAnswer