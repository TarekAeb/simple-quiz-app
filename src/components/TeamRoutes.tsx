import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TeamLogin from './TeamLogin';
import TeamBuzzer from './TeamBuzzer';
import { teamBuzz, hasAvailableQuestions, isTeamActive } from '../hooks/BuzzerService';

const TeamRoutes: React.FC = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamData, setTeamData] = useState<{ teamName: string; teamId: number } | null>(null);
  const [error, setError] = useState('');
  const [isBuzzed, setIsBuzzed] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [hasNextQuestion, setHasNextQuestion] = useState(false);
  
  // Static passwords - not shown to users
  const getStaticPassword = (id: number) => {
    const passwords = ['TEAM1PWD', 'TEAM2PWD'];
    return passwords[id] || `TEAM${id+1}PWD`;
  };
  
  // Handle team login
  const handleLogin = (teamName: string, password: string) => {
    try {
      if (password === getStaticPassword(0)) {
        const team0 = JSON.parse(localStorage.getItem('team_cred_0') || '{}');
        setTeamData({ teamName: team0.teamName || "Team 1", teamId: 0 });
        setIsLoggedIn(true);
        localStorage.setItem('current_team', '0');
      } else if (password === getStaticPassword(1)) {
        const team1 = JSON.parse(localStorage.getItem('team_cred_1') || '{}');
        setTeamData({ teamName: team1.teamName || "Team 2", teamId: 1 });
        setIsLoggedIn(true);
        localStorage.setItem('current_team', '1');
      } else {
        setError('Invalid password');
      }
    } catch (e) {
      setError('Login failed. Please try again.');
    }
  };
  
  // Handle buzzing in
  const handleBuzz = (teamId: number) => {
    if (!hasNextQuestion) return;
    
    // Use the teamBuzz function from BuzzerService
    const success = teamBuzz(teamId, gameCode || '');
    
    if (success) {
      setIsBuzzed(true);
    }
  };
  
  // Listen for game state changes
  useEffect(() => {
    if (isLoggedIn && teamData) {
      const checkGameState = setInterval(() => {
        try {
          // Check if questions are available
          const hasQuestions = hasAvailableQuestions();
          setHasNextQuestion(hasQuestions);
          
          // Check if this team is active
          const isActive = isTeamActive(teamData.teamId);
          setIsMyTurn(isActive);
          
          // Check if any team is active
          if (isActive) {
            setIsBuzzed(true);
          } else {
            // Check the game state from localStorage
            const gameStateJSON = localStorage.getItem('game_state');
            if (gameStateJSON) {
              const gameState = JSON.parse(gameStateJSON);
              setIsBuzzed(gameState.activeTeam !== null);
            }
          }
        } catch (e) {
          console.error("Error checking game state:", e);
        }
      }, 500); // Check every 500ms
      
      return () => clearInterval(checkGameState);
    }
  }, [isLoggedIn, teamData]);
  
  if (!isLoggedIn) {
    return <TeamLogin onLogin={handleLogin} error={error} />;
  }
  
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