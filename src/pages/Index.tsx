import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import ValentineButtons from "@/components/ValentineButtons";
import CelebrationScreen from "@/components/CelebrationScreen";
import gif from "@/assets/gif.gif";
import yay from "@/assets/yay.mp3";
import heartbeat from "@/assets/heartbeat.mp3";

// Replace these with your own files!

const Index = () => {
  const [accepted, setAccepted] = useState(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const playedOnInteraction = useRef(false);

  useEffect(() => {
    const a = bgAudioRef.current;
    if (!a) return;

    if (!accepted) {
      a.loop = true;
      // Try to play immediately; some browsers may still block audible autoplay.
      a.play().catch(() => {
        // Autoplay may be blocked until user interaction
      });
    } else {
      a.pause();
      try {
        a.currentTime = 0;
      } catch {}
    }
  }, [accepted]);

  // Fallback: start audio on first user interaction if autoplay is blocked
  useEffect(() => {
    if (playedOnInteraction.current) return;
    const tryPlay = () => {
      const a = bgAudioRef.current;
      if (!a || playedOnInteraction.current || accepted) return;
      a.loop = true;
      a.play().catch(() => {});
      playedOnInteraction.current = true;
    };

    window.addEventListener("pointerdown", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });
    // Start on cursor movement as requested
    window.addEventListener("pointermove", tryPlay, { once: true });
    window.addEventListener("mousemove", tryPlay, { once: true });

    return () => {
      try { window.removeEventListener("pointerdown", tryPlay as any); } catch {}
      try { window.removeEventListener("touchstart", tryPlay as any); } catch {}
      try { window.removeEventListener("keydown", tryPlay as any); } catch {}
      try { window.removeEventListener("pointermove", tryPlay as any); } catch {}
      try { window.removeEventListener("mousemove", tryPlay as any); } catch {}
    };
  }, [accepted]);

  // Try muted autoplay on mount to bypass strict autoplay policies where possible
  useEffect(() => {
    const a = bgAudioRef.current;
    if (!a) return;
    if (accepted) return;
    try {
      a.preload = "auto";
      a.loop = true;
      a.muted = true;
      a.play()
        .then(() => {
          // Attempt to unmute shortly after; may still be blocked in some browsers
          setTimeout(() => {
            try {
              a.muted = false;
              a.volume = 1;
            } catch {}
          }, 50);
        })
        .catch(() => {
          // ignore
        });
    } catch {}
  }, []);

  if (accepted) {
    return (
      <CelebrationScreen 
        gifUrl={gif} 
        audioUrl={yay || undefined} 
      />
    );
  }

  return (
    <div className="min-h-screen gradient-romantic relative overflow-hidden">
      <FloatingHearts />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-float text-center max-w-lg w-full"
        >
          {/* Animated heart */}
          <motion.div
            className="text-6xl md:text-7xl mb-6"
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            💕
          </motion.div>

          {/* Question */}
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Will you be my Valentine?
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            I promise to make every day special 💝
          </motion.p>

          {/* Buttons */}
          <ValentineButtons onYesClick={() => {
            if (bgAudioRef.current) {
              bgAudioRef.current.pause();
              try { bgAudioRef.current.currentTime = 0; } catch {}
            }
            setAccepted(true);
          }} />
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-10 left-10 text-4xl opacity-50"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          💗
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-4xl opacity-50"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          💖
        </motion.div>
        <motion.div
          className="absolute top-1/4 right-20 text-3xl opacity-40"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-20 text-3xl opacity-40"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.div>
      </div>
      {/* Background audio that plays until the question is answered */}
      <audio
        ref={bgAudioRef}
        src={heartbeat}
        preload="auto"
        autoPlay
        loop
        playsInline
        onCanPlay={() => {
          try {
            bgAudioRef.current?.play().catch(() => {});
          } catch {}
        }}
      />
    </div>
  );
};

export default Index;
