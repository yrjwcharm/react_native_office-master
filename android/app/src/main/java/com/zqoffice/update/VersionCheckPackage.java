package com.zqoffice.update;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.Callback;
import com.zqoffice.update.VersionCheckModule.VersionCheckHandler;

import java.util.*;

public class VersionCheckPackage implements ReactPackage {
  private VersionCheckModule mVersionCheckModule = null;

  @Override
  public List<Class<? extends JavaScriptModule>> createJSModules() {
    return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    VersionManager ver_man = new VersionManager(reactContext);
    mVersionCheckModule = new VersionCheckModule(ver_man, reactContext);
    mVersionCheckModule.setHandler(new VersionCheckHandler() {
      public void onHasUpdate(Callback callback) {
        callback.invoke("");
      }
    });
    modules.add(mVersionCheckModule);
    return modules;
  }
}
