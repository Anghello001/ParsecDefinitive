import React, { useState, useEffect } from 'react';
import { Wifi, Rocket, Sliders, Volume2, VolumeX, Eye, Terminal, Maximize2, Minimize2, Plus, Smartphone, Layers, LayoutGrid } from 'lucide-react';
import { haptics } from '../utils/audio';

interface HeaderBarProps {
  isAdbConnected: boolean;
  opacity: number;
  onOpacityChange: (val: number) => void;
  onOpenAdbModal: () => void;
  onOpenLauncherModal: () => void;
  onOpenCustomizationModal: () => void;
  onToggleLogger: () => void;
  isLoggerOpen: boolean;
  isCompactMode: boolean;
  onToggleCompactMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  layoutMode: 'unified' | 'split';
  onToggleLayoutMode: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isAdbConnected,
  opacity,
  onOpacityChange,
  onOpenAdbModal,
  onOpenLauncherModal,
  onOpenCustomizationModal,
  onToggleLogger,
  isLoggerOpen,
  isCompactMode,
  onToggleCompactMode,
  soundEnabled,
  onToggleSound,
  layoutMode,
  onToggleLayoutMode,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);

  // Fullscreen toggle with wake lock to keep screen on while playing
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
        // Request Screen WakeLock so phone screen doesn't turn off
        if ('wakeLock' in navigator) {
          try {
            await (navigator as any).wakeLock.request('screen');
            setWakeLockActive(true);
          } catch {
            // Wake lock failed
          }
        }
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen failed or user declined
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <header className="w-full bg-[#141414] border-b border-[#262626] px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 text-xs font-mono select-none z-30 shadow-md">
      {/* Left: Branding & Connection Status */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <div className="flex items-center gap-1.5 font-bold text-gray-200">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm shadow-[0_0_8px_#10b981]" />
          <span className="tracking-wider uppercase font-black text-xs sm:text-sm text-gray-100 hidden sm:inline">
            PARSEC WEB CONTROLLER
          </span>
          <span className="tracking-wider uppercase font-black text-xs text-gray-100 sm:hidden">
            PARSEC
          </span>
        </div>

        {/* ADB Connection status indicator */}
        <button
          onClick={onOpenAdbModal}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded border text-[11px] font-bold transition-colors ${
            isAdbConnected
              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
              : 'bg-[#1e1e1e] border-[#303030] text-gray-400 hover:text-gray-200 hover:border-[#404040]'
          }`}
          title="Configurar depuración inalámbrica ADB"
        >
          <Wifi className={`w-3.5 h-3.5 ${isAdbConnected ? 'text-emerald-400' : 'text-gray-500'}`} />
          <span className="hidden md:inline">ADB:</span>
          <span className="text-[10px] sm:text-[11px]">{isAdbConnected ? 'CONECTADO' : 'ADB'}</span>
        </button>

        {/* App Launcher Button */}
        <button
          onClick={onOpenLauncherModal}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-[#1a2e1d] hover:bg-[#203a24] border border-emerald-600/70 text-emerald-400 rounded font-bold text-[11px] transition-colors shadow-sm"
          title="Abrir o agregar aplicaciones de tu celular"
        >
          <Rocket className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Apps de mi Celular</span>
          <span className="sm:hidden">Apps</span>
        </button>

        {/* Quick Chassis Layout Toggle */}
        <button
          onClick={onToggleLayoutMode}
          className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-[#202020] hover:bg-[#282828] border border-[#383838] text-gray-300 rounded font-bold text-[11px] transition-colors"
          title={layoutMode === 'unified' ? 'Cambiar a modo Laterales Flotantes' : 'Cambiar a Chasis Unificado Xbox'}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
          <span>{layoutMode === 'unified' ? 'Chasis Unificado' : 'Flotante Split'}</span>
        </button>

        {/* Customization (Opacity & Sizes) Button */}
        <button
          onClick={onOpenCustomizationModal}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-[#1f242d] hover:bg-[#28303d] border border-sky-600/60 text-sky-400 rounded font-bold text-[11px] transition-colors"
          title="Ajuste individual de opacidad y tamaños"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ajustes Mando</span>
          <span className="sm:hidden">Ajustes</span>
        </button>
      </div>

      {/* Right: Quick Tools (Opacity, Haptics, Fullscreen, Minimize) */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Opacity Slider (Desktop & Tablet) */}
        <div className="hidden xl:flex items-center gap-1.5 text-gray-400 text-[11px]">
          <Eye className="w-3.5 h-3.5 text-gray-500" />
          <span>Opacidad:</span>
          <input
            type="range"
            min="20"
            max="100"
            value={Math.round(opacity * 100)}
            onChange={(e) => onOpacityChange(parseInt(e.target.value, 10) / 100)}
            className="w-16 accent-emerald-500 cursor-pointer h-1.5 bg-[#252525] rounded"
          />
          <span className="tabular-nums text-gray-300">{Math.round(opacity * 100)}%</span>
        </div>

        {/* Sound / Haptics Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded border transition-colors ${
            soundEnabled
              ? 'bg-[#1b261d] border-emerald-600/60 text-emerald-400'
              : 'bg-[#1e1e1e] border-[#2e2e2e] text-gray-500'
          }`}
          title={soundEnabled ? 'Sonido y vibración háptica activados' : 'Silenciado'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Event Monitor Toggle */}
        <button
          onClick={onToggleLogger}
          className={`p-1.5 rounded border transition-colors hidden sm:flex items-center gap-1 ${
            isLoggerOpen
              ? 'bg-[#25231a] border-amber-500 text-amber-400'
              : 'bg-[#1e1e1e] border-[#2e2e2e] text-gray-400 hover:text-gray-200'
          }`}
          title="Monitor de eventos y keycodes en tiempo real"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[10px]">LOGS</span>
        </button>

        {/* Mobile Fullscreen Toggle Button */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1 px-2 py-1 bg-[#222222] hover:bg-[#2c2c2c] border border-gray-600 text-gray-200 rounded font-bold text-[11px] transition-colors"
          title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa (Modo Mando Móvil)'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5 text-gray-300" />
          )}
          <span className="hidden sm:inline">{isFullscreen ? 'Salir Fullscreen' : 'Pantalla Completa'}</span>
        </button>

        {/* Compact Mode Toggle */}
        <button
          onClick={onToggleCompactMode}
          className={`p-1.5 rounded border transition-colors ${
            isCompactMode
              ? 'bg-emerald-950 border-emerald-600 text-emerald-400'
              : 'bg-[#1e1e1e] border-[#2e2e2e] text-gray-400 hover:text-gray-200'
          }`}
          title={isCompactMode ? 'Expandir mando completo' : 'Minimizar a barra flotante'}
        >
          {isCompactMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
