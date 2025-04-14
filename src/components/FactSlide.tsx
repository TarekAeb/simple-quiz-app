
import React from 'react';
import { Card } from '@/components/ui/card';
import { FactSlide as FactSlideType } from '@/context/PresentationContext';
import { Lightbulb } from 'lucide-react';

interface FactSlideProps {
  isActive: boolean;
  fact: FactSlideType;
}

const FactSlide: React.FC<FactSlideProps> = ({ isActive, fact }) => {
  return (
    <div 
      className={`fullscreen-slide algeria-pattern ${
        isActive ? 'animate-fade-in' : 'hidden'
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8 border-4 border-algeria-green shadow-lg bg-white/90 backdrop-blur-sm transform transition-all duration-500 hover:scale-105">
          <div className="flex flex-col items-center gap-6">
            <Lightbulb className="w-16 h-16 text-algeria-green animate-bounce" />
            
            <h2 className="text-3xl font-bold text-algeria-green mb-2">
              {fact.title}
            </h2>
            
            <p className="text-xl text-center leading-relaxed">
              {fact.content}
            </p>
            
            {fact.imageUrl && (
              <img 
                src={fact.imageUrl} 
                alt={fact.title}
                className="max-w-md rounded-lg shadow-lg mt-4 animate-fade-in"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FactSlide;
