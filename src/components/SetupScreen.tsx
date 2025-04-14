import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface SetupScreenProps {
  onStartGame: (team1Name: string, team2Name: string) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const team1InputRef = useRef<HTMLInputElement>(null);
  const team2InputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team1Name.trim()) {
      setError('Please enter Team 1 name');
      team1InputRef.current?.focus();
      team1InputRef.current?.classList.add('animate-shake');
      setTimeout(() => {
        team1InputRef.current?.classList.remove('animate-shake');
      }, 500);
      return;
    }
    
    if (!team2Name.trim()) {
      setError('Please enter Team 2 name');
      team2InputRef.current?.focus();
      team2InputRef.current?.classList.add('animate-shake');
      setTimeout(() => {
        team2InputRef.current?.classList.remove('animate-shake');
      }, 500);
      return;
    }
    
    onStartGame(team1Name, team2Name);
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-lg"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-4xl font-bold text-center text-algerian-green-dark to  mb-8 relative">
        Team Quiz Challenge
        <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-algerian-green rounded-full"></span>
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-center">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="team1-name" className="block font-medium">
            Team 1
          </label>
          <input
            ref={team1InputRef}
            type="text"
            id="team1-name"
            value={team1Name}
            onChange={(e) => setTeam1Name(e.target.value)}
            placeholder="Enter team name"
            className="input-field"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="team2-name" className="block font-medium">
            Team 2
          </label>
          <input
            ref={team2InputRef}
            type="text"
            id="team2-name"
            value={team2Name}
            onChange={(e) => setTeam2Name(e.target.value)}
            placeholder="Enter team name"
            className="input-field"
          />
        </div>
        
        <motion.button
          type="submit"
          className="btn-primary w-full mt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Start Game</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SetupScreen;