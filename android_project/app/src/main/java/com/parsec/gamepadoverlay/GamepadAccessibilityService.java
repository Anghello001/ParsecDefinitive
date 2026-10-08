package com.parsec.gamepadoverlay;

import android.accessibilityservice.AccessibilityService;
import android.os.Build;
import android.view.KeyEvent;
import android.view.accessibility.AccessibilityEvent;

/**
 * GamepadAccessibilityService - Inyección de eventos y teclas de accesibilidad
 */
public class GamepadAccessibilityService extends AccessibilityService {

    public static GamepadAccessibilityService instance = null;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // No se requiere procesar eventos de pantalla entrantes
    }

    @Override
    public void onInterrupt() {
        instance = null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        instance = null;
    }

    public void handleKeyEvent(int keyCode, int action) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            if (keyCode == KeyEvent.KEYCODE_BACK || keyCode == KeyEvent.KEYCODE_BUTTON_SELECT) {
                if (action == KeyEvent.ACTION_UP) {
                    performGlobalAction(GLOBAL_ACTION_BACK);
                }
                return;
            }
            if (keyCode == KeyEvent.KEYCODE_HOME || keyCode == KeyEvent.KEYCODE_BUTTON_MODE) {
                if (action == KeyEvent.ACTION_UP) {
                    performGlobalAction(GLOBAL_ACTION_HOME);
                }
                return;
            }
        }

        try {
            String cmd = "input keyevent " + keyCode;
            Runtime.getRuntime().exec(new String[]{"sh", "-c", cmd});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void handleMotionEvent(float axisX, float axisY, int stickId) {
        // Manejo de ejes
    }

    public void handleTriggerEvent(int triggerId, float value) {
        // Manejo de gatillos
    }
}
