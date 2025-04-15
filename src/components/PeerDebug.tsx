import { useState, useEffect } from 'react';
import Peer from 'peerjs';

const PeerDebug: React.FC = () => {
  const [hostId, setHostId] = useState('');
  const [clientId, setClientId] = useState('');
  const [hostPeer, setHostPeer] = useState<Peer | null>(null);
  const [clientPeer, setClientPeer] = useState<Peer | null>(null);
  const [message, setMessage] = useState('');
  const [log, setLog] = useState<string[]>([]);
  
  // Function to add to log
  const addLog = (msg: string) => {
    setLog(prev => [...prev, `${new Date().toISOString()}: ${msg}`]);
  };
  
  // Initialize host
  const initHost = () => {
    const peer = new Peer(hostId, {debug: 3});
    setHostPeer(peer);
    
    peer.on('open', id => {
      addLog(`Host peer opened with ID: ${id}`);
      
      peer.on('connection', conn => {
        addLog(`Connection received from: ${conn.peer}`);
        
        conn.on('data', data => {
          addLog(`Host received: ${JSON.stringify(data)}`);
        });
        
        conn.on('open', () => {
          addLog(`Connection to ${conn.peer} opened`);
          // Send initial state
          conn.send({
            type: 'GAME_STATE_UPDATE',
            payload: {
              hasQuestions: true,
              activeTeam: null,
              currentQuestion: 0
            }
          });
        });
      });
    });
    
    peer.on('error', err => {
      addLog(`Host error: ${err.message}`);
    });
  };
  
  // Initialize client
  const initClient = () => {
    const peer = new Peer(clientId, {debug: 3});
    setClientPeer(peer);
    
    peer.on('open', id => {
      addLog(`Client peer opened with ID: ${id}`);
      
      const conn = peer.connect(hostId);
      
      conn.on('open', () => {
        addLog(`Connection to host opened`);
        // Send test message
        conn.send({
          type: 'TEST',
          payload: 'Hello from client'
        });
      });
      
      conn.on('data', data => {
        addLog(`Client received: ${JSON.stringify(data)}`);
      });
      
      conn.on('error', err => {
        addLog(`Connection error: ${err.message}`);
      });
    });
    
    peer.on('error', err => {
      addLog(`Client error: ${err.message}`);
    });
  };
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PeerJS Debug</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Host</h2>
          <input
            type="text"
            value={hostId}
            onChange={(e) => setHostId(e.target.value)}
            placeholder="Host ID"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={initHost}
          >
            Initialize Host
          </button>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Client</h2>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Client ID"
            className="w-full p-2 border rounded mb-2"
          />
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={initClient}
          >
            Initialize Client
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="font-bold mb-2">Log</h2>
        <div className="h-64 overflow-auto p-4 bg-gray-100 rounded font-mono text-sm">
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeerDebug;