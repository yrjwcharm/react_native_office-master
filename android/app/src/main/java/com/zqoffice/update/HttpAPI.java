package com.zqoffice.update;

import java.io.UnsupportedEncodingException;

public class HttpAPI {
	public static final String HostAddress = "192.168.160.84";
	//检查更新
	public static final String URL_checkUpdate = "http://" + HostAddress + ":8081/bpm/task/findLatestVersionByPlatform.do?platform=0";
}
