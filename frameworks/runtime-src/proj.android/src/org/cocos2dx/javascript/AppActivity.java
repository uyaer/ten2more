/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.DialogInterface.OnClickListener;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.uyaer.ten2more.R;

// The name of .so is specified in AndroidMenifest.xml. NativityActivity will load it automatically for you.
// You can use "System.loadLibrary()" to load other .so files.

public class AppActivity extends Cocos2dxActivity {
	private static AppActivity app = null;
	private AdView adView;

	static String hostIPAdress = "0.0.0.0";

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);

		if (nativeIsLandScape()) {
			setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
		} else {
			setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT);
		}
		if (nativeIsDebug()) {
			getWindow().setFlags(
					WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON,
					WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
		}
		hostIPAdress = getHostIpAddress();

		app = this;

		// 创建adView。
		adView = new AdView(this);
		adView.setAdUnitId("ca-app-pub-7430856253637281/7605528259");
		adView.setAdSize(AdSize.BANNER);

		View layout = View.inflate(this, R.layout.ad_layout, null);
		LayoutParams params = new LayoutParams(LayoutParams.WRAP_CONTENT,
				LayoutParams.WRAP_CONTENT);
		params.gravity = Gravity.CENTER;
		this.addContentView(layout, params);

		LinearLayout adCon = (LinearLayout) layout.findViewById(R.id.adCon);
		adCon.addView(adView);

		// 启动一般性请求。
		AdRequest adRequest = new AdRequest.Builder().build();

		// 在adView中加载广告请求。
		adView.loadAd(adRequest);
	}

	@Override
	public void onPause() {
		adView.pause();
		super.onPause();
	}

	@Override
	public void onResume() {
		super.onResume();
		adView.resume();
	}

	@Override
	public void onDestroy() {
		adView.destroy();
		super.onDestroy();
	}

	@Override
	public Cocos2dxGLSurfaceView onCreateView() {
		Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
		// TestCpp should create stencil buffer
		glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

		return glSurfaceView;
	}

	public String getHostIpAddress() {
		WifiManager wifiMgr = (WifiManager) getSystemService(WIFI_SERVICE);
		WifiInfo wifiInfo = wifiMgr.getConnectionInfo();
		int ip = wifiInfo.getIpAddress();
		return ((ip & 0xFF) + "." + ((ip >>>= 8) & 0xFF) + "."
				+ ((ip >>>= 8) & 0xFF) + "." + ((ip >>>= 8) & 0xFF));
	}

	public static String getLocalIpAddress() {
		return hostIPAdress;
	}

	private static native boolean nativeIsLandScape();

	private static native boolean nativeIsDebug();

	/******************************************************************************
	 * 提供给js调用的方法
	 ****************************************************************************** 
	 */

	/**
	 * 提示关闭界面
	 */
	public static void confirmClose() {
		// 这里一定要使用runOnUiThread
		app.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				AlertDialog.Builder builder = new AlertDialog.Builder(app);
				builder.setMessage("确认退出吗？");
				builder.setTitle("提示");
				builder.setPositiveButton("确认", new OnClickListener() {
					@Override
					public void onClick(DialogInterface arg0, int arg1) {
						// 一定要在GL线程中执行
						app.runOnGLThread(new Runnable() {
							@Override
							public void run() {
								Cocos2dxJavascriptJavaBridge
										.evalString("App.closeApp()");
							}
						});
					}
				});
				builder.setNegativeButton("取消", new OnClickListener() {
					@Override
					public void onClick(DialogInterface dialog, int which) {
						dialog.dismiss();
					}
				});
				builder.create().show();
			}
		});
	}

	/**
	 * 进入分享
	 */
	public static void showShare(final String url) {
		// 这里一定要使用runOnUiThread
		app.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				Uri uri = Uri.parse(url);
				Intent it = new Intent(Intent.ACTION_VIEW, uri);
				app.startActivity(it);
			}
		});
	}
}
