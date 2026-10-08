import React, { useState, useEffect, useRef } from 'react';
import { GamepadEventLog } from '../types/gamepad';
import { nativeBridge } from '../utils/nativeBridge';
import { Terminal, Trash2, ShieldCheck, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface EventLoggerDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const EventLoggerDrawer: React.FC<EventLoggerDrawerProps> = ({
  isOpen,
  onToggle,
}) => {
  const [logs, setLogs] = useState<GamepadEventLog[]>(() => nativeBridge.logs);
  const isNative = nativeBridge.isNative();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = nativeBridge.addLogListener((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    });
    return unsubscribe;
  }, []);

  const handleClear = () => {
    nativeBridge.logs = [];
    setLogs([]);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[#161616] border-t border-[#2d2d2d] transition-all duration-200 ${
        isOpen ? 'h-64' : 'h-8'
      } flex flex-col font-mono text-xs`}
    >
      {/* Header bar */}
      <div
        onClick={onToggle}
        className="h-8 bg-[#1a1a1a] px-3 flex items-center justify-between cursor-pointer border-b border-[#252525] select-none text-gray-300 hover:bg-[#202020]"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold text-[11px] uppercase tracking-wider text-gray-200">
            Monitor de Eventos Android Bridge ({logs.length})
          </span>
          {isNative ? (
            <span className="text-[10px] bg-emerald-950 border border-emerald-700 text-emerald-400 px-1.5 py-0.2 rounded-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Android WebView Nativo
            </span>
          ) : (
            <span className="text-[10px] bg-sky-950 border border-sky-700 text-sky-400 px-1.5 py-0.2 rounded-sm flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Simulador Web
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-white p-1 hover:bg-[#252525] rounded-sm"
              title="Limpiar registros"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Log list */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1 bg-[#121212] select-text">
          {logs.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              Sin eventos todavía. Toca los botones o mueve los joysticks para ver las llamadas a <code className="text-gray-400">Android.sendKeyEvent(...)</code>
            </div>
          ) : (
            logs.map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }) + '.' + (log.timestamp % 1000).toString().padStart(3, '0');

              let badgeColor = 'bg-gray-800 text-gray-300';
              if (log.type === 'KEY_DOWN') badgeColor = 'bg-emerald-950 text-emerald-300 border border-emerald-700';
              if (log.type === 'KEY_UP') badgeColor = 'bg-gray-900 text-gray-400 border border-gray-700';
              if (log.type === 'AXIS_MOVE') badgeColor = 'bg-sky-950 text-sky-300 border border-sky-700';
              if (log.type === 'TRIGGER') badgeColor = 'bg-purple-950 text-purple-300 border border-purple-700';
              if (log.type === 'ADB_PAIR') badgeColor = 'bg-amber-950 text-amber-300 border border-amber-700';
              if (log.type === 'APP_LAUNCH') badgeColor = 'bg-rose-950 text-rose-300 border border-rose-700';

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-2 py-0.5 px-1.5 rounded-sm hover:bg-[#1a1a1a] text-[11px]"
                >
                  <span className="text-gray-500 tabular-nums shrink-0">{timeStr}</span>
                  <span className={`px-1 rounded-sm text-[10px] font-bold shrink-0 ${badgeColor}`}>
                    {log.type}
                  </span>
                  <span className="font-bold text-gray-200 shrink-0">{log.codeName}</span>
                  {log.keyCode > 0 && (
                    <span className="text-gray-400 shrink-0 font-mono">[{log.keyCode}]</span>
                  )}
                  <span className="text-gray-400 truncate flex-1">{log.details}</span>
                </div>
              );
            })
          )}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
};
