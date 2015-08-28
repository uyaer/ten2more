/**
 * ———————————————————————————————————————————————————————————
 |--------------------------_ooOoo_------------------------|
 |------------------------o888888888o----------------------|
 |------------------------88"" . ""88----------------------|
 |------------------------(|  - -  |)----------------------|
 |------------------------0\   =   /0----------------------|
 |------------------------_/` --- '\____-------------------|
 |-------------------.'  \\|       |//  `. ----------------|
 |------------------/  \\|||   :   |||//  \ ---------------|
 |---------------- /  _|||||  -:-  |||||-  \---------------|
 |---------------- |   | \\\   -   /// |   |---------------|
 |---------------- | \_|  ``\ --- /''  |   |---------------|
 |---------------- \  .-\__   `-'   ___/-. / --------------|
 |--------------___ `. . '  /--.--\  '. . __---------------|
 |-----------.""  '<  `.___ \_<|>_/___.'  >'"". -----------|
 |----------| | :   `- \`.;` \ _ /`;.`/ - ` : | |----------|
 |----------\  \ `-.    \_  __\ /__ _/   .-` /  /----------|
 |===========`-.____`-.___ \______/___.-`____.-'===========|
 |--------------------------`=---='------------------------|
 |^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^|
 |------佛祖保留 ---------------永无BUG---------------永不修改-----|
 |-----------------------------*---------------------------|
 |-----------------------------*---------------------------|
 |-----------------------------*---------------------------|
 |--------------------------初始化成功！-----------------------|
 |-----------------------------*---------------------------|
 |-----------------------------*---------------------------|
 |-----------------------------*---------------------------|
 |-------------------------不修改属性激活 -----------------------|
 ———————————————————————————————————————————————————————————
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

cc.game.onStart = function () {
    cc.view.adjustViewPort(true);
    cc.view.enableRetina(true);
    if (cc.sys.isMobile) {
        cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_WIDTH);
    } else {
        cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
    }
    cc.view.resizeWithBrowserSize(true);

    Const.WIN_W = cc.winSize.width;
    Const.WIN_H = cc.winSize.height;

    cc.director.setProjection(cc.Director.PROJECTION_2D);

    //load resources
    cc.LoaderScene.preload(g_logo, function () {

        cc.director.runScene(new LogoScene(function () {
            GameManager.instance.init();
            Lang.init();
            cc.spriteFrameCache.addSpriteFrames(res.game_plist, res.game_png);
            cc.director.runScene(new cc.TransitionFade(0.5, new IndexScene(), hex2Color(0xa1edf8)));
        }));

    }, this);


    var delayResizeId = 0;
    cc.view.setResizeCallback(function () {
        clearTimeout(delayResizeId);
        delayResizeId = setTimeout(onResize, 200);
    });

    function onResize() {
        if (cc.sys.isMobile) {
            cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.FIXED_WIDTH);
        }
        Const.WIN_W = cc.winSize.width;
        Const.WIN_H = cc.winSize.height;

        cc.eventManager.dispatchCustomEvent(GameEvent.WIN_LAYOUT);
    }
};
cc.game.run();
