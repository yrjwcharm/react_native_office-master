package com.zqoffice.update;

import android.os.Handler;
import android.util.Log;
import android.os.Looper;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import android.util.Log;

public class VersionCheckModule extends ReactContextBaseJavaModule {
    private Context mContext;

    public interface VersionCheckHandler {
        void onHasUpdate(Callback callback);
    }

    public VersionCheckModule(VersionManager verman, ReactApplicationContext reactContext) {
        super(reactContext);
        mVerMan = verman;
        mContext = reactContext;
    }

    public VersionCheckModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
     return "VersionCheckModule";
    }

    public synchronized void setHandler(VersionCheckHandler handler) {
        mCheckHandler = handler;
    }

    @ReactMethod
    public void startCheck(final Callback callback) {
        Log.v("ReactNativeJS", "startCheck");
        String strVersion = "";
		    try {
			       strVersion = mContext.getPackageManager()
				     .getPackageInfo(mContext.getPackageName(), 0).versionName;
		         } catch (PackageManager.NameNotFoundException e) {
			            e.printStackTrace();
        }
		    VersionManager.setVersion(strVersion);
        if (mVerMan == null) return;
        (mThreadVersionCheck = new Thread(null, new Runnable() {
            public void run() {
              if (mVerMan.checkVersion() && mVerMan.needUpdate()) {
                try {
    					         Thread.sleep(3000);
    				        } catch (InterruptedException e) {
    					         e.printStackTrace();
    				        }
                Looper.prepare();
                mHandler = new Handler();
                mHandler.post(new Runnable() {
                  public void run() {
                    notifyNeedUpdate(callback);
                  }
                });
                Looper.loop();
              }
            }
        }, "version_check")).start();
    }

    @ReactMethod
    public synchronized void startUpdate(final Callback callback) {
        if (mVerMan == null) return;

        (mThreadVersionUpdate = new Thread(null, new Runnable() {
            public void run() {
                callback.invoke(mVerMan.performUpdate());
            }
        }, "version_update")).start();
    }

    public synchronized void notifyExitApp() {
        if (mVerMan == null) return;

        (mThreadNotifyExit = new Thread(null, new Runnable() {
            public void run() {
            //    mVerMan.notifyAppExit();
            }
        }, "notify_exit")).start();
    }

    @ReactMethod
    public synchronized void shutdown() {
		try {
	    	if (mThreadVersionCheck != null) {
	    		mThreadVersionCheck.join(1000);
	    	}

	    	if (mThreadVersionUpdate != null) {
	    		mThreadVersionUpdate.join(1000);
	    	}

	    	if (mThreadNotifyExit != null) {
	    		mThreadNotifyExit.join(1000);
	    	}
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
    }

    private synchronized void notifyNeedUpdate(Callback callback) {
        if (mCheckHandler != null) {
            mCheckHandler.onHasUpdate(callback);
        }
    }

    public synchronized void stopThread() {
    	mThreadVersionUpdate.interrupt();
    }

    private VersionManager mVerMan = null;

    private Handler mHandler;
    private VersionCheckHandler mCheckHandler = null;

    private Thread mThreadVersionCheck = null;
    private Thread mThreadVersionUpdate = null;
    private Thread mThreadNotifyExit = null;
}
