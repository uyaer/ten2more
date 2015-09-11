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
    musicBtn: null,
    /**
     * @type ccui.Button
     */
    restartBtn: null,
    /**
     * @type cc.Text
     */
    ruleTF: null,
    ctor: function () {
        this._super(cc.color(0, 0, 0, 0), Const.WIN_W, Const.WIN_H);
        var bg = new cc.LayerColor(0xf1ba6d, Const.WIN_W * 0.66, Const.WIN_H);
        bg.x = Const.WIN_W * 0.34;
        this.addChild(bg);

        var scene = ccs.load(res.layer_menu);
        this.mainNode = scene.node;
        this.addChild(this.mainNode);
        doLayout(this.mainNode);
        //addButtonsTouchEffect(["musicBtn","restartBtn"], this.mainNode);

        this.backBtn = seekChildByName(this.mainNode, "backBtn");
        this.musicBtn = seekChildByName(this.mainNode, "musicBtn");
        this.restartBtn = seekChildByName(this.mainNode, "restartBtn");
        this.ruleTF = seekChildByName(this.mainNode, "ruleTF");
        //var txt = "将相同位数的任意数字连在一起组成新的数字，10以内的数字能相加组合成10的倍数，其数字需要相等或者相加能进位才能连接,围成圆圈可以产生超级炸弹,还有更多隐藏规则哦！";
        var txt = Lang.i18n(26);
        this.ruleTF.setString(txt);

        //event
        this.backBtn.addClickEventListener(this.onBackBtnClick.bind(this));
        this.closeBtn.addClickEventListener(this.onPlayBtnClick.bind(this));

        maskTouchEvent(this);
    },

    onEnter: function () {
        this._super();

        this.x = Const.WIN_W * 0.66;
        this.runAction(cc.moveTo(0.5, 0, 0));
    },

    onBackBtnClick: function () {
        //TODO 通知游戏向右边

        this.runAction(cc.sequence(
            cc.moveTo(0.5, Const.WIN_W * 0.66, 0),
            cc.removeSelf()
        ));
    }
});