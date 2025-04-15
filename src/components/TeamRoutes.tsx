import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TeamLogin from './TeamLogin';
import TeamBuzzer from './TeamBuzzer';
import BuzzerService from '../hooks/BuzzerService';

const TeamRoutes: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamData, setTeamData] = useState<{ teamName: string; teamId: number } | null>(null);
  const [error, setError] = useState('');
  const [isBuzzed, setIsBuzzed] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [hasNextQuestion, setHasNextQuestion] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  // Static passwords - not shown to users
  const getStaticPassword = (id: number) => {
    const passwords = ['TEAM1PWD', 'TEAM2PWD'];
    return passwords[id] || `TEAM${id+1}PWD`;
  };
  
  // Handle team login
  const handleLogin = async (teamName: string, password: string) => {
    try {
      // Check password against static passwords
      let teamId = -1;
      
      if (password === getStaticPassword(0)) {
        teamId = 0;
      } else if (password === getStaticPassword(1)) {
        teamId = 1;
      } else {
        setError('Invalid password');
        return;
      }
      
      if (gameCode) {
        setConnectionStatus('connecting');
        
        // Initialize PeerJS client
        const buzzerService = BuzzerService.getInstance();
        
        try {
          await buzzerService.initClient(gameCode, teamId);
          
          // Setup state update listener
          buzzerService.on('stateUpdate', (gameState: any) => {
            setHasNextQuestion(gameState.hasQuestions);
            setIsMyTurn(gameState.activeTeam === teamId);
            setIsBuzzed(gameState.activeTeam !== null);
          });
          
          buzzerService.on('connectionError', (err: Error) => {
            setError(`Connection error: ${err.message}`);
            setConnectionStatus('disconnected');
          });
          
          setConnectionStatus('connected');
          setTeamData({ teamName, teamId });
          setIsLoggedIn(true);
        } catch (err: any) {
          setError(`Failed to connect: ${err.message}`);
          setConnectionStatus('disconnected');
        }
      } else {
        setError('No game code provided');
      }
    } catch (e) {
      setError('Login failed. Please try again.');
    }
  };
  
  // Handle buzzing in
  const handleBuzz = (teamId: number) => {
    if (!hasNextQuestion || isBuzzed) return;
    
    // Use BuzzerService to send buzz
    const buzzerService = BuzzerService.getInstance();
    const success = buzzerService.sendBuzz();
    
    if (success) {
      setIsBuzzed(true);
    } else {
      setError('Failed to send buzz. Please try again.');
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isLoggedIn) {
        BuzzerService.getInstance().disconnect();
      }
    };
  }, [isLoggedIn]);
  
  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <TeamLogin 
        onLogin={handleLogin} 
        error={error} 
        isLoading={connectionStatus === 'connecting'}
      />
    );
  }
  
  // Show buzzer if logged in
  if (teamData) {
    return (
      <TeamBuzzer
        teamName={teamData.teamName}
        teamId={teamData.teamId}
        gameCode={gameCode || ''}
        onBuzz={handleBuzz}
        isBuzzed={isBuzzed}
        isMyTurn={isMyTurn}
        hasNextQuestion={hasNextQuestion}
      />
    );
  }
  
  return null;
};

export default TeamRoutes;