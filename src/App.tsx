/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { XboxController } from './components/XboxController';
import { AdbPairingModal } from './components/AdbPairingModal';
import { AppLauncherModal } from './components/AppLauncherModal';
import { AndroidCodeExportModal } from './components/AndroidCodeExportModal';
import { CustomizationModal } from './components/CustomizationModal';
import { EventLoggerDrawer } from './components/EventLoggerDrawer';
import { nativeBridge } from './utils/nativeBridge';
import { haptics } from './utils/audio';
import { ANDROID_KEYCODES, GamepadCustomizationSettings } from './types/gamepad';
import { Monitor, Smartphone, Sparkles, Layers, Volume2, ShieldCheck, Sliders } from 'lucide-react';

const DEFAULT_SETTINGS: GamepadCustomizationSettings = {
  leftStickOpacity: 0.9,
  rightStickOpacity: 0.9,
  dpadOpacity: 0.9,
  actionButtonsOpacity: 0.9,
  shouldersOpacity: 0.85,
  centerControlsOpacity: 0.8,
  rackBackgroundOpacity: 0.85,
  stickSize: 135,
  buttonScale: 1.0,
  rackSpacing: 18,
};

export default function App() {
  const [isAdbConnected, setIsAdbConnected] = useState<boolean>(nativeBridge.isAdbConnected);
  const [opacity, setOpacity] = useState<number>(0.92);
  const [isAdbModalOpen, setIsAdbModalOpen] = useState<boolean>(false);
  const [isLauncherModalOpen, setIsLauncherModalOpen] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isLoggerOpen, setIsLoggerOpen] = useState<boolean>(false);
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [backgroundScene, setBackgroundScene] = useState<'stream' | 'dark' | 'grid'>('stream');
  const [activeApp, setActiveApp] = useState<string>('Parsec Remote Client');
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [dismissPortraitTip, setDismissPortraitTip] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const [customSettings, setCustomSettings] = useState<GamepadCustomizationSettings>(() => {
    try {
      const saved = localStorage.getItem('parsec_gamepad_custom_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const handleCustomSettingsChange = (newSettings: GamepadCustomizationSettings) => {
    setCustomSettings(newSettings);
    try {
      localStorage.setItem('parsec_gamepad_custom_settings', JSON.stringify(newSettings));
    } catch {
      // storage error
    }
  };

  // Sync ADB connection state listener
  useEffect(() => {
    const unsub = nativeBridge.addAdbStatusListener(({ connected }) => {
      setIsAdbConnected(connected);
    });
    return unsub;
  }, []);

  // Update opacity in native overlay if running in WebView
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

  // Keyboard shortcut listener for testing without touch screen
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
          <div className="relative w-full h-full bg-[#0a0f14] overflow-hidden opacity-90">
            {/* Cyberpunk / Gaming streaming scene mock */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#051119] via-[#091824] to-[#04080e]" />
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Parsec Stream Telemetry HUD at Top */}
            <div className="absolute top-14 left-6 flex items-center gap-4 text-[10px] font-mono text-emerald-400 bg-black/60 px-3 py-1.5 rounded-sm border border-emerald-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                PARSEC P2P STREAM
              </div>
              <span className="text-gray-400">|</span>
              <span>HOST: PC-GAMING-RIG (RTX 4080)</span>
              <span className="text-gray-400">|</span>
              <span className="text-sky-400">LATENCIA: 6.8 ms</span>
              <span className="text-gray-400">|</span>
              <span className="text-yellow-400">FPS: 60 / 60</span>
              <span className="text-gray-400">|</span>
              <span className="text-purple-400">H.265 / 35 Mbps</span>
            </div>

            {/* Center Gaming Graphics Simulation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <div className="text-center font-mono">
                <div className="text-5xl font-black text-gray-600 tracking-widest uppercase">
                  {activeApp}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  TRANSMISIÓN EN VIVO DESDE PC • SUPERPOSICIÓN ANDROID FLOTANTE
                </div>
              </div>
            </div>
          </div>
        )}

        {backgroundScene === 'grid' && (
          <div className="w-full h-full bg-[#141414] opacity-80 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem]" />
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
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        onToggleLogger={() => setIsLoggerOpen(!isLoggerOpen)}
        isLoggerOpen={isLoggerOpen}
        isCompactMode={isCompactMode}
        onToggleCompactMode={() => setIsCompactMode(!isCompactMode)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* QUICK BACKGROUND & VIEWPORT BAR WITH QUICK ADJUSTERS */}
      <div className="w-full bg-[#171717]/85 backdrop-blur-sm border-b border-[#242424] px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-400 z-10">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[10px]">FONDO:</span>
          {(['stream', 'dark', 'grid'] as const).map(bg => (
            <button
              key={bg}
              onClick={() => setBackgroundScene(bg)}
              className={`px-1.5 py-0.5 rounded-sm border uppercase text-[10px] transition-colors ${
                backgroundScene === bg
                  ? 'bg-[#292929] border-gray-400 text-white font-bold'
                  : 'bg-[#1b1b1b] border-[#292929] text-gray-500 hover:text-gray-300'
              }`}
            >
              {bg === 'stream' ? 'Stream Parsec' : bg === 'dark' ? 'Transparente Puro' : 'Cuadrícula'}
            </button>
          ))}
        </div>

        {/* Quick Sliders: Joysticks Opacity & Buttons Opacity */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[10px]">
            <span className="text-emerald-400">Opacidad Joysticks:</span>
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
              className="w-16 accent-emerald-500 cursor-pointer h-1 bg-[#252525] rounded"
            />
            <span className="tabular-nums w-6 text-gray-300">{Math.round(customSettings.leftStickOpacity * 100)}%</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[10px]">
            <span className="text-yellow-400">Opacidad Botones:</span>
            <input
              type="range"
              min="10"
              max="100"
              value={Math.round(customSettings.actionButtonsOpacity * 100)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) / 100;
                handleCustomSettingsChange({
                  ...customSettings,
                  actionButtonsOpacity: val,
                  dpadOpacity: val,
                });
              }}
              className="w-16 accent-yellow-500 cursor-pointer h-1 bg-[#252525] rounded"
            />
            <span className="tabular-nums w-6 text-gray-300">{Math.round(customSettings.actionButtonsOpacity * 100)}%</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[10px]">
            <span className="text-sky-400">Tamaño Sticks:</span>
            <input
              type="range"
              min="105"
              max="175"
              value={customSettings.stickSize}
              onChange={(e) => {
                handleCustomSettingsChange({
                  ...customSettings,
                  stickSize: parseInt(e.target.value, 10),
                });
              }}
              className="w-16 accent-sky-500 cursor-pointer h-1 bg-[#252525] rounded"
            />
            <span className="tabular-nums w-8 text-gray-300">{customSettings.stickSize}px</span>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-[#222222] hover:bg-[#2c2c2c] border border-sky-600/70 text-sky-300 rounded-sm font-bold"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Todos los Ajustes</span>
          </button>
        </div>
      </div>

      {/* MOBILE ORIENTATION HELPER (When phone is held vertically) */}
      {isPortrait && !dismissPortraitTip && (
        <div className="w-full bg-[#112415] border-b border-emerald-600/70 px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-emerald-300 z-20">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Consejo: Gira tu teléfono a horizontal (Landscape) para posición óptima de pulgares tipo Xbox.</span>
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
      <main className="relative flex-1 flex items-center justify-center overflow-y-auto overflow-x-hidden p-1 sm:p-2 z-10">
        {isCompactMode ? (
          /* MINIMIZED FLOATING BUBBLE / TOOLBAR */
          <div className="bg-[#181818]/95 border border-[#303030] rounded-sm p-3 shadow-2xl backdrop-blur-md flex items-center gap-4 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-sm" />
              <span className="text-xs font-mono font-bold text-gray-200">OVERLAY MINIMIZADO</span>
            </div>
            <button
              onClick={() => setIsLauncherModalOpen(true)}
              className="px-3 py-1 bg-emerald-600 text-white font-mono text-xs font-bold rounded-sm"
            >
              Lanzar Parsec
            </button>
            <button
              onClick={() => setIsCompactMode(false)}
              className="px-3 py-1 bg-[#262626] border border-[#383838] text-gray-300 font-mono text-xs font-bold rounded-sm"
            >
              Expandir Mando Xbox
            </button>
          </div>
        ) : (
          /* FULL XBOX ASYMMETRIC CONTROLLER IN HORIZONTAL RACK MODE */
          <XboxController
            settings={customSettings}
            globalOpacity={opacity}
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
          setActiveApp(app.name);
        }}
      />

      <CustomizationModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        settings={customSettings}
        onChange={handleCustomSettingsChange}
      />

      <AndroidCodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
