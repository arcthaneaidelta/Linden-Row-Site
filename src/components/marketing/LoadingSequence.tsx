import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

let hasCompletedInitialLoad = false;

export const LoadingSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(!hasCompletedInitialLoad);
  const [hairlineWidth, setHairlineWidth] = useState(0);

  useEffect(() => {
    if (hasCompletedInitialLoad) {
      setIsVisible(false);
      onComplete();
      return;
    }

    const t1 = setTimeout(() => {
      setHairlineWidth(140);
    }, 100);

    const t2 = setTimeout(() => {
      hasCompletedInitialLoad = true;
      setIsVisible(false);
      onComplete();
    }, 900);

    const handleSkip = () => {
      hasCompletedInitialLoad = true;
      setIsVisible(false);
      onComplete();
    };

    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] bg-[#F6F2EC] flex flex-col items-center justify-center cursor-pointer select-none"
      >
        <div className="flex flex-col items-center">
          <span className="font-serif text-3xl sm:text-4xl text-[#1E1B18] font-normal tracking-[0.04em] lowercase">
            linden row
          </span>

          {/* Hairline */}
          <div
            className="h-[1px] bg-[#C9C0B2] mt-3 relative overflow-hidden transition-all duration-700 ease-out"
            style={{ width: `${hairlineWidth}px` }}
          >
            <div className="absolute inset-0 bg-[#B5654A]" />
          </div>

          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#7C766D] mt-3">
            Autumn / Winter 2026
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
