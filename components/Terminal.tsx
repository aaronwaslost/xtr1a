import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal as TerminalIcon, Trash2 } from 'lucide-react';

interface TerminalProps {
  logs: LogEntry[];
  onClear: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-black border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-green-500" />
          <span className="text-xs font-mono font-bold text-gray-400">CONSOLE OUT</span>
        </div>
        <button 
          onClick={onClear}
          className="text-gray-500 hover:text-red-400 transition-colors"
          title="Clear Console"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm space-y-1">
        {logs.length === 0 && (
            <div className="text-gray-600 italic">Waiting for process...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="break-all">
            <span className="text-gray-600 mr-2">[{log.timestamp}]</span>
            <span className={
              log.type === 'error' ? 'text-red-500 font-bold' :
              log.type === 'success' ? 'text-green-400 font-bold' :
              log.type === 'warning' ? 'text-yellow-400' :
              'text-blue-300'
            }>
              {log.type === 'info' && '> '}
              {log.type === 'success' && '✓ '}
              {log.type === 'error' && '✕ '}
              {log.type === 'warning' && '! '}
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};