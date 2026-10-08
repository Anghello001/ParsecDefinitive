import React, { useState } from 'react';
import { ANDROID_KEYCODES, GamepadButtonKey } from '../types/gamepad';
import { nativeBridge } from '../utils/nativeBridge';

interface ButtonPressState {
  [key: string]: boolean;
}

// Reusable single gamepad button with touchstart/touchend
export const GamepadButton: React.FC<{
  buttonKey: GamepadButtonKey;
  label: string;
  subLabel?: string;
  className?: string;
  accentColor?: string;
  badgeDotColor?: string;
}> = ({ buttonKey, label, subLabel, className = '', badgeDotColor }) => {
  const [pressed, setPressed] = useState(false);

  const handlePressDown = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (pressed) return;
    setPressed(true);
    nativeBridge.sendKeyEvent(buttonKey, 0); // ACTION_DOWN
  };

  const handlePressUp = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!pressed) return;
    setPressed(false);
    nativeBridge.sendKeyEvent(buttonKey, 1); // ACTION_UP
  };

  return (
    <button
      type="button"
      onTouchStart={handlePressDown}
      onTouchEnd={handlePressUp}
      onTouchCancel={handlePressUp}
      onMouseDown={handlePressDown}
      onMouseUp={handlePressUp}
      onMouseLeave={handlePressUp}
      aria-label={label}
      className={`relative select-none touch-none font-mono text-center transition-all duration-75 flex flex-col items-center justify-center border ${
        pressed
          ? 'bg-[#333333] border-[#555555] translate-y-0.5 text-white shadow-inner shadow-black'
          : 'bg-[#222222] hover:bg-[#282828] border-[#333333] text-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.6)]'
      } ${className}`}
    >
      {badgeDotColor && (
        <span
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: badgeDotColor }}
        />
      )}
      <span className="font-bold tracking-wider leading-none">{label}</span>
      {subLabel && (
        <span className="text-[9px] text-gray-500 font-normal leading-none mt-0.5">
          {subLabel}
        </span>
      )}
    </button>
  );
};

// Xbox Action Buttons Diamond (A, B, X, Y)
export const ActionDiamond: React.FC<{ opacity?: number; scale?: number }> = ({
  opacity = 1.0,
  scale = 1.0,
}) => {
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
      className="relative w-36 h-36 flex items-center justify-center bg-[#181818] border border-[#2d2d2d] rounded-sm p-1.5 shadow-[inset_0_1px_6px_rgba(0,0,0,0.6)] transition-all duration-150"
    >
      {/* Subtle diagonal grid accents */}
      <div className="absolute inset-2 border border-[#262626] rounded-sm pointer-events-none opacity-40" />

      {/* Y Button (Top) */}
      <div className="absolute top-1.5">
        <GamepadButton
          buttonKey="KEYCODE_BUTTON_Y"
          label="Y"
          badgeDotColor="#eab308" // Yellow Xbox accent
          className="w-10 h-10 rounded-sm text-base text-yellow-400 font-sans font-black"
        />
      </div>

      {/* X Button (Left) */}
      <div className="absolute left-1.5">
        <GamepadButton
          buttonKey="KEYCODE_BUTTON_X"
          label="X"
          badgeDotColor="#38bdf8" // Blue Xbox accent
          className="w-10 h-10 rounded-sm text-base text-sky-400 font-sans font-black"
        />
      </div>

      {/* B Button (Right) */}
      <div className="absolute right-1.5">
        <GamepadButton
          buttonKey="KEYCODE_BUTTON_B"
          label="B"
          badgeDotColor="#ef4444" // Red Xbox accent
          className="w-10 h-10 rounded-sm text-base text-red-400 font-sans font-black"
        />
      </div>

      {/* A Button (Bottom) */}
      <div className="absolute bottom-1.5">
        <GamepadButton
          buttonKey="KEYCODE_BUTTON_A"
          label="A"
          badgeDotColor="#22c55e" // Green Xbox accent
          className="w-10 h-10 rounded-sm text-base text-green-400 font-sans font-black"
        />
      </div>

      {/* Center Xbox Diamond Hub */}
      <div className="w-5 h-5 bg-[#151515] border border-[#2a2a2a] rounded-sm flex items-center justify-center pointer-events-none">
        <div className="w-1.5 h-1.5 bg-[#3a3a3a] rounded-sm" />
      </div>
    </div>
  );
};

