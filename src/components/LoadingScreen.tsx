import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Loading Image */}
            <motion.img
              src="/athenuraloadingscreen.jpeg"
              alt="Loading"
              className="max-w-md w-full h-auto"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Loading Spinner */}
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="h-3 w-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
