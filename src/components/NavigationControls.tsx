
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePresentation } from '@/context/PresentationContext';

const NavigationControls: React.FC = () => {
  const { 
    currentSlide, 
    totalSlides, 
    handleNext, 
    handlePrev, 
    handleGoToSlide 
  } = usePresentation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);
  
  return (
    <>
      {/* Previous/Next Buttons */}
      <div className="fixed bottom-8 right-8 flex gap-2 z-40">
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="rounded-full shadow-lg bg-white text-algeria-green border-2 border-algeria-green hover:bg-algeria-green hover:text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className="rounded-full shadow-lg bg-white text-algeria-green border-2 border-algeria-green hover:bg-algeria-green hover:text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Navigation Dots */}
      <div className="navigation-dots">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`${currentSlide === index ? 'active' : ''}`}
            onClick={() => handleGoToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Current Slide Indicator */}
      <div className="fixed bottom-8 left-8 z-40 bg-white px-3 py-1 rounded-full shadow-lg border border-algeria-green">
        <span className="text-sm font-medium text-algeria-green">
          {currentSlide + 1} / {totalSlides}
        </span>
      </div>
    </>
  );
};

export default NavigationControls;
