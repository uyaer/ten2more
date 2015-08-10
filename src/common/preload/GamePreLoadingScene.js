/**
 * 游戏预加载场景
 * Created by Grape on 2015/6/27.
 */
var GamePreLoadingScene = cc.Scene.extend({

    _interval: null,
    _label: null,
    _className: "GamePreLoadingScene",
    cb: null,
    target: null,

    /**
     * Contructor of cc.GamePreLoadingScene
     * @returns {boolean}
     */
    init: function () {
        var self = this;

        //logo
        var logoWidth = 258;
        var logoHeight = 258;

        // bg
        var bgLayer = self._bgLayer = new cc.LayerGradient(
            hex2Color(0x0a96ef),
            hex2Color(0x0b96ef),
            cc.p(0, 1),
            [{p: 0, color: hex2Color(0x0a96ef)},
                {p: .5, color: hex2Color(0x3dadf5)},
                {p: 1, color: hex2Color(0x0b96ef)}
            ]
        );
        self.addChild(bgLayer, 0);

        //image move to CCSceneFile.js
        var fontSize = 32, lblHeight = -logoHeight / 2 + 100;
        if (cc._loaderImage) {
            //loading logo
            cc.loader.loadImg("res/loading.png", {isCrossOrigin: false}, function (err, img) {
                logoWidth = img.width;
                logoHeight = img.height;
                self._initStage(img, cc.visibleRect.center);
            });
            lblHeight = -logoHeight / 2 - 10;
        }

        //loading percent
        var label = self._label = new cc.LabelTTF("加载中... 0%", "Arial", fontSize);
        label.setPosition(cc.pAdd(cc.visibleRect.center, cc.p(0, lblHeight)));
        label.setColor(cc.color.WHITE);
        bgLayer.addChild(this._label, 10);
        return true;
    },

    _initStage: function (img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = self._logo = new cc.Sprite(texture2d);
        logo.setScale(cc.contentScaleFactor());
        logo.x = centerPos.x;
        logo.y = centerPos.y;
        self._bgLayer.addChild(logo, 10);
    },

    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
    },

    /**
     * custom onExit
     */
    onExit: function () {
        cc.Node.prototype.onExit.call(this);
        var tmpStr = "加载中... 0%";
        this._label.setString(tmpStr);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function (resources, cb, target) {
        if (cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._label.setString("加载中... " + percent + "%");
            }, function () {
                if (self.cb)
                    self.cb.call(self.target);
            });
    }


});

GamePreLoadingScene.preload = function (resources, cb, target) {
    var gamePreLoadingScene = new GamePreLoadingScene();
    gamePreLoadingScene.init();
    gamePreLoadingScene.initWithResources(resources, cb, target);
    cc.director.runScene(gamePreLoadingScene);
    return gamePreLoadingScene;
};