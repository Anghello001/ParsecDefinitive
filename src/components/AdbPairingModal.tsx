import React, { useState } from 'react';
import { nativeBridge } from '../utils/nativeBridge';
import { Wifi, CheckCircle2, AlertCircle, Terminal, Copy, Check, X, ShieldAlert, Cpu } from 'lucide-react';

interface AdbPairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPairSuccess?: () => void;
}

export const AdbPairingModal: React.FC<AdbPairingModalProps> = ({
  isOpen,
  onClose,
  onPairSuccess,
}) => {
  const [ip, setIp] = useState('127.0.0.1');
  const [port, setPort] = useState('37829');
  const [code, setCode] = useState('482910');
  const [connectPort, setConnectPort] = useState('41235');
  const [isPairing, setIsPairing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const generatedAdbPairCmd = `adb pair ${ip}:${port} ${code}`;
  const generatedAdbConnectCmd = `adb connect ${ip}:${connectPort || port}`;

  const handlePair = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPairing(true);
    setStatusMessage('Iniciando handshake TLS con el daemon de depuración inalámbrica...');
    setStatusType('info');

    const result = await nativeBridge.pairAdb(ip, port, code);
    setIsPairing(false);

    if (result.success) {
      setStatusType('success');
      setStatusMessage(`✓ Conexión establecida: ${result.message}`);
      onPairSuccess?.();
    } else {
      setStatusType('error');
      setStatusMessage(`✕ Error: ${result.message}`);
    }
  };

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText(`${generatedAdbPairCmd} && ${generatedAdbConnectCmd}`);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#181818] border border-[#2d2d2d] rounded-sm shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#141414]">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-100">
                Depuración Inalámbrica / Puente ADB (Wireless Debugging)
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">
                Emparejamiento local para inyección de eventos de hardware sin root
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white bg-[#202020] border border-[#2e2e2e] rounded-sm hover:bg-[#282828]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-sm border font-mono text-xs flex items-start gap-2.5 ${
                statusType === 'success'
                  ? 'bg-emerald-950/50 border-emerald-600 text-emerald-300'
                  : statusType === 'error'
                  ? 'bg-red-950/50 border-red-600 text-red-300'
                  : 'bg-[#202020] border-[#383838] text-gray-300'
              }`}
            >
              {statusType === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : statusType === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Cpu className="w-4 h-4 text-sky-400 shrink-0 mt-0.5 animate-spin" />
              )}
              <div className="flex-1 break-all">{statusMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handlePair} className="space-y-3 bg-[#151515] p-3.5 border border-[#252525] rounded-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* IP */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Dirección IP Local:
                </label>
                <input
                  type="text"
                  value={ip}
                  onChange={e => setIp(e.target.value)}
                  placeholder="127.0.0.1 ó 192.168.1.X"
                  className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-sm px-2.5 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              {/* Pairing Port */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Puerto de Emparejamiento:
                </label>
                <input
                  type="text"
                  value={port}
                  onChange={e => setPort(e.target.value)}
                  placeholder="37829"
                  className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-sm px-2.5 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Pairing Code */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1 flex items-center justify-between">
                  <span>Código de Vinculación (6 dígitos):</span>
                  <span className="text-[10px] text-amber-400">Requerido</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="482910"
                  className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-sm px-2.5 py-1.5 text-xs text-amber-300 font-mono tracking-widest font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Service Connect Port */}
              <div>
                <label className="block text-[11px] font-mono text-gray-400 uppercase mb-1">
                  Puerto de Conexión Principal:
                </label>
                <input
                  type="text"
                  value={connectPort}
                  onChange={e => setConnectPort(e.target.value)}
                  placeholder="41235"
                  className="w-full bg-[#1e1e1e] border border-[#2e2e2e] rounded-sm px-2.5 py-1.5 text-xs text-gray-200 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                disabled={isPairing}
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-sm flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Wifi className="w-3.5 h-3.5" />
                {isPairing ? 'Emparejando con ADB...' : 'Vincular y Conectar ADB'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIp('127.0.0.1');
                  setPort('37829');
                  setCode('123456');
                }}
                className="px-3 py-2 bg-[#222222] hover:bg-[#2a2a2a] border border-[#333333] text-gray-400 hover:text-gray-200 rounded-sm font-mono text-xs"
              >
                Ejemplo
              </button>
            </div>
          </form>

          {/* Quick CLI command */}
          <div className="bg-[#121212] border border-[#262626] rounded-sm p-3 font-mono text-xs">
            <div className="flex items-center justify-between text-gray-400 mb-1.5 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Comando ADB equivalente en terminal:
              </span>
              <button
                onClick={handleCopyCmd}
                className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white bg-[#1e1e1e] border border-[#333333] px-2 py-0.5 rounded-sm"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <code className="text-gray-300 break-all select-all">
              {generatedAdbPairCmd} && {generatedAdbConnectCmd}
            </code>
          </div>

          {/* Step by step guide */}
          <div className="bg-[#161616] border border-[#262626] p-3 rounded-sm space-y-2 text-[11px] font-mono text-gray-400">
            <div className="font-bold text-gray-200 uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              ¿Cómo obtener el código en Android 11 / 12 / 13 / 14?
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-gray-400">
              <li>Abre <strong>Ajustes del Sistema &gt; Opciones de desarrollador</strong>.</li>
              <li>Activa <strong>Depuración inalámbrica</strong> (Wireless Debugging).</li>
              <li>Toca en <em>"Vincular dispositivo con código de vinculación"</em>.</li>
              <li>Aparecerá una ventana con la <strong>Dirección IP y puerto</strong> + <strong>Código de vinculación de 6 dígitos</strong>.</li>
              <li>Escribe esos números arriba y pulsa <strong>Vincular y Conectar</strong>.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#141414] border-t border-[#242424] text-[10px] text-gray-500 font-mono flex items-center justify-between">
          <span>Bridge: Android.pairAdb(ip, port, code)</span>
          <span className="text-gray-400">Sin necesidad de permisos Root</span>
        </div>
      </div>
    </div>
  );
};
