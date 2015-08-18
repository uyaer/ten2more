var IndexScene = cc.Scene.extend({
    /**
     * @type cc.LayerColor
     */
    colorbg: null,
    /**
     * @type cc.Sprite
     */
    bottomSp: null,
    /**
     * @type cc.Sprite
     */
    titleSp: null,
    /**
     * @type
     */
    startBtn: null,
    /**
     * @type
     */
    shareBtn: null,
    ctor: function () {
        this._super();

        this.colorbg = new cc.LayerColor(hex2Color(0xa1edf8), Const.WIN_W, Const.WIN_H);
        this.addChild(this.colorbg);

        this.bottomSp = new cc.Sprite("#game/index.png");
        this.bottomSp.anchorX = 0;
        this.bottomSp.anchorY = 0;
        this.addChild(this.bottomSp);

        this.makeCloud();

        this.makeTitle();

        this.makeStartButton();
    },

    makeStartButton: function () {
        //start button
        this.startBtn = this.createButton("开始游戏",Const.WIN_H*0.475,cc.color.WHITE);
        this.startBtn.addTargetWithActionForControlEvents(this, this.onStartBtnClickHandler, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        this.shareBtn = this.createButton("分享快乐",Const.WIN_H*0.45 - 86,cc.color.GREEN);
        this.shareBtn.addTargetWithActionForControlEvents(this, this.onShareBtnClickHandler, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    },

    createButton: function (txt, y,color) {
        var box = new cc.Scale9Sprite("game/start.png",cc.rect(138,35,1,1));
        box.color = color;
        var titleButton = new cc.LabelTTF(txt, "Arial", 40);
        titleButton.color = cc.color.WHITE;
        var btn = new cc.ControlButton(titleButton, box);
        btn.setMargins(80,12);
        this.addChild(btn);
        btn.x = Const.WIN_W *0.5;
        btn.y = y;
        return btn;
    },

    onStartBtnClickHandler: function () {
        cc.director.runScene(new cc.TransitionFade(0.5, new GameScene(), hex2Color(0xb8af9e)));
    },

    onShareBtnClickHandler: function () {
        //TODO Share
    },

    makeTitle: function () {
        this.titleSp = new cc.Sprite("#game/title.png");
        this.titleSp.x = Const.WIN_W / 2;
        this.titleSp.y = Const.WIN_H * 0.675;
        this.addChild(this.titleSp);
    },

    makeCloud: function () {
        var every = (Const.WIN_H - 500) / 6;

        for (var i = 0; i < 3; i++) {
            var cloud = new cc.Sprite("#game/cloud.png");
            cloud.scale = Math.random() * 0.2 + 0.8;
            cloud.x = 0;
            cloud.y = 500 + (i * 2 + 1) * every;
            this.addChild(cloud);
            cloud.runAction(cc.sequence(
                cc.moveBy(randomInt(10, 25), 800, 0),
                cc.moveBy(randomInt(10, 25), -800, 0)
            ).repeatForever());
        }
    }
});