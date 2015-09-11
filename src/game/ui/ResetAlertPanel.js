var ResetAlertPanel = cc.Layer.extend({
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
        box.width = 500;
        box.height = 320;
        box.anchorX = 0.5;
        box.anchorY = 0.5;
        box.x = Const.WIN_W / 2;
        box.y = Const.WIN_H / 2;
        this.addChild(box);

        //title
        var tf = new cc.LabelTTF(Lang.i18n(13), "Arial", 42, cc.size(500, 70), cc.TEXT_ALIGNMENT_CENTER);//提醒
        tf.color = hex2Color(0x630b0b);
        tf.anchorX = tf.anchorY = 0;
        tf.x = 0;
        tf.y = 220;
        box.addChild(tf);
        //txt
        //重新开始会清除现在的数据！
        var tf = new cc.LabelTTF(Lang.i18n(14), "Arial", 32, cc.size(500, 70), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        tf.anchorX = 0;
        tf.anchorY = 0;
        tf.y = 150;
        tf.color = hex2Color(0xffffff);
        box.addChild(tf);

        //btn
        var okBtn = this.makeButton(Lang.i18n(15), 140, 70, cc.color.RED, 186);//确定
        var cancelBtn = this.makeButton(Lang.i18n(16), 370, 70, cc.color.WHITE, 186);//取消
        box.addChild(okBtn);
        box.addChild(cancelBtn);
        okBtn.addTargetWithActionForControlEvents(this, this.onOkBtnClickHandler, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
        cancelBtn.addTargetWithActionForControlEvents(this, this.onCancelBtnClickHandler, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    },

    /**
     * 创建按钮
     * @param txt
     * @param x
     * @param y
     * @param color 按钮颜色
     * @returns {cc.ControlButton}
     */
    makeButton: function (txt, x, y, color, w) {
        var box = new cc.Scale9Sprite("game/btn.png", cc.rect(35, 20, 1, 1));
        var titleButton = new cc.LabelTTF(txt, "Arial", 30);
        titleButton.color = cc.color.WHITE;
        var btn = new cc.ControlButton(titleButton, box);
        btn.color = color;
        btn.setMargins((w - titleButton.width) / 2, 12);
        btn.anchorX = 0.5;
        btn.x = x;
        btn.y = y;
        return btn;
    },

    onOkBtnClickHandler: function () {
        PopUpManager.remove(this);

        GameManager.instance.score = 0;
        GameManager.instance.map = null;
        GameManager.instance.saveData();

        cc.director.runScene(new GameScene());
    },
    onCancelBtnClickHandler: function () {
        PopUpManager.remove(this);
    }
});