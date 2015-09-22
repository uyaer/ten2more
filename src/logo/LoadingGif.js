/**
 * 网络状态繁忙
 */
var LoadingGif = cc.LayerColor.extend({
    /**
     * @type Array
     */
    cubeArr: null,
    ctor: function () {
        this._super(cc.color(0, 0, 0, 128), Const.WIN_W, Const.WIN_H);

        this.cubeArr = [];
        for (var i = 0; i < 3; i++) {
            var cube = new cc.LayerColor(hex2Color(0xFFFFFF), 20, 65);
            cube.x = Const.WIN_W * 0.5 - 30 + 30 * i;
            cube.y = Const.WIN_H * 0.5;
            this.addChild(cube);
            this.cubeArr.push(cube);
        }


        maskTouchEvent(this);
    },

    onEnter: function () {
        this._super();

        for (var i = 0; i < this.cubeArr.length; i++) {
            var cube = this.cubeArr[i];
            cube.runAction(cc.sequence(
                cc.delayTime(i * 0.2),
                cc.callFunc(function (cube) {
                    cube.runAction(cc.sequence(
                        cc.scaleTo(0.3, 1, 2),
                        cc.scaleTo(0.3, 1, 1),
                        cc.delayTime(0.3)
                    ).repeatForever());
                }, this,cube)
            ));
        }
    },

    onExit: function () {
        this._super();

        for (var i = 0; i < this.cubeArr.length; i++) {
            var cube = this.cubeArr[i];
            cube.stopAllActions();
        }
    }
});

var __loadingGif;

/**
 * 显示加载状态
 * @param node {cc.Node}
 */
LoadingGif.show = function (node) {
    if (!__loadingGif) {
        __loadingGif = new LoadingGif();
        __loadingGif.retain();
    }
    if (__loadingGif.parent) {
        __loadingGif.removeFromParent(false);
    }
    node.addChild(__loadingGif, 1000);
}

LoadingGif.hide = function () {
    if (!__loadingGif) {
        return;
    }
    if (__loadingGif.parent) {
        __loadingGif.removeFromParent(false);
    }
}