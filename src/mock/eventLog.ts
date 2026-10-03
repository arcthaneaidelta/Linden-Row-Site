export interface LogEntry {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WEBHOOK' | 'EVENT';
  path: string;
  statusCode: number;
  statusText?: string;
  latencyMs: number;
  origin: 'browser' | 'vercel-server' | 'bigcommerce' | 'stripe' | 'webhook';
  summary: string;
  requestHeaders?: Record<string, string>;
  requestPayload?: any;
  responsePayload?: any;
  idempotencyKey?: string;
}

let eventLogs: LogEntry[] = [];
const logListeners = new Set<(logs: LogEntry[]) => void>();

export function getEventLogs(): LogEntry[] {
  return [...eventLogs];
}

export function appendLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): LogEntry {
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  
  const newEntry: LogEntry = {
    ...entry,
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: timeString,
  };

  eventLogs.push(newEntry);
  if (eventLogs.length > 200) {
    eventLogs.shift();
  }

  logListeners.forEach((listener) => listener([...eventLogs]));
  return newEntry;
}

export function clearEventLogs() {
  eventLogs = [];
  logListeners.forEach((listener) => listener([]));
}

export function subscribeEventLogs(listener: (logs: LogEntry[]) => void): () => void {
  listeners_add: logListeners.add(listener);
  return () => logListeners.delete(listener);
}
