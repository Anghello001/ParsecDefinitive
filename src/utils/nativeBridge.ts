/**
 * Android WebView Bridge Interface & Simulation Fallback
 */
import { ANDROID_KEYCODES, GamepadButtonKey, GamepadEventLog } from '../types/gamepad';
import { haptics } from './audio';

// Android JavascriptInterface Declaration
export interface AndroidNativeInterface {
  sendKeyEvent?: (keyCode: number, action: number) => void;
  sendMotionEvent?: (axisX: number, axisY: number, stickId: number) => void;
  sendTriggerEvent?: (triggerId: number, value: number) => void;
  pairAdb?: (ip: string, port: string, code: string) => boolean | string;
  launchApp?: (packageName: string) => boolean;
  getInstalledApps?: () => string;
  setOverlayOpacity?: (alpha: number) => void;
  setClickthrough?: (enabled: boolean) => void;
  closeOverlay?: () => void;
  vibrate?: (ms: number) => void;
}

declare global {
  interface Window {
    Android?: AndroidNativeInterface;
  }
}

type EventLogListener = (log: GamepadEventLog) => void;
type AdbStatusListener = (status: { connected: boolean; message: string }) => void;

class NativeBridgeManager {
  private logListeners: Set<EventLogListener> = new Set();
  private adbStatusListeners: Set<AdbStatusListener> = new Set();
  public isAdbConnected: boolean = false;
  public logs: GamepadEventLog[] = [];
  private maxLogs = 100;

  public isNative(): boolean {
    return typeof window !== 'undefined' && typeof window.Android !== 'undefined';
  }

  public addLogListener(listener: EventLogListener): () => void {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  public addAdbStatusListener(listener: AdbStatusListener): () => void {
    this.adbStatusListeners.add(listener);
    return () => this.adbStatusListeners.delete(listener);
  }

  private dispatchLog(log: GamepadEventLog) {
    this.logs.unshift(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    this.logListeners.forEach(listener => listener(log));
  }

  /**
   * Send hardware gamepad key event to Android
   * action: 0 = ACTION_DOWN, 1 = ACTION_UP
   */
  public sendKeyEvent(buttonKey: GamepadButtonKey | number, action: 0 | 1): void {
    let keyCode: number;
    let codeName: string;

    if (typeof buttonKey === 'number') {
      keyCode = buttonKey;
      const foundName = Object.entries(ANDROID_KEYCODES).find(([, code]) => code === keyCode)?.[0];
      codeName = foundName || `CUSTOM_KEY_${keyCode}`;
    } else {
      keyCode = ANDROID_KEYCODES[buttonKey];
      codeName = buttonKey;
    }

    if (action === 0) {
      haptics.playClick('down');
      haptics.vibrate(12);
    } else {
      haptics.playClick('up');
    }

    // Call Native Bridge if available
    if (this.isNative() && window.Android?.sendKeyEvent) {
      try {
        window.Android.sendKeyEvent(keyCode, action);
      } catch (err) {
        console.error('Error invoking Android.sendKeyEvent', err);
      }
    }

    const log: GamepadEventLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type: action === 0 ? 'KEY_DOWN' : 'KEY_UP',
      codeName,
      keyCode,
      details: `Action: ${action === 0 ? 'ACTION_DOWN (0)' : 'ACTION_UP (1)'} -> ADB cmd: input keyevent ${keyCode}`,
    };

    this.dispatchLog(log);
  }

  /**
   * Send analog stick motion event
   * stickId: 0 for Left Thumbstick, 1 for Right Thumbstick
   */
  public sendMotionEvent(axisX: number, axisY: number, stickId: 0 | 1): void {
    const roundedX = Math.round(axisX * 100) / 100;
    const roundedY = Math.round(axisY * 100) / 100;

    if (this.isNative() && window.Android?.sendMotionEvent) {
      try {
        window.Android.sendMotionEvent(roundedX, roundedY, stickId);
      } catch (err) {
        console.error('Error invoking Android.sendMotionEvent', err);
      }
    }

    // Only log motion events occasionally or on significant changes to avoid overwhelming log
    const stickName = stickId === 0 ? 'LEFT_STICK' : 'RIGHT_STICK';
    const log: GamepadEventLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type: 'AXIS_MOVE',
      codeName: stickName,
      keyCode: stickId === 0 ? 0 : 1,
      details: `X: ${roundedX.toFixed(2)}, Y: ${roundedY.toFixed(2)} (${stickId === 0 ? 'AXIS_X / AXIS_Y' : 'AXIS_Z / AXIS_RZ'})`,
    };

    this.dispatchLog(log);
  }

