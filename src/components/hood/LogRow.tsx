import React, { useState } from 'react';
import { LogEntry } from '../../mock/eventLog';
import { ChevronRight, Server, ShieldCheck, Zap, Globe, Webhook } from 'lucide-react';

export const LogRow: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const methodColors = {
    GET: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    POST: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
    PUT: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    DELETE: 'bg-rose-900/40 text-rose-300 border-rose-700/50',
    WEBHOOK: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
    EVENT: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50',
  };

  const originIcons = {
    'browser': <Globe className="w-3 h-3 text-[#9A958B]" />,
    'vercel-server': <Server className="w-3 h-3 text-hood-accent" />,
    'bigcommerce': <Server className="w-3 h-3 text-emerald-400" />,
    'stripe': <Zap className="w-3 h-3 text-[#635BFF]" />,
    'webhook': <Webhook className="w-3 h-3 text-purple-400" />,
  };

  const statusColor =
    entry.statusCode >= 200 && entry.statusCode < 300
      ? 'text-emerald-400'
      : entry.statusCode >= 400 && entry.statusCode < 500
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <div className="border-b border-[#2C3234] last:border-0 font-mono text-xs hover:bg-[#1F2324]/60 transition-colors">
      {/* Collapsed summary row */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <ChevronRight
            className={`w-3.5 h-3.5 text-[#9A958B] shrink-0 transition-transform duration-fast ${
              isExpanded ? 'rotate-90' : ''
            }`}
          />

          <span className="text-[#9A958B] text-[11px] shrink-0">{entry.timestamp}</span>

          <span
            className={`px-1.5 py-0.2 rounded-xs text-[10px] uppercase font-semibold border shrink-0 ${
              methodColors[entry.method] || 'bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}
          >
            {entry.method}
          </span>

          <span className="text-[#E6E2DA] truncate font-medium">{entry.path}</span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className={`font-semibold ${statusColor}`}>{entry.statusCode}</span>
          <span className="text-[#9A958B] text-[11px] hidden sm:inline">{entry.latencyMs}ms</span>
          <span className="flex items-center gap-1 text-[10px] uppercase text-[#9A958B] bg-[#2C3234]/60 px-1.5 py-0.5 rounded-xs border border-[#3A4244]">
            {originIcons[entry.origin]}
            <span className="hidden md:inline">{entry.origin}</span>
          </span>
        </div>
      </div>

      {/* Summary note */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 pb-2 text-[11px] text-[#9A958B] pl-10 -mt-1 cursor-pointer truncate"
      >
        {entry.summary}
      </div>

      {/* Expanded Request/Response inspection */}
      {isExpanded && (
        <div className="px-4 py-3 bg-[#131516] border-t border-[#2C3234] space-y-3">
          {entry.idempotencyKey && (
            <div className="p-2 bg-[#1F2324] rounded-xs border border-[#2C3234] flex items-center justify-between text-[11px]">
              <span className="text-hood-accent">Idempotency-Key:</span>
              <span className="text-[#E6E2DA] font-mono">{entry.idempotencyKey}</span>
            </div>
          )}

          {entry.requestPayload && (
            <div>
              <div className="text-[10px] uppercase text-[#9A958B] mb-1 font-semibold">Request Body</div>
              <pre className="p-2.5 bg-[#1A1D1E] rounded-xs border border-[#2C3234] text-[11px] text-[#E6E2DA] overflow-x-auto custom-scrollbar leading-tight">
                {JSON.stringify(entry.requestPayload, null, 2)}
              </pre>
            </div>
          )}

          {entry.responsePayload && (
            <div>
              <div className="text-[10px] uppercase text-[#9A958B] mb-1 font-semibold">Response Payload</div>
              <pre className="p-2.5 bg-[#1A1D1E] rounded-xs border border-[#2C3234] text-[11px] text-emerald-300 overflow-x-auto custom-scrollbar leading-tight">
                {JSON.stringify(entry.responsePayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
