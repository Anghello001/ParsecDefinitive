import React from 'react';
import { GamepadCustomizationSettings } from '../types/gamepad';
import { Sliders, RotateCcw, Sparkles, X, Eye, Maximize, Palette, LayoutGrid, Layers } from 'lucide-react';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GamepadCustomizationSettings;
  onChange: (settings: GamepadCustomizationSettings) => void;
}

export const DEFAULT_SETTINGS: GamepadCustomizationSettings = {
  controllerLayoutMode: 'unified',
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

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onChange,
}) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof GamepadCustomizationSettings>(
    key: K,
    value: GamepadCustomizationSettings[K]
  ) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  // Presets
  const applyPreset = (preset: 'ghost' | 'balanced' | 'large' | 'compact') => {
    if (preset === 'ghost') {
      onChange({
        ...settings,
        leftStickOpacity: 0.45,
        rightStickOpacity: 0.45,
        dpadOpacity: 0.45,
        actionButtonsOpacity: 0.5,
        shouldersOpacity: 0.4,
        centerControlsOpacity: 0.35,
        rackBackgroundOpacity: 0.35,
      });
    } else if (preset === 'balanced') {
      onChange({
        ...DEFAULT_SETTINGS,
        controllerLayoutMode: settings.controllerLayoutMode || 'unified',
      });
    } else if (preset === 'large') {
      onChange({
        ...settings,
        stickSize: 155,
        buttonScale: 1.15,
        rackSpacing: 24,
      });
    } else if (preset === 'compact') {
      onChange({
        ...settings,
        stickSize: 115,
        buttonScale: 0.88,
        rackSpacing: 12,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-[#2e2e2e] rounded-lg shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-gray-200 font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626] bg-[#141414]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-100">
                Ajuste de Mando, Transparencia y Tamaños
              </h2>
              <p className="text-[11px] text-gray-400">
                Configura el cuerpo del mando Xbox, opacidad y tamaños para tu celular
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white bg-[#202020] border border-[#2e2e2e] rounded hover:bg-[#282828] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* SECTION 0: CONTROLLER CHASSIS STYLE */}
          <div className="bg-[#141414] border border-[#2c2c2c] rounded-md p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-100 flex items-center gap-1.5 uppercase tracking-wide">
                <LayoutGrid className="w-4 h-4 text-emerald-400" />
                Diseño del Mando en Pantalla:
              </span>
              <span className="text-[10px] text-gray-500 font-bold">Xbox Asimétrico</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Unified Xbox Chassis */}
              <button
                type="button"
                onClick={() => updateSetting('controllerLayoutMode', 'unified')}
                className={`p-3 rounded border text-left transition-all ${
                  (settings.controllerLayoutMode || 'unified') === 'unified'
                    ? 'bg-[#1b261e] border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-[#1c1c1c] border-[#2e2e2e] hover:border-[#404040]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-emerald-400 text-xs">
                    🎮 Chasis Unificado Xbox
                  </span>
                  {(settings.controllerLayoutMode || 'unified') === 'unified' && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-600/40">
                      ACTIVO
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-300">
                  Un solo cuerpo continuo. Los joysticks y botones van integrados ergonómicamente en un chasis sólido estilo gamepad de Xbox.
                </p>
              </button>

              {/* Option 2: Split Floating Side Racks */}
              <button
                type="button"
                onClick={() => updateSetting('controllerLayoutMode', 'split')}
                className={`p-3 rounded border text-left transition-all ${
                  settings.controllerLayoutMode === 'split'
                    ? 'bg-[#1b261e] border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-[#1c1c1c] border-[#2e2e2e] hover:border-[#404040]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-200 text-xs">
                    📐 Laterales Flotantes (Split)
                  </span>
                  {settings.controllerLayoutMode === 'split' && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-600/40">
                      ACTIVO
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  Mangos izquierdo y derecho separados en los extremos, dejando el centro totalmente transparente para ver el juego.
                </p>
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <div className="text-[11px] text-gray-400 uppercase font-bold mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Perfiles Rápidos:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => applyPreset('ghost')}
                className="p-2 bg-[#202020] hover:bg-[#282828] border border-[#333333] rounded text-left hover:border-emerald-500 transition-colors"
              >
                <div className="font-bold text-gray-200">👻 Fantasma</div>
                <div className="text-[10px] text-gray-500">45% opacidad / Máx visibilidad</div>
              </button>
              <button
                onClick={() => applyPreset('balanced')}
                className="p-2 bg-[#202020] hover:bg-[#282828] border border-[#333333] rounded text-left hover:border-emerald-500 transition-colors"
              >
                <div className="font-bold text-emerald-400">⚖️ Equilibrado</div>
                <div className="text-[10px] text-gray-500">Predeterminado</div>
              </button>
              <button
                onClick={() => applyPreset('large')}
                className="p-2 bg-[#202020] hover:bg-[#282828] border border-[#333333] rounded text-left hover:border-emerald-500 transition-colors"
              >
                <div className="font-bold text-sky-400">🔍 Joysticks XL</div>
                <div className="text-[10px] text-gray-500">155px / Manos grandes</div>
              </button>
              <button
                onClick={() => applyPreset('compact')}
                className="p-2 bg-[#202020] hover:bg-[#282828] border border-[#333333] rounded text-left hover:border-emerald-500 transition-colors"
              >
                <div className="font-bold text-purple-400">📱 Compacto</div>
                <div className="text-[10px] text-gray-500">115px / Celulares pequeños</div>
              </button>
            </div>
          </div>

          {/* Section 1: Individual Opacities */}
          <div className="bg-[#141414] border border-[#262626] rounded-md p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Eye className="w-3.5 h-3.5" />
                Opacidad Individual (Transparencia):
              </span>
              <span className="text-[10px] text-gray-500">10% = Casi Invisible | 100% = Sólido</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Left Stick Opacity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Stick Izquierdo (LS):</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {Math.round(settings.leftStickOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={Math.round(settings.leftStickOpacity * 100)}
                  onChange={(e) => updateSetting('leftStickOpacity', parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* Right Stick Opacity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Stick Derecho (RS):</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {Math.round(settings.rightStickOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={Math.round(settings.rightStickOpacity * 100)}
                  onChange={(e) => updateSetting('rightStickOpacity', parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* D-Pad Opacity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Cruceta D-Pad:</span>
                  <span className="text-sky-400 font-bold tabular-nums">
                    {Math.round(settings.dpadOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={Math.round(settings.dpadOpacity * 100)}
                  onChange={(e) => updateSetting('dpadOpacity', parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* Action Buttons Opacity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Botones de Acción (ABXY):</span>
                  <span className="text-yellow-400 font-bold tabular-nums">
                    {Math.round(settings.actionButtonsOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={Math.round(settings.actionButtonsOpacity * 100)}
                  onChange={(e) => updateSetting('actionButtonsOpacity', parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-yellow-500 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* Shoulders & Triggers Opacity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Gatillos y Hombros (LT/LB/RT/RB):</span>
                  <span className="text-purple-400 font-bold tabular-nums">
                    {Math.round(settings.shouldersOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={Math.round(settings.shouldersOpacity * 100)}
                  onChange={(e) => updateSetting('shouldersOpacity', parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* Rack Background Opacity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-gray-400" />
                    Fondo Gris del Chasis:
                  </span>
                  <span className="text-gray-300 font-bold tabular-nums">
                    {Math.round(settings.rackBackgroundOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={Math.round(settings.rackBackgroundOpacity * 100)}
                  onChange={(e) => updateSetting('rackBackgroundOpacity', parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-gray-400 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Sizes and Spacing (No Overlap) */}
          <div className="bg-[#141414] border border-[#262626] rounded-md p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#242424] pb-2">
              <span className="font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Maximize className="w-3.5 h-3.5" />
                Tamaños Dinámicos (Sin Superposición):
              </span>
              <span className="text-[10px] text-gray-500">Distribución auto-ajustable</span>
            </div>

            <div className="space-y-4 pt-1">
              {/* Stick Size */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Diámetro de los Joysticks:</span>
                  <span className="text-sky-400 font-bold tabular-nums">{settings.stickSize} px</span>
                </div>
                <input
                  type="range"
                  min="105"
                  max="175"
                  value={settings.stickSize}
                  onChange={(e) => updateSetting('stickSize', parseInt(e.target.value, 10))}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* Button & D-Pad Scale */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Escala de Botones ABXY y Cruceta:</span>
                  <span className="text-yellow-400 font-bold tabular-nums">
                    {settings.buttonScale.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="125"
                  value={Math.round(settings.buttonScale * 100)}
                  onChange={(e) => updateSetting('buttonScale', parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-yellow-500 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>

              {/* Rack Spacing */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">Espaciado Vertical (Evita que se toquen):</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{settings.rackSpacing} px</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="36"
                  value={settings.rackSpacing}
                  onChange={(e) => updateSetting('rackSpacing', parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-[#252525] rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#121212] border-t border-[#242424] flex items-center justify-between">
          <button
            onClick={() => onChange(DEFAULT_SETTINGS)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white px-2.5 py-1 bg-[#1c1c1c] border border-[#2d2d2d] rounded"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer Todo
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow transition-colors"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
