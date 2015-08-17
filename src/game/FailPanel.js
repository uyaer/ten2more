var FailPanel = cc.Layer.extend({
    ctor: function () {
        this._super();

        var mask = new cc.LayerColor(cc.color(0, 0, 0, 100), Const.WIN_W, Const.WIN_H);
        this.addChild(mask);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            }
        }, this);

        //bg
        var box = new cc.Scale9Sprite("game/radius_box.png", cc.rect(25, 25, 1, 1));
        box.width = 620;
        box.height = 450;
        box.anchorX = 0.5;
        box.anchorY = 0.5;
        box.x = Const.WIN_W / 2;
        box.y = Const.WIN_H / 2;
        this.addChild(box);

        var person = new CirPerson();
        box.addChild(person);
        person.x = 100;
        person.y = 300;
        person.showHappy();

        //title
        var tf = new cc.TextFieldTTF("失败了~_~", cc.size(620, 200), cc.TEXT_ALIGNMENT_CENTER, "Arial", 72);
        tf.color = hex2Color(0xffffff);
        tf.anchorX = tf.anchorY = 0;
        tf.x = 0;
        tf.y = 200;
        box.addChild(tf);

        //btn
        var tryBtn = this.makeButton("再试一次", 180, 100, cc.color.WHITE);
        var shareBtn = this.makeButton("请求援助", 450, 100, cc.color.GREEN);
        box.addChild(tryBtn);
        box.addChild(shareBtn);
        tryBtn.addTargetWithActionForControlEvents(this, this.onTryBtnClickHandler, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        shareBtn.addTargetWithActionForControlEvents(this, this.onShareBtnClickHandler, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    },

    /**
     * 创建按钮
     * @param txt
     * @param x
     * @param y
     * @param color 按钮颜色
     * @returns {cc.ControlButton}
     */
    makeButton: function (txt, x, y, color) {
        var box = new cc.Scale9Sprite("game/btn.png", cc.rect(35, 20, 1, 1));
        var titleButton = new cc.LabelTTF(txt, "Arial", 30);
        titleButton.color = cc.color.WHITE;
        var btn = new cc.ControlButton(titleButton, box);
        btn.color = color;
        btn.setMargins(48,12);
        btn.anchorX = 0.5;
        btn.x = x;
        btn.y = y;
        return btn;
    },

    onTryBtnClickHandler: function () {
        GameManager.instance.score = 0;
        GameManager.instance.map = null;
        GameManager.instance.saveData();

        cc.director.runScene(new GameScene());
    },
    onShareBtnClickHandler: function () {
        //TODO Share
    }
});