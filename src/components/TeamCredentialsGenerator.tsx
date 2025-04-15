import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

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
  
  const handleGenerateCredentials = () => {
    const newGameCode = generateGameCode();
    setGameCode(newGameCode);
    
    const newCredentials = teams.map((team, index) => ({
      teamName: team.name,
      password: getStaticPassword(index),
      teamId: index
    }));
    
    setCredentials(newCredentials);
    setGenerated(true);
    onGenerateCredentials(newCredentials);
  };
  
  // URL for the QR code - just include the game code, not team ID
  const getJoinUrl = () => {
    return `${window.location.origin}/join/${gameCode}`;
  };
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-algerian-green-dark mb-4 text-center">Scan the Game QR Code</h2>
      
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
            
            
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <p className="font-medium">Reminder:</p>
            <p className="text-sm">Login with your team name and the password given to you</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCredentialsGenerator;