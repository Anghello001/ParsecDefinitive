import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Smartphone, X, BookOpen, Layers } from 'lucide-react';

interface AndroidCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidCodeExportModal: React.FC<AndroidCodeExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'index' | 'main' | 'service' | 'bridge' | 'access' | 'manifest' | 'guide'>('index');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const CODE_SNIPPETS: Record<string, { title: string; filename: string; language: string; code: string }> = {
    index: {
      title: 'index.html Autónomo (WebView - Modo Rack Xbox)',
      filename: 'app/src/main/assets/index.html',
      language: 'html',
      code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Parsec Gamepad Overlay</title>
  <style>
    * { box-sizing: border-box; user-select: none; margin: 0; padding: 0; touch-action: none; font-family: monospace; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; color: #e2e8f0; }
    .top-bar { height: 42px; background: rgba(20,20,20,0.95); border-bottom: 1px solid #282828; display: flex; align-items: center; justify-content: space-between; padding: 0 12px; }
    .badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 2px; background: #1e1e1e; border: 1px solid #333; color: #94a3b8; }
    .btn-tool { background: #202020; border: 1px solid #333; color: #e2e8f0; font-size: 11px; padding: 4px 9px; border-radius: 2px; cursor: pointer; }
    .gamepad-container { width: 100%; height: calc(100% - 42px); display: flex; flex-direction: column; justify-content: space-between; padding: 6px 12px; }
    .racks-row { display: flex; justify-content: space-between; flex: 1; pointer-events: none; }
    .rack-box { pointer-events: auto; background: rgba(26,26,26,0.88); border: 1px solid #333; border-radius: 2px; padding: 10px 14px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; }
    .rack-stack { display: flex; flex-direction: column; align-items: center; gap: 16px; flex: 1; justify-content: center; }
    .btn-shoulder { width: 58px; height: 38px; background: #222; border: 1px solid #353535; color: #fff; font-weight: 800; border-radius: 2px; }
    .stick-base { width: 130px; height: 130px; background: #181818; border: 1px solid #303030; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; }
    .stick-knob { width: 64px; height: 64px; background: #242424; border: 1px solid #3f3f3f; border-radius: 50%; position: absolute; pointer-events: none; }
    .dpad-container { width: 120px; height: 120px; background: #181818; border: 1px solid #2c2c2c; border-radius: 2px; position: relative; }
    .btn-dpad { position: absolute; width: 36px; height: 36px; background: #222; border: 1px solid #333; color: #fff; border-radius: 2px; font-weight: 700; }
    .diamond-container { width: 124px; height: 124px; background: #181818; border: 1px solid #2c2c2c; border-radius: 2px; position: relative; }
    .btn-action { position: absolute; width: 38px; height: 38px; background: #222; border: 1px solid #333; border-radius: 2px; font-weight: 900; }
    .btn-action.y { top: 4px; left: 43px; color: #facc15; }
    .btn-action.x { left: 4px; top: 43px; color: #38bdf8; }
    .btn-action.b { right: 4px; top: 43px; color: #ef4444; }
    .btn-action.a { bottom: 4px; left: 43px; color: #22c55e; }
  </style>
</head>
<body>
  <div class="top-bar">
    <span class="badge" id="adbBadge">ADB: LISTO</span>
    <button class="btn-tool" onclick="window.Android?.launchApp('tv.parsec.client')">🚀 Abrir Parsec</button>
  </div>
  <div class="gamepad-container">
    <div style="display:flex; justify-content:center; gap:8px;">
      <button class="btn-tool" ontouchstart="window.Android?.sendKeyEvent(109, 0)">⧉ VIEW</button>
      <button class="btn-tool" ontouchstart="window.Android?.sendKeyEvent(110, 0)" style="color:#00d632;">✕ XBOX</button>
      <button class="btn-tool" ontouchstart="window.Android?.sendKeyEvent(108, 0)">☰ MENU</button>
    </div>
    <!-- Distribución Horizontal Modo Rack Xbox -->
    <div class="racks-row">
      <!-- Ala Izquierda: LT/LB + Stick Izq (arriba) + Cruceta (abajo) -->
      <div class="rack-box" id="leftRack">
        <div style="display:flex; gap:6px; margin-bottom:6px;">
          <button class="btn-shoulder" ontouchstart="window.Android?.sendKeyEvent(104, 0)">LT</button>
          <button class="btn-shoulder" ontouchstart="window.Android?.sendKeyEvent(102, 0)">LB</button>
        </div>
        <div class="rack-stack">
          <div class="stick-base" id="leftStick"><div class="stick-knob" id="knobL"></div></div>
          <div class="dpad-container">
            <button class="btn-dpad" style="top:4px;left:42px;" ontouchstart="window.Android?.sendKeyEvent(19, 0)">▲</button>
            <button class="btn-dpad" style="bottom:4px;left:42px;" ontouchstart="window.Android?.sendKeyEvent(20, 0)">▼</button>
            <button class="btn-dpad" style="left:4px;top:42px;" ontouchstart="window.Android?.sendKeyEvent(21, 0)">◀</button>
            <button class="btn-dpad" style="right:4px;top:42px;" ontouchstart="window.Android?.sendKeyEvent(22, 0)">▶</button>
          </div>
        </div>
      </div>
      <!-- Ala Derecha: RT/RB + Botones ABXY (arriba) + Stick Der (abajo) -->
      <div class="rack-box" id="rightRack">
        <div style="display:flex; gap:6px; margin-bottom:6px;">
          <button class="btn-shoulder" ontouchstart="window.Android?.sendKeyEvent(103, 0)">RB</button>
          <button class="btn-shoulder" ontouchstart="window.Android?.sendKeyEvent(105, 0)">RT</button>
        </div>
        <div class="rack-stack">
          <div class="diamond-container">
            <button class="btn-action y" ontouchstart="window.Android?.sendKeyEvent(100, 0)">Y</button>
            <button class="btn-action x" ontouchstart="window.Android?.sendKeyEvent(99, 0)">X</button>
            <button class="btn-action b" ontouchstart="window.Android?.sendKeyEvent(97, 0)">B</button>
            <button class="btn-action a" ontouchstart="window.Android?.sendKeyEvent(96, 0)">A</button>
          </div>
          <div class="stick-base" id="rightStick"><div class="stick-knob" id="knobR"></div></div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
    },
    main: {
      title: 'MainActivity.kt',
      filename: 'com/parsec/gamepadoverlay/MainActivity.kt',
      language: 'kotlin',
      code: `package com.parsec.gamepadoverlay

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.Toast

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<Button>(R.id.btnToggleOverlay).setOnClickListener {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
                val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
                startActivity(intent)
            } else {
                val intent = Intent(this, FloatingGamepadService::class.java)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    startForegroundService(intent)
                } else {
                    startService(intent)
                }
                Toast.makeText(this, "Mando Flotante Iniciado", Toast.LENGTH_SHORT).show()
            }
        }
    }
}`,
    },
    service: {
      title: 'FloatingGamepadService.kt',
      filename: 'com/parsec/gamepadoverlay/FloatingGamepadService.kt',
      language: 'kotlin',
      code: `package com.parsec.gamepadoverlay

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

class FloatingGamepadService : Service() {
    private var windowManager: WindowManager? = null
    private var webView: WebView? = null

    override fun onBind(intent: Intent?): IBinder? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        val windowType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
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
        }

        webView = WebView(this).apply {
            setBackgroundColor(Color.TRANSPARENT)
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                cacheMode = WebSettings.LOAD_NO_CACHE
            }
            addJavascriptInterface(AndroidBridge(this@FloatingGamepadService, this), "Android")
            webChromeClient = WebChromeClient()
            loadUrl("file:///android_asset/index.html")
        }

        windowManager?.addView(webView, params)
    }

    override fun onDestroy() {
        super.onDestroy()
        webView?.let { windowManager?.removeView(it) }
    }
}`,
    },
    bridge: {
      title: 'AndroidBridge.kt',
      filename: 'com/parsec/gamepadoverlay/AndroidBridge.kt',
      language: 'kotlin',
      code: `package com.parsec.gamepadoverlay

import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface
import android.webkit.WebView

class AndroidBridge(private val context: Context, private val webView: WebView) {

    @JavascriptInterface
    fun sendKeyEvent(keyCode: Int, action: Int) {
        Thread {
            try {
                // Inyección por Accesibilidad o shell local
                GamepadAccessibilityService.instance?.handleKeyEvent(keyCode, action)
                    ?: Runtime.getRuntime().exec(arrayOf("sh", "-c", "input keyevent $keyCode"))
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    @JavascriptInterface
    fun sendMotionEvent(axisX: Float, axisY: Float, stickId: Int) {
        GamepadAccessibilityService.instance?.handleMotionEvent(axisX, axisY, stickId)
    }

    @JavascriptInterface
    fun launchApp(packageName: String): Boolean {
        return try {
            val intent = context.packageManager.getLaunchIntentForPackage(packageName)
            intent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            true
        } catch (e: Exception) {
            false
        }
    }

    @JavascriptInterface
    fun pairAdb(ip: String, port: String, code: String): String {
        return try {
            val proc = Runtime.getRuntime().exec("adb pair $ip:$port $code")
            proc.waitFor()
            "OK"
        } catch (e: Exception) {
            e.message ?: "Error"
        }
    }
}`,
    },
    access: {
      title: 'GamepadAccessibilityService.kt',
      filename: 'com/parsec/gamepadoverlay/GamepadAccessibilityService.kt',
      language: 'kotlin',
      code: `package com.parsec.gamepadoverlay

import android.accessibilityservice.AccessibilityService
import android.view.KeyEvent
import android.view.accessibility.AccessibilityEvent

class GamepadAccessibilityService : AccessibilityService() {
    companion object {
        var instance: GamepadAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}

    override fun onInterrupt() {
        instance = null
    }

    fun handleKeyEvent(keyCode: Int, action: Int) {
        try {
            Runtime.getRuntime().exec(arrayOf("sh", "-c", "input keyevent $keyCode"))
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun handleMotionEvent(axisX: Float, axisY: Float, stickId: Int) {}
}`,
    },
    manifest: {
      title: 'AndroidManifest.xml',
      filename: 'app/src/main/AndroidManifest.xml',
      language: 'xml',
      code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.parsec.gamepadoverlay">

    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <queries>
        <package android:name="tv.parsec.client" />
        <package android:name="com.limelight" />
    </queries>

    <application
        android:label="Parsec Gamepad Overlay"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar"
        android:hardwareAccelerated="true">

        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service android:name=".FloatingGamepadService" android:exported="false" />

        <service
            android:name=".GamepadAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>
    </application>
</manifest>`,
    },
    guide: {
      title: 'Instrucciones para AIDE',
      filename: 'README_AIDE.md',
      language: 'markdown',
      code: `# Cómo compilar en AIDE (Android IDE)

1. En AIDE en tu teléfono o tablet Android, abre o crea una nueva aplicación.
2. Copia 'index.html' en la carpeta: 'app/src/main/assets/index.html'.
3. Copia las clases Kotlin en 'app/src/main/java/com/parsec/gamepadoverlay/'.
4. Reemplaza 'AndroidManifest.xml' para incluir los permisos de superposición y accesibilidad.
5. Toca el botón Play (Run).
6. Al abrir la app, pulsa 'Conceder Permiso de Superposición'.
7. Toca 'Iniciar Mando Flotante'.
8. Abre Parsec: el mando aparecerá flotando directamente por encima del stream con baja latencia.`,
    },
  };

  const currentSnippet = CODE_SNIPPETS[activeTab];

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentSnippet.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentSnippet.filename.split('/').pop() || 'code.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-[#161616] border border-[#2d2d2d] rounded-sm shadow-2xl flex flex-col h-[90vh] overflow-hidden text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#252525] bg-[#121212]">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-100">
                Archivos del Proyecto Nativo Android (Listo para AIDE / Android Studio)
              </h2>
              <p className="text-[11px] text-gray-400 font-mono">
                Código fuente completo para compilar el overlay flotante transparente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white bg-[#1f1f1f] border border-[#2d2d2d] rounded-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-[#242424] bg-[#1a1a1a] overflow-x-auto text-xs font-mono">
          {[
            { id: 'index', label: 'index.html (WebView)' },
            { id: 'main', label: 'MainActivity.kt' },
            { id: 'service', label: 'FloatingGamepadService.kt' },
            { id: 'bridge', label: 'AndroidBridge.kt' },
            { id: 'access', label: 'GamepadAccessibility.kt' },
            { id: 'manifest', label: 'AndroidManifest.xml' },
            { id: 'guide', label: 'Guía AIDE' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3.5 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 bg-[#141414] text-emerald-400 font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#181818]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* File meta & Action Bar */}
        <div className="px-4 py-2 bg-[#141414] border-b border-[#222222] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-400">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-200 font-bold">{currentSnippet.filename}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-[#202020] hover:bg-[#282828] border border-[#333333] rounded-sm text-gray-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado al portapapeles' : 'Copiar Código'}
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 bg-[#202020] hover:bg-[#282828] border border-[#333333] rounded-sm text-gray-200 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar Archivo
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-auto p-4 bg-[#0e0e0e]">
          <pre className="font-mono text-xs leading-relaxed text-gray-300 select-all whitespace-pre">
            <code>{currentSnippet.code}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#121212] border-t border-[#222222] text-[10px] text-gray-500 font-mono flex items-center justify-between">
          <span>Los archivos también están guardados en la carpeta /android_aide_export/ del repositorio</span>
          <span className="text-emerald-400">Compatible con AIDE, Android Studio, Termux & Shizuku</span>
        </div>
      </div>
    </div>
  );
};
