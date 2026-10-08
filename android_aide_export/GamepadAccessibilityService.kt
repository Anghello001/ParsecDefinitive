package com.parsec.gamepadoverlay

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.os.Build
import android.view.KeyEvent
import android.view.accessibility.AccessibilityEvent

/**
 * GamepadAccessibilityService - Servicio de Accesibilidad para inyección de eventos táctiles y teclas
 * Permite inyectar toques y acciones del sistema sin necesidad de permisos Root en Android.
 */
class GamepadAccessibilityService : AccessibilityService() {

    companion object {
        var instance: GamepadAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // No es necesario procesar eventos entrantes de la pantalla, solo inyectar
    }

    override fun onInterrupt() {
        instance = null
    }

    override fun onDestroy() {
        super.onDestroy()
        instance = null
    }

    /**
     * Inyección o simulación de eventos de pulsación de botones
     */
    fun handleKeyEvent(keyCode: Int, action: Int) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            // En caso de que se mapee a acciones globales del sistema:
            when (keyCode) {
                KeyEvent.KEYCODE_BACK, KeyEvent.KEYCODE_BUTTON_SELECT -> {
                    if (action == KeyEvent.ACTION_UP) {
                        performGlobalAction(GLOBAL_ACTION_BACK)
                    }
                    return
                }
                KeyEvent.KEYCODE_HOME, KeyEvent.KEYCODE_BUTTON_MODE -> {
                    if (action == KeyEvent.ACTION_UP) {
                        performGlobalAction(GLOBAL_ACTION_HOME)
                    }
                    return
                }
            }
        }

        // Para gamepad directo, inyectar mediante comando input en hilo secundario
        try {
            val cmd = "input keyevent $keyCode"
            Runtime.getRuntime().exec(arrayOf("sh", "-c", cmd))
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * Inyecta toques virtuales en coordenadas específicas si se requiere mapeo táctil sobre la pantalla
     */
    fun simulateTap(x: Float, y: Float, durationMs: Long = 50) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            val path = Path().apply {
                moveTo(x, y)
            }
            val stroke = GestureDescription.StrokeDescription(path, 0, durationMs)
            val gesture = GestureDescription.Builder().addStroke(stroke).build()
            dispatchGesture(gesture, null, null)
        }
    }

    /**
     * Maneja el movimiento de los joysticks analógicos
     */
    fun handleMotionEvent(axisX: Float, axisY: Float, stickId: Int) {
        // Puede implementar uinput o mapeo directo a pantalla si el juego no tiene soporte nativo de mando
    }

    /**
     * Maneja gatillos analógicos
     */
    fun handleTriggerEvent(triggerId: Int, value: Float) {
        // Manejo de gatillos LT / RT
    }
}
