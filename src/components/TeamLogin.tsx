import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TeamLoginProps {
  onLogin: (teamName: string, password: string) => void;
  error: string;
  defaultTeamId?: number;
}

const TeamLogin: React.FC<TeamLoginProps> = ({ onLogin, error, defaultTeamId }) => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  
  // Pre-fill team name if we have a default team ID
  useEffect(() => {
    if (defaultTeamId !== undefined) {
      setTeamName(`Team ${defaultTeamId + 1}`);
    }
  }, [defaultTeamId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(teamName, password);
  };
  
  return (
    <div className="app-background flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-algerian-green-dark mb-6 text-center">
          Team Login
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Team Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-algerian-green focus:border-algerian-green"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-algerian-green focus:border-algerian-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter team password"
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <motion.button
            type="submit"
            className="w-full bg-algerian-green hover:bg-algerian-green-dark text-white px-6 py-3 rounded-lg font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Game
          </motion.button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Ask your quiz master for the password</p>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;