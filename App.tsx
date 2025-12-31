
import React, { useState, useEffect, useCallback } from 'react';
import { Question } from './types';
import { fetchQuestions } from './services/geminiService';
import QuestionCard from './components/QuestionCard';
import { CorrectIcon, LoaderIcon, ReplayIcon, TrophyIcon } from './components/icons';

type GameState = 'loading' | 'playing' | 'correct' | 'incorrect' | 'finished';

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState>('loading');

  const loadQuestions = useCallback(async () => {
    setGameState('loading');
    setScore(0);
    setCurrentQuestionIndex(0);
    try {
      const newQuestions = await fetchQuestions();
      setQuestions(newQuestions);
      setGameState('playing');
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      // Handle error state in UI if needed
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswer = (answer: boolean) => {
    if (gameState !== 'playing') return;

    if (answer === questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
      setGameState('correct');
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
          setCurrentQuestionIndex(nextIndex);
          setGameState('playing');
        } else {
          setGameState('finished');
        }
      }, 2000);
    } else {
      setGameState('incorrect');
      setTimeout(() => {
        setGameState('playing');
      }, 500);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const renderContent = () => {
    switch (gameState) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-sky-400">
            <LoaderIcon className="animate-spin h-24 w-24 mb-4" />
            <p className="text-2xl font-bold">Generating your trivia game...</p>
          </div>
        );
      case 'finished':
        return (
          <div className="text-center bg-slate-800 p-8 rounded-2xl shadow-2xl shadow-cyan-500/20 w-full max-w-md animate-fade-in">
            <TrophyIcon className="h-28 w-28 mx-auto text-yellow-400" />
            <h2 className="text-4xl font-bold text-white mt-4">Game Over!</h2>
            <p className="text-2xl text-slate-300 mt-2">Your final score is:</p>
            <p className="text-7xl font-bold text-cyan-400 my-6">{score}</p>
            <button
              onClick={loadQuestions}
              className="flex items-center justify-center w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-4 px-6 rounded-lg text-xl transition-transform transform hover:scale-105"
            >
              <ReplayIcon className="h-6 w-6 mr-2" />
              Play Again
            </button>
          </div>
        );
      case 'playing':
      case 'correct':
      case 'incorrect':
        return (
          <QuestionCard
            question={currentQuestion?.question}
            onAnswer={handleAnswer}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            disabled={gameState !== 'playing'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 text-white font-sans overflow-hidden">
      {/* Incorrect answer overlay */}
      <div
        className={`absolute inset-0 bg-red-500/50 transition-opacity duration-200 pointer-events-none ${
          gameState === 'incorrect' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Correct answer overlay */}
      {gameState === 'correct' && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-fade-in">
            <div className="text-center p-6">
                <CorrectIcon className="h-48 w-48 mx-auto text-green-400 animate-pop-in" />
                <h2 className="text-4xl font-bold text-green-300 mt-4">Correct!</h2>
                <p className="text-lg text-slate-300 mt-2 max-w-xl">{currentQuestion.explanation}</p>
            </div>
        </div>
      )}

      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold text-cyan-400">Yes/No Trivia</h1>
        {gameState !== 'loading' && gameState !== 'finished' && (
           <div className="bg-slate-800 px-4 py-2 rounded-lg text-xl font-bold text-white">
             Score: <span className="text-cyan-400">{score}</span>
           </div>
        )}
      </header>
      
      <main className="flex-grow flex items-center justify-center w-full">
        {renderContent()}
      </main>

       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

          @keyframes pop-in {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
          }
          .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards; }
        `}</style>
    </div>
  );
};

export default App;
