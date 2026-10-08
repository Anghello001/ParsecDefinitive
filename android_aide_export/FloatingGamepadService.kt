package com.parsec.gamepadoverlay

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

/**
 * FloatingGamepadService - Servicio en segundo plano para superposición flotante
 * Crea una ventana WindowManager transparente a pantalla completa cargando index.html
 */
class FloatingGamepadService : Service() {

    companion object {
        var isRunning = false
        const val CHANNEL_ID = "parsec_gamepad_channel"
        const val NOTIFICATION_ID = 991
    }

    private var windowManager: WindowManager? = null
    private var webView: WebView? = null
    private var layoutParams: WindowManager.LayoutParams? = null

    override fun onBind(intent: Intent?): IBinder? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate() {
        super.onCreate()
        isRunning = true
        startForegroundNotification()

        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val windowType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        // LayoutParams configurados para pantalla completa transparente sin bloquear foco innecesario
        layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            windowType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 0
            y = 0
        }

        // Creación y configuración del WebView
        webView = WebView(this).apply {
            setBackgroundColor(Color.TRANSPARENT)
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false

            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                useWideViewPort = true
                loadWithOverviewMode = true
                cacheMode = WebSettings.LOAD_NO_CACHE
            }

            // Exponer el puente Android a JavaScript
            addJavascriptInterface(AndroidBridge(this@FloatingGamepadService, this), "Android")

            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                }
            }

            // Cargar interfaz local de los assets
            loadUrl("file:///android_asset/index.html")
        }

        windowManager?.addView(webView, layoutParams)
    }

    fun updateOverlayOpacity(alpha: Float) {
        layoutParams?.alpha = alpha.coerceIn(0.1f, 1.0f)
        windowManager?.updateViewLayout(webView, layoutParams)
    }

    fun setClickthrough(enabled: Boolean) {
        if (enabled) {
            layoutParams?.flags = layoutParams?.flags?.or(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE) ?: 0
        } else {
            layoutParams?.flags = layoutParams?.flags?.and(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE.inv()) ?: 0
        }
        windowManager?.updateViewLayout(webView, layoutParams)
    }

    private fun startForegroundNotification() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Parsec Gamepad Overlay Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Mando de juego flotante activo sobre Parsec"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)

            val notification: Notification = Notification.Builder(this, CHANNEL_ID)
                .setContentTitle("Mando Flotante Parsec Activo")
                .setContentText("Superposición táctil activa en pantalla")
                .setSmallIcon(android.R.drawable.ic_menu_compass)
                .build()

            startForeground(NOTIFICATION_ID, notification)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning = false
        if (webView != null && windowManager != null) {
            try {
                windowManager?.removeView(webView)
                webView?.destroy()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
