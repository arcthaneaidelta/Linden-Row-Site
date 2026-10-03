import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  position?: 'right' | 'bottom';
  width?: string;
  headerAction?: React.ReactNode;
  theme?: 'light' | 'dark';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  width = 'max-w-md',
  headerAction,
  theme = 'light',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          {/* Backdrop Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-[1px]"
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            initial={position === 'right' ? { x: '100%' } : { y: '100%' }}
            animate={position === 'right' ? { x: 0 } : { y: 0 }}
            exit={position === 'right' ? { x: '100%' } : { y: '100%' }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full ${width} h-full shadow-lg flex flex-col z-10 ${
              isDark 
                ? 'bg-[#16191A] text-[#E6E2DA] border-l border-[#2C3234]' 
                : 'bg-surface text-ink border-l border-border'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${
              isDark ? 'border-[#2C3234] bg-[#1F2324]' : 'border-border bg-surface'
            }`}>
              <div className="flex items-center gap-3">
                <div>
                  {title && (
                    <h2 className={`font-serif text-lg font-normal ${isDark ? 'text-white' : 'text-ink'}`}>
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-[#9A958B]' : 'text-ink-muted'}`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {headerAction}
                <button
                  onClick={onClose}
                  className={`p-1.5 rounded-sm transition-colors ${
                    isDark 
                      ? 'text-[#9A958B] hover:text-white hover:bg-[#2C3234]' 
                      : 'text-ink-muted hover:text-ink hover:bg-secondary'
                  }`}
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
