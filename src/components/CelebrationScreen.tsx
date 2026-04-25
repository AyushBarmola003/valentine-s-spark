import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface CelebrationScreenProps {
  gifUrl?: string;
  audioUrl?: string;
}

const CelebrationScreen = ({ gifUrl, audioUrl }: CelebrationScreenProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked, that's okay
      });
    }
  }, [audioUrl]);

  const hearts = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    size: 20 + Math.random() * 30,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen gradient-celebration relative overflow-hidden px-4"
    >
      {/* Rising hearts animation */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-primary"
          style={{
            left: `${heart.left}%`,
            bottom: -50,
            fontSize: heart.size,
          }}
          animate={{
            y: -window.innerHeight - 100,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: heart.delay,
            ease: "easeOut",
          }}
        >
          {["💕", "💖", "💗", "💘", "❤️"][heart.id % 5]}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center z-10"
      >
        {gifUrl && (
          <motion.img
            src={gifUrl}
            alt="Celebration"
            className="w-64 h-64 md:w-80 md:h-80 mx-auto mb-8 rounded-3xl shadow-float object-cover"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <motion.h1
          className="text-4xl md:text-6xl font-bold text-foreground mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Yay! 🎉
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          You made me the happiest person! 💖
        </motion.p>

        <motion.div
          className="text-6xl md:text-8xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          💕
        </motion.div>

        <motion.p
          className="text-lg text-primary mt-8 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Happy Valentine's Day, my love! 💝
        </motion.p>
      </motion.div>

      {audioUrl && <audio ref={audioRef} src={audioUrl} />}
    </motion.div>
  );
};

export default CelebrationScreen;
