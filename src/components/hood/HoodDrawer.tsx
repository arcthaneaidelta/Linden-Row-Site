import React, { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { Tabs } from '../ui/Tabs';
import { LiveLog } from './LiveLog';
import { FailureLab } from './FailureLab';
import { SecurityTable } from './SecurityTable';
import { OrderRecordTab } from './OrderRecordTab';
import { subscribeEventLogs } from '../../mock/eventLog';
import { subscribeFailureState } from '../../mock/failures';
import { Code2, Terminal, AlertOctagon, ShieldCheck, FileText } from 'lucide-react';

export const HoodDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'failure' | 'order' | 'security'>('log');
  const [hasNewLogs, setHasNewLogs] = useState(false);
  const [isFailureArmed, setIsFailureArmed] = useState(false);

  useEffect(() => {
    const unsubLog = subscribeEventLogs(() => {
      if (!isOpen) {
        setHasNewLogs(true);
      }
    });

    const unsubFailure = subscribeFailureState((state) => {
      setIsFailureArmed(state.armedScenario !== 'none');
    });

    return () => {
      unsubLog();
      unsubFailure();
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewLogs(false);
  };

  const tabs = [
    { id: 'log', label: 'Live Log', icon: <Terminal /> },
    { id: 'failure', label: 'Failure Lab', icon: <AlertOctagon />, badge: isFailureArmed ? 'ARMED' : undefined },
    { id: 'order', label: 'Order Record', icon: <FileText /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck /> },
  ];

  return (
    <>
      {/* Persistent Floating Toggle Pill at Bottom-Left */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={handleOpen}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-mono text-xs font-medium shadow-md transition-all duration-fast hover:scale-105 active:scale-95 ${
            isFailureArmed
              ? 'bg-hood-accent text-hood-bg border border-white/20'
              : 'bg-[#16191A] text-[#E6E2DA] border border-[#2C3234] hover:border-hood-accent'
          }`}
          aria-label="Open Under the Hood middleware drawer"
        >
          <Code2 className="w-3.5 h-3.5 text-hood-accent" />
          <span>Under the hood</span>

          {/* Live notification dot */}
          {hasNewLogs && !isFailureArmed && (
            <span className="w-2 h-2 rounded-full bg-hood-success animate-pulse" />
          )}

          {isFailureArmed && (
            <span className="px-1.5 py-0.2 rounded-full bg-hood-bg text-hood-accent text-[10px] font-bold">
              ARMED
            </span>
          )}
        </button>
      </div>

      {/* Under The Hood Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Under the hood"
        subtitle="Live Vercel Serverless Middleware & BigCommerce Engine"
        theme="dark"
        width="max-w-lg"
      >
        <div className="flex flex-col h-full bg-[#16191A]">
          {/* Navigation Tabs */}
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            theme="dark"
          />

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'log' && <LiveLog />}
            {activeTab === 'failure' && <FailureLab />}
            {activeTab === 'order' && <OrderRecordTab />}
            {activeTab === 'security' && <SecurityTable />}
          </div>
        </div>
      </Drawer>
    </>
  );
};
