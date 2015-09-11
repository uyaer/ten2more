var TopLayer = cc.Layer.extend({
    /**
     * @type cc.Node
     */
    mainNode: null,
    /**
     * @type ccui.Button
     */
    menuBtn: null,
    /**
     * @type ccui.Text
     */
    timeTF: null,
    /**
     * @type cc.Text
     */
    stepTF: null,
    ctor: function () {
        this._super();

        var colorBg = new cc.LayerColor(hex2Color(0xdf8c2c), Const.WIN_W, 70);
        colorBg.y = Const.WIN_H - 70;
        this.addChild(colorBg);
        var border = new cc.LayerColor(hex2Color(0xac6109), Const.WIN_W, 2);
        border.y = -1;
        colorBg.addChild(border);

        var scene = ccs.load(res.layer_top);
        this.mainNode = scene.node;
        this.addChild(this.mainNode);
        doLayout(this.mainNode);
        //addButtonsTouchEffect(["musicBtn","restartBtn"], this.mainNode);

        this.menuBtn = seekChildByName(this.mainNode, "menuBtn");
        this.timeTF = seekChildByName(this.mainNode, "timeTF");
        this.stepTF = seekChildByName(this.mainNode, "stepTF");


        //event
        this.menuBtn.addClickEventListener(this.onMenuBtnClick.bind(this));

    },

    onEnter: function () {
        this._super();

        this.updateStep();

        this.schedule(this.updateStep, 1);
    },

    onExit: function () {
        this._super();

        this.unschedule(this.updateStep);
    },



    updateStep: function () {
        var s = int(TimerTicker.getNeedTime() / 1000);
        s = s >= 10 ? s : "0" + s;
        this.stepTF.string = gameStepVo.step + "/" + gameStepVo.maxStep +
            "  (" + cc.formatStr(Lang.i18n(28),s) + ")";
    },


    onMenuBtnClick: function () {
        cc.eventManager.dispatchCustomEvent(GameEvent.SHOW_MENU);
    }
});