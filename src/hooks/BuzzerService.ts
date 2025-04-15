import Peer, { DataConnection } from 'peerjs';

// Types for our messaging system
type BuzzerMessage = {
  type: 'BUZZ' | 'GAME_STATE_UPDATE' | 'TEAM_CONNECTED';
  payload: any;
};

class BuzzerService {
  private static instance: BuzzerService;
  private peer: Peer | null = null;
  private hostConnection: DataConnection | null = null;
  private connections: Map<number, DataConnection> = new Map();
  private gameCode: string = '';
  private isHost: boolean = false;
  private teamId: number | null = null;
  private listeners: {[key: string]: Function[]} = {
    'buzz': [],
    'stateUpdate': [],
    'teamConnected': [],
    'connectionError': []
  };

  // Singleton pattern
  public static getInstance(): BuzzerService {
    if (!BuzzerService.instance) {
      BuzzerService.instance = new BuzzerService();
    }
    return BuzzerService.instance;
  }

  // Initialize as host (quiz master)
  public initHost(gameCode: string): Promise<void> {
    this.gameCode = gameCode;
    this.isHost = true;
    
    return new Promise<void>((resolve, reject) => {
      try {
        // Create peer with ID based on game code
        this.peer = new Peer(`quiz-host-${gameCode}`);
        
        this.peer.on('open', () => {
          console.log('Host peer opened with ID:', this.peer?.id);
          this.setupHostListeners();
          resolve();
        });
        
        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          this.notifyListeners('connectionError', err);
          reject(err);
        });
      } catch (error) {
        console.error('Failed to initialize host:', error);
        reject(error);
      }
    });
  }

  // Initialize as client (team)
  public initClient(gameCode: string, teamId: number): Promise<void> {
    this.gameCode = gameCode;
    this.isHost = false;
    this.teamId = teamId;
    
    return new Promise<void>((resolve, reject) => {
      try {
        // Generate a unique ID for this client
        const clientId = `quiz-client-${gameCode}-team-${teamId}-${Date.now()}`;
        this.peer = new Peer(clientId);
        
        this.peer.on('open', () => {
          console.log('Client peer opened with ID:', this.peer?.id);
          
          // Connect to host
          const conn = this.peer?.connect(`quiz-host-${gameCode}`);
          
          if (conn) {
            this.hostConnection = conn;
            
            conn.on('open', () => {
              console.log('Connected to host!');
              
              // Send team info to host
              this.sendToHost({
                type: 'TEAM_CONNECTED',
                payload: { teamId, timestamp: Date.now() }
              });
              
              this.setupClientListeners();
              resolve();
            });
            
            conn.on('error', (err) => {
              console.error('Connection error:', err);
              this.notifyListeners('connectionError', err);
              reject(err);
            });
          } else {
            reject(new Error('Could not establish connection to host'));
          }
        });
        
        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          this.notifyListeners('connectionError', err);
          reject(err);
        });
      } catch (error) {
        console.error('Failed to initialize client:', error);
        reject(error);
      }
    });
  }

  // Setup host event listeners
  private setupHostListeners(): void {
    if (!this.peer || !this.isHost) return;
    
    this.peer.on('connection', (conn) => {
      console.log('New connection from:', conn.peer);
      
      conn.on('data', (data: BuzzerMessage) => {
        console.log('Received data:', data);
        
        switch (data.type) {
          case 'BUZZ':
            const { teamId, timestamp } = data.payload;
            this.notifyListeners('buzz', { teamId, timestamp });
            break;
            
          case 'TEAM_CONNECTED':
            const teamInfo = data.payload;
            this.connections.set(teamInfo.teamId, conn);
            this.notifyListeners('teamConnected', teamInfo);
            break;
        }
      });
      
      conn.on('close', () => {
        console.log('Connection closed:', conn.peer);
        // Remove connection from map
        this.connections.forEach((connection, key) => {
          if (connection === conn) {
            this.connections.delete(key);
          }
        });
      });
    });
  }

  // Setup client event listeners
  private setupClientListeners(): void {
    if (!this.hostConnection || this.isHost) return;
    
    this.hostConnection.on('data', (data: BuzzerMessage) => {
      console.log('Received data from host:', data);
      
      if (data.type === 'GAME_STATE_UPDATE') {
        this.notifyListeners('stateUpdate', data.payload);
      }
    });
    
    this.hostConnection.on('close', () => {
      console.log('Connection to host closed');
      this.notifyListeners('connectionError', new Error('Connection to host closed'));
    });
  }

  // Send buzz event to host
  public sendBuzz(): boolean {
    if (!this.hostConnection || this.isHost) return false;
    
    try {
      this.hostConnection.send({
        type: 'BUZZ',
        payload: {
          teamId: this.teamId,
          timestamp: Date.now()
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to send buzz:', error);
      return false;
    }
  }

  // Send to specific team from host
  public sendToTeam(teamId: number, data: BuzzerMessage): boolean {
    if (!this.isHost) return false;
    
    const conn = this.connections.get(teamId);
    if (!conn) return false;
    
    try {
      conn.send(data);
      return true;
    } catch (error) {
      console.error(`Failed to send to team ${teamId}:`, error);
      return false;
    }
  }

  // Broadcast game state to all connected teams
  public broadcastGameState(gameState: any): void {
    if (!this.isHost) return;
    
    const message: BuzzerMessage = {
      type: 'GAME_STATE_UPDATE',
      payload: {
        activeTeam: gameState.activeTeamForPhase2,
        hasQuestions: gameState.hasQuestions,
        currentQuestion: gameState.currentQuestion,
        timestamp: Date.now()
      }
    };
    
    this.connections.forEach((conn) => {
      try {
        conn.send(message);
      } catch (error) {
        console.error('Failed to broadcast game state:', error);
      }
    });
  }

  // Send message to host
  private sendToHost(message: BuzzerMessage): void {
    if (this.isHost || !this.hostConnection) return;
    
    try {
      this.hostConnection.send(message);
    } catch (error) {
      console.error('Failed to send to host:', error);
    }
  }

  // Event listener management
  public on(event: 'buzz' | 'stateUpdate' | 'teamConnected' | 'connectionError', callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove event listener
  public off(event: 'buzz' | 'stateUpdate' | 'teamConnected' | 'connectionError', callback: Function): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  // Notify listeners of an event
  private notifyListeners(event: string, data: any): void {
    if (!this.listeners[event]) return;
    
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  // Close all connections
  public disconnect(): void {
    this.connections.forEach(conn => {
      conn.close();
    });
    
    if (this.hostConnection) {
      this.hostConnection.close();
    }
    
    if (this.peer) {
      this.peer.destroy();
    }
    
    this.connections.clear();
    this.hostConnection = null;
    this.peer = null;
  }

  // Get connected team IDs
  public getConnectedTeams(): number[] {
    return Array.from(this.connections.keys());
  }
}

export default BuzzerService;