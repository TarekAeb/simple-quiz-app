import { motion } from 'framer-motion';

interface TimerProps {
  seconds: number;
  isWarning: boolean;
  isDanger: boolean;
}

const Timer: React.FC<TimerProps> = ({ seconds, isWarning, isDanger }) => {
  return (
    <motion.div
      className={`
        w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-white
        ${isDanger ? 'bg-error' : isWarning ? 'bg-secondary' : 'bg-primary'}
      `}
      animate={
        isDanger 
          ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.5 } }
          : isWarning 
            ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1 } }
            : {}
      }
    >
      {seconds}
    </motion.div>
  );
};

export default Timer;