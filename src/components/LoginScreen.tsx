import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoginScreenProps {
  onAuthenticated: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Correct password - in a real app, this would be verified server-side
  const correctPassword = 'M3alma3youmalilm2025';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Please enter the password');
      inputRef.current?.focus();
      return;
    }
    
    setIsLoading(true);
    
    // Simulate verification delay
    setTimeout(() => {
      if (password === correctPassword) {
        setError('');
        onAuthenticated();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
        inputRef.current?.focus();
      }
      setIsLoading(false);
    }, 800);
  };
  
  return (
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
              ease: "easeInOut" 
            }}
          />
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </motion.div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Youm al-Ilm Competition</h1>
        <p className="text-algerian-light opacity-80">April 16, 2025</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-algerian-red/20 text-algerian-red rounded-lg text-center text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="password" className="block font-medium text-white">
            Administrator Password
          </label>
          <input
            ref={inputRef}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 bg-algerian-green-light border-2 border-algerian-green text-white rounded-lg 
                     focus:border-algerian-gold focus:outline-none focus:ring-2 focus:ring-algerian-gold/20 
                     transition-all duration-300 placeholder-white/50"
            autoFocus
          />
        </div>
        
        <motion.button
          type="submit"
          className={`w-full p-3 mt-4 rounded-lg font-bold text-white 
                    ${isLoading ? 'bg-algerian-gold/70' : 'bg-algerian-gold'} 
                    transition-colors duration-200 flex items-center justify-center`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : (
            "Access Competition"
          )}
        </motion.button>
      </form>
      
      <div className="mt-6 text-center text-algerian-light opacity-70 text-sm">
        <p>Hosted by: TarekAeb</p>
        <p className="mt-1">Knowledge Day Celebration</p>
      </div>
    </motion.div>
  );
};

export default LoginScreen;