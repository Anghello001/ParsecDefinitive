package com.parsec.gamepadoverlay

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.TextView
import android.widget.Toast

/**
 * MainActivity - Pantalla de configuración y gestión de permisos
 * Permite conceder el permiso de superposición (SYSTEM_ALERT_WINDOW)
 * y el permiso de accesibilidad antes de iniciar el mando flotante.
 */
class MainActivity : Activity() {

    private val OVERLAY_PERMISSION_REQ_CODE = 1234
    private lateinit var statusText: TextView
    private lateinit var btnToggleOverlay: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        statusText = findViewById(R.id.statusText)
        btnToggleOverlay = findViewById(R.id.btnToggleOverlay)
        val btnAccessibility: Button = findViewById(R.id.btnAccessibility)
        val btnLaunchParsec: Button = findViewById(R.id.btnLaunchParsec)

        updateStatus()

        btnToggleOverlay.setOnClickListener {
            if (checkOverlayPermission()) {
                toggleOverlayService()
            } else {
                requestOverlayPermission()
            }
        }

        btnAccessibility.setOnClickListener {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            startActivity(intent)
            Toast.makeText(this, "Activa 'Parsec Gamepad Input Service'", Toast.LENGTH_LONG).show()
        }

        btnLaunchParsec.setOnClickListener {
            val pkg = "tv.parsec.client"
            val launchIntent = packageManager.getLaunchIntentForPackage(pkg)
            if (launchIntent != null) {
                startActivity(launchIntent)
            } else {
                Toast.makeText(this, "Parsec no está instalado en este dispositivo", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        updateStatus()
    }

    private fun checkOverlayPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(this)
        } else {
            true
        }
    }

    private fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE)
        }
    }

    private fun updateStatus() {
        val hasOverlay = checkOverlayPermission()
        if (hasOverlay) {
            statusText.text = "✓ Permiso de Superposición concedido.\nListo para superponer sobre Parsec."
            btnToggleOverlay.text = "Iniciar Mando Flotante"
        } else {
            statusText.text = "⚠ Se requiere permiso para mostrar sobre otras aplicaciones."
            btnToggleOverlay.text = "Conceder Permiso de Superposición"
        }
    }

    private fun toggleOverlayService() {
        val serviceIntent = Intent(this, FloatingGamepadService::class.java)
        if (FloatingGamepadService.isRunning) {
            stopService(serviceIntent)
            Toast.makeText(this, "Mando flotante detenido", Toast.LENGTH_SHORT).show()
        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent)
            } else {
                startService(serviceIntent)
            }
            Toast.makeText(this, "Mando flotante iniciado", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            updateStatus()
        }
    }
}
