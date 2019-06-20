package com.zqoffice.update;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.net.URLEncoder;

import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.zqoffice.update.HttpAPI;
// import com.zoom.zqim.util.HttpEngine;
// import com.zoom.zqim.util.Logger;
// import com.zoom.zqim.util.ZQSecure;

public class VersionManager {

	public VersionManager(Context theContext) {

		mContext = theContext;

		try {
			mTargetPackage = File.createTempFile(kTempFilePrefix, ".apk");
		} catch (IOException e) {
			e.printStackTrace();
			Logger.put("update Failed to create temp file.");
		}
	}

	public static void setVersion(String str) {

		strVersion = str;
	}

	public static String getVersion() {

		return strVersion;
	}

	public void notifyAppExit() {
		String request = makeCheckRequest();
		request += "&action=exit";
		HttpEngine.getStringWith(request);
	}

	public boolean checkVersion() {
		Log.v("ReactNativeJS", "checkVersion");
		mNeedUpdate = false;
		String request = makeCheckRequest();
		String result = null;
		String strResponse = HttpEngine.getStringWith(request);
		if (strResponse == null || strResponse.length() <= 0)
			return false;
		JSONObject jsonObj;
		try {
			jsonObj = new JSONObject(strResponse);
			String info = jsonObj.getString("infos");
			JSONObject infoJsonObj = new JSONObject(info);
			String appInfo = infoJsonObj.getString("appInfo");
			JSONObject appInfoObj = new JSONObject(appInfo);
			mUpdateFileVersion = appInfoObj.getString("version");
			String downloadUrl = appInfoObj.getString("appDownloadUrl");
			Log.v("ReactNativeJS mUpdateFileVersion", mUpdateFileVersion);
			Log.v("ReactNativeJS getVersion()", getVersion());
			Log.v("ReactNativeJS mUpdateFileVersion.compareTo(getVersion())", "" + mUpdateFileVersion.compareTo(getVersion()));
			if (mUpdateFileVersion.compareTo(getVersion()) > 0)
					result = downloadUrl;
		} catch (JSONException e) {
			e.printStackTrace();
			return false;
		}

		return handleCheckResult(result);
	}

	public boolean needUpdate() {
		return mNeedUpdate;
	}

	public boolean performUpdate() {
		if (mNeedUpdate) {
			clearTempFiles();
			Logger.put("update mUpdateUri  = " + mUpdateUri);
			if (downloadFile(mUpdateUri)) {
				return installPackage();
			}
		}

		return false;
	}

	private String makeCheckRequest() {
		if (mDebugUpdate) {
			return "";
		} else {
		//	return String.format(HttpAPI.URL_GetVersion, URLEncoder.encode(ZQSecure.encrypt("android")));
      return HttpAPI.URL_checkUpdate;
		}
	}

	private boolean handleCheckResult(String response) {
		if ((response == null) || (response.trim().length() == 0)) {
			mNeedUpdate = false;
			Logger.put("It's already the latest version.");
		} else {
			mNeedUpdate = true;
			mUpdateRootDir = response.trim();
			mUpdateUri = mUpdateRootDir;
			Logger.put("There is new version to update.");
		}

		return true;
	}

	private boolean downloadFile(String uri) {
		return HttpEngine.getFileWith(uri, mTargetPackage);
	}

	private void clearTempFiles() {
		File parent = mTargetPackage.getParentFile();
		File[] files = parent.listFiles(new FilenameFilter() {
			public boolean accept(File dir, String file) {
				// CoolConLog.put("Filtering file - " + file);
				return (file.startsWith(kTempFilePrefix) && file
						.endsWith(".apk"));
			}
		});

		if (files != null) {
			for (File file : files) {
				// CoolConLog.put("Deleting file - " + file.getAbsolutePath());
				file.delete();
			}
		}
	}

	private boolean installPackage() {

		Intent intent = new Intent(Intent.ACTION_VIEW);
		String intent_type = "application/vnd.android.package-archive";
		Uri uri = Uri.fromFile(mTargetPackage);
		setRunnable(mTargetPackage);
		int flags = Intent.FLAG_ACTIVITY_NEW_TASK;
		if (uri != null) {
			Logger.put("update URI  = " + uri.toString());
			intent = intent.setDataAndType(uri, intent_type).addFlags(flags);

			try {
				Logger.put("  update Intent: data - " + intent.getData().toString()
						+ ", type = " + intent.getType());
				mContext.startActivity(intent);
				System.exit(0);
			} catch (Exception exception) {
				Logger.put("update Exception: " + exception.toString());
				return false;
			}

			return true;
		}

		return false;
	}

	private void setRunnable(File file) {

		file.setReadable(true, false);
		file.setWritable(true, false);
	}

	private Context mContext;

	private String mUpdateUri;
	private String mUpdateRootDir;
	private File mTargetPackage;
	private boolean mNeedUpdate;
	private boolean mDebugUpdate = false;

	private String mUpdateFileName;
	private String mUpdateFileVersion;

	private static String strVersion = "?.?.?";


	private final static String kTempFilePrefix = ".zoom-tmp-";
}
