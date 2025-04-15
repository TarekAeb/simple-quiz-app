import React, { useState, useEffect, useRef } from "react";
import { GameState, Question, GamePhase } from "../lib/types";
import Phase1Screen from "./Phase1Screen";
import Phase2Screen from "./Phase2Screen";
import { phase1Questions, phase2Questions } from "@/data/questions";
import { motion } from "framer-motion";
import BuzzerService from "../hooks/BuzzerService";

const initialGameState: GameState = {
  phase: "setup",
  teams: [
    { name: "Team 1", score: 0 },
    { name: "Team 2", score: 0 },
  ],
  currentTeam: 0,
  currentQuestion: 0,
  phase1Questions: phase1Questions,
  phase2Questions: phase2Questions,
  selectedAnswer: -1,
  answerLocked: false,
  timer: 30,
  activeTeamForPhase2: null,
  moderatorPassword: "",
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [authenticated, setAuthenticated] = useState(false);
  const [gameCode, setGameCode] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "error">("connecting");
  const [connectedTeams, setConnectedTeams] = useState<number[]>([]);
  const buzzerServiceRef = useRef<BuzzerService | null>(null);

  // Initialize buzzer service
  useEffect(() => {
    if (authenticated && gameState.phase !== "setup") {
      initBuzzerService();
    }
    
    return () => {
      // Cleanup when component unmounts
      if (buzzerServiceRef.current) {
        buzzerServiceRef.current.disconnect();
      }
    };
  }, [authenticated, gameState.phase]);

  // Function to initialize the buzzer service
  const initBuzzerService = async () => {
    try {
      const buzzerService = BuzzerService.getInstance();
      buzzerServiceRef.current = buzzerService;

      // Generate game code if we don't have one
      if (!gameCode) {
        const newGameCode = generateGameCode();
        setGameCode(newGameCode);
      }

      // Initialize as host
      await buzzerService.initHost(gameCode);
      setConnectionStatus("connected");
      
      // Listen for buzz events
      buzzerService.on("buzz", (data: { teamId: number; timestamp: number }) => {
        if (gameState.phase === "phase2" && !gameState.answerLocked) {
          setGameState(prev => ({
            ...prev,
            activeTeamForPhase2: data.teamId
          }));
        }
      });

      // Listen for team connections
      buzzerService.on("teamConnected", (teamInfo: any) => {
        console.log("Team connected:", teamInfo);
        setConnectedTeams(buzzerService.getConnectedTeams());
      });

      // Listen for connection errors
      buzzerService.on("connectionError", (error: any) => {
        console.error("Buzzer connection error:", error);
        setConnectionStatus("error");
      });

    } catch (error) {
      console.error("Failed to initialize buzzer service:", error);
      setConnectionStatus("error");
    }
  };

  // Generate a random 4-character game code
  const generateGameCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Update game state in BuzzerService whenever relevant state changes
  useEffect(() => {
    if (buzzerServiceRef.current && connectionStatus === "connected") {
      // Broadcast game state to all connected clients
      const hasQuestions = 
        gameState.phase === "phase1" 
          ? gameState.currentQuestion < gameState.phase1Questions.length
          : gameState.currentQuestion < gameState.phase2Questions.length;

      buzzerServiceRef.current.broadcastGameState({
        phase: gameState.phase,
        activeTeam: gameState.activeTeamForPhase2,
        hasQuestions: hasQuestions,
        currentQuestion: gameState.currentQuestion,
        currentTeam: gameState.currentTeam,
        selectedAnswer: gameState.selectedAnswer,
        answerLocked: gameState.answerLocked,
        timer: gameState.timer,
        timestamp: Date.now(),
      });
    }
  }, [
    gameState.phase,
    gameState.currentQuestion,
    gameState.activeTeamForPhase2,
    gameState.currentTeam,
    gameState.selectedAnswer,
    gameState.answerLocked,
    gameState.timer,
    connectionStatus
  ]);

  // Handle authentication
  const handleAuthenticate = (password: string) => {
    // Store password for future use
    setGameState((prev) => ({
      ...prev,
      moderatorPassword: password,
    }));
    setAuthenticated(true);
  };

  // Handle starting the game
  const handleStartGame = (teamNames: string[]) => {
    const updatedTeams = gameState.teams.map((team, index) => ({
      ...team,
      name: teamNames[index] || `Team ${index + 1}`,
    }));

    setGameState({
      ...gameState,
      phase: "phase1",
      teams: updatedTeams,
      currentQuestion: 0,
      currentTeam: 0,
      selectedAnswer: -1,
      answerLocked: false,
      timer: 30,
    });
  };

  // Handle answer selection for Phase 1
  const handleSelectAnswer = (index: number) => {
    const currentQuestion =
      gameState.phase1Questions[gameState.currentQuestion];
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
      teams: updatedTeams,
    });
  };

  // Handle answer selection for Phase 2
  const handlePhase2SelectAnswer = (index: number, teamIndex: number) => {
    const currentQuestion =
      gameState.phase2Questions[gameState.currentQuestion];
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
      teams: updatedTeams,
    });
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    const currentPhase = gameState.phase;
    const questions =
      currentPhase === "phase1"
        ? gameState.phase1Questions
        : gameState.phase2Questions;
    const nextQuestion = gameState.currentQuestion + 1;

    // If there are more questions, move to the next one
    if (nextQuestion < questions.length) {
      const nextTeam = (gameState.currentTeam + 1) % gameState.teams.length;

      setGameState({
        ...gameState,
        currentQuestion: nextQuestion,
        currentTeam:
          currentPhase === "phase1" ? nextTeam : gameState.currentTeam,
        selectedAnswer: -1,
        answerLocked: false,
        timer: 30,
        activeTeamForPhase2: null,
      });
    }
    // If we're in phase 1 and finished all questions, move to phase 2
    else if (currentPhase === "phase1") {
      setGameState({
        ...gameState,
        phase: "phase2",
        currentQuestion: 0,
        selectedAnswer: -1,
        answerLocked: false,
        activeTeamForPhase2: null,
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
      phase: "results",
    });
  };

  // Reset the game
  const resetGame = () => {
    // Keep the moderator password when resetting
    const moderatorPassword = gameState.moderatorPassword;
    // Keep the game code when resetting
    const currentGameCode = gameCode;
    
    setGameState({
      ...initialGameState,
      moderatorPassword,
    });
    
    // Disconnect and reinitialize the buzzer service
    if (buzzerServiceRef.current) {
      buzzerServiceRef.current.disconnect();
    }
    
    // Generate a new game code
    const newGameCode = generateGameCode();
    setGameCode(newGameCode);
    setConnectedTeams([]);
    setConnectionStatus("connecting");
  };

  // Authentication screen component
  const AuthScreen = ({
    onAuthenticate,
  }: {
    onAuthenticate: (password: string) => void;
  }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      // Simple validation - you would want to use a more secure method in production
      if (password.trim() === "") {
        setError("Password cannot be empty");
        return;
      }

      onAuthenticate(password);
    };

    return (
      <div className="app-background flex items-center justify-center p-4 scale-105">
        <motion.div 
              className="bg-algerian-green-dark rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <motion.div
                className="absolute inset-0 bg-algerian-red rounded-full opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-14 h-14 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </motion.div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Youm al-Ilm Competition
            </h1>
            <p className="text-algerian-light opacity-80">April 16, 2025</p>
          </div>

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
        {/* </div> */}
        </motion.div>
      </div>
    );
  };

  // Setup screen component
  const SetupScreen = ({
    onStart,
  }: {
    onStart: (teamNames: string[]) => void;
  }) => {
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
              <label className="block text-sm font-medium mb-1">
                Team 1 Name
              </label>
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
              <label className="block text-sm font-medium mb-1">
                Team 2 Name
              </label>
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
  const ResultsScreen = ({
    gameState,
    onPlayAgain,
  }: {
    gameState: GameState;
    onPlayAgain: () => void;
  }) => {
    const winner =
      gameState.teams[0].score > gameState.teams[1].score
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

  // Display connection status
  const ConnectionStatus = () => {
    if (gameState.phase === "setup") return null;
    
    return (
      <div className="fixed top-4 right-4 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md z-50 bg-white">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus === "connected" ? "bg-green-500" : 
          connectionStatus === "connecting" ? "bg-yellow-500" : 
          "bg-red-500"
        }`}></div>
        <span>
          {connectionStatus === "connected" ? `Game Code: ${gameCode}` : 
           connectionStatus === "connecting" ? "Connecting..." : 
           "Connection Error"}
        </span>
        {connectionStatus === "connected" && connectedTeams.length > 0 && (
          <span className="ml-2 text-xs text-gray-600">
            {connectedTeams.length} team{connectedTeams.length > 1 ? 's' : ''} connected
          </span>
        )}
      </div>
    );
  };

  // Render the appropriate screen based on game phase
  return (
    <div className="app-background flex items-center justify-center p-4">
      <ConnectionStatus />
      
      {!authenticated ? (
        <AuthScreen onAuthenticate={handleAuthenticate} />
      ) : gameState.phase === "setup" ? (
        <SetupScreen onStart={handleStartGame} />
      ) : gameState.phase === "phase1" ? (
        <Phase1Screen
          gameState={gameState}
          onSelectAnswer={handleSelectAnswer}
          onNextQuestion={handleNextQuestion}
          setGameState={setGameState}
          gameCode={gameCode}
          isHost={true}
        />
      ) : gameState.phase === "phase2" ? (
        <Phase2Screen
          gameState={gameState}
          onSelectAnswer={handlePhase2SelectAnswer}
          onNextQuestion={handleNextQuestion}
          completePhaseTwoAndShowResults={completePhaseTwoAndShowResults}
          gameCode={gameCode}
          connectedTeams={connectedTeams}
        />
      ) : (
        <ResultsScreen gameState={gameState} onPlayAgain={resetGame} />
      )}
    </div>
  );
};

export default Game;