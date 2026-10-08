/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { XboxController } from './components/XboxController';
import { AdbPairingModal } from './components/AdbPairingModal';
import { AppLauncherModal } from './components/AppLauncherModal';
import { CustomizationModal, DEFAULT_SETTINGS } from './components/CustomizationModal';
import { EventLoggerDrawer } from './components/EventLoggerDrawer';
import { nativeBridge } from './utils/nativeBridge';
import { haptics } from './utils/audio';
import { ANDROID_KEYCODES, GamepadCustomizationSettings, InstalledApp } from './types/gamepad';
import { Monitor, Smartphone, Sparkles, Layers, Volume2, ShieldCheck, Sliders, Rocket, Plus, ExternalLink, RotateCw, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [isAdbConnected, setIsAdbConnected] = useState<boolean>(nativeBridge.isAdbConnected);
  const [opacity, setOpacity] = useState<number>(0.92);
  const [isAdbModalOpen, setIsAdbModalOpen] = useState<boolean>(false);
  const [isLauncherModalOpen, setIsLauncherModalOpen] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [backgroundScene, setBackgroundScene] = useState<'stream' | 'dark' | 'grid'>('stream');
  const [activeApp, setActiveApp] = useState<{ name: string; packageName: string }>({
    name: 'Parsec Remote Gaming',
    packageName: 'tv.parsec.client',
  });
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissPortraitTip, setDismissPortraitTip] = useState<boolean>(false);

  // Settings from localStorage
  const [customSettings, setCustomSettings] = useState<GamepadCustomizationSettings>(() => {
    try {
      const saved = localStorage.getItem('parsec_gamepad_custom_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Detect orientation and mobile screen
  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 850;
      setIsPortrait(portrait);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleCustomSettingsChange = (newSettings: GamepadCustomizationSettings) => {
    setCustomSettings(newSettings);
    try {
      localStorage.setItem('parsec_gamepad_custom_settings', JSON.stringify(newSettings));
    } catch {
      // storage error
    }
  };

  // Toggle layout mode between Unified and Split
  const handleToggleLayoutMode = () => {
    const nextMode = (customSettings.controllerLayoutMode || 'unified') === 'unified' ? 'split' : 'unified';
    handleCustomSettingsChange({
      ...customSettings,
      controllerLayoutMode: nextMode,
    });
  };

  // Sync ADB connection state listener
  useEffect(() => {
    const unsub = nativeBridge.addAdbStatusListener(({ connected }) => {
      setIsAdbConnected(connected);
    });
    return unsub;
  }, []);

  // Update opacity
  const handleOpacityChange = (val: number) => {
    setOpacity(val);
    nativeBridge.setOverlayOpacity(val);
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    haptics.enabled = nextState;
    haptics.hapticsEnabled = nextState;
  };

  // Keyboard shortcut listener for testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.repeat) return;

      switch (e.key.toLowerCase()) {
        case 'a':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_A', 0);
          break;
        case 'b':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_B', 0);
          break;
        case 'x':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_X', 0);
          break;
        case 'y':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_Y', 0);
          break;
        case 'q':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_L1', 0); // LB
          break;
        case 'e':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_R1', 0); // RB
          break;
        case '1':
          nativeBridge.sendTriggerEvent(0, 1.0);
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_L2', 0);
          break;
        case '2':
          nativeBridge.sendTriggerEvent(1, 1.0);
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_R2', 0);
          break;
        case 'arrowup':
          nativeBridge.sendKeyEvent('KEYCODE_DPAD_UP', 0);
          break;
        case 'arrowdown':
          nativeBridge.sendKeyEvent('KEYCODE_DPAD_DOWN', 0);
          break;
        case 'arrowleft':
          nativeBridge.sendKeyEvent('KEYCODE_DPAD_LEFT', 0);
          break;
        case 'arrowright':
          nativeBridge.sendKeyEvent('KEYCODE_DPAD_RIGHT', 0);
          break;
        case 'enter':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_START', 0);
          break;
        case 'backspace':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_SELECT', 0);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key.toLowerCase()) {
        case 'a':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_A', 1);
          break;
        case 'b':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_B', 1);
          break;
        case 'x':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_X', 1);
          break;
        case 'y':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_Y', 1);
          break;
        case 'q':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_L1', 1);
          break;
        case 'e':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_R1', 1);
          break;
        case '1':
          nativeBridge.sendTriggerEvent(0, 0.0);
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_L2', 1);
          break;
        case '2':
          nativeBridge.sendTriggerEvent(1, 0.0);
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_R2', 1);
          break;
        case 'arrowup':
          nativeBridge.sendKeyEvent('KEYCODE_DPAD_UP', 1);
          break;
        case 'arrowdown':
          nativeBridge.sendKeyEvent('KEYCODE_DPAD_DOWN', 1);
          break;
        case 'arrowleft':
          nativeBridge.sendKeyEvent('KEYCODE_DPAD_LEFT', 1);
          break;
        case 'arrowright':
          nativeBridge.sendKeyEvent('KEYCODE_DPAD_RIGHT', 1);
          break;
        case 'enter':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_START', 1);
          break;
        case 'backspace':
          nativeBridge.sendKeyEvent('KEYCODE_BUTTON_SELECT', 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[#121212] text-gray-200 select-none overflow-hidden touch-none font-sans">
      
      {/* BACKGROUND SIMULATOR (Shows game / Parsec desktop streaming through overlay transparency) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {backgroundScene === 'stream' && (
          <div className="relative w-full h-full bg-[#090e13] overflow-hidden opacity-90">
            {/* Cyberpunk / Gaming streaming scene mock */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#040d14] via-[#081520] to-[#03060b]" />
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Parsec Stream Telemetry HUD at Top */}
            <div className="absolute top-14 left-4 right-4 sm:right-auto flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] font-mono text-emerald-400 bg-black/65 px-3 py-1.5 rounded border border-emerald-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                PARSEC P2P STREAM
              </div>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-gray-300 truncate max-w-[150px] sm:max-w-none">
                APP: {activeApp.name}
              </span>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-sky-400">6.4 ms</span>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-yellow-400">60 FPS</span>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <span className="text-purple-400">H.265 / 35 Mbps</span>
            </div>

            {/* Center Gaming Graphics Simulation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <div className="text-center font-mono p-4">
                <div className="text-3xl sm:text-5xl font-black text-gray-600 tracking-widest uppercase">
                  {activeApp.name}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 mt-2">
                  TRANSMISIÓN EN VIVO • MANDO FLOTANTE ACTIVO
                </div>
              </div>
            </div>
          </div>
        )}

        {backgroundScene === 'grid' && (
          <div className="w-full h-full bg-[#141414] opacity-80 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        )}

        {backgroundScene === 'dark' && (
          <div className="w-full h-full bg-[#121212]" />
        )}
      </div>

      {/* TOP HEADER & CONTROLS */}
      <HeaderBar
        isAdbConnected={isAdbConnected}
        opacity={opacity}
        onOpacityChange={handleOpacityChange}
        onOpenAdbModal={() => setIsAdbModalOpen(true)}
        onOpenLauncherModal={() => setIsLauncherModalOpen(true)}
        onOpenCustomizationModal={() => setIsCustomModalOpen(true)}
        onToggleLogger={() => setIsLoggerOpen(!isLoggerOpen)}
        isLoggerOpen={isLoggerOpen}
        isCompactMode={isCompactMode}
        onToggleCompactMode={() => setIsCompactMode(!isCompactMode)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        layoutMode={customSettings.controllerLayoutMode || 'unified'}
        onToggleLayoutMode={handleToggleLayoutMode}
      />

      {/* QUICK SECONDARY TOOLBAR */}
      <div className="w-full bg-[#171717]/85 backdrop-blur-sm border-b border-[#242424] px-2.5 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-400 z-20">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Active app indicator & quick change button */}
          <button
            onClick={() => setIsLauncherModalOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 bg-[#202020] hover:bg-[#282828] border border-emerald-600/60 text-emerald-300 rounded font-bold text-[10px] transition-colors"
            title="Cambiar o agregar aplicación de tu celular"
          >
            <Rocket className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[120px] sm:max-w-none">{activeApp.name}</span>
          </button>

          <button
            onClick={() => setIsLauncherModalOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-600 text-emerald-400 rounded font-bold text-[10px] transition-colors"
            title="Agregar juego o aplicación de tu móvil"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">Agregar App</span>
          </button>

          {/* Background options */}
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <span className="text-gray-500 text-[10px]">FONDO:</span>
            {(['stream', 'dark', 'grid'] as const).map(bg => (
              <button
                key={bg}
                onClick={() => setBackgroundScene(bg)}
                className={`px-1.5 py-0.5 rounded border uppercase text-[9px] transition-colors ${
                  backgroundScene === bg
                    ? 'bg-[#292929] border-gray-400 text-white font-bold'
                    : 'bg-[#1b1b1b] border-[#292929] text-gray-500 hover:text-gray-300'
                }`}
              >
                {bg === 'stream' ? 'Stream' : bg === 'dark' ? 'Puro' : 'Grid'}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Sliders: Joysticks Opacity & Buttons Opacity & Layout Mode */}
        <div className="flex items-center gap-2.5">
          {/* Chassis Mode Badge */}
          <button
            onClick={handleToggleLayoutMode}
            className="px-2 py-0.5 rounded bg-[#1e1e1e] hover:bg-[#262626] border border-[#333333] text-[10px] text-gray-300 flex items-center gap-1 font-bold"
          >
            <span className="text-emerald-400 font-bold">Mando:</span>
            <span>{(customSettings.controllerLayoutMode || 'unified') === 'unified' ? 'Chasis Unificado' : 'Separado Split'}</span>
          </button>

          <div className="hidden md:flex items-center gap-1.5 text-[10px]">
            <span className="text-emerald-400">Joysticks:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={Math.round(customSettings.leftStickOpacity * 100)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) / 100;
                handleCustomSettingsChange({
                  ...customSettings,
                  leftStickOpacity: val,
                  rightStickOpacity: val,
                });
              }}
              className="w-14 accent-emerald-500 cursor-pointer h-1 bg-[#252525] rounded"
            />
            <span className="tabular-nums w-6 text-gray-300">{Math.round(customSettings.leftStickOpacity * 100)}%</span>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#222222] hover:bg-[#2c2c2c] border border-sky-600/70 text-sky-300 rounded font-bold"
          >
            <Sliders className="w-3 h-3" />
            <span>Ajustes</span>
          </button>
        </div>
      </div>

      {/* MOBILE PORTRAIT HELPER (When phone is held vertically) */}
      {isPortrait && !dismissPortraitTip && (
        <div className="w-full bg-[#112415] border-b border-emerald-600/70 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-emerald-300 z-20">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Modo Celular Vertical activo: el mando se adapta a la mitad inferior. Para agarre horizontal tipo consola, gira tu móvil.</span>
          </div>
          <button
            onClick={() => setDismissPortraitTip(true)}
            className="text-emerald-400 hover:text-white px-1.5 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* MAIN GAMEPAD CONTROLLER AREA */}
      <main className="relative flex-1 flex flex-col items-center justify-center overflow-hidden p-1 sm:p-2 z-10">
        {isCompactMode ? (
          /* MINIMIZED FLOATING BUBBLE / TOOLBAR */
          <div className="bg-[#181818]/95 border border-[#303030] rounded p-3 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
              <span className="text-xs font-mono font-bold text-gray-200">MANDO MINIMIZADO</span>
            </div>
            <button
              onClick={() => setIsLauncherModalOpen(true)}
              className="px-3 py-1 bg-emerald-600 text-white font-mono text-xs font-bold rounded"
            >
              Lanzar {activeApp.name}
            </button>
            <button
              onClick={() => setIsCompactMode(false)}
              className="px-3 py-1 bg-[#262626] border border-[#383838] text-gray-300 font-mono text-xs font-bold rounded"
            >
              Expandir Mando Xbox
            </button>
          </div>
        ) : isPortrait ? (
          /* MOBILE PORTRAIT SPLIT VIEW (Top: Stream Preview; Bottom: Full Xbox Gamepad) */
          <div className="w-full h-full flex flex-col justify-between overflow-hidden">
            {/* Top 35%: Game Screen & App Preview */}
            <div className="w-full h-[32%] bg-[#0c1219] border border-[#222222] rounded-lg p-2.5 flex flex-col justify-between relative overflow-hidden shadow-inner shrink-0">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {activeApp.name}
                </span>
                <span className="text-gray-400">PANTALLA DE JUEGO</span>
              </div>

              <div className="text-center my-auto">
                <div className="text-lg font-black text-gray-400 uppercase tracking-wider">
                  {activeApp.name}
                </div>
                <div className="text-[10px] text-gray-500">
                  Usa los controles abajo para jugar con tus pulgares
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500">
                <span>FPS: 60</span>
                <button
                  onClick={() => setIsLauncherModalOpen(true)}
                  className="text-emerald-400 font-bold underline"
                >
                  Cambiar app
                </button>
                <span>PING: 6ms</span>
              </div>
            </div>

            {/* Bottom 68%: Xbox Gamepad (Unified or Split) */}
            <div className="w-full flex-1 flex items-center justify-center overflow-hidden pt-1">
              <XboxController
                settings={customSettings}
                globalOpacity={opacity}
                isPortrait={true}
              />
            </div>
          </div>
        ) : (
          /* FULL XBOX CONTROLLER (Horizontal / Landscape / Desktop / Tablet) */
          <XboxController
            settings={customSettings}
            globalOpacity={opacity}
            isPortrait={false}
          />
        )}
      </main>

      {/* EVENT LOGGER DRAWER AT BOTTOM */}
      <EventLoggerDrawer
        isOpen={isLoggerOpen}
        onToggle={() => setIsLoggerOpen(!isLoggerOpen)}
      />

      {/* MODALS */}
      <AdbPairingModal
        isOpen={isAdbModalOpen}
        onClose={() => setIsAdbModalOpen(false)}
        onPairSuccess={() => {
          setIsAdbConnected(true);
        }}
      />

      <AppLauncherModal
        isOpen={isLauncherModalOpen}
        onClose={() => setIsLauncherModalOpen(false)}
        onAppLaunched={(app) => {
          setActiveApp({ name: app.name, packageName: app.packageName });
        }}
      />

      <CustomizationModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        settings={customSettings}
        onChange={handleCustomSettingsChange}
      />
    </div>
  );
}
