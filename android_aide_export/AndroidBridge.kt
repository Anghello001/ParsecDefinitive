package com.parsec.gamepadoverlay

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.KeyEvent
import android.webkit.JavascriptInterface
import android.webkit.WebView
import java.io.BufferedReader
import java.io.InputStreamReader

/**
 * AndroidBridge - Puente expuesto a JavaScript como "window.Android"
 * Gestiona el envío de keycodes de hardware de gamepad, ejecución ADB,
 * lanzamiento de aplicaciones y control de la superposición.
 */
class AndroidBridge(
    private val context: Context,
    private val webView: WebView
) {
    private val mainHandler = Handler(Looper.getMainLooper())
    private val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator

    /**
     * Inyecta keycodes de hardware (KEYCODE_BUTTON_A, DPAD, etc.)
     * action: 0 = ACTION_DOWN, 1 = ACTION_UP
     */
    @JavascriptInterface
    fun sendKeyEvent(keyCode: Int, action: Int) {
        Thread {
            try {
                // 1. Intentar inyección a través del Servicio de Accesibilidad si está activo
                if (GamepadAccessibilityService.instance != null) {
                    GamepadAccessibilityService.instance?.handleKeyEvent(keyCode, action)
                    return@Thread
                }

                // 2. Inyección mediante comando shell local (ADB / shizuku / root)
                val actionFlag = if (action == KeyEvent.ACTION_DOWN) "down" else "up"
                // Usando comando input estándar de Android
                val cmd = "input keyevent $keyCode"
                Runtime.getRuntime().exec(arrayOf("sh", "-c", cmd))
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    /**
     * Inyecta eventos de movimiento de joysticks analógicos (-1.0 a 1.0)
     */
    @JavascriptInterface
    fun sendMotionEvent(axisX: Float, axisY: Float, stickId: Int) {
        // Enviar hacia GamepadAccessibilityService o virtual input device
        GamepadAccessibilityService.instance?.handleMotionEvent(axisX, axisY, stickId)
    }

    /**
     * Inyecta valores analógicos de gatillos LT / RT (0.0 a 1.0)
     */
    @JavascriptInterface
    fun sendTriggerEvent(triggerId: Int, value: Float) {
        GamepadAccessibilityService.instance?.handleTriggerEvent(triggerId, value)
    }

    /**
     * Empareja y conecta el puente local mediante depuración inalámbrica ADB
     */
    @JavascriptInterface
    fun pairAdb(ip: String, port: String, code: String): String {
        return try {
            val process = Runtime.getRuntime().exec(arrayOf("sh", "-c", "adb pair $ip:$port $code"))
            val reader = BufferedReader(InputStreamReader(process.inputStream))
            val output = StringBuilder()
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                output.append(line).append("\n")
            }
            process.waitFor()
            if (output.isEmpty()) "OK" else output.toString()
        } catch (e: Exception) {
            "Error: ${e.message}"
        }
    }

    /**
     * Lanza una app instalada (como Parsec) manteniendo el overlay flotante visible
     */
    @JavascriptInterface
    fun launchApp(packageName: String): Boolean {
        return try {
            val launchIntent = context.packageManager.getLaunchIntentForPackage(packageName)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(launchIntent)
                true
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    /**
     * Obtiene la lista de aplicaciones instaladas en el celular en formato JSON
     */
    @JavascriptInterface
    fun getInstalledApps(): String {
        return try {
            val pm = context.packageManager
            val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
            }
            val pkgAppsList = pm.queryIntentActivities(mainIntent, 0)
            val jsonArray = org.json.JSONArray()
            for (resolveInfo in pkgAppsList) {
                val appName = resolveInfo.loadLabel(pm).toString()
                val pkgName = resolveInfo.activityInfo.packageName
                if (pkgName != context.packageName) {
                    val jsonObj = org.json.JSONObject().apply {
                        put("name", appName)
                        put("packageName", pkgName)
                    }
                    jsonArray.put(jsonObj)
                }
            }
            jsonArray.toString()
        } catch (e: Exception) {
            "[]"
        }
    }

    /**
     * Ajusta la opacidad del overlay flotante (0.1 a 1.0)
     */
    @JavascriptInterface
    fun setOverlayOpacity(alpha: Float) {
        mainHandler.post {
            (context as? FloatingGamepadService)?.updateOverlayOpacity(alpha)
        }
    }

    /**
     * Activa o desactiva el paso de toques a la app inferior
     */
    @JavascriptInterface
    fun setClickthrough(enabled: Boolean) {
        mainHandler.post {
            (context as? FloatingGamepadService)?.setClickthrough(enabled)
        }
    }

    /**
     * Vibración háptica del dispositivo
     */
    @JavascriptInterface
    fun vibrate(durationMs: Long) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator?.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(durationMs)
        }
    }

    /**
     * Cierra el servicio de superposición flotante
     */
    @JavascriptInterface
    fun closeOverlay() {
        mainHandler.post {
            if (context is FloatingGamepadService) {
                context.stopSelf()
            }
        }
    }
}
