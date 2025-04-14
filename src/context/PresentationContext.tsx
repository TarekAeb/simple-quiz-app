
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Team = {
  name: string;
  score: number;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type PresentationContextType = {
  currentSlide: number;
  totalSlides: number;
  isAuthenticated: boolean;
  team1: Team;
  team2: Team;
  questions: QuizQuestion[];
  handleNext: () => void;
  handlePrev: () => void;
  handleGoToSlide: (slideIndex: number) => void;
  authenticate: (password: string) => boolean;
  incrementScore: (teamNumber: 1 | 2) => void;
  decrementScore: (teamNumber: 1 | 2) => void;
  resetScores: () => void;
};

const defaultQuestions: QuizQuestion[] = [
  {
    question: "In what year was Abdelhamid Ben Badis born?",
    options: ["1889", "1895", "1900", "1905"],
    correctAnswer: "1889"
  },
  {
    question: "Which organization did Ibn Badis found in 1931?",
    options: [
      "Association of Algerian Muslim Ulama",
      "Islamic Renaissance Movement",
      "Algerian National Liberation Front",
      "Algerian Islamic Society"
    ],
    correctAnswer: "Association of Algerian Muslim Ulama"
  },
  {
    question: "What famous slogan is associated with Ibn Badis's nationalist movement?",
    options: [
      "Islam is our religion, Arabic is our language, Algeria is our country",
      "Freedom, Equality, Fraternity",
      "One Nation, One Voice",
      "Education is the path to liberation"
    ],
    correctAnswer: "Islam is our religion, Arabic is our language, Algeria is our country"
  },
  {
    question: "What newspaper did Ibn Badis establish in 1925?",
    options: [
      "Al-Muntaqid",
      "Al-Ahram",
      "Al-Jazeera",
      "Al-Bashir"
    ],
    correctAnswer: "Al-Muntaqid"
  },
  {
    question: "In what year did Ibn Badis pass away?",
    options: ["1930", "1940", "1950", "1960"],
    correctAnswer: "1940"
  },
  {
    question: "What was the primary goal of Ibn Badis's educational reforms?",
    options: [
      "To promote Algerian identity and resist French cultural assimilation",
      "To integrate Algerian education with the French system",
      "To focus exclusively on religious education",
      "To promote Western secularism"
    ],
    correctAnswer: "To promote Algerian identity and resist French cultural assimilation"
  },
  {
    question: "What important date does the April 16 'Knowledge Day' commemorate?",
    options: [
      "The death of Ibn Badis",
      "The birth of Ibn Badis",
      "The founding of the Association of Algerian Muslim Ulama",
      "The Algerian independence day"
    ],
    correctAnswer: "The death of Ibn Badis"
  },
  {
    question: "Which city in Algeria was Ibn Badis born in?",
    options: ["Constantine", "Algiers", "Oran", "Annaba"],
    correctAnswer: "Constantine"
  }
];

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

// The actual password to use - in a real app, this should be hashed and stored securely
const ADMIN_PASSWORD = "april16";

export const PresentationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [team1, setTeam1] = useState<Team>({ name: "Team 1", score: 0 });
  const [team2, setTeam2] = useState<Team>({ name: "Team 2", score: 0 });
  const [questions] = useState<QuizQuestion[]>(defaultQuestions);

  // Total number of slides: intro, rules, questions (n), results
  const totalSlides = 3 + questions.length;

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleGoToSlide = (slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
      setCurrentSlide(slideIndex);
    }
  };

  const authenticate = (password: string): boolean => {
    const isValid = password === ADMIN_PASSWORD;
    setIsAuthenticated(isValid);
    return isValid;
  };

  const incrementScore = (teamNumber: 1 | 2) => {
    if (teamNumber === 1) {
      setTeam1({ ...team1, score: team1.score + 1 });
    } else {
      setTeam2({ ...team2, score: team2.score + 1 });
    }
  };

  const decrementScore = (teamNumber: 1 | 2) => {
    if (teamNumber === 1 && team1.score > 0) {
      setTeam1({ ...team1, score: team1.score - 1 });
    } else if (teamNumber === 2 && team2.score > 0) {
      setTeam2({ ...team2, score: team2.score - 1 });
    }
  };

  const resetScores = () => {
    setTeam1({ ...team1, score: 0 });
    setTeam2({ ...team2, score: 0 });
  };

  return (
    <PresentationContext.Provider
      value={{
        currentSlide,
        totalSlides,
        isAuthenticated,
        team1,
        team2,
        questions,
        handleNext,
        handlePrev,
        handleGoToSlide,
        authenticate,
        incrementScore,
        decrementScore,
        resetScores,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
};

export const usePresentation = (): PresentationContextType => {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};
