# Guía de Compilación en AIDE (Android IDE)

Este proyecto está listo para compilarse y ejecutarse directamente en un teléfono o tablet Android usando **AIDE (Android IDE - Java & C++)** o **Android Studio**.

---

## 📁 Estructura de Archivos del Proyecto

```text
app/
├── src/
│   ├── main/
│   │   ├── AndroidManifest.xml
│   │   ├── assets/
│   │   │   └── index.html          <-- Archivo web autónomo con CSS y JS integrado
│   │   ├── java/com/parsec/gamepadoverlay/
│   │   │   ├── MainActivity.kt
│   │   │   ├── FloatingGamepadService.kt
│   │   │   ├── AndroidBridge.kt
│   │   │   └── GamepadAccessibilityService.kt
│   │   └── res/
│   │       ├── layout/
│   │       │   └── activity_main.xml
│   │       ├── values/
│   │       │   └── strings.xml
│   │       └── xml/
│   │           └── accessibility_service_config.xml
└── build.gradle
```

---

## 🚀 Pasos para Compilar en AIDE

1. **Crear o Abrir Proyecto en AIDE**:
   - En AIDE, selecciona **"Crear nuevo proyecto"** (Plantilla básica de aplicación).
   - O copia esta carpeta en `/sdcard/AppProjects/ParsecGamepadOverlay`.

2. **Copiar `index.html` a la carpeta `assets`**:
   - Crea el directorio `app/src/main/assets/` si no existe.
   - Pega el archivo `index.html` allí. La ruta debe ser exactamente:
     `file:///android_asset/index.html`

3. **Copiar las clases Kotlin / Java**:
   - Coloca `MainActivity.kt`, `FloatingGamepadService.kt`, `AndroidBridge.kt`, y `GamepadAccessibilityService.kt` en el paquete `com.parsec.gamepadoverlay`.

4. **Copiar los recursos XML**:
   - `activity_main.xml` en `res/layout/`.
   - `accessibility_service_config.xml` en `res/xml/`.
   - `strings.xml` en `res/values/`.

5. **Reemplazar `AndroidManifest.xml`**:
   - Asegúrate de que incluya los permisos `SYSTEM_ALERT_WINDOW`, `FOREGROUND_SERVICE`, `INTERNET`, y el servicio `GamepadAccessibilityService`.

6. **Compilar y Ejecutar en AIDE**:
   - Toca el botón de reproducción (▶ **Run**).
   - Concede el permiso **"Superponerse a otras apps"** cuando la app lo solicite.
   - (Opcional) Activa el servicio de accesibilidad en los Ajustes del Sistema para permitir inyecciones directas de entrada.
   - Pulsa **"Iniciar Mando Flotante"** y abre **Parsec**; el mando Xbox permanecerá visible y operativo por encima del streaming.

---

## ⚙️ Conexión ADB Inalámbrica

Si prefieres inyección directa mediante el puente de depuración inalámbrica:
1. Activa **Opciones de Desarrollador > Depuración Inalámbrica**.
2. Toca en **"Vincular con código"**.
3. En la barra superior del mando flotante, toca **"📶 Depuración Inalámbrica"**.
4. Introduce la IP, el Puerto y el Código de 6 dígitos generado por Android.
5. El puente ejecutará `adb pair` y conectará automáticamente el socket local.