// Xbox D-Pad Cross (Up, Down, Left, Right)
export const DPadCross: React.FC<{ opacity?: number; scale?: number }> = ({
  opacity = 1.0,
  scale = 1.0,
}) => {
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      }}
      className="relative w-36 h-36 flex items-center justify-center bg-[#181818] border border-[#2d2d2d] rounded-sm p-1.5 shadow-[inset_0_1px_6px_rgba(0,0,0,0.6)] transition-all duration-150"
    >
      {/* Up */}
      <div className="absolute top-1.5">
        <GamepadButton
          buttonKey="KEYCODE_DPAD_UP"
          label="▲"
          className="w-10 h-10 rounded-sm text-sm text-gray-300"
        />
      </div>

      {/* Down */}
      <div className="absolute bottom-1.5">
        <GamepadButton
          buttonKey="KEYCODE_DPAD_DOWN"
          label="▼"
          className="w-10 h-10 rounded-sm text-sm text-gray-300"
        />
      </div>

      {/* Left */}
      <div className="absolute left-1.5">
        <GamepadButton
          buttonKey="KEYCODE_DPAD_LEFT"
          label="◀"
          className="w-10 h-10 rounded-sm text-sm text-gray-300"
        />
      </div>

      {/* Right */}
      <div className="absolute right-1.5">
        <GamepadButton
          buttonKey="KEYCODE_DPAD_RIGHT"
          label="▶"
          className="w-10 h-10 rounded-sm text-sm text-gray-300"
        />
      </div>

      {/* Center D-Pad pivot plate */}
      <div className="w-8 h-8 bg-[#161616] border border-[#2e2e2e] rounded-sm flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-[#252525] rounded-sm border border-[#333333]" />
      </div>
    </div>
  );
};

// Shoulder Bumpers and Triggers (LB, LT, RB, RT)
export const ShoulderTriggers: React.FC<{ side: 'left' | 'right'; opacity?: number }> = ({
  side,
  opacity = 1.0,
}) => {
  const isLeft = side === 'left';
  const bumperKey = isLeft ? 'KEYCODE_BUTTON_L1' : 'KEYCODE_BUTTON_R1';
  const triggerKey = isLeft ? 'KEYCODE_BUTTON_L2' : 'KEYCODE_BUTTON_R2';
  const bumperLabel = isLeft ? 'LB' : 'RB';
  const triggerLabel = isLeft ? 'LT' : 'RT';
  const triggerId = isLeft ? 0 : 1;

  const [triggerValue, setTriggerValue] = useState(0);
  const [triggerActive, setTriggerActive] = useState(false);

  const handleTriggerStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setTriggerActive(true);
    setTriggerValue(1.0);
    nativeBridge.sendTriggerEvent(triggerId, 1.0);
    nativeBridge.sendKeyEvent(triggerKey, 0);
  };

  const handleTriggerEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setTriggerActive(false);
    setTriggerValue(0.0);
    nativeBridge.sendTriggerEvent(triggerId, 0.0);
    nativeBridge.sendKeyEvent(triggerKey, 1);
  };

  return (
    <div
      style={{ opacity }}
      className={`flex items-center gap-2 transition-opacity duration-150 ${
        isLeft ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Analog Trigger (LT / RT) with pressure indicator */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onTouchStart={handleTriggerStart}
          onTouchEnd={handleTriggerEnd}
          onTouchCancel={handleTriggerEnd}
          onMouseDown={handleTriggerStart}
          onMouseUp={handleTriggerEnd}
          onMouseLeave={handleTriggerEnd}
          className={`relative w-16 h-12 rounded-sm border select-none touch-none flex flex-col items-center justify-center transition-all ${
            triggerActive
              ? 'bg-[#303030] border-[#00d632] translate-y-0.5 text-white shadow-[0_0_8px_rgba(0,214,50,0.3)]'
              : 'bg-[#202020] hover:bg-[#252525] border-[#303030] text-gray-200'
          }`}
        >
          {/* Pressure bar */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#107c10] opacity-40 transition-all duration-75"
            style={{ height: `${triggerValue * 100}%` }}
          />
          <span className="font-bold font-mono text-sm tracking-wider z-10">{triggerLabel}</span>
          <span className="text-[9px] font-mono text-gray-500 z-10">ANALOG</span>
        </button>
      </div>

      {/* Digital Shoulder Bumper (LB / RB) */}
      <GamepadButton
        buttonKey={bumperKey}
        label={bumperLabel}
        subLabel="BUMPER"
        className="w-16 h-12 rounded-sm text-sm"
      />
    </div>
  );
};

// Center Auxiliary Buttons (View, Xbox Guide, Menu)
export const CenterControls: React.FC<{ opacity?: number }> = ({ opacity = 1.0 }) => {
  return (
    <div
      style={{ opacity }}
      className="flex items-center gap-3 bg-[#161616] border border-[#2b2b2b] px-3 py-1.5 rounded-sm shadow-md transition-opacity duration-150"
    >
      {/* View / Back / Select */}
      <GamepadButton
        buttonKey="KEYCODE_BUTTON_SELECT"
        label="⧉"
        subLabel="VIEW"
        className="w-11 h-9 rounded-sm text-sm"
      />

      {/* Xbox Guide / Mode (Special center jewel button) */}
      <GamepadButton
        buttonKey="KEYCODE_BUTTON_MODE"
        label="✕"
        subLabel="XBOX"
        badgeDotColor="#107c10"
        className="w-12 h-10 rounded-sm text-base text-gray-100 border-[#383838] bg-[#222222] font-black"
      />

      {/* Menu / Start */}
      <GamepadButton
        buttonKey="KEYCODE_BUTTON_START"
        label="☰"
        subLabel="MENU"
        className="w-11 h-9 rounded-sm text-sm"
      />
    </div>
  );
};
