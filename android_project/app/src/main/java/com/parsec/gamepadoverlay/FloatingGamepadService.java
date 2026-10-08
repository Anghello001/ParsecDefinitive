package com.parsec.gamepadoverlay;

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
import android.webkit.WebViewClient;

/**
 * FloatingGamepadService - Servicio de superposición WindowManager para AIDE
 */
public class FloatingGamepadService extends Service {

    public static boolean isRunning = false;
    private static final String CHANNEL_ID = "parsec_gamepad_channel";
    private static final int NOTIF_ID = 991;

    private WindowManager windowManager;
    private WebView webView;
    private WindowManager.LayoutParams layoutParams;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public void onCreate() {
        super.onCreate();
        isRunning = true;
        startForegroundNotif();

        windowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);

        int windowType;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            windowType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            windowType = WindowManager.LayoutParams.TYPE_PHONE;
        }

        layoutParams = new WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            windowType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE |
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL |
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN |
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        );
        layoutParams.gravity = Gravity.TOP | Gravity.START;
        layoutParams.x = 0;
        layoutParams.y = 0;

        webView = new WebView(this);
        webView.setBackgroundColor(Color.TRANSPARENT);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode = true;
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);

        // Registro del puente JavaScript "Android"
        webView.addJavascriptInterface(new AndroidBridge(this, webView), "Android");
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient());

        // Carga el archivo web autónomo
        webView.loadUrl("file:///android_asset/index.html");

        windowManager.addView(webView, layoutParams);
    }

    public void updateOverlayOpacity(float alpha) {
        if (layoutParams != null && windowManager != null && webView != null) {
            layoutParams.alpha = Math.max(0.1f, Math.min(1.0f, alpha));
            windowManager.updateViewLayout(webView, layoutParams);
        }
    }

    public void setClickthrough(boolean enabled) {
        if (layoutParams != null && windowManager != null && webView != null) {
            if (enabled) {
                layoutParams.flags |= WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
            } else {
                layoutParams.flags &= ~WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;
            }
            windowManager.updateViewLayout(webView, layoutParams);
        }
    }

    private void startForegroundNotif() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Mando Flotante Parsec",
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Superposición de mando activo sobre la pantalla");
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) {
                nm.createNotificationChannel(channel);
            }

            Notification notif = new Notification.Builder(this, CHANNEL_ID)
                .setContentTitle("Mando Flotante Parsec Activo")
                .setContentText("Superpuesto sobre juegos y apps externas")
                .setSmallIcon(android.R.drawable.ic_menu_compass)
                .build();

            startForeground(NOTIF_ID, notif);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        isRunning = false;
        if (webView != null && windowManager != null) {
            try {
                windowManager.removeView(webView);
                webView.destroy();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
