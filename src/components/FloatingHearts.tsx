import { motion } from "framer-motion";

const FloatingHearts = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 16 + Math.random() * 24,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-primary opacity-30"
          style={{
            left: `${heart.left}%`,
            fontSize: heart.size,
            bottom: -50,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.sin(heart.id) * 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          💕
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
