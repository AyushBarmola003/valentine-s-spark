import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface ValentineButtonsProps {
  onYesClick: () => void;
}

const ValentineButtons = ({ onYesClick }: ValentineButtonsProps) => {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);

  const moveNoButton = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const buttonWidth = rect.width;
    const buttonHeight = rect.height;
    
    // Define safe margins from edges
    const margin = 20;
    const minX = margin;
    const maxX = window.innerWidth - buttonWidth - margin;
    const minY = margin;
    const maxY = window.innerHeight - buttonHeight - margin;
    
    // Calculate new absolute position within bounds
    const newAbsoluteX = Math.random() * (maxX - minX) + minX;
    const newAbsoluteY = Math.random() * (maxY - minY) + minY;
    
    // Convert to relative offset from current position
    const newX = newAbsoluteX - rect.left + noPosition.x;
    const newY = newAbsoluteY - rect.top + noPosition.y;
    
    setNoPosition({ x: newX, y: newY });
    setNoAttempts(prev => prev + 1);
  }, [noPosition.x, noPosition.y]);

  // Yes button grows with each "No" attempt
  const yesScale = 1 + noAttempts * 0.1;
  const noScale = Math.max(0.6, 1 - noAttempts * 0.05);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 relative">
      <motion.button
        onClick={onYesClick}
        className="gradient-button-yes text-primary-foreground font-bold rounded-full shadow-button hover:shadow-float transition-shadow duration-300 z-10"
        style={{
          padding: `${16 + noAttempts * 2}px ${48 + noAttempts * 4}px`,
          fontSize: `${18 + noAttempts}px`,
        }}
        animate={{ scale: yesScale }}
        whileHover={{ scale: yesScale * 1.05 }}
        whileTap={{ scale: yesScale * 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        Yes! 💖
      </motion.button>

      <motion.button
        className="gradient-button-no text-secondary-foreground font-semibold rounded-full shadow-soft hover:shadow-button transition-shadow duration-300"
        style={{
          padding: `${12 * noScale}px ${32 * noScale}px`,
          fontSize: `${14 * noScale}px`,
        }}
        animate={{ 
          x: noPosition.x, 
          y: noPosition.y,
          scale: noScale,
        }}
        onMouseEnter={moveNoButton}
        onTouchStart={moveNoButton}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        No 😢
      </motion.button>
    </div>
  );
};

export default ValentineButtons;
