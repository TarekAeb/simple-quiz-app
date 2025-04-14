
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePresentation } from '@/context/PresentationContext';
import { Timer, Bell } from 'lucide-react';

interface FirstAnswerDetectorProps {
  onTimeUp: () => void;
  timeLimit: number;
}

const FirstAnswerDetector: React.FC<FirstAnswerDetectorProps> = ({ 
  onTimeUp,
  timeLimit 
}) => {
  const { currentRound, setFirstAnswerTeam } = usePresentation();
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeUp]);

  const handleTeamClick = (team: 1 | 2) => {
    setFirstAnswerTeam(team);
    setIsRunning(false);
  };

  if (currentRound === 1) return null;

  return (
    <div className="fixed top-4 right-4 flex flex-col items-end gap-4 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-algeria-green flex items-center gap-4">
        <Timer className="text-algeria-green" />
        <span className="text-2xl font-bold text-algeria-green">{timeLeft}s</span>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={() => handleTeamClick(1)}
          variant="outline"
          className="border-2 border-algeria-green hover:bg-algeria-green hover:text-white"
          size="lg"
        >
          <Bell className="mr-2" />
          Team 1 First!
        </Button>
        
        <Button
          onClick={() => handleTeamClick(2)}
          variant="outline"
          className="border-2 border-algeria-red hover:bg-algeria-red hover:text-white"
          size="lg"
        >
          <Bell className="mr-2" />
          Team 2 First!
        </Button>
      </div>
    </div>
  );
};

export default FirstAnswerDetector;
