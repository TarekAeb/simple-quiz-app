import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
}

const Confetti: React.FC = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    // Create confetti pieces
    const colors = ['#6366f1', '#22c55e', '#fb923c', '#f43f5e', '#06b6d4'];
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < 100; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100, // percent
        y: -20, // start above the container
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5, // 5-15px
        rotation: Math.random() * 360,
        duration: Math.random() * 3 + 2, // 2-5s
        delay: Math.random() * 2 // 0-2s
      });
    }
    
    setConfetti(pieces);
    
    // Clean up confetti after animation
    const timeout = setTimeout(() => {
      setConfetti([]);
    }, 7000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {confetti.map((piece) => (
        <div 
          key={piece.id}
          className="confetti absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
          } as React.CSSProperties}
          data-fall-duration={`${piece.duration}s`}
          data-fall-delay={`${piece.delay}s`}
        />
      ))}
    </div>
  );
};

export default Confetti;