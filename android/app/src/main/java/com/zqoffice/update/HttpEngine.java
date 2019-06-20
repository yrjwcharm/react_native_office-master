package com.zqoffice.update;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.SocketTimeoutException;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpConnectionParams;

import android.util.Log;

import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.BinaryHttpResponseHandler;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import com.zqoffice.update.Logger;
import com.zqoffice.update.ZQSecure;

public class HttpEngine {

	public static String getStringWith(String request) {
		Logger.put("request of HttpEngine getStringWith(String request) = " + request);
		dumpRequestString(request);
		HttpClient httpClient = new DefaultHttpClient();
		HttpGet httpGet = new HttpGet(request);
		HttpResponse httpResponse = null;
		/* 连接超时 */
		HttpConnectionParams.setConnectionTimeout(httpClient.getParams(), 10000);
		/* 请求超时 */
		HttpConnectionParams.setSoTimeout(httpClient.getParams(), 10000);

		try {
			httpResponse = httpClient.execute(httpGet);
			if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
				InputStream content = httpResponse.getEntity().getContent();
				InputStreamReader isreader = new InputStreamReader(content);
				BufferedReader reader = new BufferedReader(isreader);
				return ZQSecure.decrypt(reader.readLine());
			} else {
				return null;
			}
		} catch (ConnectTimeoutException e) {
			// 捕获ConnectionTimeout
			Log.d("err", "与服务器建立连接超时");
			return null;
		} catch (SocketTimeoutException e) {
			// 捕获SocketTimeout
			Log.d("err", "从服务器获取响应数据超时");
			return null;
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;

	}

	public static String _getStringWith(String request) {
		Logger.put("request of HttpEngine getStringWith(String request) = " + request);
		dumpRequestString(request);
		HttpClient httpClient = new DefaultHttpClient();
		HttpGet httpGet = new HttpGet(request);
		HttpResponse httpResponse = null;
		/* 连接超时 */
		HttpConnectionParams.setConnectionTimeout(httpClient.getParams(), 2000);
		/* 请求超时 */
		HttpConnectionParams.setSoTimeout(httpClient.getParams(), 2000);

		try {
			httpResponse = httpClient.execute(httpGet);
			if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
				InputStream content = httpResponse.getEntity().getContent();
				InputStreamReader isreader = new InputStreamReader(content);
				BufferedReader reader = new BufferedReader(isreader);
				return reader.readLine();
			} else {
				return null;
			}
		} catch (ConnectTimeoutException e) {
			// 捕获ConnectionTimeout
			Log.d("err", "与服务器建立连接超时");
			return null;
		} catch (SocketTimeoutException e) {
			// 捕获SocketTimeout
			Log.d("err", "从服务器获取响应数据超时");
			return null;
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;

	}

	public static boolean getFileWith(String request, File file) {
		dumpRequestString(request);

		try {
			FileOutputStream stream = new FileOutputStream(file);
			try {
				HttpClient httpClient = new DefaultHttpClient();
				HttpGet httpGet = new HttpGet(request);
				HttpResponse httpResponse = httpClient.execute(httpGet);
				httpResponse.getEntity().writeTo(stream);

				Log.i(TAG,
						String.format("Downloaded to %s.",
								file.getAbsolutePath()));
				Log.i(TAG, String.format("Size: %d.", file.length()));
				return true;
			} finally {
				stream.close();
			}
		} catch (IOException e) {
			// e.printStackTrace();
			Log.i(TAG, e.toString());
		}

		return false;
	}

	private static void dumpRequestString(String uri) {
		if (kDumpRequest) {
			Log.i(TAG, String.format("Http Req: %s", uri));
		}
	}

	private static final boolean kDumpRequest = false;
	private final static String TAG = "ZQIM";

	private static AsyncHttpClient client = new AsyncHttpClient(); // 实例话对象
	static {
		client.setTimeout(10000); // 设置链接超时，如果不设置，默认为10s
	}

	public static void get(String urlString, AsyncHttpResponseHandler res) // 用一个完整url获取一个string对象
	{
		client.get(urlString, res);
	}

	public static void get(String urlString, RequestParams params,
			AsyncHttpResponseHandler res) // url里面带参数
	{
		if(params == null)
			client.get(urlString, res);
		else
			client.post(urlString, params, res);
	}

	public static void get(String urlString, JsonHttpResponseHandler res) // 不带参数，获取json对象或者数组
	{
		client.get(urlString, res);
	}

	public static void get(String urlString, RequestParams params,
			JsonHttpResponseHandler res) // 带参数，获取json对象或者数组
	{
		client.get(urlString, params, res);
	}

	public static void get(String uString, RequestParams params, BinaryHttpResponseHandler bHandler) // 下载数据使用，会返回byte数据
	{
		client.get(uString, params, bHandler);
	}

	public static AsyncHttpClient getClient() {
		return client;
	}
}
