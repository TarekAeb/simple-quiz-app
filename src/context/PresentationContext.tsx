
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Team = {
  name: string;
  scores: {
    history: number;
    computerScience: number;
    mathematics: number;
  };
};

export type QuizSection = {
  name: string;
  points: number;
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  section: 'history' | 'computerScience' | 'mathematics';
};

export type FactSlide = {
  title: string;
  content: string;
  imageUrl?: string;
};

type PresentationContextType = {
  currentSlide: number;
  totalSlides: number;
  isAuthenticated: boolean;
  team1: Team;
  team2: Team;
  sections: QuizSection[];
  facts: FactSlide[];
  handleNext: () => void;
  handlePrev: () => void;
  handleGoToSlide: (slideIndex: number) => void;
  authenticate: (password: string) => boolean;
  incrementScore: (teamNumber: 1 | 2, section: keyof Team['scores']) => void;
  decrementScore: (teamNumber: 1 | 2, section: keyof Team['scores']) => void;
  resetScores: () => void;
};

const historyQuestions: QuizQuestion[] = [
  {
    question: "In what year was Abdelhamid Ben Badis born?",
    options: ["1889", "1895", "1900", "1905"],
    correctAnswer: "1889",
    section: "history"
  },
  {
    question: "Which organization did Ibn Badis found in 1931?",
    options: [
      "Association of Algerian Muslim Ulama",
      "Islamic Renaissance Movement",
      "Algerian National Liberation Front",
      "Algerian Islamic Society"
    ],
    correctAnswer: "Association of Algerian Muslim Ulama",
    section: "history"
  },
  {
    question: "What famous slogan is associated with Ibn Badis's nationalist movement?",
    options: [
      "Islam is our religion, Arabic is our language, Algeria is our country",
      "Freedom, Equality, Fraternity",
      "One Nation, One Voice",
      "Education is the path to liberation"
    ],
    correctAnswer: "Islam is our religion, Arabic is our language, Algeria is our country",
    section: "history"
  },
  {
    question: "What newspaper did Ibn Badis establish in 1925?",
    options: [
      "Al-Muntaqid",
      "Al-Ahram",
      "Al-Jazeera",
      "Al-Bashir"
    ],
    correctAnswer: "Al-Muntaqid",
    section: "history"
  },
  {
    question: "In what year did Ibn Badis pass away?",
    options: ["1930", "1940", "1950", "1960"],
    correctAnswer: "1940",
    section: "history"
  },
  {
    question: "What was the primary goal of Ibn Badis's educational reforms?",
    options: [
      "To promote Algerian identity and resist French cultural assimilation",
      "To integrate Algerian education with the French system",
      "To focus exclusively on religious education",
      "To promote Western secularism"
    ],
    correctAnswer: "To promote Algerian identity and resist French cultural assimilation",
    section: "history"
  },
  {
    question: "What important date does the April 16 'Knowledge Day' commemorate?",
    options: [
      "The death of Ibn Badis",
      "The birth of Ibn Badis",
      "The founding of the Association of Algerian Muslim Ulama",
      "The Algerian independence day"
    ],
    correctAnswer: "The death of Ibn Badis",
    section: "history"
  },
  {
    question: "Which city in Algeria was Ibn Badis born in?",
    options: ["Constantine", "Algiers", "Oran", "Annaba"],
    correctAnswer: "Constantine",
    section: "history"
  }
];

const computerScienceQuestions: QuizQuestion[] = [
  {
    question: "Which data structure follows the LIFO principle?",
    options: ["Queue", "Stack", "List", "Tree"],
    correctAnswer: "Stack",
    section: "computerScience"
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: "O(log n)",
    section: "computerScience"
  },
  {
    question: "Which protocol is used for secure data transmission over the web?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctAnswer: "HTTPS",
    section: "computerScience"
  }
];

const mathematicsQuestions: QuizQuestion[] = [
  {
    question: "What is the value of lim(x→∞) (1 + 1/x)^x?",
    options: ["1", "2", "e", "π"],
    correctAnswer: "e",
    section: "mathematics"
  },
  {
    question: "Which of these is not a prime number?",
    options: ["17", "23", "27", "31"],
    correctAnswer: "27",
    section: "mathematics"
  },
  {
    question: "What is the derivative of ln(x)?",
    options: ["1/x", "x", "1", "ln(x)"],
    correctAnswer: "1/x",
    section: "mathematics"
  }
];

const quizSections: QuizSection[] = [
  {
    name: "Historical Knowledge",
    points: 1,
    questions: historyQuestions
  },
  {
    name: "Computer Science",
    points: 2,
    questions: computerScienceQuestions
  },
  {
    name: "Mathematics",
    points: 2,
    questions: mathematicsQuestions
  }
];

const interestingFacts: FactSlide[] = [
  {
    title: "Did you know?",
    content: "Ibn Badis established multiple schools that combined modern education with Islamic teachings, revolutionizing education in Algeria."
  },
  {
    title: "Computer Science Fact",
    content: "The first computer programmer was a woman named Ada Lovelace, who wrote the first algorithm for Charles Babbage's Analytical Engine in the 1840s."
  },
  {
    title: "Mathematics Fun Fact",
    content: "Zero was invented by ancient Indian mathematicians and was first recorded in 628 CE in a book by Brahmagupta."
  }
];

const ADMIN_PASSWORD = "april16";

// Create the context
const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export const PresentationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [team1, setTeam1] = useState<Team>({
    name: "Team 1",
    scores: { history: 0, computerScience: 0, mathematics: 0 }
  });
  const [team2, setTeam2] = useState<Team>({
    name: "Team 2",
    scores: { history: 0, computerScience: 0, mathematics: 0 }
  });
  
  const [sections] = useState<QuizSection[]>(quizSections);
  const [facts] = useState<FactSlide[]>(interestingFacts);

  const totalQuestions = sections.reduce((acc, section) => acc + section.questions.length, 0);
  const totalSlides = 2 + totalQuestions + facts.length + 1; // intro + rules + questions + facts + scoreboard

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

  const incrementScore = (teamNumber: 1 | 2, section: keyof Team['scores']) => {
    const pointValue = sections.find(s => s.name.toLowerCase().includes(section))?.points || 1;
    
    if (teamNumber === 1) {
      setTeam1({
        ...team1,
        scores: {
          ...team1.scores,
          [section]: team1.scores[section] + pointValue
        }
      });
    } else {
      setTeam2({
        ...team2,
        scores: {
          ...team2.scores,
          [section]: team2.scores[section] + pointValue
        }
      });
    }
  };

  const decrementScore = (teamNumber: 1 | 2, section: keyof Team['scores']) => {
    const pointValue = sections.find(s => s.name.toLowerCase().includes(section))?.points || 1;
    
    if (teamNumber === 1 && team1.scores[section] >= pointValue) {
      setTeam1({
        ...team1,
        scores: {
          ...team1.scores,
          [section]: team1.scores[section] - pointValue
        }
      });
    } else if (teamNumber === 2 && team2.scores[section] >= pointValue) {
      setTeam2({
        ...team2,
        scores: {
          ...team2.scores,
          [section]: team2.scores[section] - pointValue
        }
      });
    }
  };

  const resetScores = () => {
    setTeam1({
      ...team1,
      scores: { history: 0, computerScience: 0, mathematics: 0 }
    });
    setTeam2({
      ...team2,
      scores: { history: 0, computerScience: 0, mathematics: 0 }
    });
  };

  return (
    <PresentationContext.Provider
      value={{
        currentSlide,
        totalSlides,
        isAuthenticated,
        team1,
        team2,
        sections,
        facts,
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
