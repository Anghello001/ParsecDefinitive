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

  // Background style for the dark gray translucent rack pads overlaid on Parsec
  const rackBgStyle: React.CSSProperties = {
    backgroundColor: `rgba(26, 26, 26, ${rackBackgroundOpacity * 0.92})`,
    borderColor: `rgba(60, 60, 60, ${rackBackgroundOpacity * 0.85})`,
    boxShadow: `0 8px 32px rgba(0, 0, 0, ${rackBackgroundOpacity * 0.7})`,
  };

  return (
    <div
      style={{ opacity: globalOpacity }}
      className="w-full h-full max-w-[100vw] flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none touch-none transition-opacity duration-150 overflow-hidden"
    >
      {/* Top Center Controls Bar (View, Xbox Guide, Menu) */}
      <div className="w-full flex items-center justify-center pointer-events-auto z-20 mb-1">
        <CenterControls opacity={centerControlsOpacity} />
      </div>

      {/* Main Horizontal Rack Layout: Left Wing on Left edge, Right Wing on Right edge */}
      <div className="w-full flex-1 flex flex-row items-stretch justify-between gap-4 pointer-events-none">
        {/* ========================================================= */}
        {/* LEFT WING / RACK (Ala Izquierda Xbox)                     */}
        {/* 1. Hombro Izquierdo (LT / LB)                             */}
        {/* 2. Joystick Izquierdo (LS) arriba                         */}
        {/* 3. Cruceta D-Pad abajo                                    */}
        {/* ========================================================= */}
        <div
          style={rackBgStyle}
          className="pointer-events-auto flex flex-col items-center justify-between border rounded-sm p-3 sm:p-4 backdrop-blur-md shrink-0 transition-all duration-150"
        >
          {/* Top of Left Rack: Shoulder LB / LT */}
          <div className="w-full flex flex-col items-center pb-2 border-b border-[#2d2d2d]/60 mb-2">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">
              LT / LB
            </span>
            <ShoulderTriggers side="left" opacity={shouldersOpacity} />
          </div>

          {/* Body of Left Rack: Joystick Arriba + Cruceta Abajo */}
          <div
            className="flex flex-col items-center justify-center flex-1"
            style={{ gap: `${rackSpacing}px` }}
          >
            {/* 1. Left Analog Stick (Arriba) */}
            <div className="flex flex-col items-center">
              <AnalogStick
                stickId={0}
                label="LS (L3)"
                size={stickSize}
                opacity={leftStickOpacity}
              />
            </div>

            {/* Subtle separator line between Stick and D-Pad */}
            <div className="w-16 h-px bg-[#333333]/40" />

            {/* 2. D-Pad Cruceta (Abajo) */}
            <div className="flex flex-col items-center">
              <span
                style={{ opacity: dpadOpacity }}
                className="text-[9px] font-mono text-gray-400 mb-1 font-bold uppercase tracking-wider"
              >
                Cruceta D-Pad
              </span>
              <DPadCross opacity={dpadOpacity} scale={buttonScale} />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER VIEWPORT GAP: Mantiene visible el stream de Parsec */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col items-center justify-center pointer-events-none px-2 text-center">
          <div className="hidden lg:flex flex-col items-center gap-1 opacity-20 hover:opacity-80 transition-opacity">
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              Área de Streaming Parsec
            </span>
            <span className="text-[9px] font-mono text-gray-400">
              Mando Xbox en modo rack horizontal (Izquierda / Derecha)
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT WING / RACK (Ala Derecha Xbox)                      */}
        {/* 1. Hombro Derecho (RT / RB)                               */}
        {/* 2. Botones de Acción (ABXY) arriba                        */}
        {/* 3. Joystick Derecho (RS) abajo                            */}
        {/* ========================================================= */}
        <div
          style={rackBgStyle}
          className="pointer-events-auto flex flex-col items-center justify-between border rounded-sm p-3 sm:p-4 backdrop-blur-md shrink-0 transition-all duration-150"
        >
          {/* Top of Right Rack: Shoulder RB / RT */}
          <div className="w-full flex flex-col items-center pb-2 border-b border-[#2d2d2d]/60 mb-2">
            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">
              RT / RB
            </span>
            <ShoulderTriggers side="right" opacity={shouldersOpacity} />
          </div>

          {/* Body of Right Rack: Botones ABXY Arriba + Joystick Abajo */}
          <div
            className="flex flex-col items-center justify-center flex-1"
            style={{ gap: `${rackSpacing}px` }}
          >
            {/* 1. Action Diamond (Arriba) */}
            <div className="flex flex-col items-center">
              <span
                style={{ opacity: actionButtonsOpacity }}
                className="text-[9px] font-mono text-gray-400 mb-1 font-bold uppercase tracking-wider"
              >
                Botones ABXY
              </span>
              <ActionDiamond opacity={actionButtonsOpacity} scale={buttonScale} />
            </div>

            {/* Subtle separator line between Buttons and Stick */}
            <div className="w-16 h-px bg-[#333333]/40" />

            {/* 2. Right Analog Stick (Abajo) */}
            <div className="flex flex-col items-center">
              <AnalogStick
                stickId={1}
                label="RS (R3)"
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
