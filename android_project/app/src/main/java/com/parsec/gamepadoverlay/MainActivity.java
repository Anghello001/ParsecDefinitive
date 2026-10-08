package com.parsec.gamepadoverlay;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

/**
 * MainActivity - Gestor de permisos y arranque del servicio flotante para AIDE
 */
public class MainActivity extends Activity {

    private static final int REQ_CODE_OVERLAY = 1234;
    private TextView statusText;
    private Button btnToggleOverlay;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        statusText = findViewById(R.id.statusText);
        btnToggleOverlay = findViewById(R.id.btnToggleOverlay);
        Button btnAccessibility = findViewById(R.id.btnAccessibility);
        Button btnLaunchParsec = findViewById(R.id.btnLaunchParsec);

        updateStatus();

        btnToggleOverlay.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (checkOverlayPermission()) {
                    toggleService();
                } else {
                    requestOverlayPermission();
                }
            }
        });

        btnAccessibility.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
                startActivity(intent);
                Toast.makeText(MainActivity.this, "Activa 'Parsec Gamepad Input Service'", Toast.LENGTH_LONG).show();
            }
        });

        btnLaunchParsec.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String pkg = "tv.parsec.client";
                Intent launch = getPackageManager().getLaunchIntentForPackage(pkg);
                if (launch != null) {
                    startActivity(launch);
                } else {
                    Toast.makeText(MainActivity.this, "Parsec no está instalado en este dispositivo", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        updateStatus();
    }

    private boolean checkOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(this);
        }
        return true;
    }

    private void requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Intent intent = new Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:" + getPackageName())
            );
            startActivityForResult(intent, REQ_CODE_OVERLAY);
        }
    }

    private void updateStatus() {
        boolean granted = checkOverlayPermission();
        if (granted) {
            statusText.setText("✓ Permiso de Superposición Concedido.\nListo para superponer el mando sobre Parsec.");
            btnToggleOverlay.setText("Iniciar Mando Flotante");
        } else {
            statusText.setText("⚠ Requiere permiso de superposición sobre otras aplicaciones.");
            btnToggleOverlay.setText("Conceder Permiso");
        }
    }

    private void toggleService() {
        Intent intent = new Intent(this, FloatingGamepadService.class);
        if (FloatingGamepadService.isRunning) {
            stopService(intent);
            Toast.makeText(this, "Mando flotante detenido", Toast.LENGTH_SHORT).show();
        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(intent);
            } else {
                startService(intent);
            }
            Toast.makeText(this, "Mando flotante iniciado sobre la pantalla", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_CODE_OVERLAY) {
            updateStatus();
        }
    }
}
