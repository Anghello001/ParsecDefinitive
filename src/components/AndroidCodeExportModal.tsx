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
      title: 'MainActivity.java (AIDE Native)',
      filename: 'com/parsec/gamepadoverlay/MainActivity.java',
      language: 'java',
      code: `package com.parsec.gamepadoverlay;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final int REQ_CODE = 1234;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btnToggle = findViewById(R.id.btnToggleOverlay);
        btnToggle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(MainActivity.this)) {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getPackageName()));
                    startActivityForResult(intent, REQ_CODE);
                } else {
                    Intent intent = new Intent(MainActivity.this, FloatingGamepadService.class);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        startForegroundService(intent);
                    } else {
                        startService(intent);
                    }
                    Toast.makeText(MainActivity.this, "Mando Flotante Iniciado", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}`,
    },
    service: {
      title: 'FloatingGamepadService.java (AIDE Native)',
      filename: 'com/parsec/gamepadoverlay/FloatingGamepadService.java',
      language: 'java',
      code: `package com.parsec.gamepadoverlay;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class FloatingGamepadService extends Service {
    public static boolean isRunning = false;
    private WindowManager windowManager;
    private WebView webView;

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public void onCreate() {
        super.onCreate();
        isRunning = true;
        windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);

        int type = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) 
            ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY 
            : WindowManager.LayoutParams.TYPE_PHONE;

        WindowManager.LayoutParams params = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            type,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        );
        params.gravity = Gravity.TOP | Gravity.START;

        webView = new WebView(this);
        webView.setBackgroundColor(Color.TRANSPARENT);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setCacheMode(WebSettings.LOAD_NO_CACHE);

        webView.addJavascriptInterface(new AndroidBridge(this, webView), "Android");
        webView.setWebChromeClient(new WebChromeClient());
        webView.loadUrl("file:///android_asset/index.html");

        windowManager.addView(webView, params);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        isRunning = false;
        if (webView != null && windowManager != null) {
            windowManager.removeView(webView);
            webView.destroy();
        }
    }
}`,
    },
    bridge: {
      title: 'AndroidBridge.java (AIDE Native)',
      filename: 'com/parsec/gamepadoverlay/AndroidBridge.java',
      language: 'java',
      code: `package com.parsec.gamepadoverlay;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.List;

public class AndroidBridge {
    private final Context context;
    private final WebView webView;

    public AndroidBridge(Context context, WebView webView) {
        this.context = context;
        this.webView = webView;
    }

    @JavascriptInterface
    public void sendKeyEvent(final int keyCode, final int action) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (GamepadAccessibilityService.instance != null) {
                        GamepadAccessibilityService.instance.handleKeyEvent(keyCode, action);
                        return;
                    }
                    Runtime.getRuntime().exec(new String[]{"sh", "-c", "input keyevent " + keyCode});
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    @JavascriptInterface
    public void sendMotionEvent(float x, float y, int stickId) {
        if (GamepadAccessibilityService.instance != null) {
            GamepadAccessibilityService.instance.handleMotionEvent(x, y, stickId);
        }
    }

    @JavascriptInterface
    public boolean launchApp(String packageName) {
        try {
            Intent intent = context.getPackageManager().getLaunchIntentForPackage(packageName);
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    @JavascriptInterface
    public String getInstalledApps() {
        try {
            PackageManager pm = context.getPackageManager();
            Intent intent = new Intent(Intent.ACTION_MAIN, null);
            intent.addCategory(Intent.CATEGORY_LAUNCHER);
            List<ResolveInfo> list = pm.queryIntentActivities(intent, 0);
            JSONArray array = new JSONArray();
            for (ResolveInfo info : list) {
                String pkg = info.activityInfo.packageName;
                if (!pkg.equals(context.getPackageName())) {
                    JSONObject obj = new JSONObject();
                    obj.put("name", info.loadLabel(pm).toString());
                    obj.put("packageName", pkg);
                    array.put(obj);
                }
            }
            return array.toString();
        } catch (Exception e) {
            return "[]";
        }
    }

    @JavascriptInterface
    public String pairAdb(String ip, String port, String code) {
        try {
            Process p = Runtime.getRuntime().exec(new String[]{"sh", "-c", "adb pair " + ip + ":" + port + " " + code});
            p.waitFor();
            return "OK";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}`,
    },
    access: {
      title: 'GamepadAccessibilityService.java (AIDE Native)',
      filename: 'com/parsec/gamepadoverlay/GamepadAccessibilityService.java',
      language: 'java',
      code: `package com.parsec.gamepadoverlay;

import android.accessibilityservice.AccessibilityService;
import android.os.Build;
import android.view.KeyEvent;
import android.view.accessibility.AccessibilityEvent;

public class GamepadAccessibilityService extends AccessibilityService {
    public static GamepadAccessibilityService instance = null;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {}

    @Override
    public void onInterrupt() {
        instance = null;
    }

    public void handleKeyEvent(int keyCode, int action) {
        try {
            Runtime.getRuntime().exec(new String[]{"sh", "-c", "input keyevent " + keyCode});
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void handleMotionEvent(float x, float y, int stickId) {}
    public void handleTriggerEvent(int triggerId, float val) {}
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
      title: 'Solución a "./gradlew: No such file" y Guía AIDE',
      filename: 'README_AIDE.md',
      language: 'markdown',
      code: `# Solución al error: "bash: ./gradlew: No such file or directory"

## 1. ¿Por qué ocurrió este error?
El error ocurrió porque intentaste ejecutar './gradlew' desde una terminal (como Termux, SSH o bash en Android) pero no existía el script Gradle Wrapper en ese directorio.

## 2. Cómo compilar correctamente:

### Opción A: Compilar directamente en AIDE (Recomendado sin terminal)
En la app AIDE de tu celular Android NO necesitas usar la terminal ni ejecutar './gradlew'.
AIDE tiene su propio compilador interno de Android:
1. Abre AIDE en tu teléfono o tablet.
2. Abre la carpeta del proyecto: '/android_project'.
3. AIDE detectará automáticamente 'settings.gradle' y 'app/build.gradle'.
4. Toca directamente el botón Play (▶ RUN) en la esquina superior derecha.
5. Las clases Java que hemos estructurado compilan al 100% sin requerir plugins pesados de Kotlin ni descargas externas.

### Opción B: Si deseas compilar por consola (Termux / Linux / Mac)
Hemos añadido el script ejecutable 'gradlew' en la raíz de '/android_project':
\`\`\`bash
cd android_project
chmod +x gradlew
./gradlew assembleDebug
\`\`\`
El APK compilado se generará en:
'android_project/app/build/outputs/apk/debug/app-debug.apk'

## 3. Estructura Completa del Proyecto Generado:
android_project/
├── gradlew                  (Script ejecutable de Gradle Wrapper)
├── settings.gradle          (Configuración raíz)
├── build.gradle             (Gradle raíz)
├── gradle/wrapper/          (gradle-wrapper.properties)
└── app/
    ├── build.gradle         (Configuración del módulo app con namespace)
    └── src/main/
        ├── AndroidManifest.xml (Permisos SYSTEM_ALERT_WINDOW y accesibilidad)
        ├── assets/
        │   └── index.html   (Web App optimizada con chasis unificado Xbox)
        ├── java/com/parsec/gamepadoverlay/
        │   ├── MainActivity.java
        │   ├── FloatingGamepadService.java
        │   ├── AndroidBridge.java
        │   └── GamepadAccessibilityService.java
        └── res/
            ├── layout/activity_main.xml
            ├── values/strings.xml
            └── xml/accessibility_service_config.xml`,
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
            { id: 'main', label: 'MainActivity.java' },
            { id: 'service', label: 'FloatingGamepadService.java' },
            { id: 'bridge', label: 'AndroidBridge.java' },
            { id: 'access', label: 'GamepadAccessibility.java' },
            { id: 'manifest', label: 'AndroidManifest.xml' },
            { id: 'guide', label: 'Fix: ./gradlew y Guía AIDE' },
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
