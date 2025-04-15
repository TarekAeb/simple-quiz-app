import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TeamBuzzerProps {
  teamName: string;
  teamId: number;
  gameCode: string;
  onBuzz: (teamId: number) => void;
  isBuzzed: boolean;
  isMyTurn: boolean;
  hasNextQuestion: boolean;
}

const TeamBuzzer: React.FC<TeamBuzzerProps> = ({ 
  teamName, 
  teamId, 
  gameCode, 
  onBuzz, 
  isBuzzed, 
  isMyTurn,
  hasNextQuestion
}) => {
  const [cooldown, setCooldown] = useState(false);
  const [questionStatus, setQuestionStatus] = useState<string>("waiting");
  
  // Reset cooldown when a new question is available
  useEffect(() => {
    if (hasNextQuestion) {
      setCooldown(false);
      setQuestionStatus("ready");
    } else {
      setQuestionStatus("no_questions");
    }
  }, [hasNextQuestion]);
  
  const handleBuzz = () => {
    if (cooldown || isBuzzed || !hasNextQuestion) return;
    
    // Call the onBuzz function passed from parent
    onBuzz(teamId);
    
    setCooldown(true);
    setQuestionStatus("buzzed");
    
    // Prevent double-clicks with a cooldown
    setTimeout(() => {
      if (hasNextQuestion) {
        setCooldown(false);
        setQuestionStatus("ready");
      }
    }, 2000);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-algerian-green-dark mb-2">{teamName}</h1>
          <p className="text-gray-500">Game Code: {gameCode}</p>
        </div>
        
        {!hasNextQuestion ? (
          <div className="text-center p-6 bg-gray-100 rounded-lg mb-6">
            <p className="text-lg font-medium">Waiting for the next question...</p>
            <p>The host is preparing the next question.</p>
          </div>
        ) : isBuzzed && !isMyTurn ? (
          <div className="text-center p-6 bg-gray-100 rounded-lg mb-6">
            <p className="text-lg font-medium">The other team buzzed in first!</p>
            <p>Please wait...</p>
          </div>
        ) : isMyTurn ? (
          <div className="text-center p-6 bg-algerian-green/10 rounded-lg mb-6">
            <p className="text-lg font-bold text-algerian-green-dark">It's your turn to answer!</p>
            <p>Check the main screen for the question.</p>
          </div>
        ) : (
          <motion.button
            className={`
              w-full h-40 rounded-full ${hasNextQuestion ? 'bg-algerian-green' : 'bg-gray-400'} text-white text-2xl font-bold
              ${cooldown || !hasNextQuestion ? 'opacity-50 cursor-not-allowed' : 'hover:bg-algerian-green-dark'}
            `}
            whileHover={!cooldown && hasNextQuestion ? { scale: 1.05 } : {}}
            whileTap={!cooldown && hasNextQuestion ? { scale: 0.95 } : {}}
            onClick={handleBuzz}
            disabled={cooldown || isBuzzed || !hasNextQuestion}
          >
            {hasNextQuestion ? "BUZZ!" : "Waiting..."}
          </motion.button>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {questionStatus === "ready" ? "Ready to buzz!" : 
             questionStatus === "buzzed" ? "Buzzed in!" : 
             questionStatus === "no_questions" ? "No question available" : "Waiting..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamBuzzer;