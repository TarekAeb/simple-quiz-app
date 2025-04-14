
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { usePresentation } from '@/context/PresentationContext';

const ScoreboardSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const { team1, team2, incrementScore, decrementScore, resetScores } = usePresentation();
  
  const winnerText = () => {
    if (team1.score > team2.score) {
      return `${team1.name} Wins!`;
    } else if (team2.score > team1.score) {
      return `${team2.name} Wins!`;
    } else {
      return "It's a Tie!";
    }
  };
  
  return (
    <div 
      className={`fullscreen-slide algeria-pattern ${
        isActive ? 'animate-fade-in' : 'hidden'
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-algeria-green">
          Final Results
        </h1>
        
        {/* Trophy and Winner */}
        <div className="mb-10 text-center">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-algeria-green">
            {winnerText()}
          </h2>
        </div>
        
        {/* Scoreboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Team 1 */}
          <Card className="p-6 border-4 border-algeria-green shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-algeria-green text-center">
              {team1.name}
            </h3>
            
            <div className="flex justify-center items-center mb-6">
              <div className="text-6xl font-bold w-24 h-24 rounded-full bg-algeria-green text-white flex items-center justify-center">
                {team1.score}
              </div>
            </div>
            
            <div className="flex justify-center gap-2">
              <Button 
                onClick={() => incrementScore(1)}
                variant="outline" 
                className="border-2 border-algeria-green"
                size="icon"
              >
                <ChevronUp className="w-5 h-5 text-algeria-green" />
              </Button>
              
              <Button 
                onClick={() => decrementScore(1)}
                variant="outline" 
                className="border-2 border-algeria-red"
                size="icon"
                disabled={team1.score <= 0}
              >
                <ChevronDown className="w-5 h-5 text-algeria-red" />
              </Button>
            </div>
          </Card>
          
          {/* Team 2 */}
          <Card className="p-6 border-4 border-algeria-red shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-algeria-red text-center">
              {team2.name}
            </h3>
            
            <div className="flex justify-center items-center mb-6">
              <div className="text-6xl font-bold w-24 h-24 rounded-full bg-algeria-red text-white flex items-center justify-center">
                {team2.score}
              </div>
            </div>
            
            <div className="flex justify-center gap-2">
              <Button 
                onClick={() => incrementScore(2)}
                variant="outline" 
                className="border-2 border-algeria-green"
                size="icon"
              >
                <ChevronUp className="w-5 h-5 text-algeria-green" />
              </Button>
              
              <Button 
                onClick={() => decrementScore(2)}
                variant="outline" 
                className="border-2 border-algeria-red"
                size="icon"
                disabled={team2.score <= 0}
              >
                <ChevronDown className="w-5 h-5 text-algeria-red" />
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Reset Button */}
        <div className="text-center">
          <Button 
            onClick={resetScores}
            variant="outline" 
            className="border-2 border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Scores
          </Button>
        </div>
        
        {/* Conclusion */}
        <div className="mt-10 text-center">
          <p className="text-xl font-medium text-gray-700">
            Thank you for participating in our April 16 Knowledge Competition!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardSlide;
