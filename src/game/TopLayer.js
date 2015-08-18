var TopLayer = cc.Layer.extend({
    /**
     * @type cc.LabelTTF
     */
    maxScoreTF: null,
    /**
     * @type cc.LabelTTF
     */
    playCountTF: null,
    /**
     * @type cc.LabelTTF
     */
    scoreTF: null,
    /**
     * @type cc.ControlSwitch
     */
    musicSwitch: null,

    /**
     * @type cc.Scale9Sprite
     */
    addTipBox: null,
    /**
     * @type cc.LabelTTF
     */
    addTipTF: null,

    ctor: function () {
        this._super();

        this.y = Const.WIN_H;

        this.makeMenu();
        this.makeInfo();
        this.makeHelp();
        this.makeAddTip();

        this.scoreTF.setString(GameManager.instance.score + "");
        this.maxScoreTF.setString(GameManager.instance.maxScore + "");
        this.playCountTF.setString(GameManager.instance.playCount + "");
    },

    /**
     * 创建菜单相关的
     */
    makeMenu: function () {
        var colorBg = new cc.LayerColor(hex2Color(0xdf8c2c), Const.WIN_W, 70);
        colorBg.y = -70;
        this.addChild(colorBg);
        var border = new cc.LayerColor(hex2Color(0xac6109), Const.WIN_W, 2);
        border.y = -1;
        colorBg.addChild(border);

        //music txt
        var tf = new cc.LabelTTF("音乐",  "Arial", 32,cc.size(100, 70), cc.TEXT_ALIGNMENT_RIGHT,cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        tf.anchorX = 1;
        tf.anchorY = 0;
        tf.x = 100;
        tf.y = 0;
        tf.color = hex2Color(0xffffff);
        colorBg.addChild(tf);

        //switch
        this.musicSwitch = new cc.ControlSwitch
        (
            new cc.Sprite("res/switch-mask.png"),
            new cc.Sprite("res/switch-on.png"),
            new cc.Sprite("res/switch-off.png"),
            new cc.Sprite("res/switch-thumb.png"),
            new cc.LabelTTF("开", "Arial", 32),
            new cc.LabelTTF("关", "Arial", 32)
        );
        this.musicSwitch.anchorX = 0;
        this.musicSwitch.x = 120;
        this.musicSwitch.y = 35;
        colorBg.addChild(this.musicSwitch);
        this.musicSwitch.addTargetWithActionForControlEvents(this, this.onMusicValueChanged, cc.CONTROL_EVENT_VALUECHANGED);
        this.onMusicValueChanged(this.musicSwitch);

        //version tf
        //music txt
        var tf = new cc.LabelTTF(Const.VERSION, "Arial", 22,cc.size(200, 70), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        tf.anchorX = 0.5;
        tf.anchorY = 0;
        tf.x = Const.WIN_W / 2;
        tf.y = 0;
        tf.color = hex2Color(0xffffff);
        colorBg.addChild(tf);

        //reset button
        var box = new cc.Scale9Sprite("game/btn.png", cc.rect(35, 20, 1, 1));
        //box.setContentSize(size);
        var titleButton = new cc.LabelTTF("重新开始", "Arial", 30);
        titleButton.color = cc.color.WHITE;
        var btn = new cc.ControlButton(titleButton, box);
        colorBg.addChild(btn);
        btn.x = Const.WIN_W - 90;
        btn.y = 35;
        btn.addTargetWithActionForControlEvents(this, this.onResetBtnClickHandler, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    },

    onResetBtnClickHandler: function () {
        var alert = new ResetAlertPanel();
        PopUpManager.add(alert);
    },

    onMusicValueChanged: function (sender, controlEvent) {
        if (sender.isOn()) {
            //this._displayValueLabel.setString("On");
        }
        else {
            //this._displayValueLabel.setString("Off");
        }
    },

    /**
     * 创建信息相关的
     */
    makeInfo: function () {
        var posArr = [cc.p(150, 10), cc.p(150, 80), cc.p(480, 10)];
        var sizeArr = [cc.size(200, 65), cc.size(200, 65), cc.size(220, 135)];
        var labelTxtArr = ["最高分数", "挑战次数", "当前分数"];

        for (var i = 0; i < posArr.length; i++) {
            /**@type cc.Point*/
            var pos = cc.pAdd(posArr[i], cc.p(0, 70));
            /**@type cc.Size*/
            var size = sizeArr[i];
            //背景
            var box = new cc.Scale9Sprite("game/radius_box.png", cc.rect(25, 25, 1, 1));
            box.anchorX = 0;
            box.anchorY = 1;
            box.x = pos.x;
            box.y = -pos.y;
            box.setContentSize(size);
            this.addChild(box);
            //text
            var txtSize = limit(int(size.height / 65), 1, 2) == 1 ? 30 : 46;
            var tf = new cc.LabelTTF(labelTxtArr[i], "Arial", txtSize, cc.size(120, size.height), cc.TEXT_ALIGNMENT_RIGHT,cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            tf.anchorX = 1;
            tf.anchorY = 1;
            tf.x = pos.x - 10;
            tf.y = -pos.y;
            tf.color = hex2Color(0x323231);
            this.addChild(tf);
            //show num txt
            var tf = new cc.LabelTTF("0",  "Arial", txtSize + 2,cc.size(size.width, size.height), cc.TEXT_ALIGNMENT_CENTER,cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            tf.anchorX = 0;
            tf.anchorY = 1;
            tf.x = pos.x;
            tf.y = -pos.y;
            tf.color = hex2Color(0xffffff);
            this.addChild(tf);
            i == 0 ? (this.maxScoreTF = tf) : i == 1 ? (this.playCountTF = tf) : (this.scoreTF = tf);
        }
    },

    /**
     * 产生帮助信息
     */
    makeHelp: function () {
        var txt = "将相同位数的任意数字连在一起组成新的数字，10以内的数字能相加组合成10的倍数，其数字需要相等或者相加能进位才能连接,围成圆圈可以产生超级炸弹,还有更多隐藏规则哦！";
        var tf = new cc.LabelTTF(txt,  "Arial", 22,cc.size(Const.WIN_W - 20, 100), cc.TEXT_ALIGNMENT_LEFT);
        tf.anchorX = 0;
        tf.anchorY = 0;
        tf.x = 10;
        tf.y = -325;
        tf.color = hex2Color(0x323231);
        this.addChild(tf);
    },

    makeAddTip: function () {
        var pos = cc.p(Const.WIN_W / 2, -Const.TOP_HEIGHT + 65);
        var size = cc.size(200, 100);
        //背景
        var box = new cc.Scale9Sprite("game/radius_box_yellow.png", cc.rect(25, 25, 1, 1));
        box.anchorX = 0.5;
        box.anchorY = 0.5;
        box.x = pos.x;
        box.y = pos.y;
        box.setContentSize(size);
        this.addChild(box);
        box.opacity = 200;
        //show num txt
        var tf = new cc.LabelTTF("0", "Arial", 32, cc.size(size.width, size.height), cc.TEXT_ALIGNMENT_CENTER,cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        tf.anchorX = 0;
        tf.anchorY = 0;
        tf.color = hex2Color(0xffffff);
        box.addChild(tf);

        box.cascadeOpacity = true;
        box.cascadeColor = true;
        box.visible = false;
        this.addTipBox = box;
        this.addTipTF = tf;
    },

    updateScoreShow: function () {
        this._playScoreShow(this.scoreTF, GameManager.instance.score);

        if (GameManager.instance.maxScore < GameManager.instance.score) {
            GameManager.instance.maxScore = GameManager.instance.score;
            this._playScoreShow(this.maxScoreTF, GameManager.instance.maxScore);
        }

        GameManager.instance.saveData();
    },

    /**
     * 播放文本改变动画
     * @param target {cc.LabelTTF}
     * @private
     */
    _playScoreShow: function (target, score) {
        target.stopAllActions();
        target.runAction(cc.sequence(
            cc.blink(0.35, 2),
            cc.show(),
            cc.callFunc(function () {
                target.setString(score + "");
            }, this)
        ));
    },

    /**
     * 显示临时相加的数字
     * @param num
     */
    showAddTip: function (num) {
        this.addTipTF.setString(num + "");
        this.addTipBox.visible = true;
        this.addTipBox.scale = 1;
    },

    /**
     * 隐藏临时相加的数字
     */
    hideAddTip: function () {

        this.addTipBox.runAction(cc.sequence(
            cc.scaleTo(0.1, 0.01),
            cc.hide()
        ))
    }
});