  /**
   * Send trigger value (0.0 to 1.0)
   * triggerId: 0 for LT (AXIS_LTRIGGER), 1 for RT (AXIS_RTRIGGER)
   */
  public sendTriggerEvent(triggerId: 0 | 1, value: number): void {
    const rounded = Math.round(value * 100) / 100;

    if (this.isNative() && window.Android?.sendTriggerEvent) {
      try {
        window.Android.sendTriggerEvent(triggerId, rounded);
      } catch (err) {
        console.error('Error invoking Android.sendTriggerEvent', err);
      }
    }

    const triggerName = triggerId === 0 ? 'LT_TRIGGER' : 'RT_TRIGGER';
    const log: GamepadEventLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type: 'TRIGGER',
      codeName: triggerName,
      keyCode: triggerId === 0 ? ANDROID_KEYCODES.KEYCODE_BUTTON_L2 : ANDROID_KEYCODES.KEYCODE_BUTTON_R2,
      value: rounded,
      details: `Analog Value: ${(rounded * 100).toFixed(0)}% (${triggerId === 0 ? 'AXIS_BRAKE / AXIS_LTRIGGER' : 'AXIS_GAS / AXIS_RTRIGGER'})`,
    };

    this.dispatchLog(log);
  }

  /**
   * Pair with Wireless Debugging (ADB)
   */
  public async pairAdb(ip: string, port: string, code: string): Promise<{ success: boolean; message: string }> {
    let resultSuccess = false;
    let message = '';

    if (this.isNative() && window.Android?.pairAdb) {
      try {
        const res = window.Android.pairAdb(ip, port, code);
        resultSuccess = res === true || res === 'OK' || res === 'true';
        message = typeof res === 'string' ? res : (resultSuccess ? 'Emparejado exitosamente con Android ADB' : 'Fallo en emparejamiento ADB');
      } catch (err) {
        resultSuccess = false;
        message = `Error en puente nativo: ${(err as Error).message}`;
      }
    } else {
      // Simulate pairing in browser with 600ms latency
      await new Promise(resolve => setTimeout(resolve, 600));
      if (!ip || !port || !code || code.length < 6) {
        resultSuccess = false;
        message = 'Parámetros inválidos. Ingresa IP, Puerto y código de 6 dígitos.';
      } else {
        resultSuccess = true;
        message = `Emparejado con éxito a ${ip}:${port} mediante código ${code} (Simulador ADB)`;
      }
    }

    this.isAdbConnected = resultSuccess;
    this.adbStatusListeners.forEach(listener => listener({ connected: resultSuccess, message }));

    const log: GamepadEventLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type: 'ADB_PAIR',
      codeName: 'ADB_WIRELESS_PAIR',
      keyCode: 0,
      details: `${resultSuccess ? 'CONECTADO' : 'FALLO'}: adb pair ${ip}:${port} ${code} -> ${message}`,
    };
    this.dispatchLog(log);

    return { success: resultSuccess, message };
  }

  /**
   * Launch application by package name via Android Intent
   */
  public launchApp(packageName: string, appName: string): boolean {
    haptics.playClick('heavy');
    haptics.vibrate([20, 40, 20]);

    let success = false;
    if (this.isNative() && window.Android?.launchApp) {
      try {
        success = window.Android.launchApp(packageName) ?? true;
      } catch (err) {
        console.error('Error in Android.launchApp', err);
        success = false;
      }
    } else {
      // Browser simulation
      success = true;
    }

    const log: GamepadEventLog = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      type: 'APP_LAUNCH',
      codeName: 'INTENT_LAUNCH_APP',
      keyCode: 0,
      details: `Lanzando ${appName} [${packageName}] manteniendo overlay flotante activo`,
    };
    this.dispatchLog(log);

    return success;
  }

  /**
   * Get installed apps list from native Android device
   */
  public getInstalledApps(): Array<{ name: string; packageName: string }> {
    if (this.isNative() && window.Android?.getInstalledApps) {
      try {
        const jsonStr = window.Android.getInstalledApps();
        if (jsonStr) {
          return JSON.parse(jsonStr);
        }
      } catch (err) {
        console.error('Error fetching installed apps from Android bridge', err);
      }
    }
    return [];
  }

  /**
   * Control overlay opacity
   */
  public setOverlayOpacity(alpha: number): void {
    if (this.isNative() && window.Android?.setOverlayOpacity) {
      try {
        window.Android.setOverlayOpacity(alpha);
      } catch (err) {
        console.error(err);
      }
    }
  }

  /**
   * Toggle click-through touch passthrough
   */
  public setClickthrough(enabled: boolean): void {
    if (this.isNative() && window.Android?.setClickthrough) {
      try {
        window.Android.setClickthrough(enabled);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export const nativeBridge = new NativeBridgeManager();
