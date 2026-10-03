import React, { useEffect, useState, useRef } from 'react';
import { getEventLogs, subscribeEventLogs, clearEventLogs, LogEntry } from '../../mock/eventLog';
import { LogRow } from './LogRow';
import { Trash2, ArrowDown, Activity } from 'lucide-react';

export const LiveLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>(getEventLogs());
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeEventLogs((newLogs) => {
      setLogs(newLogs);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 40;
    setAutoScroll(atBottom);
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setAutoScroll(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#16191A]">
      {/* Subheader Toolbar */}
      <div className="px-4 py-2 bg-[#1A1D1E] border-b border-[#2C3234] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-[#9A958B]">
          <Activity className="w-3.5 h-3.5 text-hood-success animate-pulse" />
          <span>Live Middleware Stream ({logs.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {!autoScroll && (
            <button
              onClick={scrollToBottom}
              className="flex items-center gap-1 px-2 py-0.5 bg-hood-accent/20 text-hood-accent rounded-xs text-[11px] hover:bg-hood-accent/30 transition-colors"
            >
              <ArrowDown className="w-3 h-3" />
              <span>Latest</span>
            </button>
          )}

          <button
            onClick={() => clearEventLogs()}
            className="flex items-center gap-1 text-[#9A958B] hover:text-white p-1 rounded-xs transition-colors"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logs container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[#2C3234]"
      >
        {logs.length === 0 ? (
          <div className="p-8 text-center text-[#9A958B] font-mono text-xs">
            <p>No middleware events captured yet.</p>
            <p className="text-[11px] text-[#9A958B]/60 mt-1">
              Events stream automatically as you interact with the cart and checkout.
            </p>
          </div>
        ) : (
          logs.map((entry) => <LogRow key={entry.id} entry={entry} />)
        )}
      </div>

      {/* Simulation note footer */}
      <div className="p-3 bg-[#131516] border-t border-[#2C3234] text-[11px] font-mono text-[#9A958B] text-center">
        Simulation active. Production calls execute server-side on Vercel Functions.
      </div>
    </div>
  );
};
