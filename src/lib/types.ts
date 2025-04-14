export interface Team {
  name: string;
  score: number;
}

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export type GamePhase = 'login' | 'intro' | 'setup' | 'phase1' | 'phase2' | 'results';

export interface GameState {
  teams: [Team, Team];
  currentTeam: 0 | 1;
  currentQuestion: number;
  timer: number;
  phase1Questions: Question[];
  phase2Questions: Question[];
  selectedAnswer: number | null;
  answerLocked: boolean;
  gamePhase: GamePhase;
  introSlide: number;
  activeTeamForPhase2: number | null;
  isAuthenticated: boolean;
}