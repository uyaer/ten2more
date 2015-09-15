//////////////////////////////////////
///////////////  plus ///////////////////////
////////////////         //////////////////////
/////////////////             /////////////////////
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
    cc.director.end();
}

App.showShare = function () {
    var lang = Const.LANG;

    var url = "http://uyaer.qiniudn.com/share.html?lang=" + lang +
        "&icon=_games/ten2more/icon512.png" +
        "&name=" + (lang == "zh" ? "十分完美" : "ten%20dots") +
        "&pic=http://uyaer.qiniudn.com/images/7.png" +
        "&title=" + (lang == "zh" ? "很好玩的游戏" : "A fun game with you!") +
        "&desc=" + (lang == "zh" ? "喜欢2048吗？玩过两点一线吗？那一定要来试一试这款游戏，非常好玩哦！" : "2048 like it? and two dots? It must be to try this game, very fun oh!") +
        "&r=" + Date.now() +
        "&url=http://uyaer.qiniudn.com/?v" + Date.now() + "#game-7";
    if (cc.sys.isNative) {
        jsb.reflection.callStaticMethod(App.__android_class, "showShare", "(Ljava/lang/String;)V", url);
    } else {
        window.open(url);
    }
}
