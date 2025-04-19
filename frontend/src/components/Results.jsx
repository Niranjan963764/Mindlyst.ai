import React from 'react';

const Results = ({ predictions, answers }) => {
  return (
    <div className="flex flex-col items-center p-8 mt-40 mb-36 mx-auto max-w-4xl bg-gray-900 rounded-xl shadow-2xl border border-gray-700 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">Your Emotional Insights</h2>
      <div className="space-y-6 w-full">
        {answers.map((answer, index) => (
          <div
            key={index}
            className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg transition hover:scale-[1.02] hover:shadow-cyan-600/20"
          >
            <p className="text-sm text-gray-400 mb-2">Q{index + 1}</p>
            <p className="text-lg font-medium text-white mb-4">{answer}</p>
            <p className="text-sm font-semibold text-pink-400">
              Prediction: <span className="text-white">{predictions[index]}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Results;
