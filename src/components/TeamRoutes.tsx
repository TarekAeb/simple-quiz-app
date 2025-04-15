import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BuzzerService from '../hooks/BuzzerService';
import TeamLogin from './TeamLogin';
import TeamBuzzer from './TeamBuzzer';

const TeamRoutes: React.FC = () => {
  const { gameCode, teamId } = useParams<{ gameCode: string; teamId?: string }>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamData, setTeamData] = useState<{ teamName: string; teamId: number } | null>(null);
  const [error, setError] = useState('');
  const [isBuzzed, setIsBuzzed] = useState(false);
  const [hasNextQuestion, setHasNextQuestion] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected'|'connecting'|'error'>('connecting');
  const [buzzerService, setBuzzerService] = useState<BuzzerService | null>(null);
  
  // Get static passwords
  const getStaticPassword = (id: number) => {
    const passwords = ['m1PTeMa', 'm2PTeMa'];
    return passwords[id] || `m${id+1}PTeMa`;
  };
  
  // Auto-login if teamId is provided
  useEffect(() => {
    if (teamId && gameCode) {
      const numericTeamId = parseInt(teamId, 10);
      
      if (!isNaN(numericTeamId) && numericTeamId >= 0 && numericTeamId <= 1) {
        // For auto-login, we still show the login screen but pre-fill data
        console.log(`Team ID in URL: ${teamId} for game ${gameCode}`);
      }
    }
  }, [teamId, gameCode]);
  
  // Initialize BuzzerService when logged in
  useEffect(() => {
    if (isLoggedIn && teamData && gameCode) {
      const service = BuzzerService.getInstance();
      setBuzzerService(service);
      
      const initConnection = async () => {
        try {
          setConnectionStatus('connecting');
          await service.initClient(gameCode, teamData.teamId);
          setConnectionStatus('connected');
          
          // Set up listeners
          service.on('stateUpdate', (gameState: any) => {
            setHasNextQuestion(gameState.hasQuestions);
            setIsBuzzed(gameState.activeTeam !== null);
          });
          
          service.on('connectionError', (error: any) => {
            console.error('Connection error:', error);
            setConnectionStatus('error');
          });
          
        } catch (error) {
          console.error('Failed to connect to host:', error);
          setConnectionStatus('error');
        }
      };
      
      initConnection();
      
      return () => {
        // Clean up on unmount
        service.disconnect();
      };
    }
  }, [isLoggedIn, teamData, gameCode]);
  
  // Handle login
  const handleLogin = (teamName: string, password: string) => {
    // For simplicity, check against our static passwords
    const teamIndex = teamId ? parseInt(teamId, 10) : 
                      password === getStaticPassword(0) ? 0 : 
                      password === getStaticPassword(1) ? 1 : -1;
    
    if (teamIndex >= 0) {
      setTeamData({
        teamName: teamName || `Team ${teamIndex + 1}`,
        teamId: teamIndex
      });
      setIsLoggedIn(true);
    } else {
      setError('Invalid password');
    }
  };
  
  // Handle buzz
  const handleBuzz = () => {
    if (buzzerService && connectionStatus === 'connected' && hasNextQuestion && !isBuzzed) {
      const success = buzzerService.sendBuzz();
      if (success) {
        setIsBuzzed(true);
      }
    }
  };
  
  // If not logged in, show login screen
  if (!isLoggedIn) {
    return (
      <TeamLogin 
        onLogin={handleLogin} 
        error={error}
        defaultTeamId={teamId ? parseInt(teamId, 10) : undefined}
      />
    );
  }
  
  // If logged in, show buzzer
  if (teamData) {
    return (
      <TeamBuzzer
        teamName={teamData.teamName}
        teamId={teamData.teamId}
        gameCode={gameCode || ''}
        onBuzz={handleBuzz}
        isBuzzed={isBuzzed}
        connectionStatus={connectionStatus}
        hasNextQuestion={hasNextQuestion}
      />
    );
  }
  
  return <div>Loading...</div>;
};

export default TeamRoutes;