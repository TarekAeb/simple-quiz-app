import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState } from "../lib/types";
import Timer from "./Timer";
import TeamCredentialsGenerator from "./TeamCredentialsGenerator";
import { QRCodeSVG } from 'qrcode.react';

interface Phase2ScreenProps {
  gameState: GameState;
  onSelectAnswer: (index: number, teamIndex: number) => void;
  onNextQuestion: () => void;
  completePhaseTwoAndShowResults: () => void;
  gameCode: string;
  connectedTeams: number[];
}

const Phase2Screen: React.FC<Phase2ScreenProps> = ({
  gameState,
  onSelectAnswer,
  onNextQuestion,
  completePhaseTwoAndShowResults,
  gameCode,
  connectedTeams,
}) => {
  const [showIntroSlide, setShowIntroSlide] = useState(true);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [skipTimer, setSkipTimer] = useState<number | null>(null);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentQuestion = gameState.phase2Questions[gameState.currentQuestion];

  // Set up skip timer when a team buzzes in
  useEffect(() => {
    // If a team is active (has buzzed in)
    if (gameState.activeTeamForPhase2 !== null && !gameState.answerLocked) {
      // Start the 8-second timer
      setSkipTimer(8);
      
      // Clear any existing timers
      if (skipTimerRef.current) {
        clearInterval(skipTimerRef.current);
      }
      
      // Set up the countdown timer
      skipTimerRef.current = setInterval(() => {
        setSkipTimer(prev => {
          if (prev === null) return null;
          
          const newValue = prev - 1;
          if (newValue <= 0) {
            // Time's up - skip this team
            clearInterval(skipTimerRef.current as NodeJS.Timeout);
            skipTeam();
            return null;
          }
          return newValue;
        });
      }, 1000);
    } else {
      // No active team or answer is locked - clear the timer
      if (skipTimerRef.current) {
        clearInterval(skipTimerRef.current);
      }
      setSkipTimer(null);
    }
    
    // Cleanup when unmounting
    return () => {
      if (skipTimerRef.current) {
        clearInterval(skipTimerRef.current);
      }
    };
  }, [gameState.activeTeamForPhase2, gameState.answerLocked]);
  
  // Skip the current team
  const skipTeam = () => {
    // Reset active team to allow others to buzz in
    // You could also implement a penalty for the skipped team here
    const updatedTeams = [...gameState.teams];
    
    // Optional: Deduct points for failing to answer after buzzing
    // if (gameState.activeTeamForPhase2 !== null) {
    //   updatedTeams[gameState.activeTeamForPhase2].score = Math.max(0, updatedTeams[gameState.activeTeamForPhase2].score - 5);
    // }
    
    // Clear active team
    setGameState({
      ...gameState,
      activeTeamForPhase2: null,
      teams: updatedTeams
    });
  };
  
  // Helper function to update game state
  const setGameState = (newState: GameState) => {
    // This is just a wrapper to call the parent component's update function
    // For a real implementation, you would replace this with the actual state update mechanism
    
    // Clear any existing buzzer team
    const updatedState = {
      ...newState
    };
    
    // Updates we perform here directly
    if (gameState.activeTeamForPhase2 !== updatedState.activeTeamForPhase2) {
      // Reset skip timer if active team changes
      setSkipTimer(null);
      if (skipTimerRef.current) {
        clearInterval(skipTimerRef.current);
      }
    }
    
    // Then pass to parent
    if (onSelectAnswer && typeof newState.selectedAnswer === 'number' && typeof newState.activeTeamForPhase2 === 'number') {
      onSelectAnswer(newState.selectedAnswer, newState.activeTeamForPhase2);
    }
  };

  // Handle generating credentials for teams
  const handleGenerateCredentials = (creds: any[]) => {
    setCredentials(creds);
    // Save credentials to localStorage for teams to access
    creds.forEach(cred => {
      localStorage.setItem(`team_cred_${cred.teamId}`, JSON.stringify(cred));
    });
  };

  // Helper function to determine if an answer is wrong
  const isWrongAnswer = (index: number) => {
    return (
      gameState.selectedAnswer === index &&
      gameState.answerLocked &&
      index !== currentQuestion.correctIndex
    );
  };

  // Skip intro slide if we're in the middle of phase 2
  useEffect(() => {
    if (gameState.currentQuestion > 0) {
      setShowIntroSlide(false);
    }
  }, [gameState.currentQuestion]);

  // Display phase 2 intro slide
  if (showIntroSlide) {
    return (
      <div className="w-full max-w-4xl mx-auto">
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
            Phase 2
          </motion.div>

          <motion.h2
            className="text-3xl font-bold text-algerian-green-dark mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Speed Round!
          </motion.h2>

          <motion.div
            className="mb-8 text-lg space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <p>In this phase, teams compete to answer questions quickly.</p>
            <p>
              The first team to buzz in gets to answer the question.
            </p>
            <p>
              <span className="font-bold text-algerian-green">8 seconds</span> to answer after buzzing in!
            </p>
            <p>Choose carefully - wrong answers lose points!</p>
          </motion.div>

          <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-algerian-green-dark mb-4">
              Team Connection
            </h3>
            
            <TeamCredentialsGenerator
              onGenerateCredentials={handleGenerateCredentials}
              teams={gameState.teams}
              gameCode={gameCode}
              connectedTeams={connectedTeams}
            />
            
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <p className="font-medium">Teams Connected: {connectedTeams.length}/{gameState.teams.length}</p>
              <p className="text-sm mt-1">Wait for teams to connect their devices before starting</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-6"
          >
            <motion.button
              className="bg-algerian-green hover:bg-algerian-green-dark text-white px-8 py-4 rounded-lg font-medium text-lg flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowIntroSlide(false)}
            >
              <span>Start Phase 2</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
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
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-algerian-green-dark mb-6">
            Phase 2 Complete!
          </h2>
          <p className="text-xl mb-8">All questions have been answered.</p>

          <motion.button
            className="bg-algerian-green hover:bg-algerian-green-dark text-white px-8 py-4 rounded-lg font-medium text-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={completePhaseTwoAndShowResults}
          >
            <span>View Final Results</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Phase indicator */}
      <div className="bg-algerian-green text-white py-2 px-4 rounded-lg text-center font-medium">
        Phase 2: Speed Round - First to buzz gets to answer!
      </div>

      {/* Scoreboard */}
      <div className="bg-white rounded-xl p-4 shadow-md grid grid-cols-2 gap-4">
        {gameState.teams.map((team, index) => (
          <motion.div
            key={index}
            className={`flex flex-col items-center p-3 rounded-lg ${
              gameState.activeTeamForPhase2 === index
                ? "bg-algerian-green bg-opacity-10 border border-algerian-green"
                : ""
            }`}
            animate={{
              scale: gameState.activeTeamForPhase2 === index ? 1.05 : 1,
              transition: { duration: 0.3 },
            }}
          >
            <div className="font-medium text-sm md:text-base">{team.name}</div>
            <div className="w-12 h-12 bg-algerian-green text-white rounded-full flex items-center justify-center font-bold text-xl mt-1">
              {team.score}
            </div>
            
            {/* Connection indicator */}
            <div className="mt-2 text-xs">
              {connectedTeams.includes(index) ? (
                <span className="text-green-600 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Connected
                </span>
              ) : (
                <span className="text-gray-400 font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  Not Connected
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Question card */}
      <motion.div
        className="bg-white rounded-xl p-6 md:p-8 shadow-lg"
        key={gameState.currentQuestion}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Question {gameState.currentQuestion + 1} of{" "}
            {gameState.phase2Questions.length}
          </div>
          
          {/* Skip timer display when a team has buzzed in */}
          {skipTimer !== null && gameState.activeTeamForPhase2 !== null && (
            <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5z" clipRule="evenodd" />
              </svg>
              Skip in: {skipTimer}s
            </div>
          )}
        </div>

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
                ${
                  !gameState.answerLocked && gameState.selectedAnswer === index
                    ? "border-algerian-green bg-algerian-green-light bg-opacity-10"
                    : ""
                }
                ${
                  gameState.answerLocked && index === currentQuestion.correctIndex
                    ? "border-green-500 bg-green-50"
                    : ""
                }
                ${
                  isWrongAnswer(index)
                    ? "border-red-500 bg-red-50"
                    : ""
                }
                ${
                  !isWrongAnswer(index) &&
                  gameState.selectedAnswer !== index &&
                  !gameState.answerLocked
                    ? "border-slate-200 bg-white"
                    : ""
                }
                ${
                  gameState.answerLocked || gameState.activeTeamForPhase2 === null
                    ? "cursor-default"
                    : "hover:border-algerian-green-light hover:shadow hover:-translate-y-1 transition-transform"
                }
              `}
              onClick={() => {
                // Only allow selecting if:
                // 1. A team has buzzed in
                // 2. Answer isn't locked yet
                if (
                  !gameState.answerLocked &&
                  gameState.activeTeamForPhase2 !== null
                ) {
                  setGameState({
                    ...gameState,
                    selectedAnswer: index,
                    answerLocked: true,
                  });
                  
                  // Clear skip timer if answer selected
                  if (skipTimerRef.current) {
                    clearInterval(skipTimerRef.current);
                  }
                  setSkipTimer(null);
                }
              }}
              whileHover={
                !gameState.answerLocked && gameState.activeTeamForPhase2 !== null
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !gameState.answerLocked && gameState.activeTeamForPhase2 !== null
                  ? { scale: 0.98 }
                  : {}
              }
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

      {/* Active team indicator */}
      <AnimatePresence>
        {gameState.activeTeamForPhase2 !== null && (
          <motion.div
            className={`bg-white p-4 rounded-xl shadow-md text-center ${
              gameState.answerLocked
                ? gameState.selectedAnswer === currentQuestion.correctIndex
                  ? "border-2 border-green-500"
                  : "border-2 border-red-500"
                : "border-2 border-algerian-green"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="font-medium text-lg">
              {gameState.teams[gameState.activeTeamForPhase2].name} is answering
            </div>
            
            {skipTimer !== null && !gameState.answerLocked && (
              <div className="mt-2 text-sm text-yellow-600">
                Auto-skip in {skipTimer} seconds if no answer
              </div>
            )}
            
            {gameState.answerLocked && (
              <div
                className={`mt-2 font-bold ${
                  gameState.selectedAnswer === currentQuestion.correctIndex
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {gameState.selectedAnswer === currentQuestion.correctIndex
                  ? "Correct! +10 points"
                  : "Incorrect!"}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buzzer state message when no team is active */}
      {gameState.activeTeamForPhase2 === null && !gameState.answerLocked && (
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <div className="text-algerian-green font-medium">
            Waiting for teams to buzz in...
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Teams connected: {connectedTeams.length}/{gameState.teams.length}
          </div>
        </div>
      )}

      {/* Manual skip button and next question controls */}
      <div className="flex justify-center gap-4">
        {/* Skip team button - only show when a team is active and answer isn't locked */}
        {gameState.activeTeamForPhase2 !== null && !gameState.answerLocked && (
          <motion.button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            onClick={skipTeam}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5zM6.5 7a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75h-4.5z" />
            </svg>
            <span>Skip Team</span>
          </motion.button>
        )}
        
        {/* Next question button - only show when answer is locked */}
        {gameState.answerLocked && (
          <motion.button
            className="bg-algerian-green hover:bg-algerian-green-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
            onClick={onNextQuestion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Next Question</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Game code display and QR code */}
      <div className="mt-6 bg-white p-4 rounded-xl shadow-md">
        <div className="text-center mb-2">
          <span className="font-medium">Game Code:</span> 
          <span className="text-xl font-bold ml-2">{gameCode}</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {gameState.teams.map((team, index) => (
            <div key={index} className="text-center">
              <div className={`border-2 rounded-md p-2 ${connectedTeams.includes(index) ? 'border-green-300' : 'border-gray-200'}`}>
                <QRCodeSVG 
                  value={`${window.location.origin}/join/${gameCode}/${index}`} 
                  size={80}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="text-xs mt-1">{team.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Phase2Screen;