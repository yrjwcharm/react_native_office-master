package com.zqoffice.update;

import android.util.Log;

public class Logger {
	private static final String TAG = "ZQIM";

	public static void put(String message) {
			Log.v("ReactNativeJS", message);
	}
}
