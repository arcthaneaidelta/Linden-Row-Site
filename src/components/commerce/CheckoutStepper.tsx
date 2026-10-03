import React from 'react';
import { Check } from 'lucide-react';

export interface CheckoutStepperProps {
  activeStep: 1 | 2 | 3;
  completedSteps: number[];
  onStepClick?: (step: 1 | 2 | 3) => void;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({
  activeStep,
  completedSteps,
  onStepClick,
}) => {
  const steps = [
    { number: 1 as const, label: 'Details' },
    { number: 2 as const, label: 'Delivery' },
    { number: 3 as const, label: 'Payment' },
  ];

  return (
    <nav aria-label="Checkout Progress" className="w-full py-4 border-b border-border mb-6">
      <ol className="flex items-center justify-between sm:justify-start sm:gap-8 max-w-xl">
        {steps.map((step, idx) => {
          const isComplete = completedSteps.includes(step.number);
          const isActive = activeStep === step.number;
          const isClickable = isComplete && onStepClick;

          return (
            <li key={step.number} className="flex items-center gap-2">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.number)}
                className={`flex items-center gap-2 text-xs uppercase tracking-[0.08em] font-medium transition-colors ${
                  isActive
                    ? 'text-ink font-semibold'
                    : isComplete
                    ? 'text-ink-2 hover:text-ink cursor-pointer'
                    : 'text-ink-muted/60 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono border transition-all ${
                    isComplete
                      ? 'bg-success text-white border-success'
                      : isActive
                      ? 'bg-primary text-surface border-primary'
                      : 'bg-surface text-ink-muted border-border'
                  }`}
                >
                  {isComplete ? <Check className="w-3 h-3 stroke-[2.5]" /> : step.number}
                </span>
                <span>{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <span className="hidden sm:inline-block w-8 h-[1px] bg-border mx-2" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
