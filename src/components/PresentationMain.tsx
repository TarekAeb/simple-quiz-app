
import React from 'react';
import { usePresentation } from '@/context/PresentationContext';
import IntroSlide from './IntroSlide';
import RulesSlide from './RulesSlide';
import QuestionSlide from './QuestionSlide';
import FactSlide from './FactSlide';
import ScoreboardSlide from './ScoreboardSlide';
import NavigationControls from './NavigationControls';

const PresentationMain: React.FC = () => {
  const { currentSlide, sections, facts } = usePresentation();
  
  // Calculate slide indices
  let currentIndex = 2; // Start after intro and rules
  let questionIndex = 0;
  let factIndex = 0;
  
  // Flatten questions from all sections
  const allQuestions = sections.flatMap(section => section.questions);
  
  return (
    <div className="relative min-h-screen">
      <IntroSlide isActive={currentSlide === 0} />
      <RulesSlide isActive={currentSlide === 1} />
      
      {/* Interleave questions and facts */}
      {allQuestions.map((question, index) => {
        const slides = [];
        
        // Add question slide
        slides.push(
          <QuestionSlide
            key={`question-${index}`}
            isActive={currentSlide === currentIndex}
            question={question}
            questionNumber={questionIndex + 1}
            totalQuestions={allQuestions.length}
          />
        );
        currentIndex++;
        questionIndex++;
        
        // Add fact slide after every third question
        if ((index + 1) % 3 === 0 && factIndex < facts.length) {
          slides.push(
            <FactSlide
              key={`fact-${factIndex}`}
              isActive={currentSlide === currentIndex}
              fact={facts[factIndex]}
            />
          );
          currentIndex++;
          factIndex++;
        }
        
        return slides;
      })}
      
      {/* Scoreboard - Final Slide */}
      <ScoreboardSlide isActive={currentSlide === currentIndex} />
      
      <NavigationControls />
    </div>
  );
};

export default PresentationMain;
