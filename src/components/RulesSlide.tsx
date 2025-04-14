
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const RulesSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div 
      className={`fullscreen-slide algeria-pattern ${
        isActive ? 'animate-fade-in' : 'hidden'
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-algeria-green">
          Knowledge Competition Rules
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-2 border-algeria-green shadow-lg">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-algeria-green mr-2" />
              <h3 className="text-xl font-bold">Teams</h3>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Two teams will compete against each other</li>
              <li>Teams take turns answering questions</li>
              <li>Teams can confer for 30 seconds before answering</li>
            </ul>
          </Card>
          
          <Card className="p-6 border-2 border-algeria-green shadow-lg">
            <div className="flex items-center mb-4">
              <Trophy className="w-8 h-8 text-algeria-green mr-2" />
              <h3 className="text-xl font-bold">Scoring</h3>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Each correct answer: +1 point</li>
              <li>Incorrect answers: No points deducted</li>
              <li>The team with the most points at the end wins</li>
            </ul>
          </Card>
        </div>
        
        <Card className="p-6 border-2 border-algeria-red shadow-lg mb-8">
          <h3 className="text-2xl font-bold mb-4 text-algeria-red text-center">Question Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Clock className="w-10 h-10 mx-auto text-algeria-red mb-2" />
              <p className="font-semibold">30 seconds to confer</p>
            </div>
            <div className="text-center">
              <CheckCircle className="w-10 h-10 mx-auto text-algeria-green mb-2" />
              <p className="font-semibold">Multiple choice options</p>
            </div>
            <div className="text-center">
              <XCircle className="w-10 h-10 mx-auto text-algeria-red mb-2" />
              <p className="font-semibold">No hints or skips</p>
            </div>
          </div>
        </Card>
        
        <div className="text-center">
          <p className="text-xl font-bold text-algeria-green mb-4">
            Are the teams ready?
          </p>
          <p className="text-lg font-semibold animate-pulse text-algeria-green">
            Press right arrow key or swipe to start the quiz →
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesSlide;
