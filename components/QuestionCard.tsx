
import React from 'react';

interface QuestionCardProps {
  question: string;
  onAnswer: (answer: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
  disabled: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, questionNumber, totalQuestions, disabled }) => {
  if (!question) return null;

  const buttonClasses = `
    w-full md:w-auto flex-1 md:flex-initial text-2xl font-bold py-4 px-10 rounded-lg 
    transition-all duration-300 transform 
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const yesButtonClasses = `
    bg-green-500 text-white hover:bg-green-400 
    hover:enabled:scale-105 hover:enabled:shadow-lg hover:enabled:shadow-green-500/30
  `;

  const noButtonClasses = `
    bg-red-500 text-white hover:bg-red-400
    hover:enabled:scale-105 hover:enabled:shadow-lg hover:enabled:shadow-red-500/30
  `;

  return (
    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-2xl text-center animate-fade-in">
      <p className="text-lg font-semibold text-cyan-400 mb-2">
        Question {questionNumber} / {totalQuestions}
      </p>
      <h2 className="text-3xl font-bold text-white mb-8 min-h-[100px] flex items-center justify-center">
        {question}
      </h2>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button
          onClick={() => onAnswer(true)}
          disabled={disabled}
          className={`${buttonClasses} ${yesButtonClasses}`}
        >
          Yes
        </button>
        <button
          onClick={() => onAnswer(false)}
          disabled={disabled}
          className={`${buttonClasses} ${noButtonClasses}`}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
