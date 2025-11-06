package io.ionic.starter;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (Build.VERSION.SDK_INT >= 35) {
      final View root = getWindow().getDecorView().findViewById(android.R.id.content);
      ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
        int top = insets.getInsets(WindowInsetsCompat.Type.statusBars()).top;
        int bottom = insets.getInsets(WindowInsetsCompat.Type.navigationBars()).bottom;

        v.setPadding(0, top, 0, bottom);
        v.setBackgroundColor(getResources().getColor(com.getcapacitor.android.R.color.colorPrimary));

        return insets;
      });
    }
    this.bridge.getWebView().setBackgroundColor(getResources().getColor(com.getcapacitor.android.R.color.colorPrimary));

    WebView webView = (WebView) this.bridge.getWebView();
  }
}
