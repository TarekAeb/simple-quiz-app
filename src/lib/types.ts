export interface Team {
  name: string;
  score: number;
}

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export type GamePhase = 'setup' | 'phase1' | 'phase2' | 'results';

export interface GameState {
  phase: GamePhase;
  teams: Team[];
  currentTeam: number;
  currentQuestion: number;
  phase1Questions: Question[];
  phase2Questions: Question[];
  selectedAnswer: number;
  answerLocked: boolean;
  timer: number;
  activeTeamForPhase2: number | null;
  moderatorPassword: string; // Added the moderator password
}

export interface TeamCredential {
  teamName: string;
  password: string;
  teamId: number;
}