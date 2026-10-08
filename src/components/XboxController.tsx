import React from 'react';
import { AnalogStick } from './AnalogStick';
import { ActionDiamond, DPadCross, ShoulderTriggers, CenterControls } from './ControllerButtons';
import { GamepadCustomizationSettings } from '../types/gamepad';

interface XboxControllerProps {
  settings: GamepadCustomizationSettings;
  globalOpacity?: number;
  isPortrait?: boolean;
}

export const XboxController: React.FC<XboxControllerProps> = ({
  settings,
  globalOpacity = 1.0,
  isPortrait = false,
}) => {
  const {
    controllerLayoutMode = 'unified',
    leftStickOpacity,
    rightStickOpacity,
    dpadOpacity,
    actionButtonsOpacity,
    shouldersOpacity,
    centerControlsOpacity,
    rackBackgroundOpacity,
    stickSize,
    buttonScale,
    rackSpacing,
  } = settings;

  // Responsive scale down if screen is narrow in portrait
  const effectiveStickSize = isPortrait ? Math.min(stickSize, 120) : stickSize;
  const effectiveButtonScale = isPortrait ? Math.min(buttonScale, 0.92) : buttonScale;
  const effectiveSpacing = isPortrait ? Math.min(rackSpacing, 14) : rackSpacing;

  // Unified Xbox Chassis background & border styling
  const chassisBg = `rgba(24, 24, 24, ${rackBackgroundOpacity * 0.95})`;
  const chassisBorder = `rgba(52, 52, 52, ${rackBackgroundOpacity * 0.85})`;

  // =========================================================================
  // 1. UNIFIED CHASSIS MODE (Mando Xbox Completo con Cuerpo Integrado)
  // Joysticks y botones integrados en una misma carcasa ergonómica continua
  // =========================================================================
  if (controllerLayoutMode === 'unified') {
    return (
      <div
        style={{ opacity: globalOpacity }}
        className="w-full h-full flex flex-col items-center justify-center p-1 sm:p-3 select-none touch-none transition-opacity duration-150 overflow-hidden"
      >
        {/* Top Trigger Crown (LT / LB on Left, RT / RB on Right) */}
        <div className="w-full max-w-4xl flex items-center justify-between px-2 sm:px-6 mb-1 z-20">
          <div className="flex items-center gap-2">
            <ShoulderTriggers side="left" opacity={shouldersOpacity} />
          </div>
          
          {/* Subtle center indicator */}
          <div className="flex items-center gap-1.5 opacity-60 px-2 py-0.5 rounded bg-[#161616]/80 border border-[#2c2c2c] text-[10px] font-mono text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">CHASIS XBOX UNIFICADO</span>
            <span className="sm:hidden">XBOX</span>
          </div>

          <div className="flex items-center gap-2">
            <ShoulderTriggers side="right" opacity={shouldersOpacity} />
          </div>
        </div>

        {/* UNIFIED XBOX CONTROLLER BODY */}
        <div
          style={{
            backgroundColor: chassisBg,
            borderColor: chassisBorder,
            boxShadow: `0 16px 40px rgba(0, 0, 0, ${rackBackgroundOpacity * 0.9})`,
          }}
          className={`w-full max-w-4xl flex-1 max-h-[85vh] border rounded-lg sm:rounded-xl p-2 sm:p-4 backdrop-blur-md relative flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-150`}
        >
          {/* Outer ergonomic grip textures */}
          <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-[#2e2e2e]/40 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-l from-[#2e2e2e]/40 to-transparent pointer-events-none" />

          {/* Top Integrated Center Controls (View, Xbox Guide Logo, Menu) */}
          <div className="w-full flex items-center justify-center pt-1 pb-2 border-b border-[#2a2a2a]/60 z-10 pointer-events-auto">
            <CenterControls opacity={centerControlsOpacity} />
          </div>

          {/* MAIN FRONT FACEPLATE: ASYMMETRIC XBOX LAYOUT */}
          <div className="w-full flex-1 flex flex-row items-center justify-between gap-2 sm:gap-6 py-2 px-1 sm:px-4 pointer-events-none">
            
            {/* --- LEFT WING: Left Stick (Top) + D-Pad (Bottom) --- */}
            <div className="pointer-events-auto flex flex-col items-center justify-center flex-1 max-w-[45%]">
              <div
                className="flex flex-col items-center justify-center w-full"
                style={{ gap: `${effectiveSpacing}px` }}
              >
                {/* 1. Left Analog Stick (Arriba) */}
                <div className="flex flex-col items-center">
                  <AnalogStick
                    stickId={0}
                    label="STICK IZQ (LS)"
                    size={effectiveStickSize}
                    opacity={leftStickOpacity}
                  />
                </div>

                {/* 2. D-Pad Cruceta (Abajo) */}
                <div className="flex flex-col items-center">
                  <DPadCross opacity={dpadOpacity} scale={effectiveButtonScale} />
                  <span
                    style={{ opacity: dpadOpacity }}
                    className="text-[9px] font-mono text-gray-500 mt-1 font-bold uppercase tracking-wider hidden sm:block"
                  >
                    CRUCETA D-PAD
                  </span>
                </div>
              </div>
            </div>

            {/* --- CENTER BRIDGE: Ergonomic Core with subtle Parsec Status LED --- */}
            <div className="pointer-events-none flex flex-col items-center justify-center px-1 sm:px-4 text-center shrink-0">
              <div className="w-12 sm:w-20 h-1 rounded-full bg-[#2a2a2a] mb-2" />
              <div className="w-8 h-8 rounded-full border border-[#333333] bg-[#1a1a1a] flex items-center justify-center shadow-inner mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase hidden sm:block">
                P1 CONECTADO
              </span>
              <div className="w-12 sm:w-20 h-1 rounded-full bg-[#2a2a2a] mt-2" />
            </div>

            {/* --- RIGHT WING: Action Diamond ABXY (Top) + Right Stick (Bottom) --- */}
            <div className="pointer-events-auto flex flex-col items-center justify-center flex-1 max-w-[45%]">
              <div
                className="flex flex-col items-center justify-center w-full"
                style={{ gap: `${effectiveSpacing}px` }}
              >
                {/* 1. Action Diamond ABXY (Arriba) */}
                <div className="flex flex-col items-center">
                  <span
                    style={{ opacity: actionButtonsOpacity }}
                    className="text-[9px] font-mono text-gray-500 mb-1 font-bold uppercase tracking-wider hidden sm:block"
                  >
                    BOTONES ABXY
                  </span>
                  <ActionDiamond opacity={actionButtonsOpacity} scale={effectiveButtonScale} />
                </div>

                {/* 2. Right Analog Stick (Abajo) */}
                <div className="flex flex-col items-center">
                  <AnalogStick
                    stickId={1}
                    label="STICK DER (RS)"
                    size={effectiveStickSize}
                    opacity={rightStickOpacity}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Ergonomic Chin / Bevel */}
          <div className="w-full flex items-center justify-between pt-1 text-[9px] font-mono text-gray-500 border-t border-[#262626]/50 px-2 pointer-events-none">
            <span className="tracking-wider">GRIP IZQUIERDO</span>
            <span className="tracking-widest text-emerald-500/80 font-bold uppercase">XBOX ASYMMETRIC CONTROLLER</span>
            <span className="tracking-wider">GRIP DERECHO</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SPLIT RACK MODE (Laterales Flotantes con Centro Abierto)
  // Permite ver el stream completo al 100% en el centro de la pantalla
  // =========================================================================
  const gripChassisStyle: React.CSSProperties = {
    backgroundColor: chassisBg,
    borderColor: chassisBorder,
    boxShadow: `0 12px 36px rgba(0, 0, 0, ${rackBackgroundOpacity * 0.85})`,
  };

  return (
    <div
      style={{ opacity: globalOpacity }}
      className="w-full h-full max-w-[100vw] flex flex-col justify-between p-2 sm:p-4 select-none touch-none transition-opacity duration-150 overflow-hidden"
    >
      {/* Top Center Controls Bar (View, Xbox Guide, Menu) */}
      <div className="w-full flex items-center justify-center pointer-events-auto z-20 mb-1">
        <CenterControls opacity={centerControlsOpacity} />
      </div>

      {/* Main Horizontal Layout: Split Left Grip and Split Right Grip */}
      <div className="w-full flex-1 flex flex-row items-stretch justify-between gap-3 sm:gap-6 pointer-events-none">
        {/* LEFT GRIP */}
        <div
          style={gripChassisStyle}
          className="pointer-events-auto flex flex-col items-center justify-between border rounded-md p-3 sm:p-5 backdrop-blur-md shrink-0 transition-all duration-150 shadow-2xl relative overflow-hidden"
        >
          <div className="w-full flex flex-col items-center pb-2 border-b border-[#2e2e2e]/70 mb-1">
            <div className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
              <span>HOMBRO IZQ</span>
            </div>
            <ShoulderTriggers side="left" opacity={shouldersOpacity} />
          </div>

          <div
            className="flex flex-col items-center justify-center flex-1 w-full"
            style={{ gap: `${effectiveSpacing}px` }}
          >
            <div className="flex flex-col items-center">
              <AnalogStick
                stickId={0}
                label="STICK IZQ (LS)"
                size={effectiveStickSize}
                opacity={leftStickOpacity}
              />
            </div>

            <div className="flex flex-col items-center">
              <DPadCross opacity={dpadOpacity} scale={effectiveButtonScale} />
            </div>
          </div>
        </div>

        {/* CENTER VIEWPORT GAP */}
        <div className="flex-1 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
          <div className="hidden lg:flex flex-col items-center gap-1 opacity-25 hover:opacity-80 transition-opacity">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              Área de Transmisión Parsec
            </span>
          </div>
        </div>

        {/* RIGHT GRIP */}
        <div
          style={gripChassisStyle}
          className="pointer-events-auto flex flex-col items-center justify-between border rounded-md p-3 sm:p-5 backdrop-blur-md shrink-0 transition-all duration-150 shadow-2xl relative overflow-hidden"
        >
          <div className="w-full flex flex-col items-center pb-2 border-b border-[#2e2e2e]/70 mb-1">
            <div className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
              <span>HOMBRO DER</span>
            </div>
            <ShoulderTriggers side="right" opacity={shouldersOpacity} />
          </div>

          <div
            className="flex flex-col items-center justify-center flex-1 w-full"
            style={{ gap: `${effectiveSpacing}px` }}
          >
            <div className="flex flex-col items-center">
              <ActionDiamond opacity={actionButtonsOpacity} scale={effectiveButtonScale} />
            </div>

            <div className="flex flex-col items-center">
              <AnalogStick
                stickId={1}
                label="STICK DER (RS)"
                size={effectiveStickSize}
                opacity={rightStickOpacity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
