import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameState, Question, GamePhase } from "./lib/types";
import IntroSlides from "./components/IntroSlides";
import SetupScreen from "./components/SetupScreen";
import Phase1Screen from "./components/GameScreen";
import Phase2Screen from "./components/Phase2Screen";
import ResultsScreen from "./components/ResultScreen";
import { phase1Questions, phase2Questions } from "./data/questions";
import LoginScreen from "./components/LoginScreen";

function App() {
  const [gameState, setGameState] = useState<GameState>({
    teams: [
      { name: "", score: 0 },
      { name: "", score: 0 },
    ],
    currentTeam: 0,
    currentQuestion: 0,
    timer: 30,
    phase1Questions: phase1Questions,
    phase2Questions: phase2Questions,
    selectedAnswer: null,
    answerLocked: false,
    gamePhase: "login", // Changed from 'intro' to 'login'
    introSlide: 0,
    activeTeamForPhase2: null,
    isAuthenticated: false,
  });

  // Add this function to handle authentication
  const handleAuthentication = () => {
    setGameState((prev) => ({
      ...prev,
      isAuthenticated: true,
      gamePhase: "intro",
    }));
  };

  // In the return statement, add this before the intro screen condition:
  
  // Effect for keyboard controls in Phase 2
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gamePhase !== "phase2" || gameState.answerLocked) return;

      if (e.key.toLowerCase() === "q") {
        activateTeam(0);
      } else if (e.key.toLowerCase() === "p") {
        activateTeam(1);
      }
    };

    const handleTeamActivation = (e: Event) => {
      const customEvent = e as CustomEvent;
      const teamIndex = customEvent.detail.teamIndex;

      setGameState((prev) => ({
        ...prev,
        activeTeamForPhase2: teamIndex,
      }));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("activateTeam", handleTeamActivation);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("activateTeam", handleTeamActivation);
    };
  }, [gameState.gamePhase, gameState.answerLocked]);

  // Introduction slides navigation
  const nextIntroSlide = () => {
    if (gameState.introSlide < 2) {
      setGameState((prev) => ({
        ...prev,
        introSlide: prev.introSlide + 1,
      }));
    }
  };

  const skipIntroAndSetup = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "setup",
    }));
  };

  // Set team names and start the game
  const startGame = (team1Name: string, team2Name: string) => {
    if (!team1Name || !team2Name) return;

    setGameState((prev) => ({
      ...prev,
      teams: [
        { name: team1Name, score: 0 },
        { name: team2Name, score: 0 },
      ],
      gamePhase: "phase1",
    }));
  };

  // Handle answer selection for Phase 1
  const selectAnswerPhase1 = (answerIndex: number) => {
    if (gameState.answerLocked) return;

    setGameState((prev) => ({
      ...prev,
      selectedAnswer: answerIndex,
      answerLocked: true,
    }));

    // Check answer after a delay
    setTimeout(() => {
      checkAnswerPhase1(answerIndex);
    }, 500);
  };

  // Check if answer is correct in Phase 1
  const checkAnswerPhase1 = (answerIndex: number) => {
    const currentQuestion =
      gameState.phase1Questions[gameState.currentQuestion];

    if (answerIndex === currentQuestion.correctIndex) {
      // Update score if correct
      setGameState((prev) => {
        const updatedTeams = [...prev.teams] as [
          (typeof prev.teams)[0],
          (typeof prev.teams)[1]
        ];
        updatedTeams[prev.currentTeam].score += 1;

        return {
          ...prev,
          teams: updatedTeams,
        };
      });
    }
  };

  // Handle answer selection for Phase 2
  const selectAnswerPhase2 = (answerIndex: number, teamIndex: number) => {
    if (gameState.answerLocked) return;

    setGameState((prev) => ({
      ...prev,
      selectedAnswer: answerIndex,
      answerLocked: true,
    }));

    // Check answer after a delay
    setTimeout(() => {
      checkAnswerPhase2(answerIndex, teamIndex);
    }, 500);
  };

  // Check if answer is correct in Phase 2
  const checkAnswerPhase2 = (answerIndex: number, teamIndex: number) => {
    const currentQuestion =
      gameState.phase2Questions[gameState.currentQuestion];

    if (answerIndex === currentQuestion.correctIndex) {
      // Update score if correct
      setGameState((prev) => {
        const updatedTeams = [...prev.teams] as [
          (typeof prev.teams)[0],
          (typeof prev.teams)[1]
        ];
        updatedTeams[teamIndex].score += 1;

        return {
          ...prev,
          teams: updatedTeams,
        };
      });
    }
  };

  // Move to next question in Phase 1
  const nextQuestionPhase1 = () => {
    const nextQuestionIndex = gameState.currentQuestion + 1;

    if (nextQuestionIndex >= gameState.phase1Questions.length) {
      // End Phase 1 and start Phase 2
      setGameState((prev) => ({
        ...prev,
        gamePhase: "phase2",
        currentQuestion: 0,
        selectedAnswer: null,
        answerLocked: false,
        activeTeamForPhase2: null,
      }));
    } else {
      // Move to next question and switch teams
      setGameState((prev) => ({
        ...prev,
        currentQuestion: nextQuestionIndex,
        currentTeam: prev.currentTeam === 0 ? 1 : 0,
        selectedAnswer: null,
        answerLocked: false,
        timer: 30,
      }));
    }
  };

  // Move to next question in Phase 2
  const nextQuestionPhase2 = () => {
    const nextQuestionIndex = gameState.currentQuestion + 1;

    if (nextQuestionIndex >= gameState.phase2Questions.length) {
      // End game if all questions are answered
      setGameState((prev) => ({
        ...prev,
        gamePhase: "results",
      }));
    } else {
      // Move to next question
      setGameState((prev) => ({
        ...prev,
        currentQuestion: nextQuestionIndex,
        selectedAnswer: null,
        answerLocked: false,
        activeTeamForPhase2: null,
      }));
    }
  };

  // Complete Phase 2 and show results
  const completePhaseTwoAndShowResults = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "results",
    }));
  };

  // Helper function to activate a team for Phase 2
  const activateTeam = (teamIndex: number) => {
    if (gameState.answerLocked || gameState.activeTeamForPhase2 !== null)
      return;

    setGameState((prev) => ({
      ...prev,
      activeTeamForPhase2: teamIndex,
    }));
  };

  // Reset game to start
  const resetGame = () => {
    setGameState({
      teams: [
        { name: "", score: 0 },
        { name: "", score: 0 },
      ],
      currentTeam: 0,
      currentQuestion: 0,
      timer: 30,
      phase1Questions: phase1Questions,
      phase2Questions: phase2Questions,
      selectedAnswer: null,
      answerLocked: false,
      gamePhase: "login", // Changed from 'intro' to 'login'
      introSlide: 0,
      activeTeamForPhase2: null,
      isAuthenticated: false,
    });
  };

  return (
    <div className="app-background flex items-center justify-center p-4 scale-105">
      <AnimatePresence mode="wait">
      {
    gameState.gamePhase === "login" && (
      <motion.div
        key="login"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <LoginScreen onAuthenticated={handleAuthentication} />
      </motion.div>
    )
  }

        {gameState.gamePhase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <IntroSlides
              currentSlide={gameState.introSlide}
              onNextSlide={nextIntroSlide}
              onSkipIntro={skipIntroAndSetup}
            />
          </motion.div>
        )}

        {gameState.gamePhase === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SetupScreen onStartGame={startGame} />
          </motion.div>
        )}

        {gameState.gamePhase === "phase1" && (
          <motion.div
            key="phase1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <Phase1Screen
              gameState={gameState}
              onSelectAnswer={selectAnswerPhase1}
              onNextQuestion={nextQuestionPhase1}
              setGameState={setGameState}
              // isPhaseOne={true}
            />
          </motion.div>
        )}

        {gameState.gamePhase === "phase2" && (
          <motion.div
            key="phase2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
          >
            <Phase2Screen
              gameState={gameState}
              onSelectAnswer={selectAnswerPhase2}
              onNextQuestion={nextQuestionPhase2}
              completePhaseTwoAndShowResults={completePhaseTwoAndShowResults}
            />
          </motion.div>
        )}

        {gameState.gamePhase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <ResultsScreen teams={gameState.teams} onPlayAgain={resetGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
