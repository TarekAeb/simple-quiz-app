import React, { useState, useEffect } from 'react';
import { GameState, Question, GamePhase } from '../lib/types';
import Phase1Screen from './Phase1Screen';
import Phase2Screen from './Phase2Screen';
import { initBuzzerService, updateGameState } from '../hooks/BuzzerService';
import { phase1Questions,phase2Questions } from '@/data/questions';

const initialGameState: GameState = {
  phase: 'setup',
  teams: [
    { name: "Team 1", score: 0 },
    { name: "Team 2", score: 0 }
  ],
  currentTeam: 0,
  currentQuestion: 0,
  phase1Questions: phase1Questions,
  phase2Questions: phase2Questions,
  selectedAnswer: -1,
  answerLocked: false,
  timer: 30,
  activeTeamForPhase2: null,
  moderatorPassword: ''
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [authenticated, setAuthenticated] = useState(false);
  
  // Initialize buzzer service
  useEffect(() => {
    initBuzzerService();
  }, []);
  
  // Update game state in BuzzerService whenever relevant state changes
  useEffect(() => {
    if (gameState.phase === 'phase2') {
      const hasQuestions = gameState.phase2Questions && 
                         gameState.phase2Questions.length > 0 && 
                         gameState.currentQuestion < gameState.phase2Questions.length;
      
      updateGameState({
        activeTeam: gameState.activeTeamForPhase2,
        hasQuestions: hasQuestions,
        currentQuestion: gameState.currentQuestion,
        timestamp: Date.now()
      });
    }
  }, [gameState.phase, gameState.phase2Questions, gameState.currentQuestion, gameState.activeTeamForPhase2]);
  
  // Set up team activation event handler for Phase 2
  useEffect(() => {
    const handleTeamActivation = (event: CustomEvent<{teamIndex: number}>) => {
      if (gameState.phase === 'phase2' && !gameState.answerLocked) {
        if (event.detail && typeof event.detail.teamIndex === 'number') {
          setGameState(prev => ({
            ...prev,
            activeTeamForPhase2: event.detail.teamIndex
          }));
        }
      }
    };

    document.addEventListener('activateTeam', handleTeamActivation as EventListener);
    
    return () => {
      document.removeEventListener('activateTeam', handleTeamActivation as EventListener);
    };
  }, [gameState.phase, gameState.answerLocked]);
  
  // Handle authentication
  const handleAuthenticate = (password: string) => {
    // Store password for future use
    setGameState(prev => ({
      ...prev,
      moderatorPassword: password
    }));
    setAuthenticated(true);
  };
  
  // Handle starting the game
  const handleStartGame = (teamNames: string[]) => {
    const updatedTeams = gameState.teams.map((team, index) => ({
      ...team,
      name: teamNames[index] || `Team ${index + 1}`
    }));
    
    setGameState({
      ...gameState,
      phase: 'phase1',
      teams: updatedTeams,
      currentQuestion: 0,
      currentTeam: 0,
      selectedAnswer: -1,
      answerLocked: false,
      timer: 30
    });
  };
  
  // Handle answer selection for Phase 1
  const handleSelectAnswer = (index: number) => {
    const currentQuestion = gameState.phase1Questions[gameState.currentQuestion];
    const isCorrect = index === currentQuestion.correctIndex;
    
    // Update score if correct
    const updatedTeams = [...gameState.teams];
    if (isCorrect) {
      updatedTeams[gameState.currentTeam].score += 10;
    }
    
    setGameState({
      ...gameState,
      selectedAnswer: index,
      answerLocked: true,
      teams: updatedTeams
    });
  };
  
  // Handle answer selection for Phase 2
  const handlePhase2SelectAnswer = (index: number, teamIndex: number) => {
    const currentQuestion = gameState.phase2Questions[gameState.currentQuestion];
    const isCorrect = index === currentQuestion.correctIndex;
    
    // Update score if correct
    const updatedTeams = [...gameState.teams];
    if (isCorrect) {
      updatedTeams[teamIndex].score += 10;
    }
    
    setGameState({
      ...gameState,
      selectedAnswer: index,
      answerLocked: true,
      teams: updatedTeams
    });
  };
  
  // Handle moving to the next question
  const handleNextQuestion = () => {
    const currentPhase = gameState.phase;
    const questions = currentPhase === 'phase1' ? gameState.phase1Questions : gameState.phase2Questions;
    const nextQuestion = gameState.currentQuestion + 1;
    
    // If there are more questions, move to the next one
    if (nextQuestion < questions.length) {
      const nextTeam = (gameState.currentTeam + 1) % gameState.teams.length;
      
      setGameState({
        ...gameState,
        currentQuestion: nextQuestion,
        currentTeam: currentPhase === 'phase1' ? nextTeam : gameState.currentTeam,
        selectedAnswer: -1,
        answerLocked: false,
        timer: 30,
        activeTeamForPhase2: null
      });
    } 
    // If we're in phase 1 and finished all questions, move to phase 2
    else if (currentPhase === 'phase1') {
      setGameState({
        ...gameState,
        phase: 'phase2',
        currentQuestion: 0,
        selectedAnswer: -1,
        answerLocked: false,
        activeTeamForPhase2: null
      });
    }
    // If we're in phase 2 and finished all questions, show results
    else {
      completePhaseTwoAndShowResults();
    }
  };
  
  // Complete Phase 2 and show results
  const completePhaseTwoAndShowResults = () => {
    setGameState({
      ...gameState,
      phase: 'results'
    });
  };
  
  // Reset the game
  const resetGame = () => {
    // Keep the moderator password when resetting
    const moderatorPassword = gameState.moderatorPassword;
    setGameState({
      ...initialGameState,
      moderatorPassword
    });
  };
  
  // Authentication screen component
  const AuthScreen = ({ onAuthenticate }: { onAuthenticate: (password: string) => void }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Simple validation - you would want to use a more secure method in production
      if (password.trim() === '') {
        setError('Password cannot be empty');
        return;
      }
      
      onAuthenticate(password);
    };
    
    return (
      <div className="app-background flex items-center justify-center p-4 scale-105">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-algerian-green-dark mb-6 text-center">
            Moderator Login
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-algerian-green focus:border-algerian-green"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter moderator password"
                required
              />
              {error && <p className="text-error text-sm mt-1">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-algerian-green hover:bg-algerian-green-dark text-white px-6 py-3 rounded-lg font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  // Setup screen component
  const SetupScreen = ({ onStart }: { onStart: (teamNames: string[]) => void }) => {
    const [teamNames, setTeamNames] = useState<string[]>(["Team 1", "Team 2"]);
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onStart(teamNames);
    };
    
    return (
      <div className="app-background flex items-center justify-center p-4 scale-105">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-algerian-green-dark mb-6 text-center">
            Quiz Game Setup
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Team 1 Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-algerian-green focus:border-algerian-green"
                value={teamNames[0]}
                onChange={(e) => {
                  const newNames = [...teamNames];
                  newNames[0] = e.target.value;
                  setTeamNames(newNames);
                }}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Team 2 Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-algerian-green focus:border-algerian-green"
                value={teamNames[1]}
                onChange={(e) => {
                  const newNames = [...teamNames];
                  newNames[1] = e.target.value;
                  setTeamNames(newNames);
                }}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-algerian-green hover:bg-algerian-green-dark text-white px-6 py-3 rounded-lg font-medium"
            >
              Start Game
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  // Results screen component
  const ResultsScreen = ({ gameState, onPlayAgain }: { gameState: GameState, onPlayAgain: () => void }) => {
    const winner = gameState.teams[0].score > gameState.teams[1].score 
      ? gameState.teams[0] 
      : gameState.teams[1];
    
    const isTie = gameState.teams[0].score === gameState.teams[1].score;
    
    return (
      <div className="app-background flex items-center justify-center p-4 scale-105">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-algerian-green-dark mb-6">
            Game Results
          </h1>
          
          {isTie ? (
            <p className="text-2xl mb-6">It's a tie!</p>
          ) : (
            <p className="text-2xl mb-6">
              <span className="font-bold">{winner.name}</span> wins!
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            {gameState.teams.map((team, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold mb-2">{team.name}</div>
                <div className="text-4xl font-bold text-algerian-green">
                  {team.score}
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={onPlayAgain}
            className="bg-algerian-green hover:bg-algerian-green-dark text-white px-6 py-3 rounded-lg font-medium"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };
  
  // Render the appropriate screen based on game phase
  return (
    <div className="app-background flex items-center justify-center p-4">
      {!authenticated ? (
        <AuthScreen onAuthenticate={handleAuthenticate} />
      ) : gameState.phase === 'setup' ? (
        <SetupScreen onStart={handleStartGame} />
      ) : gameState.phase === 'phase1' ? (
        <Phase1Screen 
          gameState={gameState}
          onSelectAnswer={handleSelectAnswer}
          onNextQuestion={handleNextQuestion}
          setGameState={setGameState}
        />
      ) : gameState.phase === 'phase2' ? (
        <Phase2Screen
          gameState={gameState}
          onSelectAnswer={handlePhase2SelectAnswer}
          onNextQuestion={handleNextQuestion}
          completePhaseTwoAndShowResults={completePhaseTwoAndShowResults}
        />
      ) : (
        <ResultsScreen 
          gameState={gameState}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  );
};

export default Game;