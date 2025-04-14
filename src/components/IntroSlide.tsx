
import React from 'react';
import { Card } from '@/components/ui/card';

const IntroSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div 
      className={`fullscreen-slide algeria-pattern ${
        isActive ? 'animate-fade-in' : 'hidden'
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-algeria-green rounded-full flex items-center justify-center text-white text-3xl font-bold">
            16
          </div>
        </div>

        <h1 className="text-5xl font-bold text-center mb-6 text-algeria-green">
          April 16 Celebration
        </h1>
        
        <h2 className="text-3xl font-medium text-center mb-10 text-algeria-red">
          Ibn Badis Day of Knowledge
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 border-2 border-algeria-green bg-white bg-opacity-90 shadow-lg">
            <h3 className="text-2xl font-bold mb-3 text-algeria-green">April 16 in Algeria</h3>
            <p className="text-lg">
              April 16 is celebrated in Algeria as "Knowledge Day" (Yawm al-Ilm), 
              commemorating the death anniversary of Abdelhamid Ibn Badis, a revered 
              reformist and nationalist figure who played a crucial role in preserving 
              Algerian identity during the French colonial period.
            </p>
          </Card>
          
          <Card className="p-6 border-2 border-algeria-red bg-white bg-opacity-90 shadow-lg">
            <h3 className="text-2xl font-bold mb-3 text-algeria-red">Abdelhamid Ibn Badis</h3>
            <p className="text-lg">
              Born in Constantine in 1889, Ibn Badis was an Islamic scholar, 
              educational reformer, and the founder of the Association of Algerian 
              Muslim Ulama. His motto "Islam is our religion, Arabic is our language, 
              Algeria is our country" became a powerful expression of Algerian identity.
            </p>
          </Card>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-lg font-medium text-gray-700">
            We celebrate his legacy through knowledge and learning.
          </p>
        </div>
        
        <div className="mt-10 text-center">
          <p className="text-lg font-semibold animate-pulse text-algeria-green">
            Press right arrow key or swipe to continue →
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroSlide;
