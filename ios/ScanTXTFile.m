#import <Foundation/Foundation.h>
//#import <MobileCoreServices/MobileCoreServices.h>
#import <UIKit/UIKit.h>
//#import <AssetsLibrary/AssetsLibrary.h>

#import "RCTBridgeModule.h"
//#import "RCTLog.h"
//#import "RCTUIManager.h"
//#import "RCTBridge.h"
@interface ScanTXTFile : NSObject <RCTBridgeModule>
{
//  APP根视图控制器
  UIViewController*_ctrl;
//  覆盖原根视图的容器View
  UIView *_containerV;
//  记录原始的根视图View
  UIView *_originalV;
}
@end

@implementation ScanTXTFile
//@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();
- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}
RCT_EXPORT_METHOD(scanFile:(NSString *)filePath)
{
  UIView *navigationV=[self createNavigationBar];
  UIWebView *webV = [[UIWebView alloc]initWithFrame:CGRectMake(0, CGRectGetMaxY(navigationV.frame), CGRectGetWidth([UIScreen mainScreen].bounds), CGRectGetHeight([UIScreen mainScreen].bounds))];
  webV.backgroundColor = [UIColor whiteColor];
  [_containerV addSubview:webV];
  ///编码可以解决 .txt 中文显示乱码问题
  NSStringEncoding *useEncodeing = nil;
  //带编码头的如utf-8等，这里会识别出来
  NSError *error;
  NSString *body = [NSString stringWithContentsOfFile:filePath usedEncoding:useEncodeing error:&error];
  //识别不到，按GBK编码再解码一次.这里不能先按GB18030解码，否则会出现整个文档无换行bug。
  if (!body) {
    body = [NSString stringWithContentsOfFile:filePath encoding:0x80000632 error:nil];
  }
  //还是识别不到，按GB18030编码再解码一次.
  if (!body) {
    body = [NSString stringWithContentsOfFile:filePath encoding:0x80000631 error:nil];
  }

  //展现
  if (body) {
    [webV loadHTMLString:body baseURL: nil];
  }else {
    NSString *urlString = [[NSBundle mainBundle] pathForAuxiliaryExecutable:filePath];
    urlString = [urlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSURL *requestUrl = [NSURL URLWithString:urlString];
    NSURLRequest *request = [NSURLRequest requestWithURL:requestUrl];
    [webV loadRequest:request];
    }
}
-(UIView*)createNavigationBar
{
  UIView *navigatinBarV = [[UIView alloc]initWithFrame:CGRectMake(0, 20, CGRectGetWidth([UIScreen mainScreen].bounds), 48)];
  navigatinBarV.backgroundColor = [UIColor colorWithRed:1.0 green:152/255.0 blue:0 alpha:1.0];
  UIButton *backBt = [UIButton buttonWithType:UIButtonTypeCustom];
  [backBt setImage:[UIImage imageNamed:@"icon_back"] forState:UIControlStateNormal];
  backBt.frame = CGRectMake(8, 12, 24, 24);
  [navigatinBarV addSubview:backBt];
  UILabel *backLabel = [[UILabel alloc]initWithFrame:CGRectMake(CGRectGetMaxX(backBt.frame)+15, CGRectGetMinY(backBt.frame), 40, 24)];
  backLabel.textAlignment = NSTextAlignmentCenter;
  backLabel.text = @"返回";
  backLabel.font = [UIFont systemFontOfSize:20];
  backLabel.textColor = [UIColor whiteColor];
  [navigatinBarV addSubview:backLabel];
  [backBt addTarget:self action:@selector(backAction:) forControlEvents:UIControlEventTouchUpInside];
  _ctrl = UIApplication.sharedApplication.delegate.window.rootViewController;
  _containerV = [[UIView alloc]initWithFrame:[UIScreen mainScreen].bounds];
  [_containerV addSubview:navigatinBarV];
  _containerV.backgroundColor = [UIColor whiteColor];
  _originalV = _ctrl.view;
  _ctrl.view = _containerV;
  return navigatinBarV;
}
//替换根视图
-(void)backAction:(UIButton*)sender
{
  _ctrl.view = _originalV;
  _containerV = nil;
}

@end
