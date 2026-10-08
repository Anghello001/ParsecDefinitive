import React from 'react';
import { AnalogStick } from './AnalogStick';
import { ActionDiamond, DPadCross, ShoulderTriggers, CenterControls } from './ControllerButtons';
import { GamepadCustomizationSettings } from '../types/gamepad';

interface XboxControllerProps {
  settings: GamepadCustomizationSettings;
  globalOpacity?: number;
}

export const XboxController: React.FC<XboxControllerProps> = ({
  settings,
  globalOpacity = 1.0,
}) => {
  const {
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

  // Unified Xbox Grip Chassis styling with ergonomic dark-gray surface
  const gripChassisStyle: React.CSSProperties = {
    backgroundColor: `rgba(24, 24, 24, ${rackBackgroundOpacity * 0.94})`,
    borderColor: `rgba(56, 56, 56, ${rackBackgroundOpacity * 0.9})`,
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

      {/* Main Horizontal Layout: Unified Left Grip and Unified Right Grip */}
      <div className="w-full flex-1 flex flex-row items-stretch justify-between gap-4 pointer-events-none">
        {/* ========================================================= */}
        {/* LEFT UNIFIED XBOX GRIP (Chasis Unificado Izquierdo)       */}
        {/* Un solo cuerpo sólido y continuo:                         */}
        {/* - Corona superior: Gatillo LT + Bumper LB integrados      */}
        {/* - Cara frontal: Joystick Izquierdo arriba + D-Pad abajo   */}
        {/* ========================================================= */}
        <div
          style={gripChassisStyle}
          className="pointer-events-auto flex flex-col items-center justify-between border rounded-sm sm:rounded-md p-3.5 sm:p-5 backdrop-blur-md shrink-0 transition-all duration-150 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle textured edge grip accent */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-[#333333] to-transparent opacity-60" />

          {/* Crown: Shoulder Bumper LB and Trigger LT */}
          <div className="w-full flex flex-col items-center pb-2.5 border-b border-[#2e2e2e]/70 mb-2">
            <div className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <span>HOMBRO IZQUIERDO</span>
            </div>
            <ShoulderTriggers side="left" opacity={shouldersOpacity} />
          </div>

          {/* Unified Body Faceplate: Left Stick (Top) + D-Pad (Bottom) */}
          <div
            className="flex flex-col items-center justify-center flex-1 w-full"
            style={{ gap: `${rackSpacing}px` }}
          >
            {/* 1. Left Analog Stick (Arriba) */}
            <div className="flex flex-col items-center">
              <AnalogStick
                stickId={0}
                label="STICK IZQ (LS)"
                size={stickSize}
                opacity={leftStickOpacity}
              />
            </div>

            {/* 2. D-Pad Cruceta (Abajo) en la misma superficie continua */}
            <div className="flex flex-col items-center">
              <DPadCross opacity={dpadOpacity} scale={buttonScale} />
              <span
                style={{ opacity: dpadOpacity }}
                className="text-[9px] font-mono text-gray-500 mt-1 font-bold uppercase tracking-wider"
              >
                CRUCETA D-PAD
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER VIEWPORT GAP: Mantiene visible el stream de Parsec */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
          <div className="hidden lg:flex flex-col items-center gap-1 opacity-25 hover:opacity-80 transition-opacity">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              Área de Transmisión Parsec
            </span>
            <span className="text-[9px] font-mono text-gray-400">
              Chasis Unificado Xbox a los laterales para jugar sobre la app externa
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT UNIFIED XBOX GRIP (Chasis Unificado Derecho)        */}
        {/* Un solo cuerpo sólido y continuo:                         */}
        {/* - Corona superior: Gatillo RT + Bumper RB integrados      */}
        {/* - Cara frontal: Botones ABXY arriba + Joystick Der abajo  */}
        {/* ========================================================= */}
        <div
          style={gripChassisStyle}
          className="pointer-events-auto flex flex-col items-center justify-between border rounded-sm sm:rounded-md p-3.5 sm:p-5 backdrop-blur-md shrink-0 transition-all duration-150 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle textured edge grip accent */}
          <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-[#333333] to-transparent opacity-60" />

          {/* Crown: Shoulder Bumper RB and Trigger RT */}
          <div className="w-full flex flex-col items-center pb-2.5 border-b border-[#2e2e2e]/70 mb-2">
            <div className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <span>HOMBRO DERECHO</span>
            </div>
            <ShoulderTriggers side="right" opacity={shouldersOpacity} />
          </div>

          {/* Unified Body Faceplate: Action Diamond ABXY (Top) + Right Stick (Bottom) */}
          <div
            className="flex flex-col items-center justify-center flex-1 w-full"
            style={{ gap: `${rackSpacing}px` }}
          >
            {/* 1. Action Diamond ABXY (Arriba) */}
            <div className="flex flex-col items-center">
              <span
                style={{ opacity: actionButtonsOpacity }}
                className="text-[9px] font-mono text-gray-500 mb-1 font-bold uppercase tracking-wider"
              >
                BOTONES ABXY
              </span>
              <ActionDiamond opacity={actionButtonsOpacity} scale={buttonScale} />
            </div>

            {/* 2. Right Analog Stick (Abajo) en la misma superficie continua */}
            <div className="flex flex-col items-center">
              <AnalogStick
                stickId={1}
                label="STICK DER (RS)"
                size={stickSize}
                opacity={rightStickOpacity}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
