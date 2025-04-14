
import React from 'react';
import { usePresentation } from '@/context/PresentationContext';
import IntroSlide from './IntroSlide';
import RulesSlide from './RulesSlide';
import QuestionSlide from './QuestionSlide';
import ScoreboardSlide from './ScoreboardSlide';
import NavigationControls from './NavigationControls';

const PresentationMain: React.FC = () => {
  const { currentSlide, questions } = usePresentation();
  
  return (
    <div className="relative min-h-screen">
      <IntroSlide isActive={currentSlide === 0} />
      <RulesSlide isActive={currentSlide === 1} />
      
      {/* Question Slides */}
      {questions.map((question, index) => (
        <QuestionSlide
          key={index}
          isActive={currentSlide === index + 2}
          question={question}
          questionNumber={index + 1}
          totalQuestions={questions.length}
        />
      ))}
      
      {/* Scoreboard - Final Slide */}
      <ScoreboardSlide isActive={currentSlide === questions.length + 2} />
      
      <NavigationControls />
    </div>
  );
};

export default PresentationMain;
