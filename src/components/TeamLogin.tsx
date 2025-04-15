import { useState } from 'react';
import { motion } from 'framer-motion';

interface TeamLoginProps {
  onLogin: (teamName: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

const TeamLogin: React.FC<TeamLoginProps> = ({ onLogin, error, isLoading = false }) => {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teamName.trim() && password.trim()) {
      onLogin(teamName, password);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.div 
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-algerian-green-dark">Team Login</h1>
          <p className="text-gray-500 mt-2">Enter your team name and password to join the game</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="teamName">
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-algerian-green focus:border-algerian-green"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-algerian-green focus:border-algerian-green"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && (
            <div className="text-error text-sm py-2">
              {error}
            </div>
          )}
          
          <motion.button
            type="submit"
            className="w-full bg-algerian-green text-white py-2 px-4 rounded-md font-medium mt-4 hover:bg-algerian-green-dark disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Join Game"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default TeamLogin;