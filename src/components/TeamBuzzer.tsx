import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TeamBuzzerProps {
  teamName: string;
  teamId: number;
  gameCode: string;
  onBuzz: () => void;
  isBuzzed: boolean;
  connectionStatus: 'connected' | 'connecting' | 'error';
  hasNextQuestion: boolean;
}

const TeamBuzzer: React.FC<TeamBuzzerProps> = ({
  teamName,
  teamId,
  gameCode,
  onBuzz,
  isBuzzed,
  connectionStatus,
  hasNextQuestion,
}) => {
  // Add vibration when user buzzes in
  const handleBuzz = () => {
    // Trigger vibration if available
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    onBuzz();
  };
  
  return (
    <div className="app-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-lg">{teamName}</div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium
              ${connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 
                connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}>
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 
               'Connection Error'}
            </div>
          </div>
          
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">Game Code:</span>
            <span className="text-lg font-bold ml-2">{gameCode}</span>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
        <motion.button
          className={`w-56 h-56 rounded-full shadow-lg flex items-center justify-center
            ${hasNextQuestion && !isBuzzed 
              ? 'bg-algerian-red hover:bg-red-600 cursor-pointer' 
              : 'bg-gray-300 cursor-not-allowed'}
            transition-colors duration-300`}
          onClick={hasNextQuestion && !isBuzzed ? handleBuzz : undefined}
          whileHover={hasNextQuestion && !isBuzzed ? { scale: 1.05 } : {}}
          whileTap={hasNextQuestion && !isBuzzed ? { scale: 0.95 } : {}}
          animate={
            isBuzzed 
              ? { scale: [1, 1.03, 1], transition: { repeat: Infinity, duration: 1.5 } }
              : {}
          }
        >
          <span className="text-white text-2xl font-bold">
            {isBuzzed ? "BUZZED!" : "BUZZ"}
          </span>
        </motion.button>
        
        <div className="mt-6 text-center">
          {isBuzzed ? (
            <p className="font-medium text-algerian-green">Your team has buzzed in!</p>
          ) : hasNextQuestion ? (
            <p className="text-white">Ready to answer? Press the buzzer!</p>
          ) : (
            <p className="text-gray-300">Waiting for the next question...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamBuzzer;