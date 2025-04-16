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
        <div className="flex flex-col items-center p-4 border shadow-lg mt-36 mb-36 ml-48 mr-48">
            <p className="mb-4">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <h1 className="text-xl font-bold mb-4">{questions[currentQuestionIndex]}</h1>
            <textarea
                rows="10"
                cols="40"
                type="text"
                placeholder="Enter your answer"
                className="border p-2 rounded mb-4 w-full max-w-md"
                value={answers[currentQuestionIndex] || ""}
                onChange={handleInputChange}
            />
            <div className="flex gap-4">
                {currentQuestionIndex < questions.length - 1 ? (
                    <button
                        onClick={handleNext}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleFinish}
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Finish
                    </button>
                )}
            </div>
        </div>
    );
}

export default QuestionAndAnswer