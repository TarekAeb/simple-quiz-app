import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Team } from '../lib/types';
import Confetti from './Confetti';

interface ResultsScreenProps {
  teams: [Team, Team];
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ teams, onPlayAgain }) => {
  // Determine winner
  const team1Score = teams[0].score;
  const team2Score = teams[1].score;
  const isTie = team1Score === team2Score;
  const winnerIndex = isTie ? null : team1Score > team2Score ? 0 : 1;
  
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-2xl relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Confetti animation */}
      {!isTie && <Confetti />}
      
      <h1 className="text-3xl md:text-4xl font-bold text-center text-algerian-green-dark to  mb-6">
        Competition Complete!
      </h1>
      
      <motion.div 
        className="text-2xl md:text-3xl font-bold text-center text-algerian-green-dark to  mb-8"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {isTie 
          ? "It's a tie!" 
          : `${teams[winnerIndex as number].name} wins!`}
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <motion.div 
          className={`
            bg-white rounded-xl p-6 text-center shadow-md flex-1
            ${!isTie && winnerIndex === 0 ? 'ring-2 ring-primary' : ''}
          `}
          animate={!isTie && winnerIndex === 0 ? { scale: 1.05 } : {}}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-medium text-lg mb-2">{teams[0].name}</div>
          <div className="text-4xl font-bold text-primary">{teams[0].score}</div>
        </motion.div>
        
        <motion.div 
          className={`
            bg-white rounded-xl p-6 text-center shadow-md flex-1
            ${!isTie && winnerIndex === 1 ? 'ring-2 ring-primary' : ''}
          `}
          animate={!isTie && winnerIndex === 1 ? { scale: 1.05 } : {}}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="font-medium text-lg mb-2">{teams[1].name}</div>
          <div className="text-4xl font-bold text-primary">{teams[1].score}</div>
        </motion.div>
      </div>
      
      <div className="text-center text-lg mb-8">
        <p className="mb-2">Thank you for participating in the Youm al-Ilm Competition!</p>
        <p className="text-algerian-green-dark to  font-medium">
          "The pursuit of knowledge is obligatory for every Muslim." - Prophet Muhammad ﷺ
        </p>
      </div>
      
      <div className="flex justify-center">
        <motion.button
          className="btn-primary"
          onClick={onPlayAgain}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>Play Again</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ResultsScreen;