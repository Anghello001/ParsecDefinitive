/**
 * Android Keycodes & Gamepad Definitions for Parsec WebView Controller
 */

export const ANDROID_KEYCODES = {
  // Action Buttons
  KEYCODE_BUTTON_A: 96,
  KEYCODE_BUTTON_B: 97,
  KEYCODE_BUTTON_C: 98,
  KEYCODE_BUTTON_X: 99,
  KEYCODE_BUTTON_Y: 100,
  KEYCODE_BUTTON_Z: 101,

  // Shoulder & Triggers
  KEYCODE_BUTTON_L1: 102, // LB
  KEYCODE_BUTTON_R1: 103, // RB
  KEYCODE_BUTTON_L2: 104, // LT digital
  KEYCODE_BUTTON_R2: 105, // RT digital

  // Stick Clicks
  KEYCODE_BUTTON_THUMBL: 106, // LS / L3
  KEYCODE_BUTTON_THUMBR: 107, // RS / R3

  // Menu & System
  KEYCODE_BUTTON_START: 108,  // Menu / Start
  KEYCODE_BUTTON_SELECT: 109, // View / Back
  KEYCODE_BUTTON_MODE: 110,   // Xbox Guide

  // D-Pad
  KEYCODE_DPAD_UP: 19,
  KEYCODE_DPAD_DOWN: 20,
  KEYCODE_DPAD_LEFT: 21,
  KEYCODE_DPAD_RIGHT: 22,
  KEYCODE_DPAD_CENTER: 23,
} as const;

export type GamepadButtonKey = keyof typeof ANDROID_KEYCODES;

export interface GamepadEventLog {
  id: string;
  timestamp: number;
  type: 'KEY_DOWN' | 'KEY_UP' | 'AXIS_MOVE' | 'TRIGGER' | 'ADB_PAIR' | 'APP_LAUNCH';
  codeName: string;
  keyCode: number;
  value?: number;
  details?: string;
}

export interface StickVector {
  x: number; // -1.0 to 1.0
  y: number; // -1.0 to 1.0
  angle: number; // 0 to 360
  distance: number; // 0 to 1
}

export interface InstalledApp {
  name: string;
  packageName: string;
  category: 'streaming' | 'emulator' | 'remote' | 'game';
  icon: string; // Lucide icon identifier or initials
  color: string;
  description: string;
}

export interface AdbPairingState {
  ip: string;
  port: string;
  pairingCode: string;
  status: 'disconnected' | 'pairing' | 'connected' | 'error';
  lastLog?: string;
  connectedPort?: string;
}

export interface GamepadCustomizationSettings {
  // Individual opacities (0.1 to 1.0)
  leftStickOpacity: number;
  rightStickOpacity: number;
  dpadOpacity: number;
  actionButtonsOpacity: number;
  shouldersOpacity: number;
  centerControlsOpacity: number;
  rackBackgroundOpacity: number;

  // Individual size scales (without overlapping)
  stickSize: number;       // base stick diameter in px (e.g. 110 to 180)
  buttonScale: number;     // scale multiplier for ABXY & D-Pad (e.g. 0.8 to 1.3)
  rackSpacing: number;     // vertical gap between stick and cruceta/buttons (e.g. 12 to 36px)
}
