package com.parsec.gamepadoverlay;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

/**
 * AndroidBridge - Puente nativo expuesto a JavaScript como "window.Android"
 */
public class AndroidBridge {

    private final Context context;
    private final WebView webView;
    private final Handler mainHandler = new Handler(Looper.getMainLooper());
    private final Vibrator vibrator;

    public AndroidBridge(Context context, WebView webView) {
        this.context = context;
        this.webView = webView;
        this.vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
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
                    String cmd = "input keyevent " + keyCode;
                    Runtime.getRuntime().exec(new String[]{"sh", "-c", cmd});
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    @JavascriptInterface
    public void sendMotionEvent(float axisX, float axisY, int stickId) {
        if (GamepadAccessibilityService.instance != null) {
            GamepadAccessibilityService.instance.handleMotionEvent(axisX, axisY, stickId);
        }
    }

    @JavascriptInterface
    public void sendTriggerEvent(int triggerId, float value) {
        if (GamepadAccessibilityService.instance != null) {
            GamepadAccessibilityService.instance.handleTriggerEvent(triggerId, value);
        }
    }

    @JavascriptInterface
    public String pairAdb(String ip, String port, String code) {
        try {
            Process process = Runtime.getRuntime().exec(new String[]{"sh", "-c", "adb pair " + ip + ":" + port + " " + code});
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            process.waitFor();
            return sb.length() == 0 ? "OK" : sb.toString();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    @JavascriptInterface
    public boolean launchApp(String packageName) {
        try {
            Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(packageName);
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(launchIntent);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Devuelve las aplicaciones instaladas del celular en formato JSON
     */
    @JavascriptInterface
    public String getInstalledApps() {
        try {
            PackageManager pm = context.getPackageManager();
            Intent intent = new Intent(Intent.ACTION_MAIN, null);
            intent.addCategory(Intent.CATEGORY_LAUNCHER);

            List<ResolveInfo> list = pm.queryIntentActivities(intent, 0);
            JSONArray jsonArray = new JSONArray();

            for (ResolveInfo info : list) {
                String pkg = info.activityInfo.packageName;
                if (!pkg.equals(context.getPackageName())) {
                    JSONObject obj = new JSONObject();
                    obj.put("name", info.loadLabel(pm).toString());
                    obj.put("packageName", pkg);
                    jsonArray.put(obj);
                }
            }
            return jsonArray.toString();
        } catch (Exception e) {
            return "[]";
        }
    }

    @JavascriptInterface
    public void setOverlayOpacity(final float alpha) {
        mainHandler.post(new Runnable() {
            @Override
            public void run() {
                if (context instanceof FloatingGamepadService) {
                    ((FloatingGamepadService) context).updateOverlayOpacity(alpha);
                }
            }
        });
    }

    @JavascriptInterface
    public void setClickthrough(final boolean enabled) {
        mainHandler.post(new Runnable() {
            @Override
            public void run() {
                if (context instanceof FloatingGamepadService) {
                    ((FloatingGamepadService) context).setClickthrough(enabled);
                }
            }
        });
    }

    @JavascriptInterface
    public void vibrate(long durationMs) {
        if (vibrator != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE));
            } else {
                vibrator.vibrate(durationMs);
            }
        }
    }

    @JavascriptInterface
    public void closeOverlay() {
        mainHandler.post(new Runnable() {
            @Override
            public void run() {
                if (context instanceof FloatingGamepadService) {
                    ((FloatingGamepadService) context).stopSelf();
                }
            }
        });
    }
}
