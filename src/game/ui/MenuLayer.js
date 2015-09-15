var MenuLayer = cc.LayerColor.extend({
    /**
     * @type cc.Node
     */
    mainNode: null,
    /**
     * @type ccui.Button
     */
    backBtn: null,
    /**
     * @type ccui.Button
     */
    homeBtn: null,
    /**
     * @type ccui.Button
     */
    restartBtn: null,
    /**
     * @type cc.Text
     */
    settingTF: null,
    /**
     * @type cc.Text
     */
    ruleTF: null,
    ctor: function () {
        this._super(cc.color(0, 0, 0, 0), Const.WIN_W, Const.WIN_H);

        var bg = new cc.LayerColor(hex2Color(0xf1ba6d), Const.WIN_W * 0.66, Const.WIN_H);
        bg.x = Const.WIN_W * 0.34;
        this.addChild(bg);

        var scene = ccs.load(res.layer_menu);
        this.mainNode = scene.node;
        this.addChild(this.mainNode);
        doLayout(this.mainNode);
        //addButtonsTouchEffect(["musicBtn","restartBtn"], this.mainNode);

        this.backBtn = seekChildByName(this.mainNode, "backBtn");
        this.homeBtn = seekChildByName(this.mainNode, "homeBtn");
        this.restartBtn = seekChildByName(this.mainNode, "restartBtn");
        this.ruleTF = seekChildByName(this.mainNode, "ruleTF");
        this.settingTF = seekChildByName(this.mainNode, "settingTF");

        //var txt = "将相同位数的任意数字连在一起组成新的数字，10以内的数字能相加组合成10的倍数，其数字需要相等或者相加能进位才能连接,围成圆圈可以产生超级炸弹,还有更多隐藏规则哦！";
        var txt = Lang.i18n(26);
        this.ruleTF.setString(txt);
        this.settingTF.setString(Lang.i18n(29));//设置
        this.homeBtn.setTitleText(Lang.i18n(30));//返回主页
        this.restartBtn.setTitleText(Lang.i18n(22));

        //event
        this.backBtn.addClickEventListener(this.onBackBtnClick.bind(this));
        this.homeBtn.addClickEventListener(this.onHomeBtnClickHandler.bind(this));
        this.restartBtn.addClickEventListener(this.onResetBtnClickHandler.bind(this));

        maskTouchEvent(this);

        this.makeMusic();
    },

    onEnter: function () {
        this._super();

        this.x = Const.WIN_W * 0.66;
        this.runAction(cc.moveTo(0.35, 0, 0));
    },

    /**
     * 创建音乐按钮
     */
    makeMusic: function () {
        //music txt
        //音乐
        var tf = new cc.LabelTTF(Lang.i18n(19), "Arial", 32, cc.size(100, 70), cc.TEXT_ALIGNMENT_RIGHT, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        tf.anchorX = 1;
        tf.x = this.backBtn.x + 150;
        tf.y = this.backBtn.y;
        tf.color = hex2Color(0x8B6914);
        this.mainNode.addChild(tf);

        //switch
        this.musicSwitch = new cc.ControlSwitch
        (
            new cc.Sprite("res/switch-mask.png"),
            new cc.Sprite("res/switch-on.png"),
            new cc.Sprite("res/switch-off.png"),
            new cc.Sprite("res/switch-thumb.png"),
            new cc.LabelTTF(Lang.i18n(20), "Arial", 32),//"开"
            new cc.LabelTTF(Lang.i18n(21), "Arial", 32)//"关"
        );
        this.musicSwitch.anchorX = 0;
        this.musicSwitch.x = this.backBtn.x + 170;
        this.musicSwitch.y = this.backBtn.y;
        this.mainNode.addChild(this.musicSwitch);
        this.musicSwitch.addTargetWithActionForControlEvents(this, this.onMusicValueChanged, cc.CONTROL_EVENT_VALUECHANGED);
        this.onMusicValueChanged(this.musicSwitch);
    },


    onBackBtnClick: function () {
        // 通知游戏向右边
        cc.eventManager.dispatchCustomEvent(GameEvent.HIDE_MENU);

        this.runAction(cc.sequence(
            cc.moveTo(0.35, Const.WIN_W * 0.66, 0),
            cc.removeSelf()
        ));
    },

    onResetBtnClickHandler: function () {
        var alert = new ResetAlertPanel();
        PopUpManager.add(alert);
    },

    onHomeBtnClickHandler: function () {
        cc.director.runScene(new cc.TransitionFade(0.5, new IndexScene(), hex2Color(0xa1edf8)));
    },

    onMusicValueChanged: function (sender, controlEvent) {
        if (sender.isOn()) {
            //this._displayValueLabel.setString("On");
        }
        else {
            //this._displayValueLabel.setString("Off");
        }
    },

});