import { useState, useEffect } from 'react';
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
  gameCode: string;
  connectedTeams: number[];
}

const TeamCredentialsGenerator: React.FC<TeamCredentialsGeneratorProps> = ({ 
  onGenerateCredentials,
  teams,
  gameCode,
  connectedTeams
}) => {
  const [credentials, setCredentials] = useState<TeamCredential[]>([]);
  const [generated, setGenerated] = useState(false);
  
  // Static passwords - not shown to moderator
  const getStaticPassword = (teamId: number) => {
    // Using fixed passwords that aren't shown in the UI
    const passwords = ['TEAM1PWD', 'TEAM2PWD'];
    return passwords[teamId] || `TEAM${teamId+1}PWD`;
  };
  
  // Generate credentials when component mounts or gameCode changes
  useEffect(() => {
    if (gameCode && !generated) {
      handleGenerateCredentials();
    }
  }, [gameCode]);
  
  const handleGenerateCredentials = () => {
    const newCredentials = teams.map((team, index) => ({
      teamName: team.name,
      password: getStaticPassword(index),
      teamId: index
    }));
    
    setCredentials(newCredentials);
    setGenerated(true);
    onGenerateCredentials(newCredentials);
  };
  
  // URL for the QR code
  const getJoinUrl = (teamId: number) => {
    return `${window.location.origin}/join/${gameCode}/${teamId}`;
  };
  
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-algerian-green-dark mb-4">Team QR Codes</h2>
      
      {!generated ? (
        <div className="text-center">
          <p className="mb-4">
            Generating QR codes for teams...
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-gray-100 rounded-md text-center">
            <span className="font-medium">Game Code:</span> <span className="text-xl font-bold">{gameCode}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {credentials.map((cred) => (
              <div 
                key={cred.teamId} 
                className={`p-4 border ${connectedTeams.includes(cred.teamId) ? 'border-green-300 bg-green-50' : 'border-gray-200'} rounded-md flex flex-col items-center`}
              >
                <div className="flex justify-between items-center w-full mb-2">
                  <h3 className="font-bold text-lg">{cred.teamName}</h3>
                  {connectedTeams.includes(cred.teamId) && (
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">Connected</span>
                  )}
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeSVG 
                    value={getJoinUrl(cred.teamId)} 
                    size={180}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                
                <p className="mt-2 text-center text-sm text-gray-600">
                  Scan to join as {cred.teamName}
                </p>
                
                <div className="mt-3 w-full">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Password:</span>
                    <span className="text-xs font-mono font-bold">{cred.password}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500 break-all">
                    <span>URL: {getJoinUrl(cred.teamId)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-sm text-gray-500 text-center">
            <p className="font-medium">Instructions:</p>
            <p>1. Have each team scan their QR code or visit the URL</p>
            <p>2. When prompted, teams must enter the password shown above</p>
            <p>3. Once connected, teams will see a buzzer on their device</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCredentialsGenerator;