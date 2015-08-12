var TopLayer = cc.Layer.extend({
    /**
     * @type cc.TextFieldTTF
     */
    maxScoreTF: null,
    /**
     * @type cc.TextFieldTTF
     */
    playCountTF: null,
    /**
     * @type cc.TextFieldTTF
     */
    scoreTF: null,
    /**
     * @type cc.ControlSwitch
     */
    musicSwitch: null,

    ctor: function () {
        this._super();

        this.makeMenu();
        this.makeInfo();
        this.makeHelp();

        this.scoreTF.setString("0");
        this.maxScoreTF.setString(GameManager.instance.maxScore + "");
        this.playCountTF.setString(GameManager.instance.playCount + "");
    },

    /**
     * 创建菜单相关的
     */
    makeMenu: function () {
        var colorBg = new cc.LayerColor(hex2Color(0xdf8c2c), Const.WIN_W, 70);
        colorBg.y = Const.WIN_H - 70;
        this.addChild(colorBg);
        var border = new cc.LayerColor(hex2Color(0xac6109), Const.WIN_W, 2);
        border.y = -1;
        colorBg.addChild(border);

        //music txt
        var tf = new cc.TextFieldTTF("音乐", cc.size(100, 70), cc.TEXT_ALIGNMENT_RIGHT, "Arial", 32);
        tf.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        tf.anchorX = 1;
        tf.anchorY = 0;
        tf.x = 100;
        tf.y = 0;
        tf.color = hex2Color(0xffffff);
        colorBg.addChild(tf);

        //switch
        this.musicSwitch = new cc.ControlSwitch
        (
            new cc.Sprite("#switch-mask.png"),
            new cc.Sprite("#switch-on.png"),
            new cc.Sprite("#switch-off.png"),
            new cc.Sprite("#switch-thumb.png"),
            new cc.LabelTTF("On", "Arial", 32),
            new cc.LabelTTF("Off", "Arial", 32)
        );
        this.musicSwitch.anchorX = 0;
        this.musicSwitch.x = 120;
        this.musicSwitch.y = 35;
        colorBg.addChild(this.musicSwitch);
        this.musicSwitch.addTargetWithActionForControlEvents(this, this.onMusicValueChanged, cc.CONTROL_EVENT_VALUECHANGED);
        this.onMusicValueChanged(this.musicSwitch);
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
            var box = new cc.Scale9Sprite("radius_box.png", cc.rect(25, 25, 1, 1));
            box.anchorX = 0;
            box.anchorY = 1;
            box.x = pos.x;
            box.y = Const.WIN_H - pos.y;
            box.setContentSize(size);
            this.addChild(box);
            //text
            var txtSize = limit(int(size.height / 65), 1, 2) == 1 ? 30 : 46;
            var tf = new cc.TextFieldTTF(labelTxtArr[i], cc.size(120, size.height), cc.TEXT_ALIGNMENT_RIGHT, "Arial", txtSize);
            tf.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            tf.anchorX = 1;
            tf.anchorY = 1;
            tf.x = pos.x - 10;
            tf.y = Const.WIN_H - pos.y;
            tf.color = hex2Color(0x323231);
            this.addChild(tf);
            //show num txt
            var tf = new cc.TextFieldTTF("0", cc.size(size.width, size.height), cc.TEXT_ALIGNMENT_CENTER, "Arial", txtSize + 2);
            tf.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            tf.anchorX = 0;
            tf.anchorY = 1;
            tf.x = pos.x;
            tf.y = Const.WIN_H - pos.y;
            tf.color = hex2Color(0xffffff);
            this.addChild(tf);
            i == 0 ? (this.maxScoreTF = tf) : i == 1 ? (this.playCountTF = tf) : (this.scoreTF = tf);
        }
    },

    /**
     * 产生帮助信息
     */
    makeHelp: function () {
        var txt = "将相同位数的任意数字连在一起组成新的数字，10以内的数字只能相加组合成10,围成圆圈可以产生超级炸弹";
        var tf = new cc.TextFieldTTF(txt, cc.size(Const.WIN_W - 20, 100), cc.TEXT_ALIGNMENT_LEFT, "Arial", 22);
        tf.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        tf.anchorX = 0;
        tf.anchorY = 0;
        tf.x = 10;
        tf.y = Const.WIN_H - 325;
        tf.color = hex2Color(0x323231);
        this.addChild(tf);
    },

    updateScoreShow: function () {
        this._playScoreShow(this.scoreTF, GameManager.instance.score);

        if (GameManager.instance.maxScore < GameManager.instance.score) {
            GameManager.instance.maxScore = GameManager.instance.score;
            GameManager.instance.saveData();
            this._playScoreShow(this.maxScoreTF, GameManager.instance.maxScore);
        }
    },

    /**
     * 播放文本改变动画
     * @param target {cc.TextFieldTTF}
     * @private
     */
    _playScoreShow: function (target, score) {
        target.runAction(cc.sequence(
            cc.blink(0.35, 2),
            cc.show(),
            cc.callFunc(function () {
                target.setString(score + "");
            }, this)
        ));
    }
});