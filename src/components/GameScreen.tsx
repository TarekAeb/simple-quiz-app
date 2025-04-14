import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../lib/types';
import Timer from './Timer';

interface Phase1ScreenProps {
  gameState: GameState;
  onSelectAnswer: (index: number) => void;
  onNextQuestion: () => void;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const Phase1Screen: React.FC<Phase1ScreenProps> = ({ 
  gameState, 
  onSelectAnswer, 
  onNextQuestion,
  setGameState
}) => {
  const [showIntroSlide, setShowIntroSlide] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = gameState.phase1Questions[gameState.currentQuestion];
  
  // Skip intro slide if we're in the middle of phase 1
  useEffect(() => {
    if (gameState.currentQuestion > 0) {
      setShowIntroSlide(false);
    }
  }, [gameState.currentQuestion]);
  
  // Handle timer
  useEffect(() => {
    if (!showIntroSlide) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.currentQuestion, showIntroSlide]);
  
  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Reset timer to 30 seconds
    setGameState(prev => ({ ...prev, timer: 30 }));
    
    // Start countdown
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        const newTimer = prev.timer - 1;
        
        if (newTimer <= 0) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          // Time's up - show correct answer
          if (!prev.answerLocked) {
            setTimeout(() => {
              showCorrectAnswer();
            }, 300);
          }
          return { ...prev, timer: 0, answerLocked: true };
        }
        
        return { ...prev, timer: newTimer };
      });
    }, 1000);
  };
  
  const showCorrectAnswer = () => {
    const correctIndex = currentQuestion.correctIndex;
    
    // No score is awarded when time's up
    setGameState(prev => ({
      ...prev,
      answerLocked: true
    }));
  };

  // Phase 1 intro slide
  if (showIntroSlide) {
    return (
      <div className="w-full max-w-4xl">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-algerian-green text-5xl font-bold mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Phase 1
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-algerian-green-dark mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Turn-Based Questions
          </motion.h2>
          
          <motion.div 
            className="mb-8 text-lg space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p>In this phase, teams take turns answering questions.</p>
            <p>Each team has <span className="font-bold text-algerian-green">30 seconds</span> to answer each question.</p>
            <p>Choose carefully - you only get one chance to answer!</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <motion.button
              className="bg-algerian-green hover:bg-algerian-green-dark text-white px-8 py-4 rounded-lg font-medium text-lg flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowIntroSlide(false)}
            >
              <span>Start Phase 1</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Display phase transition message if all questions are answered
  if (!currentQuestion) {
    return (
      <div className="w-full max-w-4xl">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-algerian-green-dark mb-6">Phase 1 Complete!</h2>
          <p className="text-xl mb-8">Get ready for Phase 2: The Speed Round!</p>
          
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextQuestion}
          >
            <span>Start Phase 2</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Helper function to determine if an answer is wrong
  const isWrongAnswer = (index: number) => {
    return gameState.selectedAnswer === index && 
           gameState.answerLocked && 
           index !== currentQuestion.correctIndex;
  };

  return (
    <div className="w-full space-y-6">
      {/* Phase indicator */}
      <div className="bg-algerian-green text-white py-2 px-4 rounded-lg text-center font-medium">
        Phase 1: Turn-Based Questions - 30 seconds per question
      </div>
      
      {/* Scoreboard */}
      <div className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center">
        <motion.div 
          className="flex flex-col items-center"
          animate={{ 
            scale: gameState.currentTeam === 0 ? 1.05 : 1,
            transition: { duration: 0.3 }
          }}
        >
          <div className="font-medium text-sm md:text-base">
            {gameState.teams[0].name}
          </div>
          <div className="w-10 h-10 bg-algerian-green text-white rounded-full flex items-center justify-center font-bold text-lg">
            {gameState.teams[0].score}
          </div>
        </motion.div>
        
        <Timer 
          seconds={gameState.timer} 
          isWarning={gameState.timer <= 10 && gameState.timer > 5}
          isDanger={gameState.timer <= 5}
        />
        
        <motion.div 
          className="flex flex-col items-center"
          animate={{ 
            scale: gameState.currentTeam === 1 ? 1.05 : 1,
            transition: { duration: 0.3 }
          }}
        >
          <div className="font-medium text-sm md:text-base">
            {gameState.teams[1].name}
          </div>
          <div className="w-10 h-10 bg-algerian-green text-white rounded-full flex items-center justify-center font-bold text-lg">
            {gameState.teams[1].score}
          </div>
        </motion.div>
      </div>
      
      {/* Turn indicator */}
      <div className="bg-algerian-green-light text-white p-3 rounded-lg text-center">
        <div className="text-sm opacity-80">Current turn</div>
        <div className="font-semibold">
          {gameState.teams[gameState.currentTeam].name}
        </div>
      </div>
      
      {/* Question card */}
      <motion.div 
        className="bg-white rounded-xl p-6 md:p-8 shadow-lg"
        key={gameState.currentQuestion}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
          {currentQuestion.text}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              className={`
                p-5 rounded-xl cursor-pointer border-2 flex items-center justify-center text-center
                transition-colors duration-200 min-h-[100px] shadow-sm
                ${!gameState.answerLocked && gameState.selectedAnswer === index ? 'border-primary bg-primary/5' : ''}
                ${gameState.answerLocked && index === currentQuestion.correctIndex ? 'border-success bg-success/5' : ''}
                ${isWrongAnswer(index) ? 'border-error bg-error/5' : ''}
                ${!isWrongAnswer(index) && gameState.selectedAnswer !== index && !gameState.answerLocked ? 'border-slate-200 bg-white' : ''}
                ${gameState.answerLocked ? 'cursor-default' : 'hover:border-primary-light hover:shadow hover:-translate-y-1 transition-transform'}
              `}
              onClick={() => !gameState.answerLocked && onSelectAnswer(index)}
              whileHover={!gameState.answerLocked ? { scale: 1.02 } : {}}
              whileTap={!gameState.answerLocked ? { scale: 0.98 } : {}}
              animate={
                gameState.answerLocked && index === currentQuestion.correctIndex 
                  ? { y: [0, -5, 0] } 
                  : isWrongAnswer(index)
                    ? { x: [0, -5, 5, -5, 0] }
                    : {}
              }
              transition={{ duration: 0.5 }}
            >
              {option}
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Answer feedback message */}
      <AnimatePresence>
        {gameState.answerLocked && gameState.selectedAnswer !== currentQuestion.correctIndex && (
          <motion.div 
            className="text-center text-error font-medium mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Incorrect! The correct answer is: {currentQuestion.options[currentQuestion.correctIndex]}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Controls */}
      <div className="flex justify-center mt-6">
        <motion.button
          className="bg-algerian-green hover:bg-algerian-green-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!gameState.answerLocked}
          onClick={onNextQuestion}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Next Question</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </motion.button>
      </div>
      
      {/* Question counter */}
      <div className="text-center text-sm text-slate-500">
        Question {gameState.currentQuestion + 1} of {gameState.phase1Questions.length}
      </div>
    </div>
  );
};

export default Phase1Screen;  