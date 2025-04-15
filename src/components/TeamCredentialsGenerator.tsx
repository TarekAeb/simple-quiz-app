import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import BuzzerService from '../hooks/BuzzerService';

interface TeamCredential {
  teamName: string;
  password: string;
  teamId: number;
}

interface TeamCredentialsGeneratorProps {
  onGenerateCredentials: (credentials: TeamCredential[]) => void;
  teams: { name: string; score: number }[];
}

const TeamCredentialsGenerator: React.FC<TeamCredentialsGeneratorProps> = ({ 
  onGenerateCredentials,
  teams
}) => {
  const [gameCode, setGameCode] = useState('');
  const [credentials, setCredentials] = useState<TeamCredential[]>([]);
  const [generated, setGenerated] = useState(false);
  const [connectedTeams, setConnectedTeams] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Generate a random 4-character game code
  const generateGameCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Static passwords - not shown to moderator
  const getStaticPassword = (teamId: number) => {
    // Using fixed passwords that aren't shown in the UI
    const passwords = ['TEAM1PWD', 'TEAM2PWD'];
    return passwords[teamId] || `TEAM${teamId+1}PWD`;
  };
  
  const handleGenerateCredentials = async () => {
    const newGameCode = generateGameCode();
    setGameCode(newGameCode);
    
    const newCredentials = teams.map((team, index) => ({
      teamName: team.name,
      password: getStaticPassword(index),
      teamId: index
    }));
    
    setCredentials(newCredentials);
    
    // Initialize PeerJS host
    const buzzerService = BuzzerService.getInstance();
    
    try {
      await buzzerService.initHost(newGameCode);
      
      // Setup connection listeners
      buzzerService.on('teamConnected', (teamInfo: any) => {
        console.log(`Team ${teamInfo.teamId} connected!`);
        setConnectedTeams(buzzerService.getConnectedTeams());
      });
      
      buzzerService.on('connectionError', (err: Error) => {
        setError(`Connection error: ${err.message}`);
      });
      
      setGenerated(true);
      onGenerateCredentials(newCredentials);
    } catch (err: any) {
      setError(`Failed to initialize host: ${err.message}`);
    }
  };
  
  // URL for the QR code
  const getJoinUrl = () => {
    return `${window.location.origin}/join/${gameCode}`;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (generated) {
        BuzzerService.getInstance().disconnect();
      }
    };
  }, [generated]);
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-algerian-green-dark mb-4">Generate Game QR Code</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {!generated ? (
        <div className="text-center">
          <p className="mb-4">
            Generate QR code for teams to join Phase 2 with their own devices
          </p>
          
          <motion.button
            className="bg-algerian-green hover:bg-algerian-green-dark text-white px-4 py-2 rounded-md font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateCredentials}
          >
            Generate QR Code
          </motion.button>
        </div>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-gray-100 rounded-md text-center">
            <span className="font-medium">Game Code:</span> <span className="text-xl font-bold">{gameCode}</span>
          </div>
          
          {/* Connected teams indicator */}
          <div className="mb-4 flex justify-center gap-4">
            {teams.map((team, index) => (
              <div 
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  connectedTeams.includes(index)
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {team.name} {connectedTeams.includes(index) ? '(Connected)' : '(Waiting...)'}
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center mt-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <QRCodeSVG 
                value={getJoinUrl()} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <p className="mt-4 text-center font-medium">
              Join URL: <span className="text-algerian-green-dark">{getJoinUrl()}</span>
            </p>
            
            <div className="mt-6 text-sm text-gray-600 max-w-md">
              <p className="font-medium text-center mb-2">Instructions:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Display this QR code where all teams can see it</li>
                <li>Team members scan the QR code with their devices</li>
                <li>Provide each team with their team name and password on paper</li>
                <li>Teams enter their credentials on the login screen</li>
                <li>Once logged in, teams will see the buzzer interface</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="font-medium">Reminder:</p>
            <p className="text-sm">The team passwords are not displayed here for security. Please provide them to the teams on paper.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCredentialsGenerator;