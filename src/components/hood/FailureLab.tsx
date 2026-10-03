import React, { useState, useEffect } from 'react';
import {
  getFailureState,
  setFailureState,
  armFailureScenario,
  resetFailureState,
  subscribeFailureState,
  FailureScenario,
} from '../../mock/failures';
import { mockStore } from '../../mock/store';
import { clearEventLogs } from '../../mock/eventLog';
import { useCartStore } from '../../state/cartStore';
import { useCheckoutStore } from '../../state/checkoutStore';
import { useToast } from '../ui/Toast';
import {
  AlertOctagon,
  ShieldAlert,
  Flame,
  CopyX,
  Lock,
  WifiOff,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const FailureLab: React.FC = () => {
  const [failureState, setLocalState] = useState(getFailureState());
  const { toast } = useToast();
  const clearCart = useCartStore((s) => s.clearCart);
  const resetCheckout = useCheckoutStore((s) => s.resetCheckout);

  useEffect(() => {
    return subscribeFailureState((state) => {
      setLocalState(state);
    });
  }, []);

  const tests: {
    id: FailureScenario;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'tamper_price',
      title: 'Tamper Browser Price',
      description: 'Injects £1.00 into client request payload; server rejects and enforces real BigCommerce total.',
      icon: <Lock className="w-4 h-4 text-hood-accent" />,
    },
    {
      id: 'double_click',
      title: 'Double-Submit Payment',
      description: 'Fires rapid duplicate payment calls with the same Idempotency-Key; only 1 order created.',
      icon: <CopyX className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'sell_out',
      title: 'Sell Out Mid-Checkout',
      description: 'Simulates another shopper buying the remaining unit right before card charge.',
      icon: <Flame className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'declined_card',
      title: 'Declined Card (0002)',
      description: 'Forces Stripe to return generic_decline; verifies form data and cart remain intact.',
      icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
    },
    {
      id: '3ds_fail',
      title: '3DS SCA Auth Failure',
      description: 'Simulates cardholder failing bank security challenge; transaction aborted cleanly.',
      icon: <ShieldAlert className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'network_timeout',
      title: 'Gateway Network Timeout',
      description: 'Simulates 504 Gateway Timeout on Stripe call with safe retry handling.',
      icon: <WifiOff className="w-4 h-4 text-rose-300" />,
    },
  ];

  const handleArm = (id: FailureScenario) => {
    armFailureScenario(id);
    const newState = getFailureState();
    if (newState.armedScenario === id) {
      toast(`Armed scenario: ${id.replace('_', ' ').toUpperCase()}`, 'info');
    } else {
      toast('Scenario disarmed (Normal operation restored)', 'info');
    }
  };

  const handleResetAll = () => {
    resetFailureState();
    mockStore.resetAll();
    clearEventLogs();
    clearCart();
    resetCheckout();
    toast('System reset: Stock restored, carts cleared, logs reset.', 'success');
  };

  return (
    <div className="flex flex-col h-full bg-[#16191A] p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
      {/* Overview Intro */}
      <div className="mb-4 pb-3 border-b border-[#2C3234]">
        <div className="flex items-center gap-2 text-[#E6E2DA] font-semibold text-sm">
          <AlertOctagon className="w-4 h-4 text-hood-warning" />
          <span>Failure & Chaos Testing Lab</span>
        </div>
        <p className="text-[11px] text-[#9A958B] mt-1 leading-relaxed">
          Prove edge-case resilience directly to the client. Arm a failure scenario below, then perform checkout in the UI.
        </p>
      </div>

      {/* Latency Toggle */}
      <div className="mb-4 p-3 bg-[#1F2324] rounded-xs border border-[#2C3234] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-hood-accent" />
          <div>
            <span className="text-[#E6E2DA] font-medium block">Fast Latency Mode</span>
            <span className="text-[10px] text-[#9A958B] block">Reduces simulated network delay to 150-300ms</span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={failureState.fastLatency}
          onChange={(e) => setFailureState({ fastLatency: e.target.checked })}
          className="w-4 h-4 accent-hood-accent rounded-xs cursor-pointer"
        />
      </div>

      {/* Test Scenarios Grid */}
      <div className="space-y-2.5 flex-1">
        <span className="text-[10px] uppercase text-[#9A958B] font-semibold tracking-wider">
          Available Failure Scenarios
        </span>

        {tests.map((t) => {
          const isArmed = failureState.armedScenario === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleArm(t.id)}
              className={`p-3 rounded-xs border cursor-pointer transition-all ${
                isArmed
                  ? 'bg-hood-accent/15 border-hood-accent text-white shadow-sm'
                  : 'bg-[#1F2324] border-[#2C3234] text-[#E6E2DA] hover:border-[#3E4648] hover:bg-[#252A2C]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {t.icon}
                  <span className="font-semibold text-xs">{t.title}</span>
                </div>

                <span
                  className={`text-[10px] uppercase px-1.5 py-0.2 rounded-xs font-semibold ${
                    isArmed
                      ? 'bg-hood-accent text-hood-bg animate-pulse'
                      : 'bg-[#2C3234] text-[#9A958B]'
                  }`}
                >
                  {isArmed ? 'ARMED' : 'ARM TEST'}
                </span>
              </div>

              <p className="text-[11px] text-[#9A958B] mt-1.5 leading-tight">{t.description}</p>
            </div>
          );
        })}
      </div>

      {/* Global Reset */}
      <div className="mt-6 pt-4 border-t border-[#2C3234]">
        <button
          onClick={handleResetAll}
          className="w-full py-2.5 px-3 bg-[#2C3234] hover:bg-[#384042] text-white rounded-xs flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-hood-accent" />
          <span>Reset All State & Stock</span>
        </button>
      </div>
    </div>
  );
};
