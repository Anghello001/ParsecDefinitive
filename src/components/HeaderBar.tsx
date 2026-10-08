import React from 'react';
import { Wifi, Rocket, Code2, Sliders, Volume2, VolumeX, Eye, Terminal, Maximize2, Minimize2, Expand } from 'lucide-react';
import { haptics } from '../utils/audio';

interface HeaderBarProps {
  isAdbConnected: boolean;
  opacity: number;
  onOpacityChange: (val: number) => void;
  onOpenAdbModal: () => void;
  onOpenLauncherModal: () => void;
  onOpenCustomizationModal: () => void;
  onOpenCodeModal: () => void;
  onToggleLogger: () => void;
  isLoggerOpen: boolean;
  isCompactMode: boolean;
  onToggleCompactMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  isAdbConnected,
  opacity,
  onOpacityChange,
  onOpenAdbModal,
  onOpenLauncherModal,
  onOpenCustomizationModal,
  onOpenCodeModal,
  onToggleLogger,
  isLoggerOpen,
  isCompactMode,
  onToggleCompactMode,
  soundEnabled,
  onToggleSound,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };
  return (
    <header className="w-full bg-[#141414] border-b border-[#262626] px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-xs font-mono select-none z-30 shadow-md">
      {/* Left: Branding & Connection Status */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5 font-bold text-gray-200">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
          <span className="tracking-wider uppercase font-black text-sm text-gray-100 hidden sm:inline">
            PARSEC OVERLAY
          </span>
          <span className="tracking-wider uppercase font-black text-xs text-gray-100 sm:hidden">
            PARSEC
          </span>
        </div>

        {/* ADB Connection status indicator */}
        <button
          onClick={onOpenAdbModal}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border text-[11px] font-bold transition-colors ${
            isAdbConnected
              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
              : 'bg-[#1e1e1e] border-[#303030] text-gray-400 hover:text-gray-200 hover:border-[#404040]'
          }`}
          title="Configurar depuración inalámbrica"
        >
          <Wifi className={`w-3.5 h-3.5 ${isAdbConnected ? 'text-emerald-400' : 'text-gray-500'}`} />
          <span className="hidden md:inline">ADB:</span>
          <span>{isAdbConnected ? 'CONECTADO' : 'DESCONECTADO'}</span>
        </button>

        {/* App Launcher Button */}
        <button
          onClick={onOpenLauncherModal}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1a2e1d] hover:bg-[#203a24] border border-emerald-600/70 text-emerald-400 rounded-sm font-bold text-[11px] transition-colors"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Lanzador de Apps</span>
        </button>

        {/* Customization (Opacity & Sizes) Button */}
        <button
          onClick={onOpenCustomizationModal}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1f242d] hover:bg-[#28303d] border border-sky-600/60 text-sky-400 rounded-sm font-bold text-[11px] transition-colors"
          title="Ajuste individual de opacidad y tamaños sin superposición"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ajuste Visual & Tamaños</span>
          <span className="sm:hidden">Ajustes</span>
        </button>
      </div>

      {/* Right: Quick Tools (Opacity, Haptics, Code Export, Minimize) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Opacity Slider */}
        <div className="hidden lg:flex items-center gap-1.5 text-gray-400 text-[11px]">
          <Eye className="w-3.5 h-3.5 text-gray-500" />
          <span>Opacidad:</span>
          <input
            type="range"
            min="20"
            max="100"
            value={Math.round(opacity * 100)}
            onChange={(e) => onOpacityChange(parseInt(e.target.value, 10) / 100)}
            className="w-16 accent-emerald-500 cursor-pointer h-1 bg-[#252525] rounded"
          />
          <span className="tabular-nums w-7 text-right">{Math.round(opacity * 100)}%</span>
        </div>

        {/* Sound & Haptic Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-1.5 rounded-sm border transition-colors ${
            soundEnabled
              ? 'bg-[#202020] border-[#353535] text-emerald-400'
              : 'bg-[#181818] border-[#2a2a2a] text-gray-500'
          }`}
          title={soundEnabled ? 'Sonido y hápticos activados' : 'Silenciado'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Event Logger Drawer Toggle */}
        <button
          onClick={onToggleLogger}
          className={`px-2 py-1 rounded-sm border flex items-center gap-1 text-[11px] transition-colors ${
            isLoggerOpen
              ? 'bg-[#282828] border-gray-500 text-white'
              : 'bg-[#1c1c1c] border-[#2e2e2e] text-gray-400 hover:text-gray-200'
          }`}
          title="Ver monitor de keycodes en tiempo real"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Eventos</span>
        </button>

        {/* Export / Native Project Files Button */}
        <button
          onClick={onOpenCodeModal}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#222222] hover:bg-[#2a2a2a] border border-[#383838] hover:border-gray-500 text-gray-200 rounded-sm font-bold text-[11px] transition-colors"
          title="Ver y copiar MainActivity.kt, index.html autónomo y código para AIDE"
        >
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Código AIDE</span>
        </button>

        {/* Fullscreen Button for Mobile Gamepad */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 bg-[#202020] hover:bg-[#282828] border border-[#333333] text-emerald-400 rounded-sm"
          title="Pantalla Completa (Modo Consola / Sin barras del navegador)"
        >
          <Expand className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Compact Floating Mode */}
        <button
          onClick={onToggleCompactMode}
          className="p-1.5 bg-[#202020] hover:bg-[#282828] border border-[#333333] text-gray-300 rounded-sm"
          title={isCompactMode ? 'Expandir mando completo' : 'Minimizar a barra flotante'}
        >
          {isCompactMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
