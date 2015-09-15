var InfoLayer = cc.Layer.extend({
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

        this.makeInfo();
        this.makeAddTip();

        this.scoreTF.setString(GameManager.instance.score + "");
        this.maxScoreTF.setString(GameManager.instance.maxScore + "");
        this.playCountTF.setString(GameManager.instance.playCount + "");
    },

    /**
     * 创建信息相关的
     */
    makeInfo: function () {
        var posArr = [cc.p(160, 10), cc.p(160, 80), cc.p(490, 10)];
        var sizeArr = [cc.size(200, 65), cc.size(200, 65), cc.size(220, 135)];
        //var labelTxtArr = ["最高分数", "挑战次数", "当前分数"];
        var labelTxtArr = [Lang.i18n(23),Lang.i18n(24),Lang.i18n(25)];

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
            var labelW = 200;
            if(i ==2 && Const.LANG == "zh"){
                labelW = 100;
            }
            var tf = new cc.LabelTTF(labelTxtArr[i], "Arial", txtSize, cc.size(labelW, size.height), cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            tf.anchorX = 1;
            tf.anchorY = 1;
            tf.x = pos.x - 10;
            tf.y = -pos.y;
            tf.color = hex2Color(0x323231);
            this.addChild(tf);
            //show num txt
            var tf = new cc.LabelTTF("0", "Arial", txtSize + 2, cc.size(size.width, size.height), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            tf.anchorX = 0;
            tf.anchorY = 1;
            tf.x = pos.x;
            tf.y = -pos.y;
            tf.color = hex2Color(0xffffff);
            this.addChild(tf);
            i == 0 ? (this.maxScoreTF = tf) : i == 1 ? (this.playCountTF = tf) : (this.scoreTF = tf);
        }
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
        var tf = new cc.LabelTTF("0", "Arial", 32, cc.size(size.width, size.height), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
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
    showAddTip: function (num,isOk) {
        this.addTipTF.setString(num + "");
        this.addTipBox.visible = true;
        this.addTipBox.scale = 1;
        this.addTipTF.color = isOk?cc.color.WHITE:hex2Color(0x222222);
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