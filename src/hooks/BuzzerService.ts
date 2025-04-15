/**
 * BuzzerService.ts
 * A service to handle buzzer communication between devices
 */

// Initialize service
export const initBuzzerService = () => {
  // Set up storage event listener for cross-window communication
  window.addEventListener('storage', handleStorageEvent);
  
  // Set initial game state
  updateGameState({
    activeTeam: null,
    hasQuestions: false,
    currentQuestion: 0,
    timestamp: Date.now()
  });
};

// Handle storage events from other windows
const handleStorageEvent = (event: StorageEvent) => {
  if (event.key === 'team_buzz') {
    try {
      const data = JSON.parse(event.newValue || '{}');
      // Dispatch event for local components
      const buzzEvent = new CustomEvent('teamBuzz', { detail: data });
      document.dispatchEvent(buzzEvent);
    } catch (e) {
      console.error('Error parsing buzz data:', e);
    }
  }
};

// Update game state in localStorage
export const updateGameState = (state: {
  activeTeam: number | null;
  hasQuestions: boolean;
  currentQuestion: number;
  timestamp: number;
}) => {
  localStorage.setItem('game_state', JSON.stringify(state));
};

// Team buzz function
export const teamBuzz = (teamId: number, gameCode: string) => {
  const data = {
    teamId,
    gameCode,
    timestamp: Date.now()
  };
  
  // Store in localStorage to trigger storage event in other windows
  localStorage.setItem('team_buzz', JSON.stringify(data));
  
  // Also dispatch local event
  const buzzEvent = new CustomEvent('teamBuzz', { detail: data });
  document.dispatchEvent(buzzEvent);
  
  return true;
};

// Check if a team is active
export const isTeamActive = (teamId: number): boolean => {
  try {
    const gameStateJSON = localStorage.getItem('game_state');
    if (gameStateJSON) {
      const gameState = JSON.parse(gameStateJSON);
      return gameState.activeTeam === teamId;
    }
  } catch (e) {
    console.error('Error checking team active status:', e);
  }
  return false;
};

// Check if there are available questions
export const hasAvailableQuestions = (): boolean => {
  try {
    const gameStateJSON = localStorage.getItem('game_state');
    if (gameStateJSON) {
      const gameState = JSON.parse(gameStateJSON);
      return gameState.hasQuestions;
    }
  } catch (e) {
    console.error('Error checking question availability:', e);
  }
  return false;
};