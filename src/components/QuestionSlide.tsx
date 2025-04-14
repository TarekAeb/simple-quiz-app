import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { QuizQuestion, usePresentation } from '@/context/PresentationContext';
import FirstAnswerDetector from './FirstAnswerDetector';

type QuestionSlideProps = {
  isActive: boolean;
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
};

const QuestionSlide: React.FC<QuestionSlideProps> = ({ 
  isActive, 
  question, 
  questionNumber, 
  totalQuestions 
}) => {
  const { sections } = usePresentation();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const currentSection = sections.find(s => 
    s.name.toLowerCase().includes(question.section)
  );
  
  const handleSelectAnswer = (answer: string) => {
    if (!showAnswer) {
      setSelectedAnswer(answer);
    }
  };
  
  const revealAnswer = () => {
    setShowAnswer(true);
  };
  
  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;
  
  React.useEffect(() => {
    if (!isActive) {
      resetQuestion();
    }
  }, [isActive]);
  
  const { 
    currentRound,
    activeTeam,
    switchActiveTeam,
    firstAnswerTeam,
    setFirstAnswerTeam
  } = usePresentation();

  const handleTimeUp = () => {
    if (currentRound === 2 && !firstAnswerTeam) {
      setFirstAnswerTeam(null);
    }
  };

  React.useEffect(() => {
    if (!isActive) {
      setFirstAnswerTeam(null);
    }
  }, [isActive, setFirstAnswerTeam]);

  return (
    <div 
      className={`fullscreen-slide algeria-pattern ${
        isActive ? 'animate-fade-in' : 'hidden'
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        {/* Active Team Indicator */}
        {currentRound === 1 && (
          <div className="mb-4 text-center">
            <h3 className={`text-xl font-bold ${
              activeTeam === 1 ? 'text-algeria-green' : 'text-algeria-red'
            }`}>
              {activeTeam === 1 ? 'Team 1' : 'Team 2'}'s Turn
            </h3>
          </div>
        )}

        {/* First Answer Detector */}
        {isActive && (
          <FirstAnswerDetector
            onTimeUp={handleTimeUp}
            timeLimit={currentRound === 2 ? 5 : 30}
          />
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-algeria-green">
            Question {questionNumber} of {totalQuestions}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-algeria-green" />
              <span className="font-bold text-algeria-green">
                {currentSection?.points || 1} points
              </span>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={revealAnswer} 
                variant="outline" 
                className="border-2 border-algeria-green text-algeria-green hover:bg-algeria-green hover:text-white transition-all duration-300 transform hover:scale-105"
                disabled={selectedAnswer === null || showAnswer}
              >
                Reveal Answer
              </Button>
              
              <Button 
                onClick={resetQuestion} 
                variant="outline" 
                className="border-2 border-algeria-red text-algeria-red hover:bg-algeria-red hover:text-white transition-all duration-300 transform hover:scale-105"
                disabled={!showAnswer && selectedAnswer === null}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
        
        <Card className="p-6 border-2 border-algeria-green shadow-lg mb-8 transform transition-all duration-500 hover:shadow-2xl">
          <h3 className="text-3xl font-bold mb-6 text-center text-algeria-green">
            {question.question}
          </h3>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {question.options.map((option, index) => (
            <Card 
              key={index}
              className={`p-6 border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedAnswer === option
                  ? showAnswer
                    ? option === question.correctAnswer
                      ? 'border-green-500 bg-green-100'
                      : 'border-red-500 bg-red-100'
                    : 'border-algeria-green bg-algeria-green bg-opacity-10'
                  : showAnswer && option === question.correctAnswer
                  ? 'border-green-500 bg-green-100'
                  : 'border-algeria-green hover:border-algeria-green hover:bg-algeria-green hover:bg-opacity-5'
              }`}
              onClick={() => handleSelectAnswer(option)}
            >
              <div className="flex items-center justify-between">
                <p className="text-xl font-medium">
                  {String.fromCharCode(65 + index)}. {option}
                </p>
                
                {showAnswer && option === question.correctAnswer && (
                  <CheckCircle className="w-6 h-6 text-green-500 animate-bounce" />
                )}
                
                {showAnswer && selectedAnswer === option && option !== question.correctAnswer && (
                  <XCircle className="w-6 h-6 text-red-500 animate-shake" />
                )}
              </div>
            </Card>
          ))}
        </div>
        
        {showAnswer && (
          <div className={`text-center p-4 rounded-lg transform transition-all duration-500 animate-fade-in ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="text-xl font-bold">
              {isCorrect ? (
                <span className="text-green-600">
                  Correct answer! Award {currentSection?.points || 1} point(s) to the team.
                </span>
              ) : (
                <span className="text-red-600">
                  Incorrect. The correct answer is: {question.correctAnswer}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionSlide;
