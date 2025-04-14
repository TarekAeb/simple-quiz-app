import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Question } from '../lib/types';

interface Phase2ScreenProps {
  gameState: GameState;
  onSelectAnswer: (index: number, teamIndex: number) => void;
  onNextQuestion: () => void;
  completePhaseTwoAndShowResults: () => void;
}

const Phase2Screen: React.FC<Phase2ScreenProps> = ({ 
  gameState, 
  onSelectAnswer, 
  onNextQuestion,
  completePhaseTwoAndShowResults
}) => {
  const [showIntroSlide, setShowIntroSlide] = useState(true);
  const [incorrectSelections, setIncorrectSelections] = useState<number[]>([]);
  const [lastIncorrectTeam, setLastIncorrectTeam] = useState<number | null>(null);
  const currentQuestion = gameState.phase2Questions[gameState.currentQuestion];
  
  // Skip intro slide if we're in the middle of phase 2
  useEffect(() => {
    if (gameState.currentQuestion > 0) {
      setShowIntroSlide(false);
    }
  }, [gameState.currentQuestion]);
  
  // Reset incorrect selections when moving to a new question
  useEffect(() => {
    setIncorrectSelections([]);
    setLastIncorrectTeam(null);
  }, [gameState.currentQuestion]);
  
  // Phase 2 intro slide
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
            className="text-secondary text-5xl font-bold mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Phase 2
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-algerian-green-dark mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Speed Round
          </motion.h2>
          
          <motion.div 
            className="mb-8 text-lg space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p>In this phase, teams compete to answer questions first!</p>
            <p>Press <span className="font-bold text-algerian-green">Q</span> for {gameState.teams[0].name} or <span className="font-bold text-algerian-green">P</span> for {gameState.teams[1].name} to buzz in.</p>
            <p className="font-medium text-secondary">If a team answers incorrectly, the other team gets a chance to answer!</p>
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
              <span>Start Phase 2</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }
  
  // Display phase completion message if needed
  if (!currentQuestion) {
    return (
      <div className="w-full max-w-4xl">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-algerian-green-dark mb-6">Phase 2 Complete!</h2>
          <p className="text-xl mb-8">Let's see the final results!</p>
          
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={completePhaseTwoAndShowResults}
          >
            <span>View Results</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    );
  }
  
  // Custom handler for answer selection that implements the new logic
  const handleAnswerSelection = (index: number, teamIndex: number) => {
    // Check if the selected answer is correct
    const isCorrect = index === currentQuestion.correctIndex;
    
    if (isCorrect) {
      // If correct, proceed normally
      onSelectAnswer(index, teamIndex);
    } else {
      // Add this selection to incorrect selections
      setIncorrectSelections(prev => [...prev, index]);
      setLastIncorrectTeam(teamIndex);
      
      // If incorrect, switch to the other team without locking the answer
      const otherTeam = teamIndex === 0 ? 1 : 0;
      
      // Add a brief delay to allow the user to see the incorrect answer
      setTimeout(() => {
        activateTeam(otherTeam);
      }, 800); // Delay to show the red highlight
    }
  };
  
  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Phase indicator */}
      <div className="bg-secondary text-white py-2 px-4 rounded-lg text-center font-medium">
        Phase 2: Speed Round - Teams alternate until someone gets the correct answer!
      </div>
      
      {/* Scoreboard */}
      <div className="bg-white rounded-xl p-4 shadow-md grid grid-cols-2 gap-4">
        <div 
          className={`
            p-4 rounded-lg transition-colors duration-300
            ${gameState.activeTeamForPhase2 === 0 ? 'bg-primary/10 ring-2 ring-primary' : ''}
          `}
        >
          <div className="font-medium text-center mb-2">
            {gameState.teams[0].name}
          </div>
          <div className="text-3xl font-bold text-center">
            {gameState.teams[0].score}
          </div>
        </div>
        
        <div 
          className={`
            p-4 rounded-lg transition-colors duration-300
            ${gameState.activeTeamForPhase2 === 1 ? 'bg-primary/10 ring-2 ring-primary' : ''}
          `}
        >
          <div className="font-medium text-center mb-2">
            {gameState.teams[1].name}
          </div>
          <div className="text-3xl font-bold text-center">
            {gameState.teams[1].score}
          </div>
        </div>
      </div>
      
      {/* Team selection indicators */}
      <div className="flex justify-center gap-8">
        <motion.button
          className={`
            px-6 py-3 rounded-lg font-bold text-slate-500
            ${gameState.answerLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'}
            ${lastIncorrectTeam === 0 ? 'bg-error/10 text-error' : ''}
          `}
          whileHover={!gameState.answerLocked ? { scale: 1.05 } : {}}
          whileTap={!gameState.answerLocked ? { scale: 0.95 } : {}}
          onClick={() => !gameState.answerLocked && activateTeam(0)}
          disabled={gameState.answerLocked}
        >
          {gameState.teams[0].name} (Q key)
        </motion.button>
        
        <motion.button
          className={`
            px-6 py-3 rounded-lg font-bold text-slate-500
            ${gameState.answerLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'}
            ${lastIncorrectTeam === 1 ? 'bg-error/10 text-error' : ''}
          `}
          whileHover={!gameState.answerLocked ? { scale: 1.05 } : {}}
          whileTap={!gameState.answerLocked ? { scale: 0.95 } : {}}
          onClick={() => !gameState.answerLocked && activateTeam(1)}
          disabled={gameState.answerLocked}
        >
          {gameState.teams[1].name} (P key)
        </motion.button>
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
                ${gameState.selectedAnswer === index ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white'}
                ${gameState.answerLocked && index === currentQuestion.correctIndex ? 'border-success bg-success/5' : ''}
                ${gameState.answerLocked && gameState.selectedAnswer === index && index !== currentQuestion.correctIndex ? 'border-error bg-error/5' : ''}
                ${incorrectSelections.includes(index) ? 'border-error bg-error/5' : ''}
                ${gameState.activeTeamForPhase2 === null || gameState.answerLocked ? 'cursor-default' : 'hover:border-primary-light hover:shadow hover:-translate-y-1 transition-transform'}
              `}
              onClick={() => {
                if (gameState.answerLocked || gameState.activeTeamForPhase2 === null) return;
                handleAnswerSelection(index, gameState.activeTeamForPhase2);
              }}
              whileHover={!gameState.answerLocked && gameState.activeTeamForPhase2 !== null ? { scale: 1.02 } : {}}
              whileTap={!gameState.answerLocked && gameState.activeTeamForPhase2 !== null ? { scale: 0.98 } : {}}
              animate={
                gameState.answerLocked && index === currentQuestion.correctIndex 
                  ? { y: [0, -5, 0] } 
                  : gameState.answerLocked && gameState.selectedAnswer === index && index !== currentQuestion.correctIndex
                    ? { x: [0, -5, 5, -5, 0] }
                    : incorrectSelections.includes(index)
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
      
      {/* Status message */}
      <AnimatePresence>
        {gameState.activeTeamForPhase2 !== null && !gameState.answerLocked && (
          <motion.div 
            className="text-center text-lg font-medium text-algerian-green-dark"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {gameState.teams[gameState.activeTeamForPhase2].name}'s turn to answer!
          </motion.div>
        )}
        
        {gameState.activeTeamForPhase2 === null && !gameState.answerLocked && (
          <motion.div 
            className="text-center text-lg font-medium text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Press Q for {gameState.teams[0].name} or P for {gameState.teams[1].name} to answer!
          </motion.div>
        )}
        
        {lastIncorrectTeam !== null && !gameState.answerLocked && (
          <motion.div 
            className="text-center text-error font-medium mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={`incorrect-${lastIncorrectTeam}`}
          >
            {gameState.teams[lastIncorrectTeam].name} answered incorrectly!
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
        Question {gameState.currentQuestion + 1} of {gameState.phase2Questions.length}
      </div>
    </div>
  );

  // Helper function to activate a team
  function activateTeam(teamIndex: number) {
    document.dispatchEvent(new CustomEvent('activateTeam', { detail: { teamIndex } }));
  }
};

export default Phase2Screen;