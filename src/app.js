/**
 * 和Native交换的工具
 */
var App = {};
App.__android_class = "org/cocos2dx/javascript/AppActivity";

/**
 * 向android端发送请求关闭
 */
App.showConfirmClose = function () {
    jsb.reflection.callStaticMethod(App.__android_class, "confirmClose", "()V");
}
/**
 * 关闭应用
 */
App.closeApp = function () {
    anysdk.AgentManager.end();
    cc.director.end();
}
/////////////////////////////////////////////////////
/////anysdk
App.adPlugin = null;
App.initAnySdk = function () {
    if (!cc.sys.isNative)return;
    //注意：这里appKey, appSecret, privateKey，要替换成自己打包工具里面的值(登录打包工具，游戏管理界面上显示的那三个参数)。
    var appKey = "05F78A7B-AE83-4935-170E-2F8396B4DB23";
    var appSecret = "0eb5d6906bfa41581885fa4bcd315be0";
    var privateKey = "29FC92F8EFD8C342AB9D960E981C0F8A";
    var oauthLoginServer = "";
    var agent = anysdk.AgentManager.getInstance();
    //init
    agent.init(appKey, appSecret, privateKey, oauthLoginServer);
    //load
    agent.loadAllPlugins();
    App.adPlugin = agent.getAdsPlugin();
    App.preloadCpAd();
}

/**
 * 显示插屏广告
 */
App.showCpAd = function () {
    App.adPlugin.showAds(AdsType.AD_TYPE_FULLSCREEN);
}
/**
 * 隐藏插屏广告
 */
App.hideCpAd = function () {
    App.adPlugin.hideAds(AdsType.AD_TYPE_FULLSCREEN);
}
/**
 * 预加载插屏广告
 */
App.preloadCpAd = function () {
    App.adPlugin.preloadAds(AdsType.AD_TYPE_FULLSCREEN)
}