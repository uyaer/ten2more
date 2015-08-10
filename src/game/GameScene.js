var GameScene = cc.Scene.extend({
    ctor: function () {
        this._super();

        this.makeBackground();
    },

    /**
     *创建背景
     */
    makeBackground: function () {
        var colorBg = new cc.LayerColor.extend(hex2Color(0xb8af9e), Const.WIN_W, Const.WIN_H);
        this.addChild(colorBg);
    }
})