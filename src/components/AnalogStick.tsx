import React, { useRef, useState, useEffect, useCallback } from 'react';
import { nativeBridge } from '../utils/nativeBridge';
import { ANDROID_KEYCODES, StickVector } from '../types/gamepad';
import { haptics } from '../utils/audio';

interface AnalogStickProps {
  stickId: 0 | 1; // 0 = Left (LS), 1 = Right (RS)
  label: string;
  size?: number; // Base diameter in pixels
  opacity?: number; // Individual opacity 0.1 to 1.0
  onVectorChange?: (vector: StickVector) => void;
}

export const AnalogStick: React.FC<AnalogStickProps> = ({
  stickId,
  label,
  size = 140,
  opacity = 1.0,
  onVectorChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [isThumbClick, setIsThumbClick] = useState(false);
  const [vector, setVector] = useState<StickVector>({ x: 0, y: 0, angle: 0, distance: 0 });
  const activeTouchIdRef = useRef<number | null>(null);

  const radius = size / 2;
  const knobRadius = size * 0.28;
  const maxDistance = radius - knobRadius;
  const deadzone = 0.12;

  const updateStickPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const rawDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDistance = Math.min(rawDistance, maxDistance);
    const angle = Math.atan2(deltaY, deltaX);

    let normalizedDist = clampedDistance / maxDistance;
    let normX = 0;
    let normY = 0;

    if (normalizedDist < deadzone) {
      normX = 0;
      normY = 0;
      normalizedDist = 0;
    } else {
      // Re-scale from deadzone to 1.0
      const scaledDist = (normalizedDist - deadzone) / (1 - deadzone);
      normX = Math.cos(angle) * scaledDist;
      normY = Math.sin(angle) * scaledDist;
    }

    const knobX = Math.cos(angle) * clampedDistance;
    const knobY = Math.sin(angle) * clampedDistance;

    setKnobPos({ x: knobX, y: knobY });

    const newVector: StickVector = {
      x: normX,
      y: normY,
      angle: (angle * 180 / Math.PI + 360) % 360,
      distance: normalizedDist,
    };
    setVector(newVector);
    onVectorChange?.(newVector);

    // Send native motion event
    nativeBridge.sendMotionEvent(normX, normY, stickId);
  }, [maxDistance, deadzone, onVectorChange, stickId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (activeTouchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    activeTouchIdRef.current = touch.identifier;
    setIsPressed(true);
    updateStickPosition(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === activeTouchIdRef.current) {
        updateStickPosition(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const resetStick = useCallback(() => {
    activeTouchIdRef.current = null;
    setIsPressed(false);
    setKnobPos({ x: 0, y: 0 });
    const zeroVector = { x: 0, y: 0, angle: 0, distance: 0 };
    setVector(zeroVector);
    onVectorChange?.(zeroVector);
    nativeBridge.sendMotionEvent(0, 0, stickId);
  }, [onVectorChange, stickId]);

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeTouchIdRef.current) {
        resetStick();
        break;
      }
    }
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(true);
    updateStickPosition(e.clientX, e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      updateStickPosition(moveEvent.clientX, moveEvent.clientY);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      resetStick();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // L3 / R3 Stick Button Click
  const toggleStickClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const keyCode = stickId === 0 
      ? ANDROID_KEYCODES.KEYCODE_BUTTON_THUMBL 
      : ANDROID_KEYCODES.KEYCODE_BUTTON_THUMBR;
    
    setIsThumbClick(true);
    haptics.playClick('heavy');
    nativeBridge.sendKeyEvent(keyCode, 0);

    setTimeout(() => {
      setIsThumbClick(false);
      nativeBridge.sendKeyEvent(keyCode, 1);
    }, 150);
  };

  return (
    <div
      style={{ opacity }}
      className="flex flex-col items-center select-none touch-none transition-opacity duration-150"
    >
      {/* Outer base container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`relative flex items-center justify-center bg-[#181818] border border-[#2d2d2d] rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] cursor-pointer transition-colors ${
          isPressed ? 'border-[#404040] shadow-[0_0_12px_rgba(0,0,0,0.5)]' : ''
        }`}
      >
        {/* Subtle crosshair guide markings */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
          <div className="w-full h-px bg-[#4a4a4a]" />
          <div className="h-full w-px bg-[#4a4a4a] absolute" />
          <div className="w-16 h-16 border border-[#4a4a4a] rounded-full absolute" />
        </div>

        {/* Thumbstick Knob */}
        <div
          style={{
            width: `${knobRadius * 2}px`,
            height: `${knobRadius * 2}px`,
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: isPressed ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1)',
          }}
          className={`relative rounded-full flex items-center justify-center border transition-shadow shadow-md ${
            isThumbClick
              ? 'bg-[#107c10] border-[#00d632] shadow-[0_0_10px_rgba(16,124,16,0.8)]'
              : isPressed
              ? 'bg-[#2a2a2a] border-[#4f4f4f] shadow-[0_3px_10px_rgba(0,0,0,0.9)]'
              : 'bg-[#222222] border-[#383838]'
          }`}
        >
          {/* Subtle concentric grip rings on top */}
          <div className="w-7 h-7 rounded-full border border-[#333333] flex items-center justify-center bg-[#1a1a1a]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a] border border-[#444444]" />
          </div>

          {/* Quick L3/R3 click trigger */}
          <button
            title={`Presionar ${label} (Stick Click ${stickId === 0 ? 'LS' : 'RS'})`}
            onClick={toggleStickClick}
            className="absolute -top-1 -right-1 text-[9px] font-mono font-bold bg-[#1e1e1e] border border-[#383838] px-1.5 py-0.5 rounded text-gray-400 hover:text-white active:bg-emerald-600 transition-colors shadow"
          >
            {stickId === 0 ? 'L3' : 'R3'}
          </button>
        </div>
      </div>

      {/* Axis Vector Readout & Stick Label */}
      <div className="mt-1.5 flex items-center justify-between w-full px-1 text-[10px] font-mono text-gray-400">
        <span className="font-semibold text-gray-300 tracking-wider">{label}</span>
        <span className="tabular-nums text-gray-500">
          X:{vector.x >= 0 ? `+${vector.x.toFixed(2)}` : vector.x.toFixed(2)}{' '}
          Y:{vector.y >= 0 ? `+${vector.y.toFixed(2)}` : vector.y.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